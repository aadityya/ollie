import React, { useState, useCallback, useRef } from 'react';
import { ScrollView, View, StyleSheet, Pressable, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAppTheme } from '@/src/theme';
import { useBabyStore } from '@/src/stores/useBabyStore';
import { DateField } from '@/src/components/DateField';
import { Medication } from '@/src/types';
import * as medicationRepo from '@/src/db/repositories/medicationRepository';

export default function MedicationsScreen() {
  const { ollie } = useAppTheme();
  const router = useRouter();
  const baby = useBabyStore((s) => s.activeBaby);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const loadData = useCallback(async () => {
    if (!baby?.id) return;
    const data = await medicationRepo.getMedications(baby.id);
    setMedications(data);
  }, [baby?.id]);

  useFocusEffect(useCallback(() => { loadData(); }, [loadData]));

  const resetForm = () => {
    setName(''); setDosage(''); setFrequency('');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate(''); setNotes('');
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (med: Medication) => {
    setEditingId(med.id);
    setName(med.name);
    setDosage(med.dosage ?? '');
    setFrequency(med.frequency ?? '');
    setStartDate(med.startDate);
    setEndDate(med.endDate ?? '');
    setNotes(med.notes ?? '');
    setShowForm(true);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 300);
  };

  const handleSave = async () => {
    if (!baby?.id || !name.trim() || !startDate.trim()) return;
    setSaving(true);
    try {
      const data = {
        name: name.trim(),
        dosage: dosage.trim() || undefined,
        frequency: frequency.trim() || undefined,
        startDate: startDate.trim(),
        endDate: endDate.trim() || undefined,
        notes: notes.trim() || undefined,
      };
      if (editingId) {
        await medicationRepo.updateMedication(editingId, data);
      } else {
        await medicationRepo.insertMedication({ babyId: baby.id, ...data });
      }
      resetForm();
      await loadData();
    } catch (e) {
      Alert.alert('Error', 'Failed to save medication.');
    }
    setSaving(false);
  };

  const handleDelete = (med: Medication) => {
    Alert.alert('Delete Medication', `Delete "${med.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          await medicationRepo.deleteMedication(med.id);
          if (editingId === med.id) resetForm();
          await loadData();
        },
      },
    ]);
  };

  const active = medications.filter((m) => !m.endDate);
  const ended = medications.filter((m) => !!m.endDate);

  const renderCard = (med: Medication) => (
    <View
      key={med.id}
      style={[styles.card, { backgroundColor: ollie.bgCard, borderRadius: ollie.radiusSm }]}
    >
      <Text style={[styles.cardTitle, { color: ollie.textPrimary }]}>{med.name}</Text>
      {med.dosage && (
        <Text style={[styles.cardDetail, { color: ollie.textSecondary }]}>Dosage: {med.dosage}</Text>
      )}
      {med.frequency && (
        <Text style={[styles.cardDetail, { color: ollie.textSecondary }]}>Frequency: {med.frequency}</Text>
      )}
      <Text style={[styles.cardDate, { color: ollie.accent }]}>
        Started: {med.startDate}{med.endDate ? ` — Ended: ${med.endDate}` : ''}
      </Text>
      {med.notes && (
        <Text style={[styles.cardDetail, { color: ollie.textLight }]}>{med.notes}</Text>
      )}
      <View style={styles.cardActions}>
        <Pressable onPress={() => startEdit(med)}>
          <Text style={[styles.actionText, { color: ollie.accent }]}>Edit</Text>
        </Pressable>
        <Pressable onPress={() => handleDelete(med)}>
          <Text style={[styles.actionText, { color: ollie.textLight }]}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: ollie.bg }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={[styles.backText, { color: ollie.textSecondary }]}>{'Back'}</Text>
        </Pressable>

        <Text style={[styles.title, { color: ollie.textPrimary }]}>
          {baby?.name ? `${baby.name}'s Medications` : 'Medications'}
        </Text>

        {active.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: ollie.textLight }]}>ACTIVE</Text>
            {active.map(renderCard)}
          </>
        )}

        {ended.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: ollie.textLight }]}>ENDED</Text>
            {ended.map(renderCard)}
          </>
        )}

        {medications.length === 0 && !showForm && (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>💊</Text>
            <Text style={[styles.emptyText, { color: ollie.textLight }]}>No medications yet</Text>
          </View>
        )}

        {showForm && (
          <View style={[styles.form, { backgroundColor: ollie.bgCard, borderRadius: ollie.radius }]}>
            <Text style={[styles.formTitle, { color: ollie.textPrimary }]}>
              {editingId ? 'Edit Medication' : 'New Medication'}
            </Text>
            <TextInput
              style={[styles.input, { color: ollie.textPrimary, borderColor: ollie.border, backgroundColor: ollie.bg }]}
              value={name} onChangeText={setName} placeholder="Medication name" placeholderTextColor={ollie.textLight}
              onFocus={() => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 300)}
            />
            <TextInput
              style={[styles.input, { color: ollie.textPrimary, borderColor: ollie.border, backgroundColor: ollie.bg }]}
              value={dosage} onChangeText={setDosage} placeholder="Dosage (optional)" placeholderTextColor={ollie.textLight}
              onFocus={() => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 300)}
            />
            <TextInput
              style={[styles.input, { color: ollie.textPrimary, borderColor: ollie.border, backgroundColor: ollie.bg }]}
              value={frequency} onChangeText={setFrequency} placeholder="Frequency (optional)" placeholderTextColor={ollie.textLight}
              onFocus={() => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 300)}
            />
            <View style={{ marginBottom: 10 }}>
              <DateField value={startDate} onChange={setStartDate} />
            </View>
            <View style={{ marginBottom: 10 }}>
              <DateField value={endDate} onChange={setEndDate} label="End Date (optional)" />
            </View>
            <TextInput
              style={[styles.input, styles.textArea, { color: ollie.textPrimary, borderColor: ollie.border, backgroundColor: ollie.bg }]}
              value={notes} onChangeText={setNotes} placeholder="Notes (optional)" placeholderTextColor={ollie.textLight}
              multiline numberOfLines={3}
              onFocus={() => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 300)}
            />
            <View style={styles.formActions}>
              <Pressable onPress={resetForm}>
                <Text style={[styles.cancelBtn, { color: ollie.textSecondary }]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.saveBtn, { backgroundColor: ollie.accent }]}
                onPress={handleSave}
                disabled={saving || !name.trim() || !startDate.trim()}
              >
                <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save'}</Text>
              </Pressable>
            </View>
          </View>
        )}

        {!showForm && (
          <Pressable
            style={[styles.addBtn, { borderColor: ollie.accent }]}
            onPress={() => { setEditingId(null); setShowForm(true); setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 300); }}
          >
            <Text style={[styles.addBtnText, { color: ollie.accent }]}>+ Add Medication</Text>
          </Pressable>
        )}
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  backBtn: { marginBottom: 8 },
  backText: { fontSize: 16, fontFamily: 'Nunito_600SemiBold' },
  title: { fontSize: 24, fontFamily: 'Nunito_800ExtraBold', marginBottom: 16 },
  sectionTitle: { fontSize: 12, fontFamily: 'Nunito_700Bold', letterSpacing: 1, marginBottom: 8, marginTop: 16 },
  card: { padding: 16, marginBottom: 10 },
  cardTitle: { fontSize: 16, fontFamily: 'Nunito_700Bold', marginBottom: 4 },
  cardDate: { fontSize: 13, fontFamily: 'Nunito_600SemiBold', marginBottom: 4 },
  cardDetail: { fontSize: 13, marginTop: 2 },
  cardActions: { flexDirection: 'row', gap: 20, marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#f0e8df' },
  actionText: { fontSize: 13, fontFamily: 'Nunito_700Bold' },
  empty: { alignItems: 'center', paddingVertical: 40 },
  emptyIcon: { fontSize: 40, marginBottom: 8 },
  emptyText: { fontSize: 15 },
  form: { padding: 16, marginTop: 16 },
  formTitle: { fontSize: 16, fontFamily: 'Nunito_700Bold', marginBottom: 12 },
  input: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, borderWidth: 1.5, fontSize: 15, fontFamily: 'Nunito_400Regular', marginBottom: 10 },
  textArea: { minHeight: 60, textAlignVertical: 'top' },
  formActions: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 16, marginTop: 8 },
  cancelBtn: { fontSize: 15, fontFamily: 'Nunito_600SemiBold' },
  saveBtn: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 10 },
  saveBtnText: { color: '#FFFFFF', fontSize: 15, fontFamily: 'Nunito_700Bold' },
  addBtn: { borderWidth: 2, borderStyle: 'dashed', borderRadius: 14, padding: 14, alignItems: 'center', marginTop: 20 },
  addBtnText: { fontSize: 15, fontFamily: 'Nunito_700Bold' },
});
