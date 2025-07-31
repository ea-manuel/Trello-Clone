import React, { useEffect, useState, useCallback } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Alert,
  ImageBackground,
  BackHandler,
  ActivityIndicator,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import SafeDateTimePicker from "./SafeDateTimePicker";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";
import { API_BASE_URL } from "../appconstants/api.js";

import CardComments from "./CardComment"; // Adjust path accordingly
import CoverPickerModal from "./CoverPickerModal"; // Adjust path accordingly

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface Checklist {
  id: string;
  title: string;
  editing: boolean;
  todos: Todo[];
}

interface Comment {
  id: string;
  text: string;
  author: string;
}

interface Attachment {
  id: string;
  filename: string;
  filepath: string;
  contentType: string;
  uploadedAt: string;
}

interface Member {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

interface CardMenuModalProps {
  visible: boolean;
  onClose: () => void;
  card: any;
  styles: any;
  boardBackgroundColor?: string;
  workspaceId?: string; // Add workspaceId prop
  onDeleteCard?: () => void;
  onUpdateCardName?: (cardId: string, newName: string) => void;
  onUpdateCardCover?: (
    cardId: string,
    coverColor: string | null,
    coverImage: string | null
  ) => void;
  onUpdateCardData?: (cardId: string, cardData: any) => void;
}

export default function CardMenuModal({
  visible,
  onClose,
  card,
  styles,
  boardBackgroundColor,
  workspaceId, // Add workspaceId parameter
  onDeleteCard,
  onUpdateCardName,
  onUpdateCardCover,
  onUpdateCardData,
}: CardMenuModalProps) {
  const storageKey = `cardData-${card?.id ?? "default"}`;

  // Card-level states
  const [description, setDescription] = useState("");
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState("");
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [showStartDateModal, setShowStartDateModal] = useState(false);
  const [labels, setLabels] = useState<string[]>([]);
  const [showLabelsModal, setShowLabelsModal] = useState(false);
  const [labelInput, setLabelInput] = useState("");
  const [coverColor, setCoverColor] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [showCoverPickerModal, setShowCoverPickerModal] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Attachments and Members states
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [memberInput, setMemberInput] = useState("");
  const [memberEmailInput, setMemberEmailInput] = useState("");

  // Enhanced attachment and member states
  const [showAttachmentsModal, setShowAttachmentsModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState(false);

  // State for activities circle toggle (true means all todos complete)
  const [allTodosCompleted, setAllTodosCompleted] = useState(false);

  // Card name editing state
  const [cardName, setCardName] = useState("");
  const [isEditingCardName, setIsEditingCardName] = useState(false);

  // Handle Android back button
  useEffect(() => {
    const backAction = () => {
      if (visible) {
        onClose();
        return true; // Prevent default back action
      }
      return false; // Allow default back action
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [visible, onClose]);

  // Load saved card data on mount or card change
  useEffect(() => {
    const loadData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(storageKey);
        if (jsonValue != null) {
          const savedData = JSON.parse(jsonValue);
          setDescription(savedData.description || "");
          setIsEditingDescription(!savedData.description);
          setComments(savedData.comments || []);
          setChecklists(
            savedData.checklists || [
              {
                id: Date.now().toString(),
                title: "Default Checklist",
                editing: false,
                todos: [],
              },
            ]
          );
          setStartDate(
            savedData.startDate ? new Date(savedData.startDate) : null
          );
          setLabels(savedData.labels || []);
          setCoverColor(savedData.coverColor || null);
          setCoverImage(savedData.coverImage || null);
          setCardName(savedData.cardName || card?.text || "");
          setAttachments(savedData.attachments || []);
          setMembers(savedData.members || []);
        } else {
          // Initialize fresh card data
          setDescription(card?.description || "");
          setIsEditingDescription(!card?.description);
          setComments([]);
          setChecklists([
            {
              id: Date.now().toString(),
              title: "Default Checklist",
              editing: false,
              todos: [],
            },
          ]);
          setStartDate(null);
          setLabels([]);
          setCoverColor(null);
          setCoverImage(null);
          setCardName(card?.text || "");
          setAttachments([]);
          setMembers([]);
        }
      } catch (e) {
        console.error("Failed to load card data from storage:", e);
      }
      setComment("");
      setShowStartDateModal(false);
      setShowLabelsModal(false);
      setLabelInput("");
    };

    if (visible) {
      loadData();
    }
  }, [card, visible, storageKey]);

  // Update the allTodosCompleted state based on current todos completion
  const updateAllTodosCompletedState = useCallback(() => {
    let allDone = true;
    for (const checklist of checklists) {
      if (checklist.todos.some((todo) => !todo.completed)) {
        allDone = false;
        break;
      }
    }
    setAllTodosCompleted(allDone && checklists.length > 0);
  }, [checklists]);

  // Save all card data when changed
  useEffect(() => {
    const saveData = async () => {
      try {
        const cardDataToSave = {
          description,
          comments,
          checklists,
          startDate: startDate ? startDate.toISOString() : null,
          labels,
          coverColor,
          coverImage,
          cardName,
          attachments,
          members,
        };
        await AsyncStorage.setItem(storageKey, JSON.stringify(cardDataToSave));

        // Update the board's card data cache in real-time
        if (onUpdateCardData && card?.id) {
          onUpdateCardData(card.id, cardDataToSave);
        }

        // Update allTodosCompleted state after save
        updateAllTodosCompletedState();
      } catch (e) {
        console.error("Failed to save card data to storage:", e);
      }
    };

    if (visible) {
      saveData();
    }
  }, [
    description,
    comments,
    checklists,
    startDate,
    labels,
    coverColor,
    coverImage,
    cardName,
    attachments,
    members,
    storageKey,
    visible,
    updateAllTodosCompletedState,
    onUpdateCardData,
    card?.id,
  ]);

  // Toggle all todos completion on Activities circle press
  const toggleAllTodos = () => {
    const shouldCompleteAll = !allTodosCompleted; // Toggle state
    const updatedChecklists = checklists.map((cl) => ({
      ...cl,
      todos: cl.todos.map((todo) => ({
        ...todo,
        completed: shouldCompleteAll,
      })),
    }));
    setChecklists(updatedChecklists);
    setAllTodosCompleted(shouldCompleteAll);
  };

  // Description handlers
  const finishEditingDescription = () => {
    if (description.trim().length > 0) setIsEditingDescription(false);
  };

  // Checklist handlers
  const toggleEditChecklistTitle = (id: string) => {
    setChecklists((prev) =>
      prev.map((cl) => (cl.id === id ? { ...cl, editing: !cl.editing } : cl))
    );
  };

  const updateChecklistTitle = (id: string, newTitle: string) => {
    setChecklists((prev) =>
      prev.map((cl) => (cl.id === id ? { ...cl, title: newTitle } : cl))
    );
  };

  // Add empty checklist with no todos (all new data reset as requested)
  const handleAddChecklist = () => {
    const newChecklist: Checklist = {
      id: Date.now().toString(),
      title: "New Checklist",
      editing: false,
      todos: [], // No todos by default
    };
    setChecklists((prev) => [...prev, newChecklist]);
  };

  const updateTodoText = (
    checklistId: string,
    todoId: string,
    newText: string
  ) => {
    setChecklists((prev) =>
      prev.map((cl) => {
        if (cl.id === checklistId) {
          return {
            ...cl,
            todos: cl.todos.map((todo) =>
              todo.id === todoId ? { ...todo, text: newText } : todo
            ),
          };
        }
        return cl;
      })
    );
  };

  const toggleTodoCompleted = (checklistId: string, todoId: string) => {
    setChecklists((prev) =>
      prev.map((cl) => {
        if (cl.id === checklistId) {
          return {
            ...cl,
            todos: cl.todos.map((todo) =>
              todo.id === todoId
                ? { ...todo, completed: !todo.completed }
                : todo
            ),
          };
        }
        return cl;
      })
    );
  };

  // Add todo only when user presses plus button (no auto add on submit)
  const addTodo = (checklistId: string) => {
    const newTodo: Todo = {
      id:
        Date.now().toString() + "-todo-" + Math.random().toString(16).slice(2),
      text: "",
      completed: false,
    };
    setChecklists((prev) =>
      prev.map((cl) =>
        cl.id === checklistId ? { ...cl, todos: [...cl.todos, newTodo] } : cl
      )
    );
  };

  const addTodoOnSubmitEditing = (checklistId: string, todoId: string) => {
    // Intentionally empty to disable auto add on submit editing
  };

  const deleteChecklist = (id: string) => {
    Alert.alert(
      "Delete Checklist",
      "Are you sure you want to delete this checklist?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setChecklists((prev) => prev.filter((cl) => cl.id !== id));
            updateAllTodosCompletedState();
          },
        },
      ]
    );
  };

  const deleteTodo = (checklistId: string, todoId: string) => {
    Alert.alert(
      "Delete Todo",
      "Are you sure you want to delete this todo item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setChecklists((prev) =>
              prev.map((cl) => {
                if (cl.id === checklistId) {
                  const filteredTodos = cl.todos.filter((t) => t.id !== todoId);
                  return { ...cl, todos: filteredTodos };
                }
                return cl;
              })
            );
            updateAllTodosCompletedState();
          },
        },
      ]
    );
  };

  // Start date handlers
  const handleStartDateConfirm = (event: any, date: Date | undefined) => {
    if (Platform.OS === 'android') {
      setShowStartDateModal(false);
      if (event.type === 'dismissed') {
        return;
      }
    }
    
    if (date) {
      setStartDate(date);
      if (Platform.OS === 'android') {
        setShowStartDateModal(false);
      }
    }
  };

  // Labels handlers
  const handleAddLabel = () => {
    const trimmed = labelInput.trim();
    if (trimmed && !labels.includes(trimmed)) {
      setLabels((prev) => [...prev, trimmed]);
      setLabelInput("");
    }
  };

  const handleRemoveLabel = (labelToRemove: string) => {
    setLabels((prev) => prev.filter((l) => l !== labelToRemove));
  };

  // Comments handlers
  const handleAddComment = () => {
    const trimmedComment = comment.trim();
    if (!trimmedComment) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      text: trimmedComment,
      author: "RN", // Replace as needed
    };

    setComments((prev) => [...prev, newComment]);
    setComment("");
  };

  // Attachment handlers
  const handleAddAttachment = async () => {
    try {
      setUploadingAttachment(true);
      
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access media library is required.');
        return;
      }

      // Show picker options
      Alert.alert(
        'Add Attachment',
        'Choose attachment type',
        [
          {
            text: 'Photo/Video',
            onPress: () => pickImageAttachment(),
          },
          {
            text: 'Document',
            onPress: () => pickDocumentAttachment(),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    } catch (error) {
      console.error('Error adding attachment:', error);
      Alert.alert('Error', 'Failed to add attachment. Please try again.');
    } finally {
      setUploadingAttachment(false);
    }
  };

  const pickImageAttachment = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        await uploadFile(result.assets[0].uri, result.assets[0].type || 'image/jpeg');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const pickDocumentAttachment = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        await uploadFile(result.assets[0].uri, result.assets[0].mimeType || 'application/octet-stream');
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document. Please try again.');
    }
  };

  const uploadFile = async (uri: string, contentType: string) => {
    try {
      setUploadingAttachment(true);
      
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'Authentication required. Please log in again.');
        return;
      }

      // Create form data
      const formData = new FormData();
      const filename = uri.split('/').pop() || 'file';
      formData.append('file', {
        uri,
        type: contentType,
        name: filename,
      } as any);

      // Upload to backend
      const response = await axios.post(
        `${API_BASE_URL}/cards/${card?.id || '1'}/attachments`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data) {
        const newAttachment: Attachment = {
          id: response.data.id.toString(),
          filename: response.data.filename,
          filepath: response.data.filepath,
          contentType: response.data.contentType,
          uploadedAt: response.data.uploadedAt,
        };
        
        setAttachments(prev => [...prev, newAttachment]);
        Alert.alert('Success', 'Attachment uploaded successfully!');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data || 'Failed to upload attachment. Please try again.';
      Alert.alert('Upload Error', errorMessage);
    } finally {
      setUploadingAttachment(false);
    }
  };

  const handleRemoveAttachment = (attachmentId: string) => {
    Alert.alert(
      "Remove Attachment",
      "Are you sure you want to remove this attachment?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setAttachments((prev) =>
              prev.filter((att) => att.id !== attachmentId)
            );
          },
        },
      ]
    );
  };

  // Member handlers
  const handleAddMember = () => {
    setShowMembersModal(true);
  };

  const handleInviteMember = async () => {
    if (!inviteEmail.trim()) {
      setInviteError('Please enter an email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail.trim())) {
      setInviteError('Please enter a valid email address.');
      return;
    }

    if (!workspaceId) {
      setInviteError('Workspace context not available. Please try again.');
      return;
    }

    // Convert frontend workspace ID to numeric ID for backend
    const getNumericWorkspaceId = (workspaceId: string) => {
      if (workspaceId === "default-workspace") {
        return 1; // Default workspace gets ID 1
      }
      // For other workspaces, extract numeric part or use a hash
      const numericPart = workspaceId.replace(/[^0-9]/g, '');
      return numericPart ? parseInt(numericPart) : 1;
    };

    try {
      setInviteLoading(true);
      setInviteError("");
      setInviteSuccess(false);

      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        setInviteError('Authentication required. Please log in again.');
        return;
      }

      const numericWorkspaceId = getNumericWorkspaceId(workspaceId);

      const response = await axios.post(
        `${API_BASE_URL}/workspaces/invite`,
        {
          workspaceId: numericWorkspaceId,
          email: inviteEmail.trim(),
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        setInviteSuccess(true);
        setInviteEmail("");
        setTimeout(() => setInviteSuccess(false), 3000);
      }
    } catch (error: any) {
      console.error('Invite error:', error);
      const errorMessage = error.response?.data || 'Failed to send invitation. Please try again.';
      setInviteError(errorMessage);
    } finally {
      setInviteLoading(false);
    }
  };

  const handleAddMemberConfirm = () => {
    const trimmedName = memberInput.trim();
    const trimmedEmail = memberEmailInput.trim();

    if (!trimmedName || !trimmedEmail) {
      Alert.alert("Error", "Please provide both name and email");
      return;
    }

    // Check if member already exists
    if (members.find((m) => m.email === trimmedEmail)) {
      Alert.alert("Error", "Member with this email already exists");
      return;
    }

    const newMember: Member = {
      id: Date.now().toString(),
      username: trimmedName,
      email: trimmedEmail,
    };

    setMembers((prev) => [...prev, newMember]);
    setMemberInput("");
    setMemberEmailInput("");
    setShowMemberModal(false);
  };

  const handleRemoveMember = (memberId: string) => {
    Alert.alert(
      "Remove Member",
      "Are you sure you want to remove this member from the card?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setMembers((prev) =>
              prev.filter((member) => member.id !== memberId)
            );
          },
        },
      ]
    );
  };

  // Delete card data handler from dropdown 'Delete Card'
  const handleDeleteCard = () => {
    Alert.alert(
      "Delete Card",
      "Are you sure you want to delete this card? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(storageKey);
              // Clear state
              setDescription("");
              setComments([]);
              setChecklists([]);
              setStartDate(null);
              setLabels([]);
              setCoverColor(null);
              setCoverImage(null);
              setAttachments([]);
              setMembers([]);
              setDropdownVisible(false);

              if (onDeleteCard) {
                onDeleteCard();
              }

              onClose();
            } catch (e) {
              console.error("Failed to delete card data from storage:", e);
              Alert.alert(
                "Error",
                "Failed to delete the card. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  // Dropdown action handlers
  const handleShareCardLink = () => {
    Alert.alert(
      "Share Card",
      "Share card link functionality not implemented yet."
    );
  };

  const handleRemoveCardCover = () => {
    Alert.alert(
      "Remove Card Cover",
      "Are you sure you want to remove the card cover?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setCoverColor(null);
            setCoverImage(null);
            if (onUpdateCardCover && card?.id) {
              onUpdateCardCover(card.id, null, null);
            }
          },
        },
      ]
    );
  };

  const handleWatchCard = () => {
    Alert.alert("Watch Card", "Watch card functionality not implemented yet.");
  };

  const handleVoteCard = () => {
    Alert.alert("Vote", "Vote functionality not implemented yet.");
  };

  const handleMoveCard = () => {
    Alert.alert("Move Card", "Move card functionality not implemented yet.");
  };

  const handleCopyCard = () => {
    Alert.alert("Copy Card", "Copy card functionality not implemented yet.");
  };

  const handleArchiveCard = () => {
    Alert.alert(
      "Archive Card",
      "Archive card functionality not implemented yet."
    );
  };

  const handlePinToHomeScreen = () => {
    Alert.alert(
      "Pin to Home",
      "Pin to home screen functionality not implemented yet."
    );
  };

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={onClose}
      >
        <View style={styles.CardMenuModalmenuOverlay}>
          <BlurView
            style={StyleSheet.absoluteFill}
            intensity={80}
            tint="dark"
          />

          <View style={styles.CardMenuModalmenuContainer}>
            {/* Top Bar (Close and Ellipsis outside cover) */}
            <View style={[styles.CardMenuModalmenuTopBar]}>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={28} color="white" />
              </TouchableOpacity>
              <View style={{ flex: 1 }} />
              <TouchableOpacity onPress={() => setDropdownVisible((v) => !v)}>
                <Ionicons name="ellipsis-vertical" size={28} color="white" />
              </TouchableOpacity>
            </View>

            {/* Dropdown menu */}
            {dropdownVisible && (
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: 48,
                  right: 16,
                  backgroundColor: "#2D3748",
                  borderRadius: 12,
                  paddingVertical: 12,
                  paddingHorizontal: 0,
                  zIndex: 100,
                  elevation: 10,
                  minWidth: 220,
                  shadowColor: "#000",
                  shadowOpacity: 0.3,
                  shadowRadius: 12,
                  shadowOffset: { width: 0, height: 4 },
                  borderWidth: 1,
                  borderColor: "#4A5568",
                }}
                activeOpacity={1}
                onPressOut={() => setDropdownVisible(false)}
              >
                {/* Share card link */}
                <TouchableOpacity
                  onPress={() => {
                    setDropdownVisible(false);
                    handleShareCardLink();
                  }}
                  style={localStyles.dropdownItem}
                >
                  <Ionicons
                    name="share-outline"
                    size={20}
                    color="#4A90E2"
                    style={localStyles.dropdownIcon}
                  />
                  <Text style={localStyles.dropdownText}>Share card link</Text>
                </TouchableOpacity>

                {/* Remove card cover */}
                <TouchableOpacity
                  onPress={() => {
                    setDropdownVisible(false);
                    handleRemoveCardCover();
                  }}
                  style={localStyles.dropdownItem}
                >
                  <Ionicons
                    name="trash-bin-outline"
                    size={20}
                    color="#4A90E2"
                    style={localStyles.dropdownIcon}
                  />
                  <Text style={localStyles.dropdownText}>
                    Remove card cover
                  </Text>
                </TouchableOpacity>

                {/* Watch */}
                <TouchableOpacity
                  onPress={() => {
                    setDropdownVisible(false);
                    handleWatchCard();
                  }}
                  style={localStyles.dropdownItem}
                >
                  <Ionicons
                    name="eye-outline"
                    size={20}
                    color="#4A90E2"
                    style={localStyles.dropdownIcon}
                  />
                  <Text style={localStyles.dropdownText}>Watch</Text>
                </TouchableOpacity>

                {/* Vote */}
                <TouchableOpacity
                  onPress={() => {
                    setDropdownVisible(false);
                    handleVoteCard();
                  }}
                  style={localStyles.dropdownItem}
                >
                  <Ionicons
                    name="thumbs-up-outline"
                    size={20}
                    color="#4A90E2"
                    style={localStyles.dropdownIcon}
                  />
                  <Text style={localStyles.dropdownText}>Vote</Text>
                </TouchableOpacity>

                {/* Move card */}
                <TouchableOpacity
                  onPress={() => {
                    setDropdownVisible(false);
                    handleMoveCard();
                  }}
                  style={localStyles.dropdownItem}
                >
                  <Ionicons
                    name="arrow-forward-outline"
                    size={20}
                    color="#4A90E2"
                    style={localStyles.dropdownIcon}
                  />
                  <Text style={localStyles.dropdownText}>Move card</Text>
                </TouchableOpacity>

                {/* Copy card */}
                <TouchableOpacity
                  onPress={() => {
                    setDropdownVisible(false);
                    handleCopyCard();
                  }}
                  style={localStyles.dropdownItem}
                >
                  <Ionicons
                    name="copy-outline"
                    size={20}
                    color="#4A90E2"
                    style={localStyles.dropdownIcon}
                  />
                  <Text style={localStyles.dropdownText}>Copy card</Text>
                </TouchableOpacity>

                {/* Archive */}
                <TouchableOpacity
                  onPress={() => {
                    setDropdownVisible(false);
                    handleArchiveCard();
                  }}
                  style={localStyles.dropdownItem}
                >
                  <Ionicons
                    name="archive-outline"
                    size={20}
                    color="#4A90E2"
                    style={localStyles.dropdownIcon}
                  />
                  <Text style={localStyles.dropdownText}>Archive</Text>
                </TouchableOpacity>

                {/* Pin to home screen */}
                <TouchableOpacity
                  onPress={() => {
                    setDropdownVisible(false);
                    handlePinToHomeScreen();
                  }}
                  style={localStyles.dropdownItem}
                >
                  <Ionicons
                    name="pin-outline"
                    size={20}
                    color="#4A90E2"
                    style={localStyles.dropdownIcon}
                  />
                  <Text style={localStyles.dropdownText}>
                    Pin to home screen
                  </Text>
                </TouchableOpacity>

                {/* Separator line */}
                <View style={localStyles.dropdownSeparator} />

                {/* Delete */}
                <TouchableOpacity
                  onPress={() => {
                    setDropdownVisible(false);
                    handleDeleteCard();
                  }}
                  style={[localStyles.dropdownItem, { borderBottomWidth: 0 }]}
                >
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color="#E53E3E"
                    style={localStyles.dropdownIcon}
                  />
                  <Text
                    style={[localStyles.dropdownText, { color: "#E53E3E" }]}
                  >
                    Delete
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            )}

            {/* Scrollable content including cover */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 60 }}
            >
              {/* Cover Header - Now scrollable */}
            <TouchableOpacity
              style={{
                height: 110,
                width: "100%",
                overflow: "hidden",
                marginBottom: 12,
                backgroundColor: coverColor || "#222",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => setShowCoverPickerModal(true)}
              activeOpacity={0.9}
            >
              {coverImage ? (
                <ImageBackground
                  source={{ uri: coverImage }}
                  style={{
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                    imageStyle={{}}
                  resizeMode="cover"
                >
                  {coverColor && (
                    <View
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: coverColor + "80",
                      }}
                    />
                  )}
                  <TouchableOpacity
                    onPress={() => setShowCoverPickerModal(true)}
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 20,
                      backgroundColor: "rgba(0,0,0,0.5)",
                      borderRadius: 25,
                      zIndex: 10,
                    }}
                  >
                    <Text
                      style={[
                        styles.CardMenuModalcoverButtonText,
                        { fontSize: 16 },
                      ]}
                    >
                      Set Cover
                    </Text>
                  </TouchableOpacity>
                </ImageBackground>
              ) : (
                <TouchableOpacity
                  onPress={() => setShowCoverPickerModal(true)}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    backgroundColor: "rgba(255,255,255,0.2)",
                    borderRadius: 25,
                  }}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.CardMenuModalcoverButtonText,
                      { fontSize: 16 },
                    ]}
                  >
                    Set Cover
                  </Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
              {/* Activities Section */}
              <View style={styles.CardMenuModalsection}>
                <TouchableOpacity
                  style={styles.CardMenuModalactivitiesRow}
                  onPress={toggleAllTodos}
                  activeOpacity={0.7}
                  accessibilityLabel={
                    allTodosCompleted
                      ? "Mark all todos incomplete"
                      : "Mark all todos complete"
                  }
                >
                  <Ionicons
                    name={allTodosCompleted ? "checkbox" : "square-outline"}
                    size={24}
                    color={allTodosCompleted ? "#3CD6FF" : "#ccc"}
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.CardMenuModalactivitiesTitle}>
                    Activities
                  </Text>
                </TouchableOpacity>
                <View style={styles.CardMenuModaltodoRow}>
                  <View style={[
                    styles.CardMenuModaltodoBadge,
                    { backgroundColor: boardBackgroundColor || "#ADD8E6" }
                  ]} />
                  <View style={{ flex: 1 }}>
                    {isEditingCardName ? (
                      <TextInput
                        style={[
                          styles.CardMenuModaltodoTitle,
                          {
                            borderBottomWidth: 1,
                            borderBottomColor: "white",
                            paddingVertical: 2,
                          },
                        ]}
                        value={cardName}
                        onChangeText={setCardName}
                        onSubmitEditing={() => {
                          if (cardName.trim().length > 0) {
                            setIsEditingCardName(false);
                            if (onUpdateCardName && card?.id) {
                              onUpdateCardName(card.id, cardName.trim());
                            }
                          }
                        }}
                        onBlur={() => {
                          if (cardName.trim().length > 0) {
                            setIsEditingCardName(false);
                            if (onUpdateCardName && card?.id) {
                              onUpdateCardName(card.id, cardName.trim());
                            }
                          } else {
                            setCardName(card?.text || "Untitled Card");
                            setIsEditingCardName(false);
                          }
                        }}
                        autoFocus={true}
                        returnKeyType="done"
                        placeholder="Enter card name..."
                        placeholderTextColor="rgba(255,255,255,0.6)"
                      />
                    ) : (
                      <TouchableOpacity
                        onPress={() => setIsEditingCardName(true)}
                        style={{ flexDirection: "row", alignItems: "center" }}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[styles.CardMenuModaltodoTitle, { flex: 1 }]}
                        >
                          {cardName || "Untitled Card"}
                    </Text>
                        <Ionicons
                          name="pencil-outline"
                          size={16}
                          color="white"
                          style={{ marginLeft: 8 }}
                        />
                      </TouchableOpacity>
                    )}
                    <Text style={styles.CardMenuModaltodoSubtitle}>
                      Todo list
                    </Text>
                  </View>
                </View>
              </View>

              {/* Quick Actions */}
              <View style={styles.CardMenuModalsection}>
                <View style={styles.CardMenuModalquickActionsHeader}>
                  <Text style={styles.CardMenuModalquickActionsTitle}>
                    Quick Actions
                  </Text>
                  {/* Removed chevron as requested */}
                </View>
                <View style={styles.CardMenuModalquickActionsRow}>
                  <TouchableOpacity
                    style={[
                      styles.CardMenuModalquickActionButton,
                      { backgroundColor: "#1a2d1a" },
                    ]}
                    onPress={handleAddChecklist}
                  >
                    <Ionicons
                      name="checkbox-outline"
                      size={22}
                      color="#3CD6FF"
                    />
                    <Text style={styles.CardMenuModalquickActionText}>
                      Add Checklist
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.CardMenuModalquickActionButton,
                      { backgroundColor: "#1a2631" },
                      uploadingAttachment && { opacity: 0.7 }
                    ]}
                    onPress={() => setShowAttachmentsModal(true)}
                    disabled={uploadingAttachment}
                  >
                    {uploadingAttachment ? (
                      <ActivityIndicator size="small" color="#3CD6FF" />
                    ) : (
                    <Ionicons name="attach-outline" size={22} color="#3CD6FF" />
                    )}
                    <Text style={styles.CardMenuModalquickActionText}>
                      {uploadingAttachment ? "Uploading..." : "Add Attachment"}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.CardMenuModalquickActionsRow}>
                  <TouchableOpacity
                    style={[
                      styles.CardMenuModalquickActionButton,
                      { backgroundColor: "#221a2d" },
                    ]}
                    onPress={() => setShowMembersModal(true)}
                  >
                    <Ionicons
                      name="person-add-outline"
                      size={22}
                      color="#B37BFF"
                    />
                    <Text style={styles.CardMenuModalquickActionText}>
                      Members
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Description Section */}
              <View style={styles.CardMenuModalsection}>
                <View style={styles.CardMenuModaldescriptionRow}>
                  <Ionicons
                    name="document-text-outline"
                    size={22}
                    color="#ccc"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.CardMenuModaldescriptionTitle}>
                    Card description
                  </Text>
                </View>
                {isEditingDescription ? (
                  <TextInput
                    style={styles.CardMenuModaldescriptionInput}
                    placeholder="Add a more detailed description..."
                    placeholderTextColor="#888"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    autoFocus={false}
                    onBlur={finishEditingDescription}
                    onSubmitEditing={finishEditingDescription}
                    returnKeyType="done"
                  />
                ) : (
                  <TouchableOpacity
                    onPress={() => setIsEditingDescription(true)}
                    style={{ flexDirection: "row", alignItems: "center" }}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.CardMenuModaldescriptionText,
                        { flex: 1, color: "white" },
                      ]}
                    >
                      {description}
                    </Text>
                    <Ionicons
                      name="pencil-outline"
                      size={20}
                      color="white"
                      style={{ marginLeft: 8 }}
                    />
                  </TouchableOpacity>
                )}
              </View>

              {/* Checklist Rendering */}
              {checklists.map((checklist) => (
                <View key={checklist.id} style={{ marginBottom: 24 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    {checklist.editing ? (
                      <TextInput
                        style={{
                          flex: 1,
                          fontSize: 16,
                          fontWeight: "600",
                          color: "white",
                          borderBottomWidth: 1,
                          borderBottomColor: "white",
                          paddingVertical: 2,
                        }}
                        value={checklist.title}
                        onChangeText={(text) =>
                          updateChecklistTitle(checklist.id, text)
                        }
                        onBlur={() => toggleEditChecklistTitle(checklist.id)}
                        autoFocus
                        returnKeyType="done"
                      />
                    ) : (
                      <>
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight: "600",
                              color: "white",
                            }}
                          >
                            {checklist.title}
                          </Text>
                          <TouchableOpacity
                            onPress={() =>
                              toggleEditChecklistTitle(checklist.id)
                            }
                            style={{ marginLeft: 6 }}
                            accessibilityLabel={`Edit checklist ${checklist.title}`}
                          >
                            <Ionicons
                              name="pencil-outline"
                              size={16}
                              color="white"
                            />
                          </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1 }} />
                        <TouchableOpacity
                          onPress={() => deleteChecklist(checklist.id)}
                          style={{ marginLeft: 12 }}
                          accessibilityLabel={`Delete checklist ${checklist.title}`}
                        >
                          <Ionicons
                            name="trash-outline"
                            size={22}
                            color="#ff6b6b"
                          />
                        </TouchableOpacity>
                      </>
                    )}
                  </View>

                  {checklist.todos.map((todo) => (
                    <View
                      key={todo.id}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 8,
                        backgroundColor: "rgba(255,255,255,0.1)",
                        borderRadius: 8,
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() =>
                          toggleTodoCompleted(checklist.id, todo.id)
                        }
                        style={{ marginRight: 12 }}
                        accessibilityLabel={`Mark todo ${
                          todo.text || "empty"
                        } as ${todo.completed ? "incomplete" : "complete"}`}
                      >
                        <Ionicons
                          name={
                            todo.completed
                              ? "checkmark-circle"
                              : "ellipse-outline"
                          }
                          size={20}
                          color={todo.completed ? "#2ecc71" : "#ccc"}
                        />
                      </TouchableOpacity>
                      <TextInput
                        style={{
                          flex: 1,
                          fontSize: 14,
                          color: todo.completed ? "gray" : "white",
                          textDecorationLine: todo.completed
                            ? "line-through"
                            : "none",
                          paddingVertical: 0,
                          backgroundColor: "transparent",
                        }}
                        placeholder="Enter todo..."
                        placeholderTextColor="rgba(255,255,255,0.6)"
                        value={todo.text}
                        onChangeText={(text) =>
                          updateTodoText(checklist.id, todo.id, text)
                        }
                        onSubmitEditing={() =>
                          addTodoOnSubmitEditing(checklist.id, todo.id)
                        }
                        returnKeyType="done"
                        blurOnSubmit={false}
                      />
                      <TouchableOpacity
                        onPress={() => deleteTodo(checklist.id, todo.id)}
                        style={{ marginLeft: 8 }}
                        accessibilityLabel={`Delete todo ${
                          todo.text || "empty"
                        }`}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={20}
                          color="#ff6b6b"
                        />
                      </TouchableOpacity>
                    </View>
                  ))}

                  {/* Plus Button to add new todo */}
                  <TouchableOpacity
                    onPress={() => addTodo(checklist.id)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      backgroundColor: "rgba(255,255,255,0.15)",
                      borderRadius: 8,
                    }}
                    accessibilityLabel="Add todo"
                  >
                    <Ionicons name="add" size={20} color="white" />
                    <Text
                      style={{
                        color: "white",
                        marginLeft: 8,
                        fontWeight: "600",
                      }}
                    >
                      Add Todo
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}

              {/* Attachments Section */}
              {attachments.length > 0 && (
                <View style={styles.CardMenuModalsection}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 12,
                    }}
                  >
                    <Ionicons
                      name="attach-outline"
                      size={22}
                      color="#ccc"
                      style={{ marginRight: 8 }}
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: "white",
                      }}
                    >
                      Attachments ({attachments.length})
                    </Text>
                  </View>
                  {attachments.map((attachment) => (
                    <View
                      key={attachment.id}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "rgba(255,255,255,0.1)",
                        borderRadius: 8,
                        paddingHorizontal: 12,
                        paddingVertical: 10,
                        marginBottom: 8,
                      }}
                    >
                      <Ionicons
                        name="document-outline"
                        size={20}
                        color="#3CD6FF"
                      />
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={{ color: "white", fontWeight: "500" }}>
                          {attachment.filename}
                        </Text>
                        <Text style={{ color: "#aaa", fontSize: 12 }}>
                          {attachment.filepath}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleRemoveAttachment(attachment.id)}
                        style={{ marginLeft: 8 }}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={18}
                          color="#ff6b6b"
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              {/* Members Section */}
              {members.length > 0 && (
                <View style={styles.CardMenuModalsection}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 12,
                    }}
                  >
                    <Ionicons
                      name="people-outline"
                      size={22}
                      color="#ccc"
                      style={{ marginRight: 8 }}
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: "white",
                      }}
                    >
                      Members ({members.length})
                    </Text>
                  </View>
                  {members.map((member) => (
                    <View
                      key={member.id}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "rgba(255,255,255,0.1)",
                        borderRadius: 8,
                        paddingHorizontal: 12,
                        paddingVertical: 10,
                        marginBottom: 8,
                      }}
                    >
                      <View
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 16,
                          backgroundColor: "#B37BFF",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text style={{ color: "white", fontWeight: "bold" }}>
                          {member.username.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={{ color: "white", fontWeight: "500" }}>
                          {member.username}
                        </Text>
                        <Text style={{ color: "#aaa", fontSize: 12 }}>
                          {member.email}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleRemoveMember(member.id)}
                        style={{ marginLeft: 8 }}
                      >
                        <Ionicons
                          name="person-remove-outline"
                          size={18}
                          color="#ff6b6b"
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              {/* Start Date */}
              <TouchableOpacity
                style={styles.CardMenuModalmenuRow}
                onPress={() => setShowStartDateModal(true)}
              >
                <Ionicons
                  name="calendar-outline"
                  size={22}
                  color="#ccc"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.CardMenuModalmenuRowText}>
                  {startDate ? startDate.toLocaleString() : "Set Start Date"}
                </Text>
              </TouchableOpacity>

              {/* Labels */}
              <TouchableOpacity
                style={styles.CardMenuModalmenuRow}
                onPress={() => setShowLabelsModal(true)}
              >
                <Ionicons
                  name="pricetag-outline"
                  size={22}
                  color="#ccc"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.CardMenuModalmenuRowText}>
                  {labels.length > 0 ? labels.join(", ") : "Add Labels"}
                </Text>
              </TouchableOpacity>

              {/* Members (show current members) */}
              <TouchableOpacity
                style={styles.CardMenuModalmenuRow}
                onPress={() => {
                  if (members.length > 0) {
                    Alert.alert(
                      "Card Members",
                      members.map((m) => `${m.username} (${m.email})`).join("\n"),
                      [{ text: "OK" }]
                    );
                  } else {
                    Alert.alert(
                      "No Members",
                      "No members have been added to this card yet."
                    );
                  }
                }}
              >
                <Ionicons
                  name="person-outline"
                  size={22}
                  color="#ccc"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.CardMenuModalmenuRowText}>
                  Members {members.length > 0 ? `(${members.length})` : ""}
                </Text>
              </TouchableOpacity>

              {/* Comments List */}
              {comments.length > 0 && (
                <View style={{ marginTop: 12, paddingHorizontal: 16 }}>
                  {comments.map(({ id, author, text }) => (
                    <View
                      key={id}
                      style={{
                        marginBottom: 12,
                        backgroundColor: "rgba(255,255,255,0.1)",
                        padding: 10,
                        borderRadius: 8,
                      }}
                    >
                      <Text style={{ color: "#aaa", fontWeight: "600" }}>
                        {author}
                      </Text>
                      <Text style={{ color: "white", fontStyle: "italic" }}>
                        &ldquo;{text}&rdquo;
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Add Comment Section */}
              <CardComments
                comments={comments}
                commentInput={comment}
                setCommentInput={setComment}
                onAddComment={handleAddComment}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Start Date Picker Modal */}
      {showStartDateModal && (
        <SafeDateTimePicker
          value={startDate || new Date()}
          mode="datetime"
          onChange={handleStartDateConfirm}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        />
      )}

      {/* Labels Modal */}
      <Modal
        visible={showLabelsModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLabelsModal(false)}
      >
        <View style={localStyles.modalOverlay}>
          <View style={localStyles.modalContent}>
            <View style={localStyles.modalHeader}>
            <Text style={localStyles.modalTitle}>Manage Urgency Labels</Text>
              <TouchableOpacity
                onPress={() => setShowLabelsModal(false)}
                style={localStyles.closeButton}
              >
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row", marginBottom: 12 }}>
              <TextInput
                style={localStyles.textInput}
                value={labelInput}
                onChangeText={setLabelInput}
                placeholder="Add new label"
                placeholderTextColor="#888"
                onSubmitEditing={handleAddLabel}
                autoFocus
              />
              <TouchableOpacity
                onPress={handleAddLabel}
                style={[localStyles.addButton, { marginLeft: 8 }]}
                accessibilityLabel="Add label"
              >
                <Ionicons name="add" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {labels.length === 0 ? (
              <Text style={{ color: "#888", marginBottom: 8 }}>
                No labels yet.
              </Text>
            ) : (
              labels.map((label) => (
                <View key={label} style={localStyles.labelRow}>
                  <Text style={localStyles.labelText}>{label}</Text>
                  <TouchableOpacity onPress={() => handleRemoveLabel(label)}>
                    <Ionicons name="trash-outline" size={20} color="#ff6b6b" />
                  </TouchableOpacity>
                </View>
              ))
            )}

            <TouchableOpacity
              onPress={() => setShowLabelsModal(false)}
              style={[localStyles.closeButton, { marginTop: 16 }]}
            >
              <Text style={{ color: "#3b82f6", fontWeight: "600" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Member Modal */}
      <Modal
        visible={showMemberModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMemberModal(false)}
      >
        <View style={localStyles.modalOverlay}>
          <View style={localStyles.modalContent}>
            <Text style={localStyles.modalTitle}>Add Member to Card</Text>

            <Text style={{ color: "#ccc", marginBottom: 8 }}>Name</Text>
            <TextInput
              style={localStyles.textInput}
              value={memberInput}
              onChangeText={setMemberInput}
              placeholder="Enter member name"
              placeholderTextColor="#888"
              autoFocus
            />

            <Text style={{ color: "#ccc", marginBottom: 8, marginTop: 12 }}>
              Email
            </Text>
            <TextInput
              style={localStyles.textInput}
              value={memberEmailInput}
              onChangeText={setMemberEmailInput}
              placeholder="Enter member email"
              placeholderTextColor="#888"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 20,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setMemberInput("");
                  setMemberEmailInput("");
                  setShowMemberModal(false);
                }}
                style={[
                  localStyles.closeButton,
                  {
                    backgroundColor: "#666",
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 8,
                  },
                ]}
              >
                <Text style={{ color: "white", fontWeight: "600" }}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleAddMemberConfirm}
                style={[
                  localStyles.addButton,
                  {
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 8,
                  },
                ]}
              >
                <Text style={{ color: "white", fontWeight: "600" }}>
                  Add Member
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Cover Picker Modal */}
      <CoverPickerModal
        visible={showCoverPickerModal}
        onClose={() => setShowCoverPickerModal(false)}
        selectedColor={coverColor}
        selectedImage={coverImage}
        onSelectColor={(color) => {
          setCoverColor(color);
          setCoverImage(null);
          setShowCoverPickerModal(false);
          if (onUpdateCardCover && card?.id) {
            onUpdateCardCover(card.id, color, null);
          }
        }}
        onSelectImage={(uri) => {
          setCoverImage(uri);
          setCoverColor(null);
          setShowCoverPickerModal(false);
          if (onUpdateCardCover && card?.id) {
            onUpdateCardCover(card.id, null, uri);
          }
        }}
      />

      {/* Attachments Modal */}
      <Modal
        visible={showAttachmentsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAttachmentsModal(false)}
      >
        <View style={localStyles.modalOverlay}>
          <View style={[localStyles.modalContent, { maxHeight: '80%' }]}>
            <View style={localStyles.modalHeader}>
              <Text style={localStyles.modalTitle}>Attachments</Text>
              <TouchableOpacity
                onPress={() => setShowAttachmentsModal(false)}
                style={localStyles.closeButton}
              >
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {attachments.length === 0 ? (
              <View style={localStyles.emptyState}>
                <Ionicons name="attach-outline" size={48} color="#666" />
                <Text style={localStyles.emptyStateText}>
                  No attachments yet
                </Text>
                <Text style={localStyles.emptyStateSubtext}>
                  Add files, images, or documents to this card
                </Text>
              </View>
            ) : (
              <ScrollView style={{ maxHeight: 300 }}>
                {attachments.map((attachment) => (
                  <View key={attachment.id} style={localStyles.attachmentItem}>
                    <Ionicons
                      name="document-outline"
                      size={24}
                      color="#3CD6FF"
                    />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={localStyles.attachmentName}>
                        {attachment.filename}
                      </Text>
                      <Text style={localStyles.attachmentInfo}>
                        {attachment.contentType} • {new Date(attachment.uploadedAt).toLocaleDateString()}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleRemoveAttachment(attachment.id)}
                      style={localStyles.removeButton}
                    >
                      <Ionicons name="trash-outline" size={20} color="#ff6b6b" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}

            <TouchableOpacity
              style={[
                localStyles.addButton,
                { marginTop: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }
              ]}
              onPress={handleAddAttachment}
              disabled={uploadingAttachment}
            >
              {uploadingAttachment ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Ionicons name="add" size={20} color="white" />
              )}
              <Text style={{ color: 'white', fontWeight: '600', marginLeft: 8 }}>
                {uploadingAttachment ? 'Uploading...' : 'Add Attachment'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Members Modal */}
      <Modal
        visible={showMembersModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMembersModal(false)}
      >
        <View style={localStyles.modalOverlay}>
          <View style={[localStyles.modalContent, { maxHeight: '80%' }]}>
            <View style={localStyles.modalHeader}>
              <Text style={localStyles.modalTitle}>Members</Text>
              <TouchableOpacity
                onPress={() => setShowMembersModal(false)}
                style={localStyles.closeButton}
              >
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {members.length === 0 ? (
              <View style={localStyles.emptyState}>
                <Ionicons name="people-outline" size={48} color="#666" />
                <Text style={localStyles.emptyStateText}>
                  No members collaborating
                </Text>
                <Text style={localStyles.emptyStateSubtext}>
                  Invite team members to collaborate on this card
                </Text>
              </View>
            ) : (
              <ScrollView style={{ maxHeight: 300 }}>
                {members.map((member) => (
                  <View key={member.id} style={localStyles.memberItem}>
                    <View style={localStyles.memberAvatar}>
                      <Text style={localStyles.memberInitial}>
                        {member.username.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={localStyles.memberName}>
                        {member.username}
                      </Text>
                      <Text style={localStyles.memberEmail}>
                        {member.email}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleRemoveMember(member.id)}
                      style={localStyles.removeButton}
                    >
                      <Ionicons name="person-remove-outline" size={20} color="#ff6b6b" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}

            <View style={localStyles.inviteSection}>
              <Text style={localStyles.inviteTitle}>Invite via Email</Text>
              <View style={localStyles.inviteInputContainer}>
                <TextInput
                  style={localStyles.inviteInput}
                  placeholder="Enter email address"
                  placeholderTextColor="#888"
                  value={inviteEmail}
                  onChangeText={setInviteEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={[
                    localStyles.inviteButton,
                    inviteLoading && { opacity: 0.7 }
                  ]}
                  onPress={handleInviteMember}
                  disabled={inviteLoading}
                >
                  {inviteLoading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text style={{ color: 'white', fontWeight: '600' }}>
                      Invite
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
              
              {inviteError && (
                <Text style={localStyles.errorText}>{inviteError}</Text>
              )}
              
              {inviteSuccess && (
                <Text style={localStyles.successText}>
                  Invitation sent successfully!
                </Text>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const localStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#222",
    borderRadius: 12,
    padding: 20,
    maxHeight: 400,
  },
  modalTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  labelText: {
    color: "white",
    fontSize: 16,
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  textInput: {
    flex: 1,
    backgroundColor: "#333",
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: "white",
    borderRadius: 8,
  },
  addButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  dropdownIcon: {
    marginRight: 12,
    width: 20,
  },
  dropdownText: {
    color: "#E2E8F0",
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
  dropdownSeparator: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginVertical: 4,
  },
  attachmentItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  attachmentName: {
    color: "white",
    fontWeight: "500",
    marginBottom: 4,
  },
  attachmentInfo: {
    color: "#aaa",
    fontSize: 12,
  },
  removeButton: {
    marginLeft: 10,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
  },
  emptyStateSubtext: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 5,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  memberAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#B37BFF",
    justifyContent: "center",
    alignItems: "center",
  },
  memberInitial: {
    color: "white",
    fontWeight: "bold",
  },
  memberName: {
    color: "white",
    fontWeight: "500",
    marginBottom: 2,
  },
  memberEmail: {
    color: "#aaa",
    fontSize: 12,
  },
  inviteSection: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#444",
  },
  inviteTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  inviteInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  inviteInput: {
    flex: 1,
    color: "white",
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 14,
  },
  inviteButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
  },
  successText: {
    color: "#3CD6FF",
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
  },
});
