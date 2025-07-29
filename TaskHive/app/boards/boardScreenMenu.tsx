import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  StyleSheet, Text, TouchableOpacity, View, FlatList, Modal, TextInput,
  ImageBackground, Alert, Share, ScrollView
} from "react-native";
import { BlurView } from "expo-blur";
import * as ImagePicker from "expo-image-picker"; // Import expo-image-picker
import * as FileSystem from 'expo-file-system';
import { useWorkspaceStore } from "../stores/workspaceStore";
import { useTheme } from "../../ThemeContext";
import { lightTheme, darkTheme } from "../../styles/themes";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_BASE_URL, WORKSPACE_ENDPOINTS } from '../../appconstants/api.js';

const PRIMARY_COLOR = "#0B1F3A";

// Define a Board type for clarity
interface Board {
  id: string;
  title: string;
  backgroundColor?: string;
  backgroundImage?: string | null;
  visibility?: string;
  // Add other fields as needed
}

export default function BoardScreenMenu() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [showVisibilityModal, setShowVisibilityModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [inviteInput, setInviteInput] = useState("");
  const [backgroundImage, setBackgroundImage] = useState(null); // State for selected image URI
  const {updateBoard}=useWorkspaceStore();
  
  // Add invite functionality state
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState(false);
  
  // Parse the board
  let board: Board | null = null;
  try {
    if (typeof params.board === 'string') {
      board = JSON.parse(params.board);
      if (board && !board.backgroundColor) {
        board.backgroundColor = "#ADD8E6";
      }
      if (board && !board.visibility) {
        board.visibility = "Private";
      }
    }
  } catch (e) {
    console.error("BoardScreenMenu: Failed to parse board:", e);
  }

  // Log board for debugging
  useEffect(() => {
    console.log('BoardScreenMenu: Received board:', JSON.stringify(board, null, 2));
  }, [board]);
   useEffect(() => {
    console.log('BoardDetails: Received board:', JSON.stringify(board, null, 2));
  }, [board?.id, board?.backgroundImage]);
  

  // Function to pick an image from gallery
 const pickImage = async () => {
  try {
    console.log('BoardScreenMenu: Starting pickImage for board:', board?.id);
    if (!board?.id) {
      console.error('BoardScreenMenu: Board ID is missing:', board);
      return;
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Error', 'Permission denied for media library.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });
    console.log('BoardScreenMenu: ImagePicker result:', JSON.stringify(result, null, 2));
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      console.log('BoardScreenMenu: Selected image URI:', imageUri);
      // Copy to persistent storage
      const fileName = imageUri.split('/').pop();
      const newPath = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.copyAsync({
        from: imageUri,
        to: newPath,
      });
      console.log('BoardScreenMenu: Copied image to:', newPath);
      const updatedBoard = { ...board, backgroundImage: newPath, backgroundColor: null };
      console.log('BoardScreenMenu: Created updatedBoard:', JSON.stringify(updatedBoard, null, 2));
      updateBoard(updatedBoard);
      router.replace({
        pathname: "/boards/[id]",
        params: { id: board.id, board: JSON.stringify(updatedBoard) }
      });
    } else {
      console.log('BoardScreenMenu: Image selection canceled');
    }
  } catch (error) {
    console.error('BoardScreenMenu: Error picking image:', error);
  }
};
  if (!board) {
    return <Text>Error: No board data available</Text>;
  }

  const navigateBack = () => {
    console.log('BoardScreenMenu: Navigating back to BoardDetails for board:', board.id);
    const updatedBoard = { ...board };
    router.push({
      pathname: "/boards/[id]",
      params: { id: board.id, board: JSON.stringify(updatedBoard) }
    });
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out this board on TaskHive!\nhttps://taskhive.app/board/${board!.id}`,
        title: 'Share Board',
      });
      // Optionally handle result.action
    } catch (error) {
      console.error('Error sharing board:', error);
    }
  };

  // Add invite collaborator function
  const handleInviteCollaborator = async () => {
    if (!inviteInput.trim()) {
      setInviteError('Please enter an email address.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteInput.trim())) {
      setInviteError('Please enter a valid email address.');
      return;
    }

    setInviteLoading(true);
    setInviteError("");
    setInviteSuccess(false);

    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        setInviteError('Authentication required. Please login again.');
        return;
      }

      // Get current workspace ID (you might need to adjust this based on your data structure)
      const workspaceId = board?.workspaceId || "default-workspace";
      
      const response = await axios.post(
        `${API_BASE_URL}${WORKSPACE_ENDPOINTS.INVITE}`,
        {
          workspaceId: workspaceId,
          email: inviteInput.trim()
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        setInviteSuccess(true);
        setInviteInput("");
        Alert.alert("Success", `Invitation sent to ${inviteInput.trim()}!`);
      } else {
        setInviteError('Failed to send invitation. Please try again.');
      }
    } catch (error: any) {
      console.error('Invite error:', error);
      const errorMessage = error.response?.data || 'Failed to send invitation. Please try again.';
      setInviteError(errorMessage);
    } finally {
      setInviteLoading(false);
    }
  };

  // Color options
  const colors = [
    { id: "1", value: "#0B1F3A" },
    { id: "2", value: "#6F8FAF" },
    { id: "3", value: "#ADD8E6" },
    { id: "4", value: "#FF6F61" },
    { id: "5", value: "#6B7280" },
    { id: "6", value: "#34D399" },
    { id: "7", value: "#FFD700" },
    { id: "8", value: "#9B59B6" },
    { id: "9", value: "#E74C3C" },
    { id: "10", value: "#3498DB" },
    { id: "11", value: "#F1C40F" },
    { id: "12", value: "#2ECC71" },
  ];

  // Menu options
  const menuOptions = [
    { id: "3", title: "Archive Board" },
    { id: "4", title: "Delete Board", icon: "trash-outline" },
  ];

  // Visibility options
  const visibilityOptions = [
    { id: "1", title: "Private", icon: "lock-closed" },
    { id: "2", title: "Workspace", icon: "people" },
    { id: "3", title: "Public", icon: "globe-outline" },
  ];

  // Collaborators (placeholder)
  const collaborators = [
    { id: "1", name: "Me", role: "Owner" },
    { id: "2", name: "Kofi", role: "Edit" },
  ];

  // Edit options for Kofi
  const editOptions = [
    { id: "1", title: "Edit" },
    { id: "2", title: "View" },
  ];

  const { theme } = useTheme();
  const styles = theme === "dark" ? darkTheme : lightTheme;

  return (
    <View style={styles.boardScreenMenuContainer}>
      <View style={styles.boardScreenMenuTopBar}>
        <TouchableOpacity onPress={navigateBack} style={styles.boardScreenMenuBackButton}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.boardScreenMenuTitle}>Board Screen Menu</Text>
      </View>
      <ScrollView 
        style={styles.boardScreenMenuContent}
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.boardScreenMenuColorSection}>
          <Text style={styles.boardScreenMenuColorSectionTitle}>Change Board Background</Text>
          
          <FlatList
            data={colors}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.boardScreenMenuColorList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.boardScreenMenuColorSwatch,
                  { backgroundColor: item.value },
                  board?.backgroundColor === item.value && {
                    borderColor: '#FF6F61',
                    borderWidth: 4,
                  },
                ]}
                onPress={() => {
                  const updatedBoard = { ...board, backgroundColor: item.value, backgroundImage: null };
                  console.log('BoardScreenMenu: Selected color:', item.value);
                  setBackgroundImage(null); // Clear image if color is selected
                  router.push({
                    pathname: "/boards/[id]",
                    params: { id: board.id, board: JSON.stringify(updatedBoard) }
                  });
                }}
              />
            )}
          />
          <Text style={{color:'white' ,fontWeight:'bold',alignItems:'center',justifyContent:'center',textAlign:'center'}}>OR</Text>
          <TouchableOpacity style={styles.boardScreenMenuImageButton} onPress={pickImage}>
            <Text style={styles.boardScreenMenuImageButtonText}>Pick Image from Gallery</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.boardScreenMenuIconSection}>
          <TouchableOpacity style={styles.boardScreenMenuIconButton} onPress={handleShare}>
            <Ionicons name="share-social-outline" size={28} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.boardScreenMenuIconButton}>
            <Ionicons name="copy-outline" size={28} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.boardScreenMenuIconButton}>
            <Ionicons name="archive-outline" size={28} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.boardScreenMenuDetailsSection}>
          <Text style={styles.boardScreenMenuSectionTitle}>Board Details</Text>
          <View style={styles.boardScreenMenuDetailRow}>
            <Text style={styles.boardScreenMenuDetailLabel}>Board Name</Text>
            <Text style={styles.boardScreenMenuDetailValue}>{board.title ?? "Board"}</Text>
          </View>
          <View style={styles.boardScreenMenuDetailRow}>
            <Text style={styles.boardScreenMenuDetailLabel}>Workspace</Text>
            <View style={styles.boardScreenMenuDetailValueContainer}>
              <Text style={styles.boardScreenMenuDetailValue}>Team Workspace</Text>
              <Ionicons name="chevron-forward" size={20} color="white" />
            </View>
          </View>
          <TouchableOpacity
            style={styles.boardScreenMenuDetailRow}
            onPress={() => setShowVisibilityModal(true)}
          >
            <Text style={styles.boardScreenMenuDetailLabel}>Visibility</Text>
            <View style={styles.boardScreenMenuDetailValueContainer}>
              <Text style={styles.boardScreenMenuDetailValue}>{board.visibility}</Text>
              <Ionicons name="chevron-forward" size={20} color="white" />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.boardScreenMenuCollaboratorsSection}>
          <Text style={styles.boardScreenMenuSectionTitle}>Invite Collaborators</Text>
          <TextInput
            style={styles.boardScreenMenuInviteInput}
            placeholder="Enter email address"
            placeholderTextColor="#aaa"
            value={inviteInput}
            onChangeText={setInviteInput}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          {/* Error message */}
          {inviteError ? (
            <Text style={{ color: '#ff6b6b', fontSize: 12, marginTop: 4, marginBottom: 8 }}>
              {inviteError}
            </Text>
          ) : null}
          
          {/* Success message */}
          {inviteSuccess ? (
            <Text style={{ color: '#2ecc71', fontSize: 12, marginTop: 4, marginBottom: 8 }}>
              Invitation sent successfully!
            </Text>
          ) : null}
          
          {/* Invite button */}
          <TouchableOpacity
            style={[
              styles.boardScreenMenuInviteButton,
              inviteLoading && { opacity: 0.7 }
            ]}
            onPress={handleInviteCollaborator}
            disabled={inviteLoading}
          >
            <Text style={styles.boardScreenMenuInviteButtonText}>
              {inviteLoading ? "Sending..." : "Send Invitation"}
            </Text>
          </TouchableOpacity>
          
          <Text style={styles.boardScreenMenuSubSectionTitle}>Current Collaborators</Text>
          <FlatList
            data={collaborators}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.boardScreenMenuCollaboratorRow}>
                <Text style={styles.boardScreenMenuCollaboratorName}>{item.name}</Text>
                {item.name === "Me" ? (
                  <Text style={styles.boardScreenMenuCollaboratorRole}>{item.role}</Text>
                ) : (
                  <TouchableOpacity
                    style={styles.boardScreenMenuEditButton}
                    onPress={() => setShowEditModal(true)}
                  >
                    <Text style={styles.boardScreenMenuEditButtonText}>{item.role}</Text>
                    <Ionicons name="chevron-down" size={20} color="white" />
                  </TouchableOpacity>
                )}
              </View>
            )}
          />
        </View>
        <FlatList
          data={menuOptions}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.boardScreenMenuMenuItem, item.title === "Delete Board" && styles.boardScreenMenuDeleteButton]}
              onPress={() => {
                console.log(`BoardScreenMenu: Selected option: ${item.title}`);
              }}
            >
              {item.icon ? (
                <Ionicons name={item.icon} size={20} color="white" style={styles.boardScreenMenuMenuItemIcon} />
              ) : null}
              <Text style={styles.boardScreenMenuMenuItemText}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      </ScrollView>

      {showVisibilityModal && (
        <Modal visible={showVisibilityModal} transparent animationType="fade">
          <View style={styles.boardScreenMenuModalBackground}>
            <BlurView style={StyleSheet.absoluteFill} intensity={100} tint="dark" />
            <View style={styles.boardScreenMenuModalView}>
              <Text style={styles.boardScreenMenuModalTitle}>Select Visibility</Text>
              <FlatList
                data={visibilityOptions}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.boardScreenMenuModalOption}
                    onPress={() => {
                      const updatedBoard = { ...board, visibility: item.title };
                      console.log('BoardScreenMenu: Selected visibility:', item.title);
                      board = updatedBoard;
                      setShowVisibilityModal(false);
                    }}
                  >
                    <Ionicons name={item.icon} size={24} color="#333" style={styles.boardScreenMenuModalIcon} />
                    <Text style={styles.boardScreenMenuModalOptionText}>{item.title}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={styles.boardScreenMenuModalButton}
                onPress={() => setShowVisibilityModal(false)}
              >
                <Text style={styles.boardScreenMenuModalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {showEditModal && (
        <Modal visible={showEditModal} transparent animationType="fade">
          <View style={styles.boardScreenMenuModalBackground}>
            <BlurView style={StyleSheet.absoluteFill} intensity={100} tint="dark" />
            <View style={styles.boardScreenMenuModalView}>
              <Text style={styles.boardScreenMenuModalTitle}>Collaborator Options</Text>
              <FlatList
                data={editOptions}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.boardScreenMenuModalOption}
                    onPress={() => {
                      console.log('BoardScreenMenu: Selected edit option:', item.title);
                      setShowEditModal(false);
                    }}
                  >
                    <Text style={styles.boardScreenMenuModalOptionText}>{item.title}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={styles.boardScreenMenuModalButton}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.boardScreenMenuModalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}