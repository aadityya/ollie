import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Modal } from 'react-native';
import { Text } from 'react-native-paper';
import { useAppTheme } from '@/src/theme';
import { useBabyStore } from '@/src/stores/useBabyStore';
import { calculateAge } from '@/src/utils/dateHelpers';
import { AppIcons, IconComponent } from '@/src/constants/icons';

function getBabyIcon(gender?: string): IconComponent {
  switch (gender) {
    case 'boy': return AppIcons.boy;
    case 'girl': return AppIcons.girl;
    default: return AppIcons.genderNeutral;
  }
}

interface BabySwitcherProps {
  compact?: boolean;
}

export function BabySwitcher({ compact }: BabySwitcherProps) {
  const { ollie } = useAppTheme();
  const babies = useBabyStore((s) => s.babies);
  const activeBaby = useBabyStore((s) => s.activeBaby);
  const setActiveBaby = useBabyStore((s) => s.setActiveBaby);

  const [showPicker, setShowPicker] = useState(false);

  const handleSelect = async (id: string) => {
    await setActiveBaby(id);
    setShowPicker(false);
  };

  const BabyIcon = getBabyIcon(activeBaby?.gender);

  const trigger = compact ? (
    <Pressable
      style={[styles.compactTrigger, { backgroundColor: ollie.accentLight, borderRadius: ollie.radiusSm }]}
      onPress={() => setShowPicker(true)}
    >
      <BabyIcon width={20} height={20} />
      <Text style={[styles.compactName, { color: ollie.accent }]} numberOfLines={1}>
        {activeBaby?.name ?? 'Baby'}
      </Text>
      <Text style={[styles.compactArrow, { color: ollie.accent }]}>{'>'}</Text>
    </Pressable>
  ) : (
    <Pressable
      style={[styles.switcher, { backgroundColor: ollie.bgCard, borderRadius: ollie.radiusSm }]}
      onPress={() => setShowPicker(true)}
    >
      <BabyIcon width={40} height={40} />
      <View style={styles.babyInfo}>
        <Text style={[styles.babyName, { color: ollie.textPrimary }]}>
          {activeBaby?.name ?? 'No baby selected'}
        </Text>
        {activeBaby?.dateOfBirth && (
          <Text style={[styles.babyAge, { color: ollie.textLight }]}>
            {calculateAge(activeBaby.dateOfBirth)}
          </Text>
        )}
      </View>
      {babies.length > 1 && (
        <Text style={[styles.switchLabel, { color: ollie.accent }]}>Switch</Text>
      )}
    </Pressable>
  );

  return (
    <>
      {trigger}

      <Modal visible={showPicker} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setShowPicker(false)}>
          <Pressable style={[styles.modal, { backgroundColor: ollie.bgCard }]} onPress={(e) => e.stopPropagation()}>
            <Text style={[styles.modalTitle, { color: ollie.textPrimary }]}>Switch Baby</Text>

            {babies.map((baby) => {
              const RowIcon = getBabyIcon(baby.gender);
              return (
                <Pressable
                  key={baby.id}
                  style={[
                    styles.babyRow,
                    {
                      backgroundColor: baby.id === activeBaby?.id ? ollie.accentLight : ollie.bgSecondary,
                      borderRadius: ollie.radiusSm,
                    },
                  ]}
                  onPress={() => handleSelect(baby.id)}
                >
                  <RowIcon width={28} height={28} />
                  <Text style={[styles.rowName, { color: ollie.textPrimary }]}>{baby.name}</Text>
                  <Text style={[styles.rowAge, { color: ollie.textLight }]}>
                    {calculateAge(baby.dateOfBirth)}
                  </Text>
                  {baby.id === activeBaby?.id && (
                    <Text style={[styles.activeBadge, { color: ollie.accent }]}>Active</Text>
                  )}
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  compactTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 6,
  },
  compactName: {
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
    maxWidth: 80,
  },
  compactArrow: {
    fontSize: 11,
    fontFamily: 'Nunito_700Bold',
  },
  switcher: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    width: '100%',
    gap: 12,
  },
  babyInfo: { flex: 1 },
  babyName: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
  },
  babyAge: {
    fontSize: 13,
    marginTop: 2,
  },
  switchLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modal: {
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_800ExtraBold',
    marginBottom: 16,
    textAlign: 'center',
  },
  babyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 8,
    gap: 10,
  },
  rowName: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Nunito_700Bold',
  },
  rowAge: {
    fontSize: 12,
    marginRight: 8,
  },
  activeBadge: {
    fontSize: 12,
    fontFamily: 'Nunito_700Bold',
  },
});
