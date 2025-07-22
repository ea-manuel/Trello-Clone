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
  TextStyle,
} from "react-native";
import { useTheme } from "../../ThemeContext";
import { lightTheme, darkTheme } from "../../styles/themes";

const PRIMARY_COLOR = "#0B1F3A";
const { width: SCREEN_WIDTH } = Dimensions.get("window");

// --- CardMenuModal defined inside the same file ---
function CardMenuModal({ visible, onClose, card, styles }: { visible: boolean; onClose: () => void; card: any; styles: any }) {
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
      <View style={styles.CardMenuModalmenuOverlay as any}>
        <BlurView style={StyleSheet.absoluteFill} intensity={80} tint="dark" />
        <View style={styles.CardMenuModalmenuContainer as any}>
          {/* Top Bar */}
          <View style={styles.CardMenuModalmenuTopBar as any}>
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
            <TouchableOpacity style={styles.CardMenuModalcoverButton as any}>
              <Text style={styles.CardMenuModalcoverButtonText as any}>Cover</Text>
            </TouchableOpacity>

            {/* Activities Section */}
            <View style={styles.CardMenuModalsection as any}>
              <View style={styles.CardMenuModalactivitiesRow as any}>
                <Ionicons
                  name="ellipse-outline"
                  size={24}
                  color="#ccc"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.CardMenuModalactivitiesTitle as any}>Activities</Text>
              </View>
              <View style={styles.CardMenuModaltodoRow as any}>
                <View style={styles.CardMenuModaltodoBadge as any} />
                <View>
                  <Text style={styles.CardMenuModaltodoTitle as any}>Todos</Text>
                  <Text style={styles.CardMenuModaltodoSubtitle as any}>Todo list</Text>
                </View>
                <View style={{ flex: 1 }} />
                <TouchableOpacity>
                  <Text style={styles.CardMenuModalmoveText as any}>Move</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.CardMenuModalsection as any}>
              <View style={styles.CardMenuModalquickActionsHeader as any}>
                <Text style={styles.CardMenuModalquickActionsTitle as any}>Quick Actions</Text>
                <Ionicons name="chevron-up" size={22} color="#ccc" />
              </View>
              <View style={styles.CardMenuModalquickActionsRow as any}>
                <TouchableOpacity
                  style={[styles.CardMenuModalquickActionButton as any, { backgroundColor: "#1a2d1a" }]}
                >
                  <Ionicons name="checkbox-outline" size={22} color="#3CD6FF" />
                  <Text style={styles.CardMenuModalquickActionText as any}>Add Checklist</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.CardMenuModalquickActionButton as any, { backgroundColor: "#1a2631" }]}
                >
                  <Ionicons name="attach-outline" size={22} color="#3CD6FF" />
                  <Text style={styles.CardMenuModalquickActionText as any}>Add Attachment</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.CardMenuModalquickActionsRow as any}>
                <TouchableOpacity
                  style={[styles.CardMenuModalquickActionButton as any, { backgroundColor: "#221a2d" }]}
                >
                  <Ionicons
                    name="person-add-outline"
                    size={22}
                    color="#B37BFF"
                  />
                  <Text style={styles.CardMenuModalquickActionText as any}>Members</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Description */}
            <View style={styles.CardMenuModalsection as any}>
              <View style={styles.CardMenuModaldescriptionRow as any}>
                <Ionicons
                  name="document-text-outline"
                  size={22}
                  color="#ccc"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.CardMenuModaldescriptionTitle as any}>
                  Add card description
                </Text>
              </View>
              <TextInput
                style={styles.CardMenuModaldescriptionInput as any}
                placeholder="Add a more detailed description..."
                placeholderTextColor="#888"
                value={description}
                onChangeText={setDescription}
                multiline
              />
            </View>

            {/* Labels, Members, Start Date */}
            <TouchableOpacity style={styles.CardMenuModalmenuRow as any}>
              <Ionicons
                name="pricetag-outline"
                size={22}
                color="#ccc"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.CardMenuModalmenuRowText as any}>Labels</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.CardMenuModalmenuRow as any}>
              <Ionicons
                name="person-outline"
                size={22}
                color="#ccc"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.CardMenuModalmenuRowText as any}>Members</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.CardMenuModalmenuRow as any}>
              <Ionicons
                name="calendar-outline"
                size={22}
                color="#ccc"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.CardMenuModalmenuRowText as any}>Start date</Text>
            </TouchableOpacity>

            {/* Add Comment */}
            <View style={styles.CardMenuModalcommentSection as any}>
              <View style={styles.CardMenuModalavatarCircle as any}>
                <Text style={styles.CardMenuModalavatarText as any}>RN</Text>
              </View>
              <TextInput
                style={styles.CardMenuModalcommentInput as any}
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
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const styles = theme === "dark" ? darkTheme : lightTheme;

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

