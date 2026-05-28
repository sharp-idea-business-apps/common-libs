import React, { createRef } from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Text } from 'react-native';
import { InterstitialAd } from '../../src/google-ads';
import type { InterstitialAdRef } from '../../src/google-ads';

describe('InterstitialAd', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children when provided', () => {
    let tree!: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <InterstitialAd adUnitId="test-unit-id">
          <Text testID="child">Child Content</Text>
        </InterstitialAd>,
      );
    });

    expect(tree.root.findByProps({ testID: 'child' })).toBeTruthy();
  });

  it('renders nothing when no children are provided', () => {
    let tree!: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<InterstitialAd adUnitId="test-unit-id" />);
    });

    expect(tree.toJSON()).toBeNull();
  });

  it('exposes showAd via ref', () => {
    const ref = createRef<InterstitialAdRef>();
    ReactTestRenderer.act(() => {
      ReactTestRenderer.create(<InterstitialAd ref={ref} adUnitId="test-unit-id" />);
    });

    expect(ref.current).not.toBeNull();
    expect(typeof ref.current?.showAd).toBe('function');
  });

  it('calls ad.load() when loadOnMount is true', async () => {
    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(<InterstitialAd adUnitId="test-unit-id" loadOnMount />);
    });

    const { InterstitialAd: SDKInterstitialAd } = require('react-native-google-mobile-ads');
    const ad = SDKInterstitialAd.createForAdRequest.mock.results[0].value;
    expect(ad.load).toHaveBeenCalledTimes(1);
  });

  it('calls onAdClosed callback when ad is dismissed', async () => {
    const onAdClosed = jest.fn();
    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(<InterstitialAd adUnitId="test-unit-id" onAdClosed={onAdClosed} />);
    });

    const {
      InterstitialAd: SDKInterstitialAd,
      AdEventType,
    } = require('react-native-google-mobile-ads');
    const ad = SDKInterstitialAd.createForAdRequest.mock.results[0].value;

    // Simulate the ad being shown then closed.
    const closedCallback = (ad.addAdEventListener as jest.Mock).mock.calls.find(
      ([event]: [string]) => event === AdEventType.CLOSED,
    )?.[1];

    await ReactTestRenderer.act(async () => {
      closedCallback?.();
    });

    expect(onAdClosed).toHaveBeenCalledTimes(1);
  });
});
