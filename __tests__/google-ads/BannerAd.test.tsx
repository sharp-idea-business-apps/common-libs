import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { BannerAd } from '../../src/google-ads';

/** Returns the props passed to the most recent SDK BannerAd call. */
function getLastSDKBannerAdProps() {
  const { BannerAd: SDKBannerAd } = require('react-native-google-mobile-ads');
  const calls = (SDKBannerAd as jest.Mock).mock.calls;
  return calls[calls.length - 1]?.[0] as Record<string, unknown>;
}

describe('BannerAd', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders a container View wrapping the SDK BannerAd', async () => {
    let tree!: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(<BannerAd adUnitId="test-banner-unit-id" />);
    });
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('passes adUnitId as unitId to the SDK BannerAd', async () => {
    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(<BannerAd adUnitId="my-unit-id-123" />);
    });

    expect(getLastSDKBannerAdProps()).toMatchObject({ unitId: 'my-unit-id-123' });
  });

  it('uses BannerAdSize.BANNER as the default size', async () => {
    const { BannerAdSize } = require('react-native-google-mobile-ads');
    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(<BannerAd adUnitId="test-id" />);
    });

    expect(getLastSDKBannerAdProps()).toMatchObject({ size: BannerAdSize.BANNER });
  });

  it('passes a custom size prop to the SDK BannerAd', async () => {
    const { BannerAdSize } = require('react-native-google-mobile-ads');
    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(
        <BannerAd adUnitId="test-id" size={BannerAdSize.MEDIUM_RECTANGLE} />,
      );
    });

    expect(getLastSDKBannerAdProps()).toMatchObject({ size: BannerAdSize.MEDIUM_RECTANGLE });
  });

  it('forwards onAdLoaded callback to the SDK BannerAd', async () => {
    const onAdLoaded = jest.fn();
    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(<BannerAd adUnitId="test-id" onAdLoaded={onAdLoaded} />);
    });

    expect(getLastSDKBannerAdProps()).toMatchObject({ onAdLoaded });
  });

  it('forwards onAdFailedToLoad callback to the SDK BannerAd', async () => {
    const onAdFailedToLoad = jest.fn();
    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(
        <BannerAd adUnitId="test-id" onAdFailedToLoad={onAdFailedToLoad} />,
      );
    });

    expect(getLastSDKBannerAdProps()).toMatchObject({ onAdFailedToLoad });
  });
});


