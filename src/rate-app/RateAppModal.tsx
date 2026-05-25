import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { RateAppModalProps } from './types';

/**
 * Custom pre-prompt modal shown before the platform-native in-app review
 * dialog. Gives the user a chance to opt in ("Rate Now") or defer ("Later").
 */
export function RateAppModal({
  visible,
  onRateNow,
  onDismiss,
}: RateAppModalProps): React.JSX.Element {
  return (
    <Modal
      testID="rate-app-modal"
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Enjoying the app?</Text>
          <Text style={styles.body}>
            Your rating helps us improve. It only takes a second!
          </Text>
          <View style={styles.actions}>
            <TouchableOpacity
              testID="rate-app-dismiss"
              style={styles.btnSecondary}
              onPress={onDismiss}
              activeOpacity={0.7}
            >
              <Text style={styles.btnSecondaryText}>Later</Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="rate-app-rate-now"
              style={styles.btnPrimary}
              onPress={onRateNow}
              activeOpacity={0.7}
            >
              <Text style={styles.btnPrimaryText}>Rate Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  btnSecondary: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  btnSecondaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  btnPrimary: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#6366f1',
  },
  btnPrimaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
});
