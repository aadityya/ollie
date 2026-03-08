import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Modal, TextInput, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import { useAppTheme } from '@/src/theme';
import { useBabyStore } from '@/src/stores/useBabyStore';
import { calculateAge } from '@/src/utils/dateHelpers';

interface BabySwitcherProps {
  compact?: boolean;
}

export function BabySwitcher({ compact }: BabySwitcherProps) {
  const { ollie } = useAppTheme();
  const babies = useBabyStore((s) => s.babies);
  const activeBaby = useBabyStore((s) => s.activeBaby);
  const setActiveBaby = useBabyStore((s) => s.setActiveBaby);
  const addBaby = useBabyStore((s) => s.addBaby);
  const deleteBaby = useBabyStore((s) => s.deleteBaby);

  const [showPicker, setShowPicker] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDob, setNewDob] = useState('');

  const handleSelect = async (id: string) => {
    await setActiveBaby(id);
    setShowPicker(false);
  };

  const handleAddBaby = async () => {
    if (!newName.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(newDob)) return;
    await addBaby({ name: newName.trim(), dateOfBirth: newDob });
    setNewName('');
    setNewDob('');
    setShowAddForm(false);
    setShowPicker(false);
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Delete Profile',
      `Are you sure you want to delete ${name}'s profile? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteBaby(id);
            if (babies.length <= 1) setShowPicker(false);
          },
        },
      ]
    );
  };

  const trigger = compact ? (
    <Pressable
      style={[styles.compactTrigger, { backgroundColor: ollie.accentLight, borderRadius: ollie.radiusSm }]}
      onPress={() => setShowPicker(true)}
    >
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
      <Text style={[styles.switchLabel, { color: ollie.accent }]}>
        {babies.length > 1 ? 'Switch' : 'Manage'}
      </Text>
    </Pressable>
  );

  return (
    <>
      {trigger}

      <Modal visible={showPicker} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => { setShowPicker(false); setShowAddForm(false); }}>
          <Pressable style={[styles.modal, { backgroundColor: ollie.bgCard }]} onPress={(e) => e.stopPropagation()}>
            <Text style={[styles.modalTitle, { color: ollie.textPrimary }]}>Baby Profiles</Text>

            {babies.map((baby) => (
              <View
                key={baby.id}
                style={[
                  styles.babyRow,
                  {
                    backgroundColor: baby.id === activeBaby?.id ? ollie.accentLight : ollie.bgSecondary,
                    borderRadius: ollie.radiusSm,
                  },
                ]}
              >
                <Pressable style={styles.babyRowContent} onPress={() => handleSelect(baby.id)}>
                  <Text style={[styles.rowName, { color: ollie.textPrimary }]}>{baby.name}</Text>
                  <Text style={[styles.rowAge, { color: ollie.textLight }]}>
                    {calculateAge(baby.dateOfBirth)}
                  </Text>
                  {baby.id === activeBaby?.id && (
                    <Text style={[styles.activeBadge, { color: ollie.accent }]}>Active</Text>
                  )}
                </Pressable>
                <Pressable
                  style={styles.deleteBtn}
                  onPress={() => handleDelete(baby.id, baby.name)}
                >
                  <Text style={styles.deleteBtnText}>x</Text>
                </Pressable>
              </View>
            ))}

            {showAddForm ? (
              <View style={styles.addForm}>
                <TextInput
                  style={[styles.input, { color: ollie.textPrimary, borderColor: ollie.border, backgroundColor: ollie.bg }]}
                  value={newName}
                  onChangeText={setNewName}
                  placeholder="Baby's name"
                  placeholderTextColor={ollie.textLight}
                  autoFocus
                />
                <TextInput
                  style={[styles.input, { color: ollie.textPrimary, borderColor: ollie.border, backgroundColor: ollie.bg }]}
                  value={newDob}
                  onChangeText={setNewDob}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={ollie.textLight}
                  keyboardType="numbers-and-punctuation"
                />
                <View style={styles.formButtons}>
                  <Pressable
                    style={[styles.formBtn, { backgroundColor: ollie.bgSecondary }]}
                    onPress={() => setShowAddForm(false)}
                  >
                    <Text style={[styles.formBtnText, { color: ollie.textSecondary }]}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.formBtn, { backgroundColor: ollie.accent }]}
                    onPress={handleAddBaby}
                  >
                    <Text style={[styles.formBtnText, { color: '#FFFFFF' }]}>Add</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <Pressable
                style={[styles.addBtn, { borderColor: ollie.accent }]}
                onPress={() => setShowAddForm(true)}
              >
                <Text style={[styles.addBtnText, { color: ollie.accent }]}>+ Add Baby</Text>
              </Pressable>
            )}
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
    gap: 4,
  },
  compactName: {
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
    maxWidth: 100,
  },
  compactArrow: {
    fontSize: 11,
    fontFamily: 'Nunito_700Bold',
  },
  switcher: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginTop: 8,
  },
  babyInfo: { flex: 1 },
  babyName: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
  babyAge: {
    fontSize: 12,
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
  },
  babyRowContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
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
    marginRight: 8,
  },
  deleteBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(239,68,68,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnText: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
    color: '#EF4444',
  },
  addBtn: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  addBtnText: {
    fontSize: 15,
    fontFamily: 'Nunito_700Bold',
  },
  addForm: {
    marginTop: 8,
    gap: 10,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
  },
  formButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  formBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  formBtnText: {
    fontSize: 15,
    fontFamily: 'Nunito_700Bold',
  },
});
