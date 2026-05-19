export { BannerAd } from './BannerAd';
export { InterstitialAd } from './InterstitialAd';
export { useInterstitialAd } from './useInterstitialAd';
export type {
  BannerAdProps,
  InterstitialAdConfig,
  InterstitialAdState,
  InterstitialAdProps,
  InterstitialAdRef,
} from './types';

// Re-export SDK constants so consumers never import from the SDK directly.
export { BannerAdSize, TestIds as AD_TEST_IDS } from 'react-native-google-mobile-ads';
