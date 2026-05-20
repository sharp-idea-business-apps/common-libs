/**
 * Manual Jest mock for react-native-in-app-review.
 *
 * Placed in common-libs/__mocks__/ and wired via jest.config.js
 * moduleNameMapper so all tests that import the SDK receive this mock
 * without any jest.mock() call at the call site.
 *
 * Test helpers:
 *   - InAppReviewMock.isAvailable        → configure availability
 *   - InAppReviewMock.RequestInAppReview → configure review flow result
 */

const mockIsAvailable = jest.fn(() => true);
const mockRequestInAppReview = jest.fn(() => Promise.resolve(true));

const InAppReviewMock = {
  isAvailable: mockIsAvailable,
  RequestInAppReview: mockRequestInAppReview,
};

module.exports = {
  __esModule: true,
  default: InAppReviewMock,
  ...InAppReviewMock,
};
