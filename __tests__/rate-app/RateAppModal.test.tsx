import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { RateAppModal } from '../../src/rate-app';

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('RateAppModal', () => {
  it('renders without crashing when visible', async () => {
    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(
        <RateAppModal visible onRateNow={jest.fn()} onDismiss={jest.fn()} />,
      );
    });
  });

  it('renders "Rate Now" and "Later" buttons when visible', async () => {
    let tree!: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(
        <RateAppModal visible onRateNow={jest.fn()} onDismiss={jest.fn()} />,
      );
    });
    expect(tree.root.findByProps({ testID: 'rate-app-rate-now' })).toBeTruthy();
    expect(tree.root.findByProps({ testID: 'rate-app-dismiss' })).toBeTruthy();
  });

  it('calls onRateNow when "Rate Now" is pressed', async () => {
    const onRateNow = jest.fn();
    let tree!: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(
        <RateAppModal visible onRateNow={onRateNow} onDismiss={jest.fn()} />,
      );
    });
    await ReactTestRenderer.act(async () => {
      tree.root.findByProps({ testID: 'rate-app-rate-now' }).props.onPress();
    });
    expect(onRateNow).toHaveBeenCalledTimes(1);
  });

  it('calls onDismiss when "Later" is pressed', async () => {
    const onDismiss = jest.fn();
    let tree!: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(
        <RateAppModal visible onRateNow={jest.fn()} onDismiss={onDismiss} />,
      );
    });
    await ReactTestRenderer.act(async () => {
      tree.root.findByProps({ testID: 'rate-app-dismiss' }).props.onPress();
    });
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('renders without crashing when not visible', async () => {
    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(
        <RateAppModal
          visible={false}
          onRateNow={jest.fn()}
          onDismiss={jest.fn()}
        />,
      );
    });
  });
});
