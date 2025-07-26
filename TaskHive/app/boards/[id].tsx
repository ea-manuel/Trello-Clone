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
import CardMenuModal from "@/components/CardMenuModal";

const PRIMARY_COLOR = "#0B1F3A";
const { width: SCREEN_WIDTH } = Dimensions.get("window");

// --- Main BoardDetails component ---
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
  const [listToDelete, setListToDelete] = useState<string | null>(null);
  const [cardToDelete, setCardToDelete] = useState<{
    listId: string;
    cardIndex: number;
  } | null>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const styles = theme === "dark" ? darkTheme : lightTheme;

  // Modal state for card menu
  const [isCardMenuVisible, setCardMenuVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, settaskToDelete] = useState<string | null>(null);
  const [longPressedCardIndex, setLongPressedCardIndex] = useState<
    string | null
  >(null);
  // Parse the board param
  let board = null;
  try {
    console.log("BoardDetails: Raw params.board:", params.board);
    if (typeof params.board === "string" && params.board) {
      board = JSON.parse(params.board);
      if (board && !board.backgroundColor && !board.backgroundImage) {
        board.backgroundColor = "#ADD8E6";
      }
    } else {
      console.warn("BoardDetails: params.board is invalid:", params.board);
    }
  } catch (e) {
    console.error("BoardDetails: Failed to parse board:", e);
  }

  const [lists, setLists] = useState(board?.lists || []);
  useEffect(() => {
    console.log(
      "BoardDetails: Received board:",
      JSON.stringify(board, null, 2)
    );
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
      onError={(e) =>
        console.error("BoardDetails: ImageBackground error:", e.nativeEvent)
      }
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
            style={styles.BoardDetailstitle}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
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
                params: { board: JSON.stringify(board) },
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
                  cards: [
                    {
                      text: "Enter card name here...",
                      completed: false,
                      isInput: true,
                    },
                  ],
                  editingTitle: true,
                  newCardText: "",
                },
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
                renderItem={({
                  item: card,
                  index: cardIndex,
                }: {
                  item: any;
                  index: number;
                }) => {
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
                          <Ionicons
                            name="ellipse-outline"
                            size={24}
                            color="#555"
                          />
                          <View style={{ flex: 1 }}>
                            <Text
                              style={{
                                color: "#888",
                                fontSize: styles.BoardDetailscardText.fontSize,
                                fontWeight:
                                  styles.BoardDetailscardText.fontWeight,
                              }}
                            >
                              {"Enter card name here..."}
                            </Text>
                          </View>
                          <TouchableOpacity
                            onPress={() => {
                              setSelectedCard(card);
                              setCardMenuVisible(true);
                            }}
                            style={{ marginLeft: "auto" }}
                          >
                            <Ionicons
                              name="ellipsis-vertical-sharp"
                              size={30}
                              color="white"
                            />
                          </TouchableOpacity>
                        </TouchableOpacity>
                      );
                    } else {
                      // Show styled input for editing
                      return (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: isDark ? "#23253A" : "#f4f6fa",
                            borderRadius: 12,
                            paddingVertical: 10,
                            paddingHorizontal: 14,
                            marginBottom: 10,
                            borderWidth: 1,
                            borderColor: isDark ? "#2C8CFF" : "#B3B3B3",
                            shadowColor: isDark ? "#000" : "#ccc",
                            shadowOpacity: 0.08,
                            shadowRadius: 4,
                            elevation: 2,
                          }}
                        >
                          <Ionicons
                            name="ellipse-outline"
                            size={22}
                            color={isDark ? "#BFC9D6" : "#888"}
                            style={{ marginRight: 8 }}
                          />
                          <TextInput
                            placeholder="Enter card name here..."
                            placeholderTextColor={isDark ? "#BFC9D6" : "#888"}
                            style={{
                              flex: 1,
                              fontSize: 16,
                              color: isDark ? "#fff" : "#22345A",
                              paddingVertical: 0,
                              backgroundColor: "transparent",
                            }}
                            value={
                              card.text === "Enter card name here..."
                                ? ""
                                : card.text
                            }
                            autoFocus
                            onChangeText={(text) => {
                              const updated = [...lists];
                              updated[listIndex].cards[cardIndex].text = text;
                              setLists(updated);
                            }}
                            onSubmitEditing={() => {
                              const updated = [...lists];
                              const text =
                                updated[listIndex].cards[cardIndex].text.trim();
                              if (text) {
                                updated[listIndex].cards[cardIndex].isInput =
                                  false;
                                updated[listIndex].cards[cardIndex].editing =
                                  false;
                                // Add a new input card at the end
                                updated[listIndex].cards.push({
                                  text: "Enter card name here...",
                                  completed: false,
                                  isInput: true,
                                });
                                setLists(updated);
                              }
                            }}
                            onBlur={() => {
                              const updated = [...lists];
                              updated[listIndex].cards[cardIndex].editing =
                                false;
                              setLists(updated);
                            }}
                            returnKeyType="done"
                          />
                          <TouchableOpacity
                            onPress={() => {
                              const updated = [...lists];
                              const text =
                                updated[listIndex].cards[cardIndex].text.trim();
                              if (text) {
                                updated[listIndex].cards[cardIndex].isInput =
                                  false;
                                updated[listIndex].cards[cardIndex].editing =
                                  false;
                                updated[listIndex].cards.push({
                                  text: "Enter card name here...",
                                  completed: false,
                                  isInput: true,
                                });
                                setLists(updated);
                              }
                            }}
                            style={{
                              marginLeft: 8,
                              backgroundColor: isDark
                                ? "#2C8CFF"
                                : PRIMARY_COLOR,
                              borderRadius: 6,
                              padding: 6,
                            }}
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
                        onLongPress={() =>
                          setLongPressedCardId({ listId: list.id, cardIndex })
                        }
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
                              fontWeight:
                                styles.BoardDetailscardText.fontWeight,
                              ...(card.completed
                                ? {
                                    color:
                                      styles.BoardDetailscompletedText.color,
                                    textDecorationLine:
                                      styles.BoardDetailscompletedText
                                        .textDecorationLine,
                                  }
                                : {}),
                            }}
                          >
                            {card.text}
                          </Text>
                        </View>
                        {longPressedCardId?.listId === list.id &&
                        longPressedCardId?.cardIndex === cardIndex ? (
                          <TouchableOpacity
                            onPress={() =>
                              handleDeleteCard(listIndex, cardIndex)
                            }
                            style={{ marginLeft: "auto" }}
                          >
                            <Ionicons
                              name="trash-outline"
                              size={24}
                              color="red"
                            />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            onPress={() => {
                              setSelectedCard(card);
                              setCardMenuVisible(true);
                            }}
                            style={{ marginLeft: "auto" }}
                          >
                            <Ionicons
                              name="ellipsis-vertical-sharp"
                              size={30}
                              color="white"
                            />
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

const styles = StyleSheet.create({});
