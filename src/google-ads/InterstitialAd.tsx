import React, { forwardRef, useImperativeHandle } from 'react';
import { useInterstitialAd } from './useInterstitialAd';
import type { InterstitialAdProps, InterstitialAdRef } from './types';

/**
 * Declarative component wrapper around `useInterstitialAd`.
 *
 * The interstitial ad is a system-level overlay — this component has no
 * visible UI of its own. It exposes a `showAd()` method via `ref` so that
 * parent components can imperatively trigger the ad at the appropriate moment.
 *
 * @example
 * ```tsx
 * const adRef = useRef<InterstitialAdRef>(null);
 *
 * <InterstitialAd ref={adRef} adUnitId={AD_TEST_IDS.INTERSTITIAL} loadOnMount>
 *   <Button title="Show Ad" onPress={() => adRef.current?.showAd()} />
 * </InterstitialAd>
 * ```
 */
export const InterstitialAd = forwardRef<InterstitialAdRef, InterstitialAdProps>(
  (
    { adUnitId, loadOnMount = false, onAdLoaded, onAdFailedToLoad, onAdClosed, children = null },
    ref,
  ) => {
    const { showAd } = useInterstitialAd({
      adUnitId,
      loadOnMount,
      onAdLoaded,
      onAdFailedToLoad,
      onAdClosed,
    });

    useImperativeHandle(ref, () => ({ showAd }), [showAd]);

    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
  },
);

InterstitialAd.displayName = 'InterstitialAd';
