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
  Image
} from "react-native";
import { useWorkspaceStore } from '../stores/workspaceStore'; // Import the hook
import { useTheme } from "../../ThemeContext";
import {lightTheme,darkTheme} from "../../styles/themes";
import { useNotificationStore } from '../stores/notificationsStore';
import {Heart,HeartOff} from "lucide-react-native";
import BoardCard from "../../components/BoardCard";
import NotificationToast from "../../components/NotificationToast";

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

  useEffect(() => {
    if (notifications.length > 0 && notifications[0].id !== prevNotificationId.current) {
      setToastMessage(notifications[0].text);
      setToastType(notifications[0].type);
      setToastVisible(true);
      prevNotificationId.current = notifications[0].id;
    }
  }, [notifications]);

  // Access store methods and state via the hook
  const { workspaces, getBoards, createBoard } = useWorkspaceStore();
  const { addNotification } = useNotificationStore();

  // Get selected workspace based on params or default to first workspace
  const workspaceId = params.workspaceId as string;
  const selectedWorkspace = workspaceId
    ? workspaces.find(ws => ws.id === workspaceId) || workspaces[0]
    : workspaces[0];

  // Load boards for selected workspace
  useEffect(() => {
    if (selectedWorkspace) {
      const fetchedBoards = getBoards(selectedWorkspace.id);
      setBoards(fetchedBoards);
      console.log('HomeScreen: Current boards state for workspace', selectedWorkspace.id, ':', JSON.stringify(fetchedBoards, null, 2));
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
    const newBoard = createBoard({
      title: boardTitle,
      workspaceId: selectedWorkspace.id,
      backgroundColor: "#ADD8E6",
      lists: [],
      isFavorite: false
    });
    setBoards(prev => [...prev, newBoard]);

    setRecents(prev => [
      { id: `recent-${Date.now()}`, message: `"${newBoard.title}" board created.`, timestamp: Date.now() },
      ...prev
    ]);

    await addNotification({
      type: "success", // Changed from "Board Created"
      text: `Board "${newBoard.title}" was created.`,
    });
    console.log("Notification added");
    
    setShowModal(false);
    setBoardTitle("");
    console.log('HomeScreen: Created new board:', JSON.stringify(newBoard, null, 2));
    router.push({
      k: "/boards/[id]",
      params: { id: newBoard.id, board: JSON.stringify(newBoard) }
    });
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
      setBoards(prev => {
        const newBoards = prev.filter(board => board.id !== boardToDelete);
        console.log('HomeScreen: Deleted board', boardToDelete, 'New boards:', JSON.stringify(newBoards, null, 2));
        return newBoards;
      });
      const deletedBoard = boards.find(b => b.id === boardToDelete);
      if (deletedBoard) {
        setRecents(prev => [
          { id: `recent-${Date.now()}`, message: `"${deletedBoard.title}" board deleted.`, timestamp: Date.now() },
          ...prev
        ]);
        await addNotification({
          type: "success", // Changed from "Board Deleted"
          text: `Board "${deletedBoard.title}" was deleted.`,
        });
      }
      setBoardToDelete(null);
      setLongPressedBoardId(null);
      setShowDeleteModal(false); // <-- Ensure modal closes
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
    id: "settings",
    title: "Settings",
    icon: "settings-outline",
    onPress: () => router.push("/settings"),
  },
];


  return (
  <View style={styles.mainpage}>

    {/* Quick Actions Container */}
    <View style={styles.quickActionsWrapper}>
  <Text style={styles.quickActionsHeading}>
    Welcome back 👋
  </Text>
  <Text style={styles.quickActionsSubheading}>
    What do you want to do today?
  </Text>

  <View style={styles.quickActionsGrid}>

        {quickActions.map((action) => {
          // Optional: Add border styles by action.id if you want different border colors
          let borderStyle = {};
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
            case "settings":
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
                color={theme === "dark" ? "white" : "#0B1F3A"} // or any color that contrasts well with light bg
              />

              <Text style={styles.quickActionText}>{action.title}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>

    {/* Boards Title */}
{boards.length > 0 && (
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
      contentContainerStyle={styles.scrollContent}
      data={boards}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
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
          showDelete={longPressedBoardId === item.id}
          onDelete={() => handleDeleteBoard(item.id)}
        />
      )}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          {/* <Image source={bee} style={{ width: 300, height: 300 }} /> */}
          <Text style={styles.emptyText}>No Boards</Text>
          <Text style={styles.emptySubText}>Create Your First Task Board</Text>
        </View>
      }
    />

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
       

        {boards.filter(board => board.isFavorite).length === 0 ? (
          <Text style={styles.favouriteemptyText}>No Favorite Boards</Text>
        ) : (
          boards
            .filter(board => board.isFavorite)
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
 