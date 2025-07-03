/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Modal, View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { avatarOptions } from '../data/avatar';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (avatarName: string) => void;
  onReset?: () => void;
  selectedAvatar?: string;
}

const AvatarPickerModal: React.FC<Props> = ({ visible, onClose, onSelect, onReset, selectedAvatar }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Choose Your Avatar</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.avatarRow}>
            {avatarOptions.map((avatar) => (
              <TouchableOpacity key={avatar.name} onPress={() => onSelect(avatar.name)} style={styles.avatarWrapper}>
                <Image
                  source={avatar.source}
                  style={[
                    styles.avatar,
                    selectedAvatar === avatar.name && { borderColor: '#54408C', borderWidth: 2 },
                  ]}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity onPress={onReset}>
            <Text style={{ textAlign: 'center', marginTop: 10, color: 'red' }}>Reset to Default</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={{ color: '#fff', fontWeight: '600' }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AvatarPickerModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  avatarWrapper: {
    marginHorizontal: 8,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  closeButton: {
    backgroundColor: '#54408C',
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
});
