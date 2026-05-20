export interface UseRateAppConfig {
  /** Number of days before showing the rate prompt again. Defaults to 7. */
  cooldownDays?: number;
}

export interface UseRateAppResult {
  /** Whether the custom pre-prompt modal is currently visible. */
  isModalVisible: boolean;
  /**
   * Opens the rate prompt if the in-app review is available and the cooldown
   * period has elapsed. No-op otherwise.
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
