import { useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RateAppAdapter } from './RateAppAdapter';
import type { UseRateAppConfig, UseRateAppResult } from './types';

const COOLDOWN_KEY = '@common-libs/rate-app/last-prompted';

function msFromDays(days: number): number {
  return days * 24 * 60 * 60 * 1000;
}

/**
 * Manages the rate-app pre-prompt visibility and a configurable cooldown period.
 *
 * The last-prompted timestamp is persisted in AsyncStorage. If the stored
 * timestamp is absent or older than `cooldownDays`, the next call to
 * `openRatePrompt` will show the modal.
 *
 * @param config - Optional configuration. See {@link UseRateAppConfig}.
 * @returns State and action handlers for the rate-app flow.
 */
export function useRateApp({
  cooldownDays = 7,
}: UseRateAppConfig = {}): UseRateAppResult {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const saveCooldown = useCallback(async (): Promise<void> => {
    await AsyncStorage.setItem(COOLDOWN_KEY, String(Date.now()));
  }, []);

  const isCooldownExpired = useCallback(async (): Promise<boolean> => {
    try {
      const raw = await AsyncStorage.getItem(COOLDOWN_KEY);
      if (raw === null) {
        return true;
      }
      const lastPrompted = Number(raw);
      return Date.now() - lastPrompted >= msFromDays(cooldownDays);
    } catch {
      // If storage is unavailable, default to showing the prompt.
      return true;
    }
  }, [cooldownDays]);

  const openRatePrompt = useCallback(async (): Promise<void> => {
    if (!RateAppAdapter.isAvailable()) {
      return;
    }
    const expired = await isCooldownExpired();
    if (expired) {
      setIsModalVisible(true);
    }
  }, [isCooldownExpired]);

  const handleRateNow = useCallback(async (): Promise<void> => {
    setIsModalVisible(false);
    await saveCooldown();
    await RateAppAdapter.requestReview();
  }, [saveCooldown]);

  const handleDismiss = useCallback(async (): Promise<void> => {
    setIsModalVisible(false);
    await saveCooldown();
  }, [saveCooldown]);

  return { isModalVisible, openRatePrompt, handleRateNow, handleDismiss };
}
