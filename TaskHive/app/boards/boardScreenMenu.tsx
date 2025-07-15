import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  StyleSheet, Text, TouchableOpacity, View, FlatList, Modal, TextInput,
  ImageBackground, Alert
} from "react-native";
import { BlurView } from "expo-blur";
import * as ImagePicker from "expo-image-picker"; // Import expo-image-picker
import * as FileSystem from 'expo-file-system';
import { useWorkspaceStore } from "../stores/workspaceStore";

const PRIMARY_COLOR = "#0B1F3A";

export default function BoardScreenMenu() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [showVisibilityModal, setShowVisibilityModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [inviteInput, setInviteInput] = useState("");
  const [backgroundImage, setBackgroundImage] = useState(null); // State for selected image URI
  const {updateBoard}=useWorkspaceStore();
  // Parse the board
  let board = null;
  try {
    board = params.board ? JSON.parse(params.board) : null;
    if (board && !board.backgroundColor) {
      board.backgroundColor = "#ADD8E6";
    }
    if (board && !board.visibility) {
      board.visibility = "Private";
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

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={navigateBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Board Screen Menu</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.colorSection}>
          <Text style={styles.colorSectionTitle}>Change Board Background</Text>
          
          <FlatList
            data={colors}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.colorList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.colorSwatch, { backgroundColor: item.value }]}
                onPress={() => {
                  const updatedBoard = { ...board, backgroundColor: item.value,backgroundImage:null };
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
          <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
            <Text style={styles.imageButtonText}>Pick Image from Gallery</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.iconSection}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="share-social-outline" size={28} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="copy-outline" size={28} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="archive-outline" size={28} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Board Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Board Name</Text>
            <Text style={styles.detailValue}>{board.title ?? "Board"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Workspace</Text>
            <View style={styles.detailValueContainer}>
              <Text style={styles.detailValue}>Team Workspace</Text>
              <Ionicons name="chevron-forward" size={20} color="white" />
            </View>
          </View>
          <TouchableOpacity
            style={styles.detailRow}
            onPress={() => setShowVisibilityModal(true)}
          >
            <Text style={styles.detailLabel}>Visibility</Text>
            <View style={styles.detailValueContainer}>
              <Text style={styles.detailValue}>{board.visibility}</Text>
              <Ionicons name="chevron-forward" size={20} color="white" />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.collaboratorsSection}>
          <Text style={styles.sectionTitle}>Invite Collaborators</Text>
          <TextInput
            style={styles.inviteInput}
            placeholder="Enter username or email"
            placeholderTextColor="#aaa"
            value={inviteInput}
            onChangeText={setInviteInput}
          />
          <Text style={styles.subSectionTitle}>Current Collaborators</Text>
          <FlatList
            data={collaborators}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.collaboratorRow}>
                <Text style={styles.collaboratorName}>{item.name}</Text>
                {item.name === "Me" ? (
                  <Text style={styles.collaboratorRole}>{item.role}</Text>
                ) : (
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => setShowEditModal(true)}
                  >
                    <Text style={styles.editButtonText}>{item.role}</Text>
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
              style={[styles.menuItem, item.title === "Delete Board" && styles.deleteButton]}
              onPress={() => {
                console.log(`BoardScreenMenu: Selected option: ${item.title}`);
              }}
            >
              {item.icon ? (
                <Ionicons name={item.icon} size={20} color="white" style={styles.menuItemIcon} />
              ) : null}
              <Text style={styles.menuItemText}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {showVisibilityModal && (
        <Modal visible={showVisibilityModal} transparent animationType="fade">
          <View style={styles.modalBackground}>
            <BlurView style={StyleSheet.absoluteFill} intensity={100} tint="dark" />
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Select Visibility</Text>
              <FlatList
                data={visibilityOptions}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalOption}
                    onPress={() => {
                      const updatedBoard = { ...board, visibility: item.title };
                      console.log('BoardScreenMenu: Selected visibility:', item.title);
                      board = updatedBoard;
                      setShowVisibilityModal(false);
                    }}
                  >
                    <Ionicons name={item.icon} size={24} color="#333" style={styles.modalIcon} />
                    <Text style={styles.modalOptionText}>{item.title}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowVisibilityModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {showEditModal && (
        <Modal visible={showEditModal} transparent animationType="fade">
          <View style={styles.modalBackground}>
            <BlurView style={StyleSheet.absoluteFill} intensity={100} tint="dark" />
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Collaborator Options</Text>
              <FlatList
                data={editOptions}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalOption}
                    onPress={() => {
                      console.log('BoardScreenMenu: Selected edit option:', item.title);
                      setShowEditModal(false);
                    }}
                  >
                    <Text style={styles.modalOptionText}>{item.title}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#ADD8E6',
  },
  topBar: {
    height: 110,
    backgroundColor: PRIMARY_COLOR,
    paddingTop: 40,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    bottom: 20,
  },
  backButton: {
    padding: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    textAlign: "left",
    marginLeft: 10,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  colorSection: {
    marginBottom: 20,
    marginTop: -15,
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
  },
  colorSectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    padding: 5,
    borderRadius: 8,
    textAlign: "left",
    marginBottom: 10,
  },
  colorList: {
    paddingHorizontal: 5,
  },
  colorSwatch: {
    width: 50,
    height: 50,
    borderRadius: 15,
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: "white",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  imageButton: {
    backgroundColor: "#6F8FAF",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  imageButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  iconSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  iconButton: {
    padding: 10,
  },
  detailsSection: {
    marginBottom: 20,
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 20,
    padding: 15,
    backgroundColor: "#6F8FAF",
  },
  collaboratorsSection: {
    marginBottom: 20,
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 20,
    padding: 15,
    backgroundColor: "#6F8FAF",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    marginBottom: 10,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginTop: 10,
    marginBottom: 5,
  },
  inviteInput: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  collaboratorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  collaboratorName: {
    fontSize: 16,
    color: "white",
    fontWeight: "500",
  },
  collaboratorRole: {
    fontSize: 16,
    color: "#ddd",
    fontWeight: "400",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#5A7A9A",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 16,
    color: "white",
    marginRight: 5,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 16,
    color: "white",
    fontWeight: "500",
  },
  detailValueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailValue: {
    fontSize: 16,
    color: "white",
    marginRight: 5,
  },
  menuItem: {
    backgroundColor: "#6F8FAF",
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#E74C3C",
  },
  menuItemIcon: {
    marginRight: 10,
  },
  menuItemText: {
    fontSize: 18,
    color: "white",
    fontWeight: "500",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    padding: 20,
    margin: 30,
    borderRadius: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    minWidth: 290,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginVertical: 5,
  },
  modalIcon: {
    marginRight: 10,
  },
  modalOptionText: {
    fontSize: 16,
    color: "#333",
  },
  modalButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginTop: 10,
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});