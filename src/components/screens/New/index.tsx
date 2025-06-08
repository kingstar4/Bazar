// CategoryBottomSheet.tsx
import React, { useRef, useMemo, useState } from 'react';
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

const New = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ['40%', '70%'], []);

  const [step, setStep] = useState<'main' | 'categories'>('main');

  const handleOpenSheet = () => {
    bottomSheetRef.current?.snapToIndex(0);
    setStep('main');
  };

  const categories = ['Fiction', 'Romance', 'History', 'Science', 'Thriller'];

  const renderMainMenu = () => (
    <View style={styles.content}>
      <TouchableOpacity style={styles.option} onPress={() => setStep('categories')}>
        <Text style={styles.optionText}>📚 Categories</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>🔤 A – Z</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCategories = () => (
    <View style={styles.content}>
      <TouchableOpacity onPress={() => setStep('main')}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <FlatList
        data={categories}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.categoryItem}>
            <Text style={styles.categoryText}>{item}</Text>
          </View>
        )}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Button title="Open Bottom Sheet" onPress={handleOpenSheet} />

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
      >
        <BottomSheetView>
          {step === 'main' ? renderMainMenu() : renderCategories()}
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

export default New;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  content: {
    padding: 20,
  },
  option: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f1f1f1',
    marginBottom: 10,
  },
  optionText: {
    fontSize: 18,
  },
  backText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#007AFF',
  },
  categoryItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryText: {
    fontSize: 16,
  },
});
