import InAppReview from 'react-native-in-app-review';

/**
 * Adapter wrapping the react-native-in-app-review SDK.
 *
 * All SDK calls are confined to this module — consumers never import the SDK
 * directly, which allows the underlying library to be swapped without touching
 * any caller.
 */
export const RateAppAdapter = {
  /** Returns true when the current device and OS support in-app review. */
  isAvailable: (): boolean => InAppReview.isAvailable(),

  /**
   * Triggers the platform-native in-app review dialog.
   * Resolves to true on Android when the flow completes; resolves to false
   * on iOS (the OS handles display entirely, no result is returned).
   */
  requestReview: (): Promise<boolean> => InAppReview.RequestInAppReview(),
};
