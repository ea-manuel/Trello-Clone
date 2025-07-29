import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from '@/hooks/useColorScheme';

interface NoCollaboratorsModalProps {
  visible: boolean;
  onClose: () => void;
  onInvite: () => void;
}

export default function NoCollaboratorsModal({ visible, onClose, onInvite }: NoCollaboratorsModalProps) {
  const colorScheme = useColorScheme();

  const handleInvite = () => {
    onInvite();
    // You can add navigation logic here to go to invite screen
    Alert.alert(
      'Invite Team Members',
      'This would navigate to the invite screen where you can add team members to collaborate.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => console.log('Navigate to invite screen') }
      ]
    );
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={[
          styles.modalView,
          { backgroundColor: colorScheme === 'dark' ? '#1A324F' : '#fff' },
        ]}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="people-outline"
              size={48}
              color={colorScheme === 'dark' ? '#EAEFFF' : '#667eea'}
            />
          </View>
          <Text style={[
            styles.modalTitle,
            { color: colorScheme === 'dark' ? '#EAEFFF' : '#2c3e50' },
          ]}>
            No Collaborators Yet
          </Text>
          <Text style={[
            styles.modalText,
            { color: colorScheme === 'dark' ? '#B8BCC8' : '#7f8c8d' },
          ]}>
            Invite team members to start chatting and collaborating on your projects.
          </Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: colorScheme === 'dark' ? '#2A2C3E' : '#e0e0e0' },
              ]}
              onPress={onClose}
            >
              <Text style={[
                styles.buttonText,
                { color: colorScheme === 'dark' ? '#EAEFFF' : '#2c3e50' },
              ]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={handleInvite}
            >
              <LinearGradient
                colors={['#00C6AE', '#007CF0']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <Text style={styles.buttonText}>Invite</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  gradientButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});