import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ImageBackground,
  Alert,
  Dimensions,
} from "react-native";
import { useTheme } from "../../ThemeContext";
import { lightTheme, darkTheme } from "../../styles/themes";
import CardMenuModal from "@/components/CardMenuModal";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Dropdown components (CardDropdownMenu and ListDropdownMenu) included here

function CardDropdownMenu({
  onArchive,
  onDelete,
  onRename,
  onCopy,
  onClose,
  style,
}: {
  onArchive: () => void;
  onDelete: () => void;
  onRename: () => void;
  onCopy: () => void;
  onClose: () => void;
  style?: any;
}) {
  return (
    <TouchableOpacity
      style={[styles.dropdownOverlay, style]}
      activeOpacity={1}
      onPressOut={onClose}
    >
      <View style={styles.dropdownMenu}>
        <TouchableOpacity
          onPress={() => {
            onArchive();
            onClose();
          }}
          style={styles.dropdownItem}
        >
          <Text style={styles.dropdownText}>Archive Card</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onDelete();
            onClose();
          }}
          style={styles.dropdownItem}
        >
          <Text style={[styles.dropdownText, styles.destructiveText]}>
            Delete Card
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onRename();
            onClose();
          }}
          style={styles.dropdownItem}
        >
          <Text style={styles.dropdownText}>Rename Card</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onCopy();
            onClose();
          }}
          style={styles.dropdownItem}
        >
          <Text style={styles.dropdownText}>Copy Card</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose} style={styles.dropdownItem}>
          <Text style={[styles.dropdownText, styles.cancelText]}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

