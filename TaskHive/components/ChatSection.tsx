import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from '@/hooks/useColorScheme';
import NoCollaboratorsModal from './NoCollaborators';

interface ChatSectionProps {
  onOpenChat: (options: { conversationId?: string; filter?: 'all' | 'unread' }) => void;
  styles: any; // Reuse RootLayout styles for consistency
}

export default function ChatSection({ onOpenChat, styles }: ChatSectionProps) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastMessage, setLastMessage] = useState('');
  const [lastUnreadMessage, setLastUnreadMessage] = useState('');
  const colorScheme = useColorScheme();
  const scaleAnimInbox = useRef(new Animated.Value(1)).current;
  const scaleAnimUnread = useRef(new Animated.Value(1)).current;
  const scaleAnimNotes = useRef(new Animated.Value(1)).current;
  const scaleAnimNewChat = useRef(new Animated.Value(1)).current;
  const [showNoCollaboratorsModal, setShowNoCollaboratorsModal] = useState(false);

  useEffect(() => {
    // Load messages from AsyncStorage
    const loadChatData = async () => {
      try {
        const storedMessages = await AsyncStorage.getItem('chatMessages');
        if (storedMessages) {
          const messages = JSON.parse(storedMessages);
          if (messages.length > 0) {
            // Latest message for Inbox
            const lastMsg = messages[messages.length - 1];
            setLastMessage(lastMsg.text);
            // Unread count and latest unread message
            const unreadMessages = messages.filter((msg: any) => !msg.read);
            setUnreadCount(unreadMessages.length);
            if (unreadMessages.length > 0) {
              setLastUnreadMessage(unreadMessages[unreadMessages.length - 1].text);
            }
          }
        }
      } catch (error) {
        console.error('Failed to load chat data:', error);
      }
    };

    loadChatData();
  }, []);

  const handlePressIn = (anim: Animated.Value) => {
    Animated.spring(anim, {
      toValue: 0.95,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (anim: Animated.Value) => {
    Animated.spring(anim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleInviteCollaborators = () => {
    setShowNoCollaboratorsModal(false);
    // You can add navigation logic here to go to invite screen
    Alert.alert(
      'Invite Team Members',
      'Navigate to invite screen to add team members for collaboration.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => console.log('Navigate to invite screen') }
      ]
    );
  };

  return (
    <View style={localStyles.container}>
      {/* Inbox Section */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => onOpenChat({ filter: 'all' })}
        onPressIn={() => handlePressIn(scaleAnimInbox)}
        onPressOut={() => handlePressOut(scaleAnimInbox)}
      >
        <Animated.View style={{ transform: [{ scale: scaleAnimInbox }] }}>
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
              {lastMessage || 'No messages yet'}
            </Text>
          </View>
        </Animated.View>
      </TouchableOpacity>

      {/* Unread Section */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => onOpenChat({ filter: 'unread' })}
        onPressIn={() => handlePressIn(scaleAnimUnread)}
        onPressOut={() => handlePressOut(scaleAnimUnread)}
      >
        <Animated.View style={{ transform: [{ scale: scaleAnimUnread }] }}>
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
              {unreadCount > 0 && (
                <View style={localStyles.badge}>
                  <Text style={localStyles.badgeText}>{unreadCount}</Text>
                </View>
              )}
            </View>
            <Text
              style={[
                localStyles.messagePreview,
                { color: colorScheme === 'dark' ? '#B8BCC8' : '#7f8c8d' },
              ]}
              numberOfLines={1}
            >
              {lastUnreadMessage || 'No unread messages'}
            </Text>
          </View>
        </Animated.View>
      </TouchableOpacity>

      {/* Notes (Self-Chat) Section */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => onOpenChat({ conversationId: 'self' })}
        onPressIn={() => handlePressIn(scaleAnimNotes)}
        onPressOut={() => handlePressOut(scaleAnimNotes)}
      >
        <Animated.View style={{ transform: [{ scale: scaleAnimNotes }] }}>
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
              Personal notes and drafts
            </Text>
          </View>
        </Animated.View>
      </TouchableOpacity>

      {/* New Chat Button */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => setShowNoCollaboratorsModal(true)}
        onPressIn={() => handlePressIn(scaleAnimNewChat)}
        onPressOut={() => handlePressOut(scaleAnimNewChat)}
      >
        <LinearGradient
          colors={['#00C6AE', '#007CF0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={localStyles.newChatButton}
        >
          <Animated.View style={{ transform: [{ scale: scaleAnimNewChat }] }}>
            <View style={localStyles.buttonRow}>
              <Ionicons name="add" size={20} color="#fff" style={localStyles.buttonIcon} />
              <Text style={[styles.createWorkspaceButtonText, localStyles.buttonText]}>
                New Chat
              </Text>
            </View>
          </Animated.View>
        </LinearGradient>
      </TouchableOpacity>

      {/* No Collaborators Modal */}
      <NoCollaboratorsModal
        visible={showNoCollaboratorsModal}
        onClose={() => setShowNoCollaboratorsModal(false)}
        onInvite={handleInviteCollaborators}
      />
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
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
  badge: {
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
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
});