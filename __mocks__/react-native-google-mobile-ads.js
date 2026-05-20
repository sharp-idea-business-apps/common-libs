/**
 * Manual Jest mock for react-native-google-mobile-ads.
 *
 * Placed in __mocks__/ adjacent to node_modules so Jest applies it
 * automatically to all tests without requiring jest.mock() call sites.
 *
 * Test helpers:
 *   - InterstitialAd.createForAdRequest.mock.results[n].value  → ad instance
 *   - adInstance.addAdEventListener.mock.calls                 → find callbacks
 */

const mockLoad = jest.fn();
const mockShow = jest.fn();
// Returns a mock unsubscribe function (matching the real SDK contract).
const mockAddAdEventListener = jest.fn().mockReturnValue(jest.fn());

const mockAdInstance = {
  load: mockLoad,
  show: mockShow,
  addAdEventListener: mockAddAdEventListener,
};

module.exports = {
  InterstitialAd: {
    createForAdRequest: jest.fn(() => mockAdInstance),
  },

  AdEventType: {
    LOADED: 'loaded',
    ERROR: 'error',
    CLOSED: 'closed',
    OPENED: 'opened',
    CLICKED: 'clicked',
    LEFT_APPLICATION: 'left_application',
    IMPRESSION: 'impression',
  },

  BannerAd: jest.fn(() => null),

  BannerAdSize: {
    BANNER: 'BANNER',
    LARGE_BANNER: 'LARGE_BANNER',
    MEDIUM_RECTANGLE: 'MEDIUM_RECTANGLE',
    FULL_BANNER: 'FULL_BANNER',
    LEADERBOARD: 'LEADERBOARD',
    ADAPTIVE_BANNER: 'ADAPTIVE_BANNER',
  },

  TestIds: {
    BANNER: 'ca-app-pub-3940256099942544/6300978111',
    INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712',
  },
};
