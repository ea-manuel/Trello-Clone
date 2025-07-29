import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  isFromUser: boolean;
  username: string;
}

interface ChatModalProps {
  visible: boolean;
  onClose: () => void;
  styles: any;
}

export default function ChatModal({ visible, onClose, styles }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Load messages from AsyncStorage
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const storedMessages = await AsyncStorage.getItem('chatMessages');
        if (storedMessages) {
          const parsedMessages = JSON.parse(storedMessages).map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }));
          setMessages(parsedMessages);
        }
      } catch (error) {
        console.error('Failed to load messages:', error);
      }
    };

    if (visible) {
      loadMessages();
    }
  }, [visible]);

  // Save messages to AsyncStorage
  useEffect(() => {
    const saveMessages = async () => {
      try {
        await AsyncStorage.setItem('chatMessages', JSON.stringify(messages));
      } catch (error) {
        console.error('Failed to save messages:', error);
      }
    };

    if (messages.length > 0) {
      saveMessages();
    }
  }, [messages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0 && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsLoading(true);
    
    try {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage.trim(),
        timestamp: new Date(),
        isFromUser: true,
        username: 'You',
      };

      setMessages(prev => [...prev, message]);
      setNewMessage('');

      // Simulate response (for demo purposes)
      setTimeout(() => {
        const response: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Thanks for your message! This is a demo response.',
          timestamp: new Date(),
          isFromUser: false,
          username: 'TaskHive',
        };
        setMessages(prev => [...prev, response]);
      }, 1000);

    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    Alert.alert(
      'Clear Chat',
      'Are you sure you want to clear all messages?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            setMessages([]);
            try {
              await AsyncStorage.removeItem('chatMessages');
            } catch (error) {
              console.error('Failed to clear messages:', error);
            }
          },
        },
      ]
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const messageDate = new Date(date);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (messageDate.toDateString() === new Date(today.getTime() - 24 * 60 * 60 * 1000).toDateString()) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.ChatModalmenuOverlay}>
        <BlurView style={StyleSheet.absoluteFill} intensity={80} tint="dark" />
        
        <View style={styles.ChatModalmenuContainer}>
          {/* Header with Gradient */}
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ChatModalheader}
          >
            <TouchableOpacity onPress={onClose} style={styles.ChatModalcloseButton}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
            
            <View style={styles.ChatModalheaderContent}>
              <View style={styles.ChatModalheaderIcon}>
                <Ionicons name="chatbubbles" size={24} color="white" />
              </View>
              <View style={styles.ChatModalheaderText}>
                <Text style={styles.ChatModalheaderTitle}>Messages</Text>
                <Text style={styles.ChatModalheaderSubtitle}>Your inbox</Text>
              </View>
            </View>
            
            <TouchableOpacity onPress={clearChat} style={styles.ChatModalclearButton}>
              <Ionicons name="trash-outline" size={20} color="rgba(255,255,255,0.8)" />
            </TouchableOpacity>
          </LinearGradient>

          {/* Messages */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.ChatModalmessagesContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {messages.length === 0 ? (
              <View style={styles.ChatModalemptyState}>
                <View style={styles.ChatModalemptyIcon}>
                  <Ionicons name="chatbubbles" size={64} color="#667eea" />
                </View>
                <Text style={styles.ChatModalemptyTitle}>No messages yet</Text>
                <Text style={styles.ChatModalemptySubtitle}>
                  Start a conversation by sending a message below
                </Text>
              </View>
            ) : (
              messages.map((message, index) => {
                const showDate = index === 0 || 
                  formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp);
                
                return (
                  <View key={message.id}>
                    {showDate && (
                      <View style={styles.ChatModaldateSeparator}>
                        <View style={styles.ChatModaldateBadge}>
                          <Text style={styles.ChatModaldateText}>
                            {formatDate(message.timestamp)}
                          </Text>
                        </View>
                      </View>
                    )}
                    
                    <View style={[
                      styles.ChatModalmessageContainer,
                      message.isFromUser ? styles.ChatModalmessageRight : styles.ChatModalmessageLeft
                    ]}>
                      {!message.isFromUser && (
                        <View style={styles.ChatModalmessageAvatar}>
                          <LinearGradient
                            colors={['#667eea', '#764ba2']}
                            style={styles.ChatModalavatarGradient}
                          >
                            <Text style={styles.ChatModalavatarText}>
                              {message.username.charAt(0).toUpperCase()}
                            </Text>
                          </LinearGradient>
                        </View>
                      )}
                      
                      <View style={[
                        styles.ChatModalmessageBubble,
                        message.isFromUser ? styles.ChatModalmessageBubbleRight : styles.ChatModalmessageBubbleLeft
                      ]}>
                        <Text style={[
                          styles.ChatModalmessageText,
                          message.isFromUser ? styles.ChatModalmessageTextRight : styles.ChatModalmessageTextLeft
                        ]}>
                          {message.text}
                        </Text>
                      </View>
                      
                      <View style={[
                        styles.ChatModalmessageMeta,
                        message.isFromUser ? styles.ChatModalmessageMetaRight : styles.ChatModalmessageMetaLeft
                      ]}>
                        <Text style={styles.ChatModalmessageTime}>
                          {formatTime(message.timestamp)}
                        </Text>
                        {!message.isFromUser && (
                          <Text style={styles.ChatModalmessageUsername}>
                            {message.username}
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                );
              })
            )}
            
            {isLoading && (
              <View style={styles.ChatModalloadingContainer}>
                <View style={styles.ChatModalloadingBubble}>
                  <View style={styles.ChatModalloadingDots}>
                    <View style={styles.ChatModalloadingDot} />
                    <View style={styles.ChatModalloadingDot} />
                    <View style={styles.ChatModalloadingDot} />
                  </View>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Input */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.ChatModalinputContainer}
          >
            <View style={styles.ChatModalinputWrapper}>
              <TextInput
                style={styles.ChatModalinput}
                placeholder="Type a message..."
                placeholderTextColor="#95a5a6"
                value={newMessage}
                onChangeText={setNewMessage}
                multiline
                maxLength={500}
                onSubmitEditing={sendMessage}
              />
              
              <TouchableOpacity
                style={[
                  styles.ChatModalsendButton,
                  (!newMessage.trim() || isLoading) && styles.ChatModalsendButtonDisabled
                ]}
                onPress={sendMessage}
                disabled={!newMessage.trim() || isLoading}
              >
                <LinearGradient
                  colors={newMessage.trim() && !isLoading ? ['#667eea', '#764ba2'] : ['#bdc3c7', '#95a5a6']}
                  style={styles.ChatModalsendGradient}
                >
                  <Ionicons 
                    name="send" 
                    size={18} 
                    color="white" 
                  />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  ChatModalmenuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  ChatModalmenuContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 0,
    height: '100%',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  ChatModalheader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  ChatModalcloseButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  ChatModalheaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 16,
  },
  ChatModalheaderIcon: {
    marginRight: 12,
  },
  ChatModalheaderText: {
    flex: 1,
  },
  ChatModalheaderTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  ChatModalheaderSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: 2,
  },
  ChatModalclearButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  ChatModalmessagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
  },
  ChatModalemptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  ChatModalemptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  ChatModalemptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 8,
  },
  ChatModalemptySubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 22,
  },
  ChatModaldateSeparator: {
    alignItems: 'center',
    marginVertical: 20,
  },
  ChatModaldateBadge: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  ChatModaldateText: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '600',
  },
  ChatModalmessageContainer: {
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  ChatModalmessageLeft: {
    justifyContent: 'flex-start',
  },
  ChatModalmessageRight: {
    justifyContent: 'flex-end',
  },
  ChatModalmessageAvatar: {
    marginRight: 8,
    marginBottom: 4,
  },
  ChatModalavatarGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ChatModalavatarText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
  ChatModalmessageBubble: {
    maxWidth: SCREEN_WIDTH * 0.7,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  ChatModalmessageBubbleLeft: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  ChatModalmessageBubbleRight: {
    backgroundColor: '#667eea',
    borderBottomRightRadius: 4,
  },
  ChatModalmessageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  ChatModalmessageTextLeft: {
    color: '#2c3e50',
  },
  ChatModalmessageTextRight: {
    color: 'white',
  },
  ChatModalmessageMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ChatModalmessageMetaLeft: {
    justifyContent: 'flex-start',
    marginLeft: 40,
  },
  ChatModalmessageMetaRight: {
    justifyContent: 'flex-end',
  },
  ChatModalmessageTime: {
    fontSize: 11,
    color: '#95a5a6',
  },
  ChatModalmessageUsername: {
    fontSize: 11,
    color: '#95a5a6',
    marginLeft: 8,
    fontWeight: '600',
  },
  ChatModalloadingContainer: {
    alignItems: 'flex-start',
    marginVertical: 8,
  },
  ChatModalloadingBubble: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  ChatModalloadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ChatModalloadingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#bdc3c7',
    marginHorizontal: 2,
  },
  ChatModalinputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  ChatModalinputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f8f9fa',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
  ChatModalinput: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
    maxHeight: 100,
    paddingVertical: 8,
  },
  ChatModalsendButton: {
    marginLeft: 8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  ChatModalsendGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ChatModalsendButtonDisabled: {
    opacity: 0.6,
  },
}); 