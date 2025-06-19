import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  Animated,
  Dimensions,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ImageBackground,
  Alert,
} from "react-native";

const PRIMARY_COLOR = "#0B1F3A";
const { width: SCREEN_WIDTH } = Dimensions.get("window");

// --- CardMenuModal defined inside the same file ---
function CardMenuModal({ visible, onClose, card }) {
  const [description, setDescription] = useState(card?.description || "");
  const [comment, setComment] = useState("");
 

  // Reset description when card changes
  useEffect(() => {
    setDescription(card?.description || "");
  }, [card]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.menuOverlay}>
        <BlurView style={StyleSheet.absoluteFill} intensity={80} tint="dark" />
        <View style={styles.menuContainer}>
          {/* Top Bar */}
          <View style={styles.menuTopBar}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
            <TouchableOpacity>
              <Ionicons name="ellipsis-vertical" size={28} color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Cover Button */}
            <TouchableOpacity style={styles.coverButton}>
              <Text style={styles.coverButtonText}>Cover</Text>
            </TouchableOpacity>

            {/* Activities Section */}
            <View style={styles.section}>
              <View style={styles.activitiesRow}>
                <Ionicons
                  name="ellipse-outline"
                  size={24}
                  color="#ccc"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.activitiesTitle}>Activities</Text>
              </View>
              <View style={styles.todoRow}>
                <View style={styles.todoBadge} />
                <View>
                  <Text style={styles.todoTitle}>Todos</Text>
                  <Text style={styles.todoSubtitle}>Todo list</Text>
                </View>
                <View style={{ flex: 1 }} />
                <TouchableOpacity>
                  <Text style={styles.moveText}>Move</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.section}>
              <View style={styles.quickActionsHeader}>
                <Text style={styles.quickActionsTitle}>Quick Actions</Text>
                <Ionicons name="chevron-up" size={22} color="#ccc" />
              </View>
              <View style={styles.quickActionsRow}>
                <TouchableOpacity
                  style={[
                    styles.quickActionButton,
                    { backgroundColor: "#1a2d1a" }
                  ]}
                >
                  <Ionicons name="checkbox-outline" size={22} color="#3CD6FF" />
                  <Text style={styles.quickActionText}>Add Checklist</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.quickActionButton,
                    { backgroundColor: "#1a2631" }
                  ]}
                >
                  <Ionicons name="attach-outline" size={22} color="#3CD6FF" />
                  <Text style={styles.quickActionText}>Add Attachment</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.quickActionsRow}>
                <TouchableOpacity
                  style={[
                    styles.quickActionButton,
                    { backgroundColor: "#221a2d" }
                  ]}
                >
                  <Ionicons
                    name="person-add-outline"
                    size={22}
                    color="#B37BFF"
                  />
                  <Text style={styles.quickActionText}>Members</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Description */}
            <View style={styles.section}>
              <View style={styles.descriptionRow}>
                <Ionicons
                  name="document-text-outline"
                  size={22}
                  color="#ccc"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.descriptionTitle}>
                  Add card description
                </Text>
              </View>
              <TextInput
                style={styles.descriptionInput}
                placeholder="Add a more detailed description..."
                placeholderTextColor="#888"
                value={description}
                onChangeText={setDescription}
                multiline
              />
            </View>

            {/* Labels, Members, Start Date */}
            <TouchableOpacity style={styles.menuRow}>
              <Ionicons
                name="pricetag-outline"
                size={22}
                color="#ccc"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.menuRowText}>Labels</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuRow}>
              <Ionicons
                name="person-outline"
                size={22}
                color="#ccc"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.menuRowText}>Members</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuRow}>
              <Ionicons
                name="calendar-outline"
                size={22}
                color="#ccc"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.menuRowText}>Start date</Text>
            </TouchableOpacity>

            {/* Add Comment */}
            <View style={styles.commentSection}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>RN</Text>
              </View>
              <TextInput
                style={styles.commentInput}
                placeholder="Add comment"
                placeholderTextColor="#888"
                value={comment}
                onChangeText={setComment}
              />
              <TouchableOpacity>
                <Ionicons name="send" size={22} color="#3CD6FF" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// --- Main BoardDetails component ---
