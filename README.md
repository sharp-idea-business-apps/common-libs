# common-libs

Adapter-wrapped React Native integrations for Google Mobile Ads and in-app ratings. Feature code **never imports third-party SDKs directly** — all SDK calls are confined to this package.

## Structure

```
src/
  google-ads/   BannerAd · InterstitialAd · useInterstitialAd · useAppOpenAd
  rate-app/     RateAppModal · RateAppAdapter · useRateApp
  index.ts      Lazy re-exports per module
__tests__/      Co-located unit tests
__mocks__/      Jest manual mocks (google-mobile-ads, in-app-review)
```

## Modules

### `google-ads` — `react-native-google-mobile-ads` adapter

| Export | Kind | Notes |
|---|---|---|
| `BannerAd` | Component | Defaults to `BannerAdSize.BANNER` (320×50); non-personalised requests by default |
| `InterstitialAd` | Component | Headless; exposes `ref.showAd()` imperatively |
| `useInterstitialAd` | Hook | Load → show → auto-reload lifecycle |
| `useAppOpenAd` | Hook | Load → show lifecycle for app-open format |
| `BannerAdSize` | Re-export | SDK constant; avoids direct SDK import in callers |
| `AD_TEST_IDS` | Re-export | `TestIds` from SDK for development use |

```tsx
// Banner
import { BannerAd, AD_TEST_IDS, BannerAdSize } from 'common-libs/google-ads';
<BannerAd adUnitId={AD_TEST_IDS.BANNER} size={BannerAdSize.BANNER} />

// Interstitial (component)
const adRef = useRef<InterstitialAdRef>(null);
<InterstitialAd ref={adRef} adUnitId={AD_TEST_IDS.INTERSTITIAL} loadOnMount>
  <Button title="Show Ad" onPress={() => adRef.current?.showAd()} />
</InterstitialAd>

// Interstitial (hook)
const { showAd } = useInterstitialAd({ adUnitId: AD_TEST_IDS.INTERSTITIAL, loadOnMount: true });
```

### `rate-app` — `react-native-in-app-review` adapter

| Export | Kind | Notes |
|---|---|---|
| `useRateApp` | Hook | Cooldown via `AsyncStorage` (default 7 days); falls back to store URL if review unavailable |
| `RateAppModal` | Component | Pre-prompt modal with "Rate Now" / "Later" actions |
| `RateAppAdapter` | Object | Isolates SDK calls (`isAvailable`, `requestReview`); swap SDK here only |

```tsx
import { useRateApp, RateAppModal } from 'common-libs/rate-app';

const { isModalVisible, openRatePrompt, handleRateNow, handleDismiss } = useRateApp({
  cooldownDays: 14,
  playStoreUrl: 'https://play.google.com/store/apps/details?id=com.example',
  appStoreUrl: 'https://apps.apple.com/app/id000000000',
});

<RateAppModal visible={isModalVisible} onRateNow={handleRateNow} onDismiss={handleDismiss} />
```

## Tests

```bash
yarn test   # runs jest --testPathPattern=common-libs/__tests__
```

## Peer Dependencies

| Package | Role |
|---|---|
| `react-native-google-mobile-ads` | Ads SDK |
| `react-native-in-app-review` | Native review dialog |
| `@react-native-async-storage/async-storage` | Rate-app cooldown persistence |

