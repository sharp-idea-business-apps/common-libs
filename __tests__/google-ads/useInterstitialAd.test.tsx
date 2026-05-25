import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Text } from 'react-native';
import { useInterstitialAd } from '../../src/google-ads';
import type { InterstitialAdConfig } from '../../src/google-ads';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns the most-recently created mock ad instance. */
function getLastAdInstance() {
  const { InterstitialAd } = require('react-native-google-mobile-ads');
  const results = (InterstitialAd.createForAdRequest as jest.Mock).mock.results;
  return results[results.length - 1].value;
}

/**
 * Finds and invokes the callback registered for a given AdEventType string.
 * Must be wrapped in `ReactTestRenderer.act` by the caller.
 */
function triggerAdEvent(
  adInstance: ReturnType<typeof getLastAdInstance>,
  event: string,
  ...args: unknown[]
) {
  const calls: [string, (...a: unknown[]) => void][] = (
    adInstance.addAdEventListener as jest.Mock
  ).mock.calls;
  const match = calls.find(([e]) => e === event);
  match?.[1]?.(...args);
}

/** Simple wrapper component that exposes hook state via testIDs. */
function HookHarness({ config }: { config: InterstitialAdConfig }) {
  const state = useInterstitialAd(config);
  return (
    <>
      <Text testID="isLoaded">{String(state.isLoaded)}</Text>
      <Text testID="isLoading">{String(state.isLoading)}</Text>
      <Text testID="hasError">{state.error !== null ? 'yes' : 'no'}</Text>
      <Text testID="showAdBtn" onPress={state.showAd} />
    </>
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useInterstitialAd', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initialises with isLoaded=false, isLoading=false, error=null', async () => {
    let tree!: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(
        <HookHarness config={{ adUnitId: 'test-unit-id' }} />,
      );
    });

    expect(tree.root.findByProps({ testID: 'isLoaded' }).props.children).toBe(
      'false',
    );
    expect(tree.root.findByProps({ testID: 'isLoading' }).props.children).toBe(
      'false',
    );
    expect(tree.root.findByProps({ testID: 'hasError' }).props.children).toBe(
      'no',
    );
  });

  it('calls ad.load() immediately when loadOnMount is true', async () => {
    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(
        <HookHarness
          config={{ adUnitId: 'test-unit-id', loadOnMount: true }}
        />,
      );
    });

    const ad = getLastAdInstance();
    expect(ad.load).toHaveBeenCalledTimes(1);
  });

  it('does not call ad.load() when loadOnMount is false', async () => {
    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(
        <HookHarness
          config={{ adUnitId: 'test-unit-id', loadOnMount: false }}
        />,
      );
    });

    const ad = getLastAdInstance();
    expect(ad.load).not.toHaveBeenCalled();
  });

  it('sets isLoaded=true and isLoading=false when LOADED event fires', async () => {
    let tree!: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(
        <HookHarness config={{ adUnitId: 'test-unit-id' }} />,
      );
    });

    const ad = getLastAdInstance();
    await ReactTestRenderer.act(async () => {
      triggerAdEvent(ad, 'loaded');
    });

    expect(tree.root.findByProps({ testID: 'isLoaded' }).props.children).toBe(
      'true',
    );
    expect(tree.root.findByProps({ testID: 'isLoading' }).props.children).toBe(
      'false',
    );
  });

  it('calls onAdLoaded callback when LOADED event fires', async () => {
    const onAdLoaded = jest.fn();
    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(
        <HookHarness config={{ adUnitId: 'test-unit-id', onAdLoaded }} />,
      );
    });

    const ad = getLastAdInstance();
    await ReactTestRenderer.act(async () => {
      triggerAdEvent(ad, 'loaded');
    });

    expect(onAdLoaded).toHaveBeenCalledTimes(1);
  });

  it('sets hasError=yes and calls onAdFailedToLoad when ERROR event fires', async () => {
    const onAdFailedToLoad = jest.fn();
    let tree!: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(
        <HookHarness config={{ adUnitId: 'test-unit-id', onAdFailedToLoad }} />,
      );
    });

    const ad = getLastAdInstance();
    const testError = new Error('Ad load failed');
    await ReactTestRenderer.act(async () => {
      triggerAdEvent(ad, 'error', testError);
    });

    expect(tree.root.findByProps({ testID: 'hasError' }).props.children).toBe(
      'yes',
    );
    expect(onAdFailedToLoad).toHaveBeenCalledWith(testError);
  });

  it('calls ad.show() when showAd is invoked and ad is loaded', async () => {
    let tree!: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(
        <HookHarness config={{ adUnitId: 'test-unit-id' }} />,
      );
    });

    const ad = getLastAdInstance();

    // Load the ad first.
    await ReactTestRenderer.act(async () => {
      triggerAdEvent(ad, 'loaded');
    });

    await ReactTestRenderer.act(async () => {
      tree.root.findByProps({ testID: 'showAdBtn' }).props.onPress();
    });

    expect(ad.show).toHaveBeenCalledTimes(1);
  });

  it('does not call ad.show() when ad is not yet loaded', async () => {
    let tree!: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(
        <HookHarness config={{ adUnitId: 'test-unit-id' }} />,
      );
    });

    const ad = getLastAdInstance();
    await ReactTestRenderer.act(async () => {
      tree.root.findByProps({ testID: 'showAdBtn' }).props.onPress();
    });

    expect(ad.show).not.toHaveBeenCalled();
  });

  it('reloads the ad and calls onAdClosed when CLOSED event fires', async () => {
    const onAdClosed = jest.fn();
    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(
        <HookHarness config={{ adUnitId: 'test-unit-id', onAdClosed }} />,
      );
    });

    const ad = getLastAdInstance();

    // Fire LOADED then CLOSED to simulate full ad cycle.
    await ReactTestRenderer.act(async () => {
      triggerAdEvent(ad, 'loaded');
    });
    await ReactTestRenderer.act(async () => {
      triggerAdEvent(ad, 'closed');
    });

    expect(onAdClosed).toHaveBeenCalledTimes(1);
    // load() should be called once more to preload for next display.
    expect(ad.load).toHaveBeenCalledTimes(1);
  });
});