export default function BoardDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const floatAnim = useRef(new Animated.Value(0)).current;
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [longPressedListId, setLongPressedListId] = useState<string | null>(null);
  const [longPressedCardId, setLongPressedCardId] = useState<{ listId: string; cardIndex: number } | null>(null);
  const [listToDelete, setListToDelete] = useState<string | null>(null);
  const [cardToDelete, setCardToDelete] = useState<{ listId: string; cardIndex: number } | null>(null);
 

  // Modal state for card menu
  const [isCardMenuVisible, setCardMenuVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
   const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [taskToDelete, settaskToDelete] = useState<string | null>(null);
    const [longPressedCardIndex, setLongPressedCardIndex] = useState<string | null>(null);
  // Parse the board param
  let board = null;
try {
  console.log('BoardDetails: Raw params.board:', params.board);
  if (typeof params.board === 'string' && params.board) {
    board = JSON.parse(params.board);
    if (board && !board.backgroundColor && !board.backgroundImage) {
      board.backgroundColor = "#ADD8E6";
    }
  } else {
    console.warn('BoardDetails: params.board is invalid:', params.board);
  }
} catch (e) {
  console.error("BoardDetails: Failed to parse board:", e);
}

  const [lists, setLists] = useState(board?.lists || []);
  useEffect(() => {
  console.log('BoardDetails: Received board:', JSON.stringify(board, null, 2));
}, [board?.id, board?.backgroundImage]);

  useEffect(() => {
    setLists(board?.lists || []);
  }, [board?.id]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 1000,
          useNativeDriver: true
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true
        })
      ])
    ).start();
  }, []);

  const navigateBack = () => {
    const updatedBoard = { ...board, lists };
    router.push({
      pathname: "/(tabs)",
      params: { board: JSON.stringify(updatedBoard) }
    });
  };
  const handleDeleteList = (listId) => {
  const updated = lists.filter((list) => list.id !== listId);
  setLists(updated);
  setLongPressedListId(null);
};

const handleDeleteCard = (listIndex, cardIndex) => {
  const updated = [...lists];
  updated[listIndex].cards.splice(cardIndex, 1);
  setLists(updated);
  setLongPressedCardId(null);
};

 
  return (
    <ImageBackground
     key={`${board?.id}-${board?.backgroundImage}`} // Ensure re-render
  source={board?.backgroundImage ? { uri: board.backgroundImage } : undefined}
  style={[
    styles.container,
    { backgroundColor: board?.backgroundImage ? 'transparent' : (board?.backgroundColor || '#ADD8E6') }
  ]}
  resizeMode="cover"
  onError={(e) => console.error('BoardDetails: ImageBackground error:', e.nativeEvent)}
    >
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={navigateBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowTitleModal(true)}
          style={styles.titleContainer}
        >
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {board?.title ?? "Board"}
          </Text>
        </TouchableOpacity>
        <View style={styles.iconContainer}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="search-outline" size={28} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={28} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              router.push({
                pathname: "/boards/boardScreenMenu",
                params: { board: JSON.stringify(board) }
              });
            }}
          >
            <Ionicons name="ellipsis-vertical" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
          <TouchableOpacity
            style={styles.createlist}
            onPress={() => {
              setLists((prev) => [
                ...prev,
                {
                  id: Date.now().toString(),
                  title: "",
                  cards: [],
                  editingTitle: true,
                  newCardText: ""
                }
              ]);
            }}
          >
            <Ionicons name="add" size={25} color="white" />
            <Text style={{ color: "white" }}>Create List</Text>
          </TouchableOpacity>
        </Animated.View>
