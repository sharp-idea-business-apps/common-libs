import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AppOpenAd as SDKAppOpenAd,
  AdEventType,
} from 'react-native-google-mobile-ads';
import type { AppOpenAdConfig, AppOpenAdState } from './types';

/**
 * Manages the full lifecycle of a Google Mobile Ads App Open ad.
 *
 * Handles loading, state tracking, and event callbacks for the
 * app-launch ad format. Consumers never interact with the SDK
 * directly — all SDK calls are confined to this hook.
 *
 * @param config - Ad unit ID, mount-load flag, and optional event callbacks.
 * @returns Reactive state object with `showAd` trigger.
 */
export function useAppOpenAd({
  adUnitId,
  loadOnMount = false,
  onAdLoaded,
  onAdFailedToLoad,
  onAdClosed,
}: AppOpenAdConfig): AppOpenAdState {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Lazy-initialise the ad instance exactly once per mount.
  const adRef = useRef<InstanceType<typeof SDKAppOpenAd> | null>(null);
  if (adRef.current === null) {
    adRef.current = SDKAppOpenAd.createForAdRequest(adUnitId);
  }

  // Store latest callbacks in refs so listeners never become stale
  // without needing to re-subscribe on every render.
  const onAdLoadedRef = useRef(onAdLoaded);
  const onAdFailedToLoadRef = useRef(onAdFailedToLoad);
  const onAdClosedRef = useRef(onAdClosed);
  useEffect(() => {
    onAdLoadedRef.current = onAdLoaded;
    onAdFailedToLoadRef.current = onAdFailedToLoad;
    onAdClosedRef.current = onAdClosed;
  });

  useEffect(() => {
    const ad = adRef.current!;

    const unsubLoaded = ad.addAdEventListener(AdEventType.LOADED, () => {
      setIsLoaded(true);
      setIsLoading(false);
      setError(null);
      onAdLoadedRef.current?.();
    });

    const unsubError = ad.addAdEventListener(
      AdEventType.ERROR,
      (err: Error) => {
        setIsLoaded(false);
        setIsLoading(false);
        setError(err);
        onAdFailedToLoadRef.current?.(err);
      },
    );

    const unsubClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      setIsLoaded(false);
      onAdClosedRef.current?.();
    });

    if (loadOnMount) {
      setIsLoading(true);
      ad.load();
    }

    return () => {
      unsubLoaded();
      unsubError();
      unsubClosed();
    };
  }, [loadOnMount]);

  const showAd = useCallback(() => {
    adRef.current?.show();
  }, []);

  return { isLoaded, isLoading, error, showAd };
}
