import React, { useState, useCallback } from 'react';
import { ScrollView, View, StyleSheet, Pressable, TextInput, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAppTheme } from '@/src/theme';
import { DateField } from '@/src/components/DateField';
import { useBabyStore } from '@/src/stores/useBabyStore';
import { Memory } from '@/src/types';
import * as memoryRepo from '@/src/db/repositories/memoryRepository';

export default function MemoriesScreen() {
  const { ollie } = useAppTheme();
  const router = useRouter();
  const baby = useBabyStore((s) => s.activeBaby);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    if (!baby?.id) return;
    const data = await memoryRepo.getMemories(baby.id);
    setMemories(data);
  }, [baby?.id]);

  useFocusEffect(useCallback(() => { loadData(); }, [loadData]));

  const handleSave = async () => {
    if (!baby?.id || !title.trim() || !date.trim()) return;
    setSaving(true);
    try {
      await memoryRepo.insertMemory({
        babyId: baby.id,
        title: title.trim(),
        date: date.trim(),
        description: description.trim() || undefined,
      });
      setTitle(''); setDate(new Date().toISOString().split('T')[0]); setDescription('');
      setShowForm(false);
      await loadData();
    } catch (e) {
      Alert.alert('Error', 'Failed to save memory.');
    }
    setSaving(false);
  };

  const handleDelete = (memory: Memory) => {
    Alert.alert('Delete Memory', `Delete "${memory.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          await memoryRepo.deleteMemory(memory.id);
          await loadData();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: ollie.bg }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={[styles.backText, { color: ollie.textSecondary }]}>{'< Back'}</Text>
        </Pressable>

        <Text style={[styles.screenTitle, { color: ollie.textPrimary }]}>
          {baby?.name ? `${baby.name}'s Memories` : 'Memories'}
        </Text>

        {memories.length === 0 && !showForm && (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>💝</Text>
            <Text style={[styles.emptyText, { color: ollie.textLight }]}>No memories yet</Text>
            <Text style={[styles.emptySubtext, { color: ollie.textLight }]}>Record special moments</Text>
          </View>
        )}

        {memories.map((memory) => (
          <Pressable
            key={memory.id}
            style={[styles.card, { backgroundColor: ollie.bgCard, borderRadius: ollie.radiusSm }]}
            onLongPress={() => handleDelete(memory)}
          >
            <Text style={[styles.cardTitle, { color: ollie.textPrimary }]}>{memory.title}</Text>
            <Text style={[styles.cardDate, { color: ollie.accent }]}>{memory.date}</Text>
            {memory.description && (
              <Text style={[styles.cardDesc, { color: ollie.textSecondary }]}>{memory.description}</Text>
            )}
          </Pressable>
        ))}

        {showForm && (
          <View style={[styles.form, { backgroundColor: ollie.bgCard, borderRadius: ollie.radius }]}>
            <Text style={[styles.formTitle, { color: ollie.textPrimary }]}>New Memory</Text>
            <TextInput
              style={[styles.input, { color: ollie.textPrimary, borderColor: ollie.border, backgroundColor: ollie.bg }]}
              value={title} onChangeText={setTitle} placeholder="First smile, first word..." placeholderTextColor={ollie.textLight}
            />
            <View style={{ marginBottom: 10 }}>
              <DateField value={date} onChange={setDate} />
            </View>
            <TextInput
              style={[styles.input, styles.textArea, { color: ollie.textPrimary, borderColor: ollie.border, backgroundColor: ollie.bg }]}
              value={description} onChangeText={setDescription} placeholder="Describe this moment..." placeholderTextColor={ollie.textLight}
              multiline numberOfLines={4}
            />
            <View style={styles.formActions}>
              <Pressable onPress={() => setShowForm(false)}>
                <Text style={[styles.cancelBtn, { color: ollie.textSecondary }]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.saveBtn, { backgroundColor: ollie.accent }]}
                onPress={handleSave}
                disabled={saving || !title.trim()}
              >
                <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save'}</Text>
              </Pressable>
            </View>
          </View>
        )}

        {!showForm && (
          <Pressable
            style={[styles.addBtn, { borderColor: ollie.accent }]}
            onPress={() => setShowForm(true)}
          >
            <Text style={[styles.addBtnText, { color: ollie.accent }]}>+ Add Memory</Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  backBtn: { marginBottom: 8 },
  backText: { fontSize: 16, fontFamily: 'Nunito_600SemiBold' },
  screenTitle: { fontSize: 24, fontFamily: 'Nunito_800ExtraBold', marginBottom: 16 },
  empty: { alignItems: 'center', paddingVertical: 40 },
  emptyIcon: { fontSize: 40, marginBottom: 8 },
  emptyText: { fontSize: 15, fontFamily: 'Nunito_700Bold' },
  emptySubtext: { fontSize: 13, marginTop: 4 },
  card: { padding: 16, marginBottom: 10 },
  cardTitle: { fontSize: 16, fontFamily: 'Nunito_700Bold', marginBottom: 4 },
  cardDate: { fontSize: 13, fontFamily: 'Nunito_600SemiBold', marginBottom: 4 },
  cardDesc: { fontSize: 13, marginTop: 4, lineHeight: 18 },
  form: { padding: 16, marginTop: 16 },
  formTitle: { fontSize: 16, fontFamily: 'Nunito_700Bold', marginBottom: 12 },
  input: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, borderWidth: 1.5, fontSize: 15, fontFamily: 'Nunito_400Regular', marginBottom: 10 },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  formActions: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 16, marginTop: 8 },
  cancelBtn: { fontSize: 15, fontFamily: 'Nunito_600SemiBold' },
  saveBtn: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 10 },
  saveBtnText: { color: '#FFFFFF', fontSize: 15, fontFamily: 'Nunito_700Bold' },
  addBtn: { borderWidth: 2, borderStyle: 'dashed', borderRadius: 14, padding: 14, alignItems: 'center', marginTop: 20 },
  addBtnText: { fontSize: 15, fontFamily: 'Nunito_700Bold' },
});
