import React, { useState, useCallback, useRef } from 'react';
import { ScrollView, View, StyleSheet, Pressable, TextInput, Alert, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAppTheme } from '@/src/theme';
import { useBabyStore } from '@/src/stores/useBabyStore';
import { DateField } from '@/src/components/DateField';
import { TimeField } from '@/src/components/TimeField';
import { Appointment } from '@/src/types';
import * as appointmentRepo from '@/src/db/repositories/appointmentRepository';

export default function AppointmentsScreen() {
  const { ollie } = useAppTheme();
  const router = useRouter();
  const baby = useBabyStore((s) => s.activeBaby);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const loadData = useCallback(async () => {
    if (!baby?.id) return;
    const data = await appointmentRepo.getAppointments(baby.id);
    setAppointments(data);
  }, [baby?.id]);

  useFocusEffect(useCallback(() => { loadData(); }, [loadData]));

  const now = new Date().toISOString();
  const upcoming = appointments.filter((a) => a.dateTime >= now);
  const past = appointments.filter((a) => a.dateTime < now);

  const resetForm = () => {
    setTitle(''); setDate(''); setTime(''); setLocation(''); setNotes('');
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (apt: Appointment) => {
    setEditingId(apt.id);
    const d = new Date(apt.dateTime);
    setTitle(apt.title);
    setDate(apt.dateTime.split('T')[0]);
    setTime(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`);
    setLocation(apt.location ?? '');
    setNotes(apt.notes ?? '');
    setShowForm(true);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 300);
  };

  const handleSave = async () => {
    if (!baby?.id || !title.trim() || !date.trim()) return;
    setSaving(true);
    try {
      const dateTime = time.trim()
        ? `${date.trim()}T${time.trim()}:00`
        : `${date.trim()}T09:00:00`;
      const data = {
        title: title.trim(),
        dateTime,
        location: location.trim() || undefined,
        notes: notes.trim() || undefined,
      };
      if (editingId) {
        await appointmentRepo.updateAppointment(editingId, data);
      } else {
        await appointmentRepo.insertAppointment({ babyId: baby.id, ...data });
      }
      resetForm();
      await loadData();
    } catch (e) {
      Alert.alert('Error', 'Failed to save appointment.');
    }
    setSaving(false);
  };

  const handleDelete = (apt: Appointment) => {
    Alert.alert('Delete Appointment', `Delete "${apt.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          await appointmentRepo.deleteAppointment(apt.id);
          if (editingId === apt.id) resetForm();
          await loadData();
        },
      },
    ]);
  };

  const renderCard = (apt: Appointment) => {
    const d = new Date(apt.dateTime);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    return (
      <View
        key={apt.id}
        style={[styles.card, { backgroundColor: ollie.bgCard, borderRadius: ollie.radiusSm }]}
      >
        <Text style={[styles.cardTitle, { color: ollie.textPrimary }]}>{apt.title}</Text>
        <Text style={[styles.cardDate, { color: ollie.accent }]}>{dateStr} at {timeStr}</Text>
        {apt.location && (
          <Text style={[styles.cardDetail, { color: ollie.textSecondary }]}>📍 {apt.location}</Text>
        )}
        {apt.notes && (
          <Text style={[styles.cardDetail, { color: ollie.textLight }]}>{apt.notes}</Text>
        )}
        <View style={styles.cardActions}>
          <Pressable onPress={() => startEdit(apt)}>
            <Text style={[styles.actionText, { color: ollie.accent }]}>Edit</Text>
          </Pressable>
          <Pressable onPress={() => handleDelete(apt)}>
            <Text style={[styles.actionText, { color: ollie.textLight }]}>Delete</Text>
          </Pressable>
        </View>
      </View>
    );
  };

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
          {baby?.name ? `${baby.name}'s Appointments` : 'Appointments'}
        </Text>

        {upcoming.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: ollie.textLight }]}>UPCOMING</Text>
            {upcoming.map(renderCard)}
          </>
        )}

        {past.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: ollie.textLight }]}>PAST</Text>
            {past.map(renderCard)}
          </>
        )}

        {appointments.length === 0 && !showForm && (
          <View style={styles.empty}>
            <Text style={[styles.emptyIcon]}>📅</Text>
            <Text style={[styles.emptyText, { color: ollie.textLight }]}>No appointments yet</Text>
          </View>
        )}

        {showForm && (
          <View style={[styles.form, { backgroundColor: ollie.bgCard, borderRadius: ollie.radius }]}>
            <Text style={[styles.formTitle, { color: ollie.textPrimary }]}>
              {editingId ? 'Edit Appointment' : 'New Appointment'}
            </Text>
            <TextInput
              style={[styles.input, { color: ollie.textPrimary, borderColor: ollie.border, backgroundColor: ollie.bg }]}
              value={title} onChangeText={setTitle} placeholder="Title" placeholderTextColor={ollie.textLight}
              onFocus={() => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 300)}
            />
            <View style={{ marginBottom: 10 }}>
              <DateField value={date} onChange={setDate} />
            </View>
            <View style={{ marginBottom: 10 }}>
              <TimeField value={time} onChange={setTime} label="Time (optional)" />
            </View>
            <TextInput
              style={[styles.input, { color: ollie.textPrimary, borderColor: ollie.border, backgroundColor: ollie.bg }]}
              value={location} onChangeText={setLocation} placeholder="Location (optional)" placeholderTextColor={ollie.textLight}
              onFocus={() => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 300)}
            />
            <TextInput
              style={[styles.input, styles.textArea, { color: ollie.textPrimary, borderColor: ollie.border, backgroundColor: ollie.bg }]}
              value={notes} onChangeText={setNotes} placeholder="Notes (optional)" placeholderTextColor={ollie.textLight}
              multiline numberOfLines={3}
              onFocus={() => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 300)}
            />
          </View>
        )}

        {!showForm && (
          <Pressable
            style={[styles.addBtn, { borderColor: ollie.accent }]}
            onPress={() => { setEditingId(null); setShowForm(true); setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 300); }}
          >
            <Text style={[styles.addBtnText, { color: ollie.accent }]}>+ Add Appointment</Text>
          </Pressable>
        )}
      </ScrollView>
      {showForm && (
        <View style={[styles.bottomBar, { backgroundColor: ollie.bg }]}>
          <View style={styles.formActions}>
            <Pressable onPress={resetForm}>
              <Text style={[styles.cancelBtn, { color: ollie.textSecondary }]}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.saveBtn, { backgroundColor: ollie.accent }]}
              onPress={() => { Keyboard.dismiss(); handleSave(); }}
              disabled={saving || !title.trim() || !date.trim()}
            >
              <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save'}</Text>
            </Pressable>
          </View>
        </View>
      )}
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
  bottomBar: { paddingHorizontal: 20, paddingVertical: 12, paddingBottom: 20 },
  formActions: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 16 },
  cancelBtn: { fontSize: 15, fontFamily: 'Nunito_600SemiBold' },
  saveBtn: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 10 },
  saveBtnText: { color: '#FFFFFF', fontSize: 15, fontFamily: 'Nunito_700Bold' },
  addBtn: { borderWidth: 2, borderStyle: 'dashed', borderRadius: 14, padding: 14, alignItems: 'center', marginTop: 20 },
  addBtnText: { fontSize: 15, fontFamily: 'Nunito_700Bold' },
});
