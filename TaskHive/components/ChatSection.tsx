import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from '@/hooks/useColorScheme';

interface ChatSectionProps {
  styles: any;
}

export default function ChatSection({ styles }: ChatSectionProps) {
  const colorScheme = useColorScheme();
  const [showInboxModal, setShowInboxModal] = useState(false);
  const [showUnreadModal, setShowUnreadModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);

  return (
    <View style={localStyles.container}>
      {/* Inbox Section */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => setShowInboxModal(true)}
      >
        <View style={localStyles.sectionCard}>
          <View style={localStyles.sectionHeader}>
            <Ionicons
              name="chatbubbles-outline"
              size={20}
              color={colorScheme === 'dark' ? '#EAEFFF' : '#2c3e50'}
              style={localStyles.sectionIcon}
            />
            <Text style={[styles.yourWorkspacesLabel, localStyles.sectionTitle]}>
              Inbox
            </Text>
          </View>
          <Text
            style={[
              localStyles.messagePreview,
              { color: colorScheme === 'dark' ? '#B8BCC8' : '#7f8c8d' },
            ]}
            numberOfLines={1}
          >
            No messages yet
          </Text>
        </View>
      </TouchableOpacity>

      {/* Unread Section */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => setShowUnreadModal(true)}
      >
        <View style={localStyles.sectionCard}>
          <View style={localStyles.sectionHeader}>
            <Ionicons
              name="mail-unread-outline"
              size={20}
              color={colorScheme === 'dark' ? '#EAEFFF' : '#2c3e50'}
              style={localStyles.sectionIcon}
            />
            <Text style={[styles.yourWorkspacesLabel, localStyles.sectionTitle]}>
              Unread
            </Text>
          </View>
          <Text
            style={[
              localStyles.messagePreview,
              { color: colorScheme === 'dark' ? '#B8BCC8' : '#7f8c8d' },
            ]}
            numberOfLines={1}
          >
            No unread messages
          </Text>
        </View>
      </TouchableOpacity>

      {/* Notes Section */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => setShowNotesModal(true)}
      >
        <View style={localStyles.sectionCard}>
          <View style={localStyles.sectionHeader}>
            <Ionicons
              name="document-text-outline"
              size={20}
              color={colorScheme === 'dark' ? '#EAEFFF' : '#2c3e50'}
              style={localStyles.sectionIcon}
            />
            <Text style={[styles.yourWorkspacesLabel, localStyles.sectionTitle]}>
              Notes
            </Text>
          </View>
          <Text
            style={[
              localStyles.messagePreview,
              { color: colorScheme === 'dark' ? '#B8BCC8' : '#7f8c8d' },
            ]}
            numberOfLines={1}
          >
            No notes or drafts
          </Text>
        </View>
      </TouchableOpacity>

      {/* New Chat Button */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => Alert.alert('New Chat', 'No collaborators available yet')}
      >
        <LinearGradient
          colors={['#00C6AE', '#007CF0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={localStyles.newChatButton}
        >
          <View style={localStyles.buttonRow}>
            <Ionicons name="add" size={20} color="#fff" style={localStyles.buttonIcon} />
            <Text style={[styles.createWorkspaceButtonText, localStyles.buttonText]}>
              New Chat
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* Simple Modals */}
      <Modal
        visible={showInboxModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowInboxModal(false)}
      >
        <View style={localStyles.modalOverlay}>
          <View style={localStyles.modalContent}>
            <Ionicons name="chatbubbles-outline" size={48} color="#667eea" />
            <Text style={localStyles.modalTitle}>No Messages</Text>
            <Text style={localStyles.modalText}>Your inbox is empty</Text>
            <TouchableOpacity
              style={localStyles.modalButton}
              onPress={() => setShowInboxModal(false)}
            >
              <Text style={localStyles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showUnreadModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowUnreadModal(false)}
      >
        <View style={localStyles.modalOverlay}>
          <View style={localStyles.modalContent}>
            <Ionicons name="mail-unread-outline" size={48} color="#667eea" />
            <Text style={localStyles.modalTitle}>No Unread Messages</Text>
            <Text style={localStyles.modalText}>You're all caught up!</Text>
            <TouchableOpacity
              style={localStyles.modalButton}
              onPress={() => setShowUnreadModal(false)}
            >
              <Text style={localStyles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showNotesModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowNotesModal(false)}
      >
        <View style={localStyles.modalOverlay}>
          <View style={localStyles.modalContent}>
            <Ionicons name="document-text-outline" size={48} color="#667eea" />
            <Text style={localStyles.modalTitle}>No Notes</Text>
            <Text style={localStyles.modalText}>No notes or drafts yet</Text>
            <TouchableOpacity
              style={localStyles.modalButton}
              onPress={() => setShowNotesModal(false)}
            >
              <Text style={localStyles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: '50%',
    marginBottom: 24,
    paddingTop: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 12,
  },
  sectionCard: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontWeight: '600',
    fontSize: 16,
  },
  messagePreview: {
    fontSize: 14,
    lineHeight: 18,
  },
  newChatButton: {
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginHorizontal: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 16,
    marginBottom: 8,
  },
  modalText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});