function ListDropdownMenu({
  visible,
  onDeleteList,
  onClose,
  eyeVisible,
  onToggleEye,
  style,
}: {
  visible: boolean;
  onDeleteList: () => void;
  onClose: () => void;
  eyeVisible: boolean;
  onToggleEye: (newValue: boolean) => void;
  style?: any;
}) {
  if (!visible) return null;

  const notify = (msg: string) => Alert.alert("Notification", msg);

  const toggleEye = () => {
    const newVal = !eyeVisible;
    onToggleEye(newVal);
    notify(newVal ? "List visibility turned ON" : "List visibility turned OFF");
  };

  return (
    <TouchableOpacity
      style={[styles.dropdownOverlay, style]}
      activeOpacity={1}
      onPressOut={onClose}
    >
      <View style={styles.dropdownMenu}>
        <TouchableOpacity
          onPress={() => {
            onDeleteList();
            onClose();
          }}
          style={styles.dropdownItem}
        >
          <Text style={[styles.dropdownText, styles.destructiveText]}>
            Delete List
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleEye} style={styles.dropdownItem}>
          <Text style={styles.dropdownText}>
            {eyeVisible ? "Hide List" : "Show List"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose} style={styles.dropdownItem}>
          <Text style={[styles.dropdownText, styles.cancelText]}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

// Helper to create a new empty card with reset data
function createEmptyCard() {
  return {
    id: Date.now().toString() + "-" + Math.random().toString(16).slice(2),
    text: "",
    completed: false,
    isInput: true,
    editing: true,
    description: "",
    checklists: [],
    startDate: null,
    labels: [],
    comments: [],
    coverColor: null,
    coverImage: null,
  };
}

export default function BoardDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const floatAnim = useRef(new Animated.Value(0)).current;
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [longPressedListId, setLongPressedListId] = useState<string | null>(
    null
  );
  const [longPressedCardId, setLongPressedCardId] = useState<{
    listId: string;
    cardIndex: number;
  } | null>(null);
  const { theme } = useTheme();
  const styles = theme === "dark" ? darkTheme : lightTheme;

  const [isCardMenuVisible, setCardMenuVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [cardDropdownVisibleFor, setCardDropdownVisibleFor] = useState<{
    listId: string;
    cardId: string;
  } | null>(null);
  const [listDropdownVisibleFor, setListDropdownVisibleFor] = useState<
    string | null
  >(null);
  const [listEyeVisibility, setListEyeVisibility] = useState<
    Record<string, boolean>
  >({});

  let board = null;
  try {
    if (typeof params.board === "string" && params.board) {
      board = JSON.parse(params.board);
      if (board && !board.backgroundColor && !board.backgroundImage) {
        board.backgroundColor = "#ADD8E6";
      }
    }
  } catch (e) {
    console.error("BoardDetails: Failed to parse board:", e);
  }

  const [lists, setLists] = useState(board?.lists || []);

  useEffect(() => {
    if (lists.length > 0 && Object.keys(listEyeVisibility).length === 0) {
      const initialVis: Record<string, boolean> = {};
      lists.forEach((l) => {
        initialVis[l.id] = true;
      });
      setListEyeVisibility(initialVis);
    }
  }, [lists]);

  useEffect(() => {
    setLists(board?.lists || []);
  }, [board?.id]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const navigateBack = () => {
    const updatedBoard = { ...board, lists };
    router.push({
      pathname: "/(tabs)",
      params: { board: JSON.stringify(updatedBoard) },
    });
  };

  const handleDeleteList = (listId: string) => {
    const updated = lists.filter((list) => list.id !== listId);
    setLists(updated);
    setLongPressedListId(null);
    setListDropdownVisibleFor(null);
    setListEyeVisibility((prev) => {
      const copy = { ...prev };
      delete copy[listId];
      return copy;
    });
  };

  const handleDeleteCard = (listIndex: number, cardIndex: number) => {
    const updated = [...lists];
    updated[listIndex].cards.splice(cardIndex, 1);
    setLists(updated);
    setLongPressedCardId(null);
    setCardDropdownVisibleFor(null);
  };

  const toggleAllTodosForCard = (listIndex: number, cardIndex: number) => {
    const updated = [...lists];
    const card = updated[listIndex].cards[cardIndex];

    if (!card.checklists || card.checklists.length === 0) return;

    const allDone = card.checklists.every((cl) =>
      cl.todos.every((todo) => todo.completed)
    );
    card.checklists.forEach((cl) => {
      cl.todos.forEach((todo) => {
        todo.completed = !allDone;
      });
    });

    setLists(updated);
  };

  const addNewList = () => {
    setLists((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        title: "",
        editingTitle: true,
        newCardText: "",
        cards: [],
      },
    ]);
  };

  const addCardToList = (listIndex: number) => {
    const updatedLists = [...lists];
    const list = updatedLists[listIndex];
    const newCardIndex = list.cards.length + 1;
    const newCard = {
      id: Date.now().toString() + "-" + Math.random().toString(16).slice(2),
      text: `Card ${newCardIndex}`,
      description: "",
      checklists: [],
      startDate: null,
      labels: [],
      comments: [],
      coverColor: null,
      coverImage: null,
      completed: false,
      isInput: false,
      editing: false,
    };

    list.cards.push(newCard);
    setLists(updatedLists);

    setSelectedCard(newCard);
    setCardMenuVisible(true);
  };

  return (
    <ImageBackground
      key={`${board?.id}-${board?.backgroundImage}`}
      source={
        board?.backgroundImage ? { uri: board.backgroundImage } : undefined
      }
      style={[
        styles.BoardDetailscontainer,
        {
          backgroundColor: board?.backgroundImage
            ? "transparent"
            : board?.backgroundColor || "#ADD8E6",
        },
      ]}
      resizeMode="cover"
    >
      {/* Top Bar */}
      <View style={styles.BoardDetailstopBar}>
        <TouchableOpacity
          onPress={navigateBack}
          style={styles.BoardDetailsbackButton}
        >
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowTitleModal(true)}
          style={styles.BoardDetailstitleContainer}
        >
          <Text
            style={[
              styles.BoardDetailstitle,
              { paddingHorizontal: 8, fontSize: 21 },
            ]} // normal size (30 * 0.7 = 21 removed)
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {board?.title ?? "Board"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.BoardDetailsiconButton,
            {
              flexDirection: "row",
              alignItems: "center",
              right: 25,
            },
          ]}
          onPress={addNewList}
        >
          <Ionicons name="add" size={30} color="white" />{" "}
        </TouchableOpacity>

        <View style={styles.BoardDetailsiconContainer}>
          <TouchableOpacity style={styles.BoardDetailsiconButton}>
            <Ionicons name="search-outline" size={28} color="white" />{" "}
            {/* restored size */}
          </TouchableOpacity>
          <TouchableOpacity style={styles.BoardDetailsiconButton}>
            <Ionicons name="notifications-outline" size={28} color="white" />{" "}
            {/* restored size */}
          </TouchableOpacity>

          {/* Create List button (plus icon + text) */}

          <TouchableOpacity
            style={styles.BoardDetailsiconButton}
            onPress={() => {
              router.push({
                pathname: "/boards/boardScreenMenu",
                params: { board: JSON.stringify(board) },
              });
            }}
          >
            <Ionicons name="ellipsis-vertical" size={28} color="white" />{" "}
            {/* restored size */}
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View style={[styles.BoardDetailscontent, { flex: 1 }]}>
        <Animated.View style={{ flex: 1 }}>
          <FlatList
            data={lists}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ alignItems: "flex-start" }} // push lists to top
            renderItem={({ item: list, index: listIndex }) => {
              const eyeVisible = listEyeVisibility[list.id] ?? true;
              const isListDropdownVisible = listDropdownVisibleFor === list.id;
              const cardsToRender = eyeVisible ? list.cards : [];

              return (
                <View
                  key={list.id}
                  style={[
                    styles.BoardDetailslistCard,
                    {
                      minWidth: 100,
                      maxWidth: SCREEN_WIDTH * 0.4,
                      flexShrink: 1,
                      marginRight: 12,
                      borderRadius: 8, // reduced from 12 to 8
                      minHeight: 200,
                      borderColor: "#444",
                      maxHeight: SCREEN_WIDTH * 0.5,
                    },
                  ]}
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
                      style={[
                        styles.BoardDetailslistTitleInput,
                        { paddingHorizontal: 8, fontSize: 14 * 0.7 },
                      ]}
                    />
                  ) : (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 6,
                        justifyContent: "space-between",
                        paddingHorizontal: 8,
                      }}
                    >
                      <Text
                        style={[
                          styles.BoardDetailslistTitle,
                          { fontSize: 14 * 0.7, flex: 1 },
                        ]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {list.title || "Untitled List"}
                      </Text>

                      {/* Eye toggle */}
                      <TouchableOpacity
                        onPress={() => {
                          const newVisibility = !eyeVisible;
                          setListEyeVisibility({
                            ...listEyeVisibility,
                            [list.id]: newVisibility,
                          });
                          Alert.alert(
                            "Visibility",
                            newVisibility
                              ? "List visibility turned ON"
                              : "List visibility turned OFF"
                          );
                        }}
                        style={{ marginRight: 12 }}
                      >
                        <Ionicons
                          name={eyeVisible ? "eye" : "eye-off"}
                          size={22 * 0.7}
                          color="white"
                        />
                      </TouchableOpacity>

                      {/* List ellipsis button */}
                      <TouchableOpacity
                        onPress={() =>
                          setListDropdownVisibleFor(
                            isListDropdownVisible ? null : list.id
                          )
                        }
                      >
                        <Ionicons
                          name="ellipsis-vertical"
                          size={22 * 0.7}
                          color="white"
                        />
                      </TouchableOpacity>
                    </View>
                  )}

                  <ListDropdownMenu
                    visible={isListDropdownVisible}
                    onDeleteList={() => {
                      handleDeleteList(list.id);
                      setListDropdownVisibleFor(null);
                    }}
                    onClose={() => setListDropdownVisibleFor(null)}
                    eyeVisible={eyeVisible}
                    onToggleEye={(val) =>
                      setListEyeVisibility({
                        ...listEyeVisibility,
                        [list.id]: val,
                      })
                    }
                    style={{ top: 36, right: 12 }}
                  />

                  <FlatList
                    data={cardsToRender}
                    keyExtractor={(card) => card.id}
                    // No fixed height here; grows naturally with content (maxHeight set on list container)
                    renderItem={({ item: card, index: cardIndex }) => {
                      const allTodosCompleted =
                        card.checklists &&
                        card.checklists.length > 0 &&
                        card.checklists.every(
                          (cl) =>
                            cl.todos.length > 0 &&
                            cl.todos.every((todo) => todo.completed)
                        );

                      const cardDropdownVisible =
                        cardDropdownVisibleFor?.listId === list.id &&
                        cardDropdownVisibleFor?.cardId === card.id;

                      return (
                        <TouchableOpacity
                          activeOpacity={0.96}
                          onPress={() => {
                            if (!card.isInput && card.text.trim().length > 0) {
                              setSelectedCard(card);
                              setCardMenuVisible(true);
                              setCardDropdownVisibleFor(null);
                            }
                          }}
                          style={[
                            styles.BoardDetailscard,
                            card.coverColor
                              ? { backgroundColor: card.coverColor }
                              : {},
                            card.coverImage && !card.coverColor
                              ? { backgroundColor: "transparent" }
                              : {},
                            card.coverImage
                              ? { borderRadius: 5, overflow: "hidden" }
                              : {},
                            { marginBottom: 6 },
                            {
                              width: SCREEN_WIDTH * 0.35,
                            },
                          ]}
                          key={card.id}
                          onLongPress={() =>
                            handleLongPressCard(list.id, cardIndex)
                          }
                        >
                          {/* Circle toggle */}
                          <TouchableOpacity
                            onPress={() =>
                              toggleAllTodosForCard(listIndex, cardIndex)
                            }
                            style={{ marginRight: 1 }}
                          >
                            <Ionicons
                              name={
                                allTodosCompleted
                                  ? "checkmark-circle"
                                  : "ellipse-outline"
                              }
                              size={12}
                              color={allTodosCompleted ? "#2ecc71" : "#fff"}
                            />
                          </TouchableOpacity>

                          {card.coverImage && (
                            <ImageBackground
                              source={{ uri: card.coverImage }}
                              style={[
                                StyleSheet.absoluteFill,
                                { borderRadius: 12 },
                              ]}
                              imageStyle={{ borderRadius: 12 }}
                              resizeMode="cover"
                            />
                          )}

                          <View style={{ flex: 1 }}>
                            <Text
                              style={[
                                styles.BoardDetailscardText,
                                card.coverColor ? { color: "white" } : {},
                                card.completed && {
                                  color: styles.BoardDetailscompletedText.color,
                                  textDecorationLine:
                                    styles.BoardDetailscompletedText
                                      .textDecorationLine,
                                },
                                { zIndex: 1, fontSize: 9 },
                              ]}
                              numberOfLines={2}
                              ellipsizeMode="tail"
                            >
                              {card.text}
                            </Text>

                            {card.checklists && card.checklists.length > 0 && (
                              <Text
                                style={[
                                  styles.todoProgressText,
                                  { zIndex: 1, fontSize: 6 },
                                ]}
                              >
                                {(() => {
                                  let total = 0;
                                  let done = 0;
                                  card.checklists.forEach((cl) => {
                                    total += cl.todos.length;
                                    done += cl.todos.filter(
                                      (t) => t.completed
                                    ).length;
                                  });
                                  return total > 0
                                    ? `${done}/${total} done`
                                    : "";
                                })()}
                              </Text>
                            )}
                          </View>

                          {/* Smaller card ellipsis dropdown trigger */}
                          {!card.isInput && card.text.trim().length > 0 && (
                            <TouchableOpacity
                              onPress={() =>
                                setCardDropdownVisibleFor(
                                  cardDropdownVisible
                                    ? null
                                    : { listId: list.id, cardId: card.id }
                                )
                              }
                              style={{ marginLeft: "auto" }}
                            >
                              <Ionicons
                                name="ellipsis-vertical"
                                size={14}
                                color="white"
                              />
                            </TouchableOpacity>
                          )}

                          {cardDropdownVisible && (
                            <CardDropdownMenu
                              style={{ top: 30, right: 10 }}
                              onArchive={() => Alert.alert("Archive card")}
                              onDelete={() => {
                                handleDeleteCard(listIndex, cardIndex);
                                setCardDropdownVisibleFor(null);
                              }}
                              onRename={() => Alert.alert("Rename card")}
                              onCopy={() => Alert.alert("Copy card")}
                              onClose={() => setCardDropdownVisibleFor(null)}
                            />
                          )}
                        </TouchableOpacity>
                      );
                    }}
                  />

                  {eyeVisible && (
                    <TouchableOpacity
                      style={{
                        marginTop: 8,
                        paddingVertical: 7,
                        paddingHorizontal: 8,
                        backgroundColor: "rgba(255,255,255,0.15)",
                        borderRadius: 8,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onPress={() => addCardToList(listIndex)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="add" size={14} color="white" />
                      <Text
                        style={{
                          color: "white",
                          marginLeft: 6,
                          fontWeight: "600",
                          fontSize: 14 * 0.7,
                        }}
                      >
                        Add Card
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            }}
          />
        </Animated.View>
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
              <Text style={styles.BoardDetailsmodalText}>
                {board?.title ?? "Board"}
              </Text>
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

const styles = StyleSheet.create({
  dropdownOverlay: {
    position: "absolute",
    zIndex: 1000,
  },
  dropdownMenu: {
    backgroundColor: "#222",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    minWidth: 140,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 10,
  },
  dropdownItem: {
    paddingVertical: 10,
  },
  dropdownText: {
    color: "white",
    fontSize: 14 * 0.7,
  },
  destructiveText: {
    color: "#ff6b6b",
  },
  cancelText: {
    color: "#3b82f6",
    fontWeight: "600",
  },

  todoProgressText: {
    marginTop: 4,
    fontSize: 11,
    color: "#ddd",
  },

  BoardDetailslistCard: {
    backgroundColor: "#222",
    borderRadius: 1, // reduced from 12 to 8
    padding: 8,
    marginVertical: 6,
    minWidth: 150,
    maxWidth: SCREEN_WIDTH * 0.3,
    flexShrink: 1,
    minHeight: 200,
    maxHeight: SCREEN_WIDTH * 0.4,
  },

  BoardDetailslistTitle: {
    color: "white",
    fontSize: 14 * 0.5,
  },

  BoardDetailslistTitleInput: {
    color: "white",
    fontSize: 14 * 0.7,
    fontWeight: "600",
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: "#333",
    borderRadius: 6,
    marginBottom: 8,
  },

  BoardDetailscard: {
    marginBottom: 6,
    borderRadius: 12,
    backgroundColor: "#333",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  BoardDetailscardText: {
    color: "white",
    fontSize: 14 * 0.7,
  },

  BoardDetailscompletedText: {
    color: "#888",
    textDecorationLine: "line-through",
  },

  BoardDetailscreatelist: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3b3b3b",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 12,
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    width: SCREEN_WIDTH * 0.5,
    zIndex: 1000,
    elevation: 5,
  },
  fixedCreateListButton: {},
});
