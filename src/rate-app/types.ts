export interface UseRateAppConfig {
  /** Number of days before showing the rate prompt again. Defaults to 7. */
  cooldownDays?: number;
  /** Play Store URL to open directly when the cooldown period is still active. */
  playStoreUrl?: string;
  /** App Store URL to open directly when the cooldown period is still active. */
  appStoreUrl?: string;
}

export interface UseRateAppResult {
  /** Whether the custom pre-prompt modal is currently visible. */
  isModalVisible: boolean;
  /**
   * Shows the custom pre-prompt modal when the cooldown has elapsed.
   * When the cooldown is still active and a store URL is configured,
   * opens the appropriate app store directly.
   */
  openRatePrompt: () => Promise<void>;
  /** Triggers the native in-app review, records the cooldown, hides the modal. */
  handleRateNow: () => Promise<void>;
  /** Records the cooldown and hides the modal without launching native review. */
  handleDismiss: () => Promise<void>;
}

export interface RateAppModalProps {
  /** Controls visibility of the modal. */
  visible: boolean;
  /** Called when the user taps "Rate Now". */
  onRateNow: () => void;
  /** Called when the user taps "Later". */
  onDismiss: () => void;
}
