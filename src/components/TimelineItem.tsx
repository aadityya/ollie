import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Alert, Modal } from 'react-native';
import { Text } from 'react-native-paper';
import { useAppTheme } from '@/src/theme';
import { Activity } from '@/src/types';
import { getMetaForType, getActivityTitle, getActivityDetail } from '@/src/utils/activityHelpers';
import { formatTime } from '@/src/utils/dateHelpers';

interface TimelineItemProps {
  activity: Activity;
  onDelete?: () => void;
}

function formatDurationLong(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m} min`;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, ' ');
}

export function TimelineItem({ activity, onDelete }: TimelineItemProps) {
  const { ollie } = useAppTheme();
  const meta = getMetaForType(activity.type);
  const colors = meta.getColors(ollie);
  const Icon = meta.icon;
  const [showDetail, setShowDetail] = useState(false);

  const handleDelete = () => {
    Alert.alert('Delete Activity', 'Are you sure you want to delete this entry?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: onDelete },
    ]);
  };

  const detailRows: { label: string; value: string }[] = [];

  // Time
  detailRows.push({ label: 'Time', value: formatTime(activity.startedAt) });

  // Duration
  if (activity.durationSeconds) {
    detailRows.push({ label: 'Duration', value: formatDurationLong(activity.durationSeconds) });
  }

  // Type-specific fields
  if (activity.type === 'feed') {
    if (activity.feedType) {
      const feedLabels: Record<string, string> = {
        breast_left: 'Breast (Left)',
        breast_right: 'Breast (Right)',
        bottle: 'Bottle',
      };
      detailRows.push({ label: 'Feed Type', value: feedLabels[activity.feedType] ?? activity.feedType });
    }
    if (activity.bottleAmountMl) {
      detailRows.push({ label: 'Amount', value: `${activity.bottleAmountMl} ml` });
    }
  }

  if (activity.type === 'sleep' && activity.sleepType) {
    detailRows.push({ label: 'Sleep Type', value: capitalize(activity.sleepType) });
  }

  if (activity.type === 'pee' && activity.peeAmount) {
    detailRows.push({ label: 'Amount', value: capitalize(activity.peeAmount) });
  }

  if (activity.type === 'poop') {
    if (activity.poopColor) detailRows.push({ label: 'Color', value: capitalize(activity.poopColor) });
    if (activity.poopConsistency) detailRows.push({ label: 'Consistency', value: capitalize(activity.poopConsistency) });
  }

  if (activity.type === 'colic') {
    if (activity.colicIntensity) detailRows.push({ label: 'Intensity', value: capitalize(activity.colicIntensity) });
    if (activity.colicWhatHelped) detailRows.push({ label: 'What Helped', value: activity.colicWhatHelped });
  }

  if (activity.notes) {
    detailRows.push({ label: 'Notes', value: activity.notes });
  }

  return (
    <>
      <Pressable
        onPress={() => setShowDetail(true)}
        style={[styles.container, { backgroundColor: ollie.bgCard, borderRadius: ollie.radiusSm, shadowColor: ollie.shadow }]}
      >
        <View style={[styles.icon, { backgroundColor: colors.bg, borderRadius: 12 }]}>
          <Icon width={48} height={48} />
        </View>
        <View style={styles.info}>
          <Text style={[styles.title, { color: ollie.textPrimary }]}>
            {getActivityTitle(activity)}
          </Text>
          <Text style={[styles.detail, { color: ollie.textSecondary }]} numberOfLines={1}>
            {getActivityDetail(activity)}
          </Text>
        </View>
        <Text style={[styles.time, { color: ollie.textLight }]}>
          {formatTime(activity.startedAt)}
        </Text>
        {onDelete && (
          <Pressable onPress={handleDelete} hitSlop={8}>
            <Text style={[styles.deleteBtn, { color: ollie.textLight }]}>×</Text>
          </Pressable>
        )}
      </Pressable>

      <Modal visible={showDetail} transparent animationType="fade" onRequestClose={() => setShowDetail(false)}>
        <Pressable style={styles.overlay} onPress={() => setShowDetail(false)}>
          <Pressable style={[styles.modal, { backgroundColor: ollie.bg, borderRadius: ollie.radius }]} onPress={() => {}}>
            <View style={[styles.modalHeader, { backgroundColor: colors.bg, borderRadius: ollie.radiusSm }]}>
              <Icon width={64} height={64} />
              <Text style={[styles.modalTitle, { color: colors.color }]}>
                {getActivityTitle(activity)}
              </Text>
            </View>

            <View style={styles.modalBody}>
              {detailRows.map((row) => (
                <View key={row.label} style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: ollie.textLight }]}>{row.label}</Text>
                  <Text style={[styles.detailValue, { color: ollie.textPrimary }]}>{row.value}</Text>
                </View>
              ))}
            </View>

            <Pressable style={[styles.closeBtn, { backgroundColor: ollie.bgSecondary, borderRadius: ollie.radiusSm }]} onPress={() => setShowDetail(false)}>
              <Text style={[styles.closeBtnText, { color: ollie.textSecondary }]}>Close</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    marginBottom: 8,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  icon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
  detail: {
    fontSize: 12,
    marginTop: 2,
  },
  time: {
    fontSize: 12,
    fontFamily: 'Nunito_700Bold',
  },
  deleteBtn: {
    fontSize: 22,
    fontWeight: '300',
    marginLeft: 4,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  modal: {
    width: '100%',
    padding: 20,
    maxWidth: 360,
  },
  modalHeader: {
    alignItems: 'center',
    padding: 20,
    gap: 8,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_800ExtraBold',
  },
  modalBody: {
    gap: 12,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 4,
  },
  detailLabel: {
    fontSize: 13,
    fontFamily: 'Nunito_600SemiBold',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
    flex: 2,
    textAlign: 'right',
  },
  closeBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 15,
    fontFamily: 'Nunito_700Bold',
  },
});
