import type { BannerAdSize } from 'react-native-google-mobile-ads';
import type { ViewStyle } from 'react-native';

export interface BannerAdProps {
  /** Google Ad Unit ID. Use TestIds.BANNER for development. */
  adUnitId: string;
  /** Banner size. Defaults to BannerAdSize.BANNER (320×50). */
  size?: BannerAdSize;
  /** Called when the banner ad has been loaded and is ready to display. */
  onAdLoaded?: () => void;
  /** Called when the banner ad fails to load. */
  onAdFailedToLoad?: (error: Error) => void;
  /** Additional styles applied to the container View. */
  style?: ViewStyle;
}

export interface InterstitialAdConfig {
  /** Google Ad Unit ID. Use TestIds.INTERSTITIAL for development. */
  adUnitId: string;
  /**
   * When true, the ad begins loading immediately on hook mount.
   * Defaults to false.
   */
  loadOnMount?: boolean;
  /** Called when the interstitial ad has been loaded and is ready to show. */
  onAdLoaded?: () => void;
  /** Called when the interstitial ad fails to load. */
  onAdFailedToLoad?: (error: Error) => void;
  /** Called when the user dismisses the interstitial ad. */
  onAdClosed?: () => void;
}

export interface InterstitialAdState {
  /** True when the ad is loaded and ready to display. */
  isLoaded: boolean;
  /** True while the ad is currently being fetched. */
  isLoading: boolean;
  /** Populated when the last load attempt failed; null otherwise. */
  error: Error | null;
  /**
   * Displays the interstitial ad. No-op if the ad is not yet loaded.
   * After the ad is closed, a new load is triggered automatically.
   */
  showAd: () => void;
}

export interface InterstitialAdRef {
  /** Programmatically shows the interstitial ad. */
  showAd: () => void;
}

export interface InterstitialAdProps {
  /** Google Ad Unit ID. Use TestIds.INTERSTITIAL for development. */
  adUnitId: string;
  /**
   * When true, the ad begins loading immediately on mount.
   * Defaults to false.
   */
  loadOnMount?: boolean;
  /** Called when the interstitial ad has been loaded. */
  onAdLoaded?: () => void;
  /** Called when the interstitial ad fails to load. */
  onAdFailedToLoad?: (error: Error) => void;
  /** Called when the user dismisses the interstitial ad. */
  onAdClosed?: () => void;
  /** Optional children rendered alongside the headless ad controller. */
  children?: React.ReactNode;
}
