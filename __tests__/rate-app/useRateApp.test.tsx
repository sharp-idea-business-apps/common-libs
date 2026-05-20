import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRateApp } from '../../src/rate-app';
import type { UseRateAppConfig } from '../../src/rate-app';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getInAppReviewMock() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require('react-native-in-app-review').default as {
    isAvailable: jest.Mock;
    RequestInAppReview: jest.Mock;
  };
}

/** Simple harness that exposes hook state via testIDs. */
function HookHarness({ config = {} }: { config?: UseRateAppConfig }) {
  const { isModalVisible, openRatePrompt, handleRateNow, handleDismiss } =
    useRateApp(config);
  return (
    <>
      <Text testID="isVisible">{String(isModalVisible)}</Text>
      <Text testID="openPrompt" onPress={openRatePrompt} />
      <Text testID="rateNow" onPress={handleRateNow} />
      <Text testID="dismiss" onPress={handleDismiss} />
    </>
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useRateApp', () => {
  let getItemSpy: jest.SpyInstance;
  let setItemSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    getItemSpy = jest.spyOn(AsyncStorage, 'getItem').mockResolvedValue(null);
    setItemSpy = jest.spyOn(AsyncStorage, 'setItem').mockResolvedValue(undefined);
    getInAppReviewMock().isAvailable.mockReturnValue(true);
    getInAppReviewMock().RequestInAppReview.mockResolvedValue(true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('initialises with isModalVisible=false', async () => {
    let tree!: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(<HookHarness />);
    });
    expect(
      tree.root.findByProps({ testID: 'isVisible' }).props.children,
    ).toBe('false');
  });

  it('shows modal when no cooldown record exists', async () => {
    getItemSpy.mockResolvedValue(null);

    let tree!: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(<HookHarness />);
    });
    await ReactTestRenderer.act(async () => {
      tree.root.findByProps({ testID: 'openPrompt' }).props.onPress();
    });
    expect(
      tree.root.findByProps({ testID: 'isVisible' }).props.children,
    ).toBe('true');
  });

  it('does not show modal when within 7-day cooldown', async () => {
    const threeDaysAgo = String(Date.now() - 3 * 24 * 60 * 60 * 1000);
    getItemSpy.mockResolvedValue(threeDaysAgo);

    let tree!: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(<HookHarness />);
    });
    await ReactTestRenderer.act(async () => {
      tree.root.findByProps({ testID: 'openPrompt' }).props.onPress();
    });
    expect(
      tree.root.findByProps({ testID: 'isVisible' }).props.children,
    ).toBe('false');
  });

  it('shows modal when cooldown has expired (8 days ago)', async () => {
    const eightDaysAgo = String(Date.now() - 8 * 24 * 60 * 60 * 1000);
    getItemSpy.mockResolvedValue(eightDaysAgo);

    let tree!: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(<HookHarness />);
    });
    await ReactTestRenderer.act(async () => {
      tree.root.findByProps({ testID: 'openPrompt' }).props.onPress();
    });
    expect(
      tree.root.findByProps({ testID: 'isVisible' }).props.children,
    ).toBe('true');
  });

  it('respects a custom cooldownDays value', async () => {
    const twoDaysAgo = String(Date.now() - 2 * 24 * 60 * 60 * 1000);
    getItemSpy.mockResolvedValue(twoDaysAgo);

    let tree!: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(
        <HookHarness config={{ cooldownDays: 3 }} />,
      );
    });
    await ReactTestRenderer.act(async () => {
      tree.root.findByProps({ testID: 'openPrompt' }).props.onPress();
    });
    expect(
      tree.root.findByProps({ testID: 'isVisible' }).props.children,
    ).toBe('false');
  });

  it('does not show modal when in-app review is unavailable', async () => {
    getInAppReviewMock().isAvailable.mockReturnValue(false);

    let tree!: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(<HookHarness />);
    });
    await ReactTestRenderer.act(async () => {
      tree.root.findByProps({ testID: 'openPrompt' }).props.onPress();
    });
    expect(
      tree.root.findByProps({ testID: 'isVisible' }).props.children,
    ).toBe('false');
  });

  it('shows modal when AsyncStorage throws (fail-open)', async () => {
    getItemSpy.mockRejectedValue(new Error('Storage unavailable'));

    let tree!: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(<HookHarness />);
    });
    await ReactTestRenderer.act(async () => {
      tree.root.findByProps({ testID: 'openPrompt' }).props.onPress();
    });
    expect(
      tree.root.findByProps({ testID: 'isVisible' }).props.children,
    ).toBe('true');
  });

  it('handleRateNow: hides modal, saves cooldown, and calls requestReview', async () => {
    let tree!: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(<HookHarness />);
    });
    await ReactTestRenderer.act(async () => {
      tree.root.findByProps({ testID: 'openPrompt' }).props.onPress();
    });
    expect(
      tree.root.findByProps({ testID: 'isVisible' }).props.children,
    ).toBe('true');

    await ReactTestRenderer.act(async () => {
      tree.root.findByProps({ testID: 'rateNow' }).props.onPress();
    });
    expect(
      tree.root.findByProps({ testID: 'isVisible' }).props.children,
    ).toBe('false');
    expect(getInAppReviewMock().RequestInAppReview).toHaveBeenCalledTimes(1);
    expect(setItemSpy).toHaveBeenCalledWith(
      '@common-libs/rate-app/last-prompted',
      expect.any(String),
    );
  });

  it('handleDismiss: hides modal and saves cooldown without calling requestReview', async () => {
    let tree!: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(<HookHarness />);
    });
    await ReactTestRenderer.act(async () => {
      tree.root.findByProps({ testID: 'openPrompt' }).props.onPress();
    });

    await ReactTestRenderer.act(async () => {
      tree.root.findByProps({ testID: 'dismiss' }).props.onPress();
    });
    expect(
      tree.root.findByProps({ testID: 'isVisible' }).props.children,
    ).toBe('false');
    expect(setItemSpy).toHaveBeenCalledWith(
      '@common-libs/rate-app/last-prompted',
      expect.any(String),
    );
    expect(getInAppReviewMock().RequestInAppReview).not.toHaveBeenCalled();
  });
});
