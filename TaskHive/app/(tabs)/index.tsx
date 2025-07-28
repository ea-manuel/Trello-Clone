import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useEffect, useRef } from "react";
import bee from '../../assets/images/bee.png';
import {
  Button,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator
} from "react-native";
import { useWorkspaceStore } from '../stores/workspaceStore'; // Import the hook
import { useTheme } from "../../ThemeContext";
import {lightTheme,darkTheme} from "../../styles/themes";
import { useNotificationStore } from '../stores/notificationsStore';
import {Heart,HeartOff} from "lucide-react-native";
import BoardCard from "../../components/BoardCard";
import NotificationToast from "../../components/NotificationToast";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BackHandler } from 'react-native';
import { useOfflineBoardsStore } from "../stores/offlineBoardsStore";

export default function HomeScreen() {
  const {theme,toggleTheme}=useTheme();
  const styles = theme === "dark" ? darkTheme : lightTheme;
  const router = useRouter();
  const params = useLocalSearchParams();
  const [showModal, setShowModal] = useState(false);
  type Board = {
    id: string;
    title: string;
    isFavorite: boolean;
    workspaceId: string;
    backgroundColor: string;
    lists: any[]; // Replace 'any' with your actual list type if available
  };
  
  const [boards, setBoards] = useState<Board[]>([]);
  const [boardTitle, setBoardTitle] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [boardToDelete, setBoardToDelete] = useState<string | null>(null);
  const [longPressedBoardId, setLongPressedBoardId] = useState<string | null>(null);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [showRecentsModal, setShowRecentsModal] = useState(false);
  const [recents, setRecents] = useState<{ id: string, message: string, timestamp: number }[]>([]);
  const { notifications } = useNotificationStore();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("info");
  const prevNotificationId = useRef<string | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [inviteSent, setInviteSent] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const { addBoard: addOfflineBoard, removeBoard: removeOfflineBoard, boards: offlineBoards } = useOfflineBoardsStore();
  const [downloadingBoardId, setDownloadingBoardId] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showFullImage, setShowFullImage] = useState(false);
  const [creatingDefault, setCreatingDefault] = useState(false);

  // Load profile image from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      const uri = await AsyncStorage.getItem("profileImageUri");
      if (uri) setProfileImage(uri);
    })();
  }, []);

  // Prevent back button from navigating to previous app states
  useEffect(() => {
    const backAction = () => {
      // Optionally, show a confirmation or just prevent navigation
      // Returning true disables default back behavior
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (notifications.length > 0 && notifications[0].id !== prevNotificationId.current) {
      setToastMessage(notifications[0].text);
      setToastType(notifications[0].type);
      setToastVisible(true);
      prevNotificationId.current = notifications[0].id;
    }
  }, [notifications]);

  // Access store methods and state via the hook
  const { workspaces, getBoards, createBoard, createWorkspace } = useWorkspaceStore();
  const { addNotification } = useNotificationStore();
  const getUserWorkspaces = useWorkspaceStore((s) => s.getUserWorkspaces);

  useEffect(() => {
    (async () => {
      await getUserWorkspaces();
    })();
  }, []);

  // Automatically create a default workspace if none exist
  useEffect(() => {
    if (workspaces && workspaces.length === 0) {
      setCreatingDefault(true);
      createWorkspace({ name: "Default Workspace" })
        .catch(() => {})
        .finally(() => setCreatingDefault(false));
    }
  }, [workspaces]);

  // Get selected workspace based on params or default to first workspace
  const workspaceId = params.workspaceId as string;
  const selectedWorkspace = workspaceId
    ? workspaces.find(ws => ws.id === workspaceId) || workspaces[0]
    : workspaces[0];

  // Load boards for selected workspace (async)
  useEffect(() => {
    if (selectedWorkspace) {
      (async () => {
        const fetchedBoards = await getBoards(selectedWorkspace.id);
        setBoards(fetchedBoards);
        console.log('HomeScreen: Current boards state for workspace', selectedWorkspace.id, ':', JSON.stringify(fetchedBoards, null, 2));
      })();
    }
  }, [selectedWorkspace]);

  // Handle updated board from BoardDetails
  useEffect(() => {
    if (params.board) {
      try {
        const updatedBoard = JSON.parse(params.board as string);
        console.log('HomeScreen: Received updated board:', JSON.stringify(updatedBoard, null, 2));
        setBoards(prev => {
          const newBoards = prev.map(board =>
            board.id === updatedBoard.id ? { ...board, ...updatedBoard } : board
          );
          console.log('HomeScreen: Updated boards state:', JSON.stringify(newBoards, null, 2));
          return newBoards;
        });
      } catch (e) {
        console.error("HomeScreen: Failed to parse updated board:", e);
      }
    }
  }, [params.board]);

  const handleCreateBoard = async () => {
    if (!boardTitle.trim()) return;
    const newBoard = await createBoard({
      title: boardTitle,
      workspaceId: selectedWorkspace.id
    });
    const updatedBoards = await getBoards(selectedWorkspace.id);
    setBoards(updatedBoards);
    setRecents(prev => [
      { id: `recent-${Date.now()}`, message: `"${newBoard.title}" board created.`, timestamp: Date.now() },
      ...prev
    ]);
    addNotification({
      type: "success",
      text: `Board "${newBoard.title}" was created.`,
    });
    setShowModal(false);
    setBoardTitle("");
  };

  const handleLongPress = (boardId: string) => {
    setLongPressedBoardId(boardId);
    console.log('HomeScreen: Long pressed board:', boardId);
  };

  const handleDeleteBoard = (boardId: string) => {
    setBoardToDelete(boardId);
    setShowDeleteModal(true);
  };

  const confirmDeleteBoard = async () => {
    if (boardToDelete !== null) {
      await deleteBoard(boardToDelete);
      const updatedBoards = await getBoards(selectedWorkspace.id);
      setBoards(updatedBoards);
      const deletedBoard = boards.find(b => b.id === boardToDelete);
      if (deletedBoard) {
        setRecents(prev => [
          { id: `recent-${Date.now()}`, message: `"${deletedBoard.title}" board deleted.`, timestamp: Date.now() },
          ...prev
        ]);
        await addNotification({
          type: "success",
          text: `Board "${deletedBoard.title}" was deleted.`,
        });
      }
      setBoardToDelete(null);
      setLongPressedBoardId(null);
      setShowDeleteModal(false);
    }
  };

  async function handleToggleFavorite(id: string): Promise<void> {
    setBoards(prev =>
      prev.map(board =>
        board.id === id
          ? { ...board, isFavorite: !board.isFavorite }
          : board
      )
    );
    const toggledBoard = boards.find(board => board.id === id);
    if (toggledBoard) {
      await addNotification({
        type: toggledBoard.isFavorite ? "info" : "success",
        text: toggledBoard.isFavorite
          ? `Board "${toggledBoard.title}" removed from favorites.`
          : `Board "${toggledBoard.title}" added to favorites.`,
      });
    }
  }

  // Helper to check if a board is offline
  const isBoardOffline = (id: string) => offlineBoards.some(b => b.id === id);

  // Handle toggle switch for offline
  const handleToggleOffline = async (board: Board, value: boolean) => {
    if (value) {
      setDownloadingBoardId(board.id);
      // Simulate download
      setTimeout(async () => {
        addOfflineBoard({ id: board.id, title: board.title });
        setDownloadingBoardId(null);
        await addNotification({
          type: "success",
          text: `Board "${board.title}" has been added to offline boards.`,
        });
      }, 1000);
    } else {
      removeOfflineBoard(board.id);
    }
  };

  const quickActions = [
  {
    id: "createBoard",
    title: "Create Board",
    icon: "add-circle-outline",
    onPress: () => setShowModal(true),
  },
  {
    id: "favorites",
    title: "Favorites",
    icon: "heart-outline",
    onPress: () => setShowFavoritesModal(true),
  },
  {
    id: "recent",
    title: "Recents",
    icon: "time-outline",
    onPress: () => setShowRecentsModal(true),
  },
  {
    id: "invite",
    title: "Invite",
    icon: "person-add-outline",
    onPress: () => setShowInviteModal(true),
    borderStyle: styles.borderSettings, // Use the same border as Settings
  },
];

  // Helper to determine if FlatList is at bottom
  const handleListScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    const isAtBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    setShowScrollToBottom(!isAtBottom && contentSize.height > layoutMeasurement.height + 10);
  };


  return (
  <View style={styles.mainpage}>

    {/* Quick Actions Container */}
    <View style={styles.quickActionsWrapper}>
        {/* Profile + Welcome Block */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: 18,
          paddingVertical: 18,
          paddingHorizontal: 20,
          marginBottom: 8, // reduced from 18
          marginTop: 2,    // reduced from 8
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
          elevation: 3,
        }}>
          <TouchableOpacity onPress={() => profileImage && setShowFullImage(true)}>
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={{ width: 64, height: 64, borderRadius: 32, marginRight: 18, borderWidth: 2, borderColor: '#339dff', backgroundColor: '#e6e6e6' }}
              />
            ) : (
              <Ionicons name="person-circle" size={64} color={theme === "dark" ? "#ffffff" : "#0B1F3A"} style={{ marginRight: 18 }} />
            )}
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 26, color: theme === 'dark' ? '#fff' : '#22345A', marginBottom: 2 }}>Welcome back 👋</Text>
            <Text style={{ fontSize: 19, color: theme === 'dark' ? '#BFC9D6' : '#555' }}>What do you want to do today?</Text>
          </View>
        </View>
        {/* Full Image Modal */}
        <Modal visible={showFullImage} transparent animationType="fade">
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.9)", justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity style={{ position: "absolute", top: 40, right: 30, zIndex: 2 }} onPress={() => setShowFullImage(false)}>
              <Ionicons name="close" size={36} color="#fff" />
            </TouchableOpacity>
            {profileImage && (
              <Image
                source={{ uri: profileImage }}
                style={{ width: 320, height: 320, borderRadius: 16, borderWidth: 2, borderColor: "#fff" }}
                resizeMode="contain"
              />
            )}
          </View>
        </Modal>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action) => {
            let borderStyle = action.borderStyle || {};
            switch (action.id) {
              case "createBoard":
                borderStyle = styles.borderCreateBoard;
                break;
              case "favorites":
                borderStyle = styles.borderFavorites;
                break;
              case "recent":
                borderStyle = styles.borderRecent;
                break;
              case "invite":
                borderStyle = styles.borderSettings;
                break;
            }
            return (
              <TouchableOpacity
                key={action.id}
                onPress={action.onPress}
                style={[styles.quickActionCard, borderStyle]}
                activeOpacity={0.85}
              >
                <Ionicons
                  name={action.icon}
                  size={36}
                  color={theme === "dark" ? "white" : "#0B1F3A"}
                />
                <Text style={styles.quickActionText}>{action.title}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

    {/* Boards Title */}
{Array.isArray(boards) && boards.length > 0 && (
  <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
    <Text
      style={{
        fontWeight: "bold",
        fontSize: 24,
        color: theme === "dark" ? "white" : "#333",
      }}
    >
      Boards
    </Text>
  </View>
)}


    {/* Boards List */}
    <FlatList
      ref={flatListRef}
      contentContainerStyle={styles.scrollContent}
      data={Array.isArray(boards) ? boards : []}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }: { item: Board }) => {
        const showToggle = longPressedBoardId === item.id;
        const downloading = downloadingBoardId === item.id;
        return (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <BoardCard
              id={item.id}
              title={item.title}
              isFavorite={item.isFavorite}
              onPress={() => {
                setLongPressedBoardId(null);
                router.push({
                  pathname: `/boards/${item.id}`,
                  params: { board: JSON.stringify(item) }
                });
              }}
              onToggleFavorite={() => handleToggleFavorite(item.id)}
              onLongPress={() => handleLongPress(item.id)}
              showToggle={showToggle}
              toggleValue={isBoardOffline(item.id)}
              onToggleSwitch={(value) => handleToggleOffline(item, value)}
              showDelete={showToggle}
              onDelete={() => handleDeleteBoard(item.id)}
              backgroundColor={item.backgroundColor}
            />
            {showToggle && downloading && (
              <ActivityIndicator size="small" color="#007CF0" style={{ marginLeft: 8 }} />
            )}
          </View>
        );
      }}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          {/* <Image source={bee} style={{ width: 300, height: 300 }} /> */}
          <Text style={styles.emptyText}>No Boards</Text>
          <Text style={styles.emptySubText}>Create Your First Task Board</Text>
        </View>
      }
      onScroll={handleListScroll}
      scrollEventThrottle={16}
    />

    {/* Floating Scroll to Bottom Button */}
    {showScrollToBottom && (
      <TouchableOpacity
        style={{
          position: 'absolute',
          right: 24,
          bottom: 32,
          backgroundColor: '#0B1F3A',
          borderRadius: 24,
          padding: 12,
          elevation: 8,
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 2 },
          zIndex: 100,
        }}
        onPress={() => flatListRef.current?.scrollToEnd({ animated: true })}
        activeOpacity={0.85}
      >
        <Ionicons name="arrow-down" size={28} color="#fff" />
      </TouchableOpacity>
    )}

      {showModal && (
        <Modal visible={showModal} transparent animationType="slide">
          <View style={styles.modalBackground}>
            <BlurView style={StyleSheet.absoluteFill} intensity={100} tint="dark" />
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Enter Board Title</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Sprint Tasks"
                value={boardTitle}
                onChangeText={setBoardTitle}
              />
              <View style={styles.modalButtons}>
                <View style={styles.createButton}>
                  <Button
                    title="Create"
                    onPress={handleCreateBoard}
                    color="#0B1F3A"
                  />
                </View>
                <View style={styles.cancelButton}>
                  <Button
                    title="Cancel"
                    onPress={() => setShowModal(false)}
                    color="#ADD8E6"
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {showDeleteModal && (
        <Modal visible={showDeleteModal} transparent animationType="fade">
          <View style={styles.modalBackground}>
            <BlurView style={StyleSheet.absoluteFill} intensity={100} tint="dark" />
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Delete Board</Text>
              <Text style={styles.modalText}>
                Are you sure you want to delete this board? This action cannot be undone.
              </Text>
              <View style={styles.modalButtons}>
                <View style={styles.deleteConfirmButton}>
                  <Button
                    title="Delete"
                    onPress={confirmDeleteBoard}
                    color="red"
                  />
                </View>
                <View style={styles.cancelButton}>
                  <Button
                    title="Cancel"
                    onPress={() => {
                      setShowDeleteModal(false);
                      setBoardToDelete(null);
                    }}
                    color="#ADD8E6"
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}
      {showFavoritesModal && (
  <Modal visible={showFavoritesModal} transparent animationType="slide">
    <View style={styles.modalBackground}>
      <BlurView style={StyleSheet.absoluteFill} intensity={100} tint="dark" />
      <View style={styles.favouritemodalView}>
         <View style={styles.favouriteheader}>
          <TouchableOpacity onPress={() => setShowFavoritesModal(false)}> 
            <Ionicons name="arrow-back"color="white" size={28} />
          </TouchableOpacity>
                 <Text style={styles.favouritemodalTitle}>Favorite Boards</Text>
          </View>
       

        {Array.isArray(boards) && boards.filter(board => board.isFavorite).length === 0 ? (
          <Text style={styles.favouriteemptyText}>No Favorite Boards</Text>
        ) : (
          (Array.isArray(boards) ? boards : []).filter(board => board.isFavorite)
            .map(board => (
              <BoardCard
                key={board.id}
                id={board.id}
                title={board.title}
                isFavorite={board.isFavorite}
                onPress={() => {
                  setShowFavoritesModal(false);
                  router.push({
                    pathname: `/boards/${board.id}`,
                    params: { board: JSON.stringify(board) },
                  });
                }}
                onToggleFavorite={() => handleToggleFavorite(board.id)}
              />
            ))
        )}

        
      </View>
    </View>
  </Modal>
)}

{/* Recents Modal */}
<Modal visible={showRecentsModal} transparent animationType="slide">
  <View style={styles.modalBackground}>
    <BlurView style={StyleSheet.absoluteFill} intensity={100} tint="dark" />
    <View style={styles.favouritemodalView}>
      <View style={styles.favouriteheader}>
        <TouchableOpacity onPress={() => setShowRecentsModal(false)}>
          <Ionicons name="arrow-back" color="white" size={28} />
        </TouchableOpacity>
        <Text style={styles.favouritemodalTitle}>Recents</Text>
      </View>
      {recents.length === 0 ? (
        <Text style={styles.favouriteemptyText}>No recent activities</Text>
      ) : (
        recents.map((item) => (
          <View key={item.id} style={styles.recentCard}>
            <Text style={styles.recentCardText}>{item.message}</Text>
            <Text style={styles.recentCardTimestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
          </View>
        ))
      )}
    </View>
  </View>
</Modal>

<NotificationToast
  visible={toastVisible}
  message={toastMessage}
  type={toastType}
  onHide={() => setToastVisible(false)}
/>

{/* Invite Collaborators Modal */}
<Modal
  visible={showInviteModal}
  transparent
  animationType="slide"
  onRequestClose={() => setShowInviteModal(false)}
>
  <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' }}>
    <View style={{
      backgroundColor: theme === 'dark' ? '#181A2A' : '#fff',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 24,
      minHeight: 320,
      maxHeight: 400,
      shadowColor: '#000',
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 8,
    }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', color: theme === 'dark' ? '#fff' : '#22345A', marginBottom: 18 }}>Invite Collaborators</Text>
      {inviteSent ? (
        <View style={{ alignItems: 'center', marginTop: 24 }}>
          <Text style={{ fontSize: 16, color: theme === 'dark' ? '#BFC9D6' : '#333', marginBottom: 16, textAlign: 'center' }}>
            Invitation sent to {inviteEmail}!
          </Text>
          {/* Removed the 'Click here to accept' button from the modal */}
          <TouchableOpacity onPress={() => { setShowInviteModal(false); setInviteSent(false); setInviteEmail(""); }} style={{ marginTop: 10 }}>
            <Text style={{ color: theme === 'dark' ? '#2C8CFF' : '#0B1F3A', fontWeight: 'bold', fontSize: 16 }}>Close</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={{ fontSize: 16, color: theme === 'dark' ? '#BFC9D6' : '#333', marginBottom: 8 }}>Enter email address:</Text>
          <TextInput
            style={{
              backgroundColor: theme === 'dark' ? '#23253A' : '#f4f6fa',
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
              color: theme === 'dark' ? '#fff' : '#22345A',
              borderWidth: 1,
              borderColor: inviteError ? '#E74C3C' : (theme === 'dark' ? '#2C8CFF' : '#B3B3B3'),
              marginBottom: 8,
            }}
            placeholder="user@email.com"
            placeholderTextColor={theme === 'dark' ? '#BFC9D6' : '#888'}
            value={inviteEmail}
            onChangeText={text => { setInviteEmail(text); setInviteError(""); }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {inviteError ? <Text style={{ color: '#E74C3C', marginBottom: 8 }}>{inviteError}</Text> : null}
          <TouchableOpacity
            style={{
              backgroundColor: theme === 'dark' ? '#2C8CFF' : '#0B1F3A',
              borderRadius: 8,
              paddingVertical: 12,
              alignItems: 'center',
              marginTop: 8,
              opacity: inviteLoading ? 0.7 : 1,
            }}
            disabled={inviteLoading}
            onPress={async () => {
              // Simple email validation
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!inviteEmail.trim()) {
                setInviteError('Please enter an email address.');
                return;
              }
              if (!emailRegex.test(inviteEmail.trim())) {
                setInviteError('Please enter a valid email address.');
                return;
              }
              setInviteLoading(true);
              setInviteError("");
              try {
                const token = await AsyncStorage.getItem('authToken');
                const inviter = 'immajacobs2003@gmail.com'; // TODO: Replace with actual user email if available
                const url = 'http://10.80.33.203:8080/api/invite';
                const headers = {
                  Authorization: `Bearer ${token}`,
                };
                const body = {
                  email: inviteEmail.trim(),
                  inviter,
                  workspaceName: selectedWorkspace?.name || 'Workspace',
                };
                console.log('Invite token:', token);
                console.log('Invite URL:', url);
                console.log('Invite headers:', headers);
                console.log('Invite body:', body);
                const response = await axios.post(url, body, { headers });
                console.log('Invite response:', response);
                if (response.status === 200) {
                  setInviteSent(true);
                } else {
                  setInviteError('Failed to send invite. Please try again.');
                }
              } catch (err) {
                if (err.response) {
                  // Server responded with a status code out of 2xx
                  console.log('Invite error response:', err.response.data);
                  console.log('Invite error status:', err.response.status);
                  setInviteError(
                    err.response.data?.message ||
                    'Failed to send invite. Please try again.'
                  );
                } else if (err.request) {
                  // Request was made but no response received
                  console.log('Invite error request:', err.request);
                  setInviteError('No response from server.');
                } else {
                  // Something else happened
                  console.log('Invite error:', err.message);
                  setInviteError('Failed to send invite. Please try again.');
                }
              } finally {
                setInviteLoading(false);
              }
            }}
          >
            {inviteLoading ? (
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Sending...</Text>
            ) : (
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Invite</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowInviteModal(false)} style={{ marginTop: 10 }}>
            <Text style={{ color: theme === 'dark' ? '#2C8CFF' : '#0B1F3A', fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  </View>
</Modal>

      {/* <View style={styles.createBoardButton}>
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          style={styles.button}
          activeOpacity={0.8}
        >
          <View style={styles.buttonContent}>
            <Ionicons name="add" size={20} color="white" />
            <Text style={styles.buttonText}>Create Board</Text>
          </View>
        </TouchableOpacity>
      </View> */}
    </View>
  );
}
 