<FlatList
  data={lists}
  keyExtractor={(item) => item.id}
  horizontal
  showsHorizontalScrollIndicator={false}
  renderItem={({ item: list, index: listIndex }) => (
    <TouchableOpacity
      style={styles.listCard}
      onLongPress={() => handleLongPressList(list.id)}
      onPress={() => {
        setLongPressedListId(null);
        setLongPressedCardId(null);
      }}
      activeOpacity={1}
    >
      {list.editingTitle ? (
        <TextInput
          value={list.title}
          placeholder="Enter list title"
          onChangeText={(text) => {
            const updated = [...lists];
            updated[listIndex].title = text;
            setLists(updated);
          }}
          onSubmitEditing={() => {
            const updated = [...lists];
            updated[listIndex].editingTitle = false;
            setLists(updated);
          }}
          style={styles.listTitleInput}
        />
      ) : (
        <TouchableOpacity
          onPress={() => {
            const updated = [...lists];
            updated[listIndex].editingTitle = true;
            setLists(updated);
          }}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Text style={styles.listTitle}>
            {list.title || "Untitled List"}
          </Text>
          {longPressedListId === list.id && (
            <TouchableOpacity
              onPress={() => handleDeleteList(list.id)}
              style={styles.deleteButton}
            >
              <Ionicons name="trash-outline" size={20} color="red" />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      )}

      <FlatList
        data={list.cards}
        keyExtractor={(card, i) => i.toString()}
        renderItem={({ item: card, index: cardIndex }) => (
          <TouchableOpacity
            onLongPress={() => setLongPressedCardId({ listId: list.id, cardIndex })}
            onPress={() => {
              const updated = [...lists];
              updated[listIndex].cards[cardIndex].completed =
                !updated[listIndex].cards[cardIndex].completed;
              setLists(updated);
              setLongPressedCardId(null);
            }}
            style={styles.card}
          >
            {card.completed ? (
              <Ionicons
                name="checkmark-circle"
                size={24}
                color="#2ecc71"
              />
            ) : (
              <Ionicons
                name="ellipse-outline"
                size={24}
                color="#555"
              />
            )}

            <Text
              style={[
                styles.cardText,
                card.completed && styles.completedText,
              ]}
            >
              {card.text}
            </Text>

            {longPressedCardId?.listId === list.id && longPressedCardId?.cardIndex === cardIndex ? (
  <TouchableOpacity
    onPress={() => handleDeleteCard(listIndex, cardIndex)}
    style={{ marginLeft: "auto" }}
  >
    <Ionicons name="trash-outline" size={24} color="red" />
  </TouchableOpacity>
) : (
  <TouchableOpacity
    onPress={() => {
      setSelectedCard(card);
      setCardMenuVisible(true);
    }}
    style={{ marginLeft: "auto" }}
  >
    <Ionicons name="ellipsis-vertical-sharp" size={30} color="white" />
  </TouchableOpacity>
)}

          </TouchableOpacity>
        )}
      />

      <TextInput
        placeholder="+ Add a card..."
        style={styles.cardInput}
        value={list.newCardText}
        onChangeText={(text) => {
          const updated = [...lists];
          updated[listIndex].newCardText = text;
          setLists(updated);
        }}
        onSubmitEditing={() => {
          const updated = [...lists];
          const text = updated[listIndex].newCardText.trim();
          if (text) {
            updated[listIndex].cards.push({ text, completed: false });
            updated[listIndex].newCardText = "";
            setLists(updated);
          }
        }}
      />
    </TouchableOpacity>
  )}
/>

      </View>

      {/* Board Title Modal */}
      {showTitleModal && (
        <Modal visible={showTitleModal} transparent animationType="fade">
          <View style={styles.modalBackground}>
            <BlurView
              style={StyleSheet.absoluteFill}
              intensity={100}
              tint="dark"
            />
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Board Title</Text>
              <Text style={styles.modalText}>{board?.title ?? "Board"}</Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowTitleModal(false)}
              >
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Card Menu Modal */}
      <CardMenuModal
        visible={isCardMenuVisible}
        onClose={() => setCardMenuVisible(false)}
        card={selectedCard}
      />
    </ImageBackground>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: "black"
  },
  topBar: {
    height: 110,
    backgroundColor: PRIMARY_COLOR,
    paddingTop: 40,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    bottom: 20
  },
  backButton: {
    padding: 10
  },
  titleContainer: {
    flex: 1,
    maxWidth: SCREEN_WIDTH * 0.4,
    marginHorizontal: 10,
    justifyContent: "center"
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    textAlign: "left"
  },
  iconContainer: {
    flexDirection: "row",
    position: "absolute",
    right: -5,
    top: 50,
    alignItems: "center"
  },
  iconButton: {
    padding: 10
  },
  content: {
    flex: 1,
    alignItems: "center"
  },
  createlist: {
    backgroundColor: "#09143c",
    width: 160,
    height: 45,
    flexDirection: "row",
    borderRadius: 25,
    borderColor: "#722f37",
    borderWidth: 1.5,
    alignItems: "center",
    paddingHorizontal: 20,
    elevation: 8,
    marginVertical: 10
  },
  listCard: {
    backgroundColor: "#6F8FAF",
    alignItems: "center",
    marginLeft: 15,
    width: 270,
    borderRadius: 30,
    height: 400,
    paddingTop: 10,
    marginTop: 20,
    borderColor: "white",
    borderWidth: 2
  },
  listTitleInput: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20
  },
  listTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 15
  },
  card: {
    backgroundColor: "#0e1d3e",
    marginHorizontal: 10,
    textAlign: "left",
    width: 250,
    height: 50,
    marginVertical: 5,
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: "white",
    flexDirection: "row",
    alignItems: "center"
  },
  cardInput: {
    borderColor: "white",
    borderWidth: 1,
    width: 270,
    alignItems: "center",
    textAlign: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    color: "white",
    paddingVertical: 6
  },
  cardText: {
    fontSize: 16,
    color: "white",
    fontWeight: "500",
    paddingLeft: 10
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#888"
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center"
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
    minWidth: 300,
    alignItems: "center"
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10
  },
  modalText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
    textAlign: "center"
  },
  modalButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16
  },

  // CardMenuModal styles
  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end"
  },
  menuContainer: {
    backgroundColor: "#181A20",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 10,
    paddingHorizontal: 18,
    paddingBottom: 24,
    minHeight: "85%",
    maxHeight: "95%",
    elevation: 12
  },
  menuTopBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12
  },
  coverButton: {
    backgroundColor: "#23263A",
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 14
  },
  coverButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15
  },
  section: {
    backgroundColor: "#22242d",
    borderRadius: 14,
    padding: 14,
    marginBottom: 18
  },
  activitiesRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10
  },
  activitiesTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20
  },
  todoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 4
  },
  todoBadge: {
    width: 32,
    height: 24,
    backgroundColor: "#3CD6FF",
    borderRadius: 6,
    marginRight: 10
  },
  todoTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  },
  todoSubtitle: {
    color: "#aaa",
    fontSize: 13
  },
  moveText: {
    color: "#3CD6FF",
    fontWeight: "bold",
    fontSize: 15
  },
  quickActionsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8
  },
  quickActionsTitle: {
    color: "#aaa",
    fontWeight: "bold",
    fontSize: 14,
    flex: 1
  },
  quickActionsRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 8
  },
  quickActionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginRight: 10
  },
  quickActionText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
    fontSize: 15
  },
  descriptionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6
  },
  descriptionTitle: {
    color: "#aaa",
    fontWeight: "bold",
    fontSize: 15
  },
  descriptionInput: {
    color: "#fff",
    backgroundColor: "#23263A",
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
    fontSize: 15,
    minHeight: 48
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#23263A"
  },
  menuRowText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500"
  },
  commentSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#23263A",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#3CD6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10
  },
  avatarText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15
  },
  commentInput: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
    marginRight: 8
  }
});
