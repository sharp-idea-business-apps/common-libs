import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  BannerAd as SDKBannerAd,
  BannerAdSize,
} from 'react-native-google-mobile-ads';
import type { BannerAdProps } from './types';

/**
 * Wraps the Google Mobile Ads SDK `BannerAd` behind a stable component
 * contract. Consumers import from `@common-libs/ads` only — the SDK is
 * never referenced directly by callers.
 *
 * Non-personalised ad request options are applied by default to reduce
 * GDPR/CCPA risk until a consent framework is integrated.
 */
export function BannerAd({
  adUnitId,
  size = BannerAdSize.BANNER,
  onAdLoaded,
  onAdFailedToLoad,
  style,
}: BannerAdProps): React.JSX.Element {
  return (
    <View style={[styles.container, style]}>
      <SDKBannerAd
        unitId={adUnitId}
        size={size}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        onAdLoaded={onAdLoaded}
        onAdFailedToLoad={onAdFailedToLoad}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
});