const handleDeleteCard = (listIndex: number, cardIndex: number) => {
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
    styles.BoardDetailscontainer,
    { backgroundColor: board?.backgroundImage ? 'transparent' : (board?.backgroundColor || '#ADD8E6') }
  ]}
  resizeMode="cover"
  onError={(e) => console.error('BoardDetails: ImageBackground error:', e.nativeEvent)}
    >
      {/* Top Bar */}
      <View style={styles.BoardDetailstopBar}>
        <TouchableOpacity onPress={navigateBack} style={styles.BoardDetailsbackButton}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowTitleModal(true)}
          style={styles.BoardDetailstitleContainer}
        >
          <Text style={styles.BoardDetailstitle} numberOfLines={1} ellipsizeMode="tail">
            {board?.title ?? "Board"}
          </Text>
        </TouchableOpacity>
        <View style={styles.BoardDetailsiconContainer}>
          <TouchableOpacity style={styles.BoardDetailsiconButton}>
            <Ionicons name="search-outline" size={28} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.BoardDetailsiconButton}>
            <Ionicons name="notifications-outline" size={28} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.BoardDetailsiconButton}
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
      <View style={styles.BoardDetailscontent}>
        <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
          <TouchableOpacity
            style={styles.BoardDetailscreatelist}
            onPress={() => {
              setLists((prev) => [
                ...prev,
                {
                  id: Date.now().toString(),
                  title: "",
                  cards: [{ text: "Enter card name here...", completed: false, isInput: true }],
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
      style={styles.BoardDetailslistCard}
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
          placeholderTextColor="gray"
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
          style={styles.BoardDetailslistTitleInput}
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
          <Text style={styles.BoardDetailslistTitle}>
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
        renderItem={({ item: card, index: cardIndex }: { item: any; index: number }) => {
          if (card.isInput) {
            // Show as a normal card with placeholder text, turn into input on tap
            if (!card.editing) {
              return (
                <TouchableOpacity
                  onPress={() => {
                    const updated = [...lists];
                    updated[listIndex].cards[cardIndex].editing = true;
                    setLists(updated);
                  }}
                  style={styles.BoardDetailscard}
                >
                  <Ionicons name="ellipse-outline" size={24} color="#555" />
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#888', fontSize: styles.BoardDetailscardText.fontSize, fontWeight: styles.BoardDetailscardText.fontWeight }}>{'Enter card name here...'}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedCard(card);
                      setCardMenuVisible(true);
                    }}
                    style={{ marginLeft: "auto" }}
                  >
                    <Ionicons name="ellipsis-vertical-sharp" size={30} color="white" />
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            } else {
              // Show styled input for editing
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: isDark ? '#23253A' : '#f4f6fa',
                    borderRadius: 12,
                    paddingVertical: 10,
                    paddingHorizontal: 14,
                    marginBottom: 10,
                    borderWidth: 1,
                    borderColor: isDark ? '#2C8CFF' : '#B3B3B3',
                    shadowColor: isDark ? '#000' : '#ccc',
                    shadowOpacity: 0.08,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <Ionicons name="ellipse-outline" size={22} color={isDark ? '#BFC9D6' : '#888'} style={{ marginRight: 8 }} />
                  <TextInput
                    placeholder="Enter card name here..."
                    placeholderTextColor={isDark ? '#BFC9D6' : '#888'}
                    style={{
                      flex: 1,
                      fontSize: 16,
                      color: isDark ? '#fff' : '#22345A',
                      paddingVertical: 0,
                      backgroundColor: 'transparent',
                    }}
                    value={card.text === "Enter card name here..." ? "" : card.text}
                    autoFocus
                    onChangeText={(text) => {
                      const updated = [...lists];
                      updated[listIndex].cards[cardIndex].text = text;
                      setLists(updated);
                    }}
                    onSubmitEditing={() => {
                      const updated = [...lists];
                      const text = updated[listIndex].cards[cardIndex].text.trim();
                      if (text) {
                        updated[listIndex].cards[cardIndex].isInput = false;
                        updated[listIndex].cards[cardIndex].editing = false;
                        // Add a new input card at the end
                        updated[listIndex].cards.push({ text: "Enter card name here...", completed: false, isInput: true });
                        setLists(updated);
                      }
                    }}
                    onBlur={() => {
                      const updated = [...lists];
                      updated[listIndex].cards[cardIndex].editing = false;
                      setLists(updated);
                    }}
                    returnKeyType="done"
                  />
                  <TouchableOpacity
                    onPress={() => {
                      const updated = [...lists];
                      const text = updated[listIndex].cards[cardIndex].text.trim();
                      if (text) {
                        updated[listIndex].cards[cardIndex].isInput = false;
                        updated[listIndex].cards[cardIndex].editing = false;
                        updated[listIndex].cards.push({ text: "Enter card name here...", completed: false, isInput: true });
                        setLists(updated);
                      }
                    }}
                    style={{ marginLeft: 8, backgroundColor: isDark ? '#2C8CFF' : PRIMARY_COLOR, borderRadius: 6, padding: 6 }}
                  >
                    <Ionicons name="add" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              );
            }
          } else {
            // Normal card
            return (
              <TouchableOpacity
                onLongPress={() => setLongPressedCardId({ listId: list.id, cardIndex })}
                onPress={() => {
                  const updated = [...lists];
                  updated[listIndex].cards[cardIndex].completed =
                    !updated[listIndex].cards[cardIndex].completed;
                  setLists(updated);
                  setLongPressedCardId(null);
                }}
                style={styles.BoardDetailscard}
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
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: styles.BoardDetailscardText.color,
                      fontSize: styles.BoardDetailscardText.fontSize,
                      fontWeight: styles.BoardDetailscardText.fontWeight,
                      ...(card.completed ? {
                        color: styles.BoardDetailscompletedText.color,
                        textDecorationLine: styles.BoardDetailscompletedText.textDecorationLine,
                      } : {}),
                    }}
                  >
                    {card.text}
                  </Text>
                </View>
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
            );
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
          <View style={styles.BoardDetailsmodalBackground}>
            <BlurView
              style={StyleSheet.absoluteFill}
              intensity={100}
              tint="dark"
            />
            <View style={styles.BoardDetailsmodalView}>
              <Text style={styles.BoardDetailsmodalTitle}>Board Title</Text>
              <Text style={styles.BoardDetailsmodalText}>{board?.title ?? "Board"}</Text>
              <TouchableOpacity
                style={styles.BoardDetailsmodalButton}
                onPress={() => setShowTitleModal(false)}
              >
                <Text style={styles.BoardDetailsmodalButtonText}>Close</Text>
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
        styles={styles}
      />
    </ImageBackground>
  );
}

// --- Styles ---
// const styles = StyleSheet.create({
//   BoardDetailscontainer: {
//     flex: 1,
//     color: "black"
//   },
//   BoardDetailstopBar: {
//     height: 110,
//     backgroundColor: PRIMARY_COLOR,
//     paddingTop: 40,
//     flexDirection: "row",
//     alignItems: "center",
//     paddingLeft: 10,
//     bottom: 20
//   },
//   BoardDetailsbackButton: {
//     padding: 10
//   },
//   BoardDetailstitleContainer: {
//     flex: 1,
//     maxWidth: SCREEN_WIDTH * 0.4,
//     marginHorizontal: 10,
//     justifyContent: "center"
//   },
//   BoardDetailstitle: {
//     fontSize: 26,
//     fontWeight: "bold",
//     color: "white",
//     textAlign: "left"
//   },
//   BoardDetailsiconContainer: {
//     flexDirection: "row",
//     position: "absolute",
//     right: -5,
//     top: 50,
//     alignItems: "center"
//   },
//   BoardDetailsiconButton: {
//     padding: 10
//   },
//   BoardDetailscontent: {
//     flex: 1,
//     alignItems: "center"
//   },
//   BoardDetailscreatelist: {
//     backgroundColor: "#09143c",
//     width: 160,
//     height: 45,
//     flexDirection: "row",
//     borderRadius: 25,
//     borderColor: "#722f37",
//     borderWidth: 1.5,
//     alignItems: "center",
//     paddingHorizontal: 20,
//     elevation: 8,
//     marginVertical: 10
//   },
//   BoardDetailslistCard: {
//     backgroundColor: "#6F8FAF",
//     alignItems: "center",
//     marginLeft: 15,
//     width: 270,
//     borderRadius: 30,
//     height: 400,
//     paddingTop: 10,
//     marginTop: 20,
//     borderColor: "white",
//     borderWidth: 2
//   },
//   BoardDetailslistTitleInput: {
//     color: "white",
//     fontWeight: "bold",
//     fontSize: 20
//   },
//   BoardDetailslistTitle: {
//     color: "white",
//     fontWeight: "bold",
//     fontSize: 20,
//     marginBottom: 15
//   },
//   BoardDetailscard: {
//     backgroundColor: "#0e1d3e",
//     marginHorizontal: 10,
//     textAlign: "left",
//     width: 250,
//     height: 50,
//     marginVertical: 5,
//     borderRadius: 15,
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     color: "white",
//     flexDirection: "row",
//     alignItems: "center"
//   },
//   BoardDetailscardInput: {
//     borderColor: "white",
//     borderWidth: 1,
//     width: 270,
//     alignItems: "center",
//     textAlign: "center",
//     borderBottomLeftRadius: 30,
//     borderBottomRightRadius: 30,
//     color: "white",
//     paddingVertical: 6
//   },
//   BoardDetailscardText: {
//     fontSize: 16,
//     color: "white",
//     fontWeight: "500",
//     paddingLeft: 10
//   },
//   BoardDetailscompletedText: {
//     textDecorationLine: "line-through",
//     color: "#888"
//   },
//   BoardDetailsmodalBackground: {
//     flex: 1,
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     justifyContent: "center",
//     alignItems: "center"
//   },
//   BoardDetailsmodalView: {
//     backgroundColor: "rgba(255, 255, 255, 0.85)",
//     padding: 20,
//     margin: 30,
//     borderRadius: 20,
//     elevation: 8,
//     shadowColor: "#000",
//     shadowOpacity: 0.2,
//     shadowRadius: 10,
//     minWidth: 300,
//     alignItems: "center"
//   },
//   BoardDetailsmodalTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     marginBottom: 10
//   },
//   BoardDetailsmodalText: {
//     fontSize: 16,
//     color: "#333",
//     marginBottom: 20,
//     textAlign: "center"
//   },
//   BoardDetailsmodalButton: {
//     backgroundColor: PRIMARY_COLOR,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 6
//   },
//   BoardDetailsmodalButtonText: {
//     color: "white",
//     fontWeight: "bold",
//     fontSize: 16
//   },

//   // CardMenuModal styles
//   CardMenuModalmenuOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.6)",
//     justifyContent: "flex-end"
//   },
//   CardMenuModalmenuContainer: {
//     backgroundColor: "#181A20",
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     paddingTop: 10,
//     paddingHorizontal: 18,
//     paddingBottom: 24,
//     minHeight: "85%",
//     maxHeight: "95%",
//     elevation: 12
//   },
//   CardMenuModalmenuTopBar: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 12
//   },
//   CardMenuModalcoverButton: {
//     backgroundColor: "#23263A",
//     paddingVertical: 6,
//     paddingHorizontal: 18,
//     borderRadius: 8,
//     alignSelf: "flex-start",
//     marginBottom: 14
//   },
//   CardMenuModalcoverButtonText: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 15
//   },
//   CardMenuModalsection: {
//     backgroundColor: "#22242d",
//     borderRadius: 14,
//     padding: 14,
//     marginBottom: 18
//   },
//   CardMenuModalactivitiesRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 10
//   },
//   CardMenuModalactivitiesTitle: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 20
//   },
//   CardMenuModaltodoRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 6,
//     marginBottom: 4
//   },
//   CardMenuModaltodoBadge: {
//     width: 32,
//     height: 24,
//     backgroundColor: "#3CD6FF",
//     borderRadius: 6,
//     marginRight: 10
//   },
//   CardMenuModaltodoTitle: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 16
//   },
//   CardMenuModaltodoSubtitle: {
//     color: "#aaa",
//     fontSize: 13
//   },
//   CardMenuModalmoveText: {
//     color: "#3CD6FF",
//     fontWeight: "bold",
//     fontSize: 15
//   },
//   CardMenuModalquickActionsHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 8
//   },
//   CardMenuModalquickActionsTitle: {
//     color: "#aaa",
//     fontWeight: "bold",
//     fontSize: 14,
//     flex: 1
//   },
//   CardMenuModalquickActionsRow: {
//     flexDirection: "row",
//     justifyContent: "flex-start",
//     marginBottom: 8
//   },
//   CardMenuModalquickActionButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     borderRadius: 12,
//     marginRight: 10
//   },
//   CardMenuModalquickActionText: {
//     color: "#fff",
//     fontWeight: "bold",
//     marginLeft: 8,
//     fontSize: 15
//   },
//   CardMenuModaldescriptionRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 6
//   },
//   CardMenuModaldescriptionTitle: {
//     color: "#aaa",
//     fontWeight: "bold",
//     fontSize: 15
//   },
//   CardMenuModaldescriptionInput: {
//     color: "#fff",
//     backgroundColor: "#23263A",
//     borderRadius: 8,
//     padding: 10,
//     marginTop: 6,
//     fontSize: 15,
//     minHeight: 48
//   },
//   CardMenuModalmenuRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 14,
//     borderBottomWidth: 1,
//     borderBottomColor: "#23263A"
//   },
//   CardMenuModalmenuRowText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "500"
//   },
//   CardMenuModalcommentSection: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 20,
//     backgroundColor: "#23263A",
//     borderRadius: 16,
//     paddingHorizontal: 12,
//     paddingVertical: 8
//   },
//   CardMenuModalavatarCircle: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: "#3CD6FF",
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 10
//   },
//   CardMenuModalavatarText: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 15
//   },
//   CardMenuModalcommentInput: {
//     flex: 1,
//     color: "#fff",
//     fontSize: 15,
//     marginRight: 8
//   }
// });
