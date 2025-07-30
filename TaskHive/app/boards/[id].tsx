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
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useWorkspaceStore } from "../stores/workspaceStore";
import { useNotificationStore } from "../stores/notificationsStore";
import SearchModal from "@/components/SearchModal";
import NotificationsModal from "@/components/NotificationModal";
import CardMenuModal from "@/components/CardMenuModal";
import { useTheme } from "../../ThemeContext";
import { lightTheme, darkTheme } from "../../styles/themes";

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

  // Get current workspace ID
  const currentWorkspaceId = useWorkspaceStore((state) => state.currentWorkspaceId);

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
  const [isMenuLoading, setIsMenuLoading] = useState(false);
  const [cardDataCache, setCardDataCache] = useState<Record<string, any>>({});
  const [showDeleteCardModal, setShowDeleteCardModal] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<{
    listIndex: number;
    cardIndex: number;
    cardText: string;
  } | null>(null);

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

  // Save lists data to local storage whenever lists change
  useEffect(() => {
    const saveLists = async () => {
      if (board?.id && lists.length > 0) {
        try {
          const storageKey = `boardLists-${board.id}`;
          await AsyncStorage.setItem(storageKey, JSON.stringify(lists));
        } catch (e) {
          console.error("Failed to save lists to storage:", e);
        }
      }
    };

    saveLists();
  }, [lists, board?.id]);

  // Load lists data from local storage on component mount
  useEffect(() => {
    const loadLists = async () => {
      if (board?.id) {
        try {
          const storageKey = `boardLists-${board.id}`;
          const jsonValue = await AsyncStorage.getItem(storageKey);

          if (jsonValue != null) {
            const savedLists = JSON.parse(jsonValue);
            setLists(savedLists);
          }
        } catch (e) {
          console.error("Failed to load lists from storage:", e);
        }
      }
    };

    loadLists();
  }, [board?.id]);

  // Load card data for all cards when lists change
  useEffect(() => {
    const loadAllCardData = async () => {
      const newCardData: Record<string, any> = {};

      for (const list of lists) {
        for (const card of list.cards || []) {
          if (!cardDataCache[card.id]) {
            try {
              const storageKey = `cardData-${card.id}`;
              const jsonValue = await AsyncStorage.getItem(storageKey);

              if (jsonValue != null) {
                const savedData = JSON.parse(jsonValue);
                newCardData[card.id] = savedData;
              } else {
                newCardData[card.id] = {
                  description: "",
                  comments: [],
                  checklists: [],
                  startDate: null,
                  labels: [],
                  coverColor: null,
                  coverImage: null,
                  cardName: "",
                };
              }
            } catch (e) {
              console.error("Failed to load card data from storage:", e);
            }
          }
        }
      }

      if (Object.keys(newCardData).length > 0) {
        setCardDataCache((prev) => ({ ...prev, ...newCardData }));
      }
    };

    loadAllCardData();
  }, [lists, cardDataCache]);

  // Function to load card data from AsyncStorage (similar to CardMenuModal)
  const loadCardData = async (cardId: string) => {
    if (cardDataCache[cardId]) {
      return cardDataCache[cardId];
    }

    try {
      const storageKey = `cardData-${cardId}`;
      const jsonValue = await AsyncStorage.getItem(storageKey);

      if (jsonValue != null) {
        const savedData = JSON.parse(jsonValue);
        setCardDataCache((prev) => ({
          ...prev,
          [cardId]: savedData,
        }));
        return savedData;
      }
    } catch (e) {
      console.error("Failed to load card data from storage:", e);
    }

    return {
      description: "",
      comments: [],
      checklists: [],
      startDate: null,
      labels: [],
      coverColor: null,
      coverImage: null,
      cardName: "",
    };
  };

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

  const navigateBack = async () => {
    // Save current lists to storage before navigating back
    if (board?.id) {
      try {
        const storageKey = `boardLists-${board.id}`;
        await AsyncStorage.setItem(storageKey, JSON.stringify(lists));

        // Also save the complete board data
        const updatedBoard = { ...board, lists };
        const boardStorageKey = `board-${board.id}`;
        await AsyncStorage.setItem(
          boardStorageKey,
          JSON.stringify(updatedBoard)
        );
      } catch (e) {
        console.error("Failed to save board data:", e);
      }
    }

    const updatedBoard = { ...board, lists };
    router.push({
      pathname: "/(tabs)",
      params: { board: JSON.stringify(updatedBoard) },
    });
  };

  const handleDeleteList = async (listId: string) => {
    const updated = lists.filter((list) => list.id !== listId);
    setLists(updated);
    setLongPressedListId(null);
    setListDropdownVisibleFor(null);
    setListEyeVisibility((prev) => {
      const copy = { ...prev };
      delete copy[listId];
      return copy;
    });

    // Save updated lists to storage
    if (board?.id) {
      try {
        const storageKey = `boardLists-${board.id}`;
        await AsyncStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save lists after deletion:", e);
      }
    }
  };

  const handleDeleteCard = async (listIndex: number, cardIndex: number) => {
    const updated = [...lists];
    updated[listIndex].cards.splice(cardIndex, 1);
    setLists(updated);
    setLongPressedCardId(null);
    setCardDropdownVisibleFor(null);

    // Save updated lists to storage
    if (board?.id) {
      try {
        const storageKey = `boardLists-${board.id}`;
        await AsyncStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save lists after card deletion:", e);
      }
    }
  };

  const addNewList = async () => {
    const newList = {
        id: Date.now().toString(),
        title: "",
        editingTitle: true,
        newCardText: "",
        cards: [],
    };

    const updated = [...lists, newList];
    setLists(updated);

    // Save updated lists to storage
    if (board?.id) {
      try {
        const storageKey = `boardLists-${board.id}`;
        await AsyncStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save lists after adding new list:", e);
      }
    }
  };

  const addCardToList = async (listIndex: number) => {
    const updatedLists = [...lists];
    const list = updatedLists[listIndex];
    const newCard = {
      id: Date.now().toString() + "-" + Math.random().toString(16).slice(2),
      text: "",
      description: "",
      checklists: [],
      startDate: null,
      labels: [],
      comments: [],
      coverColor: null,
      coverImage: null,
      completed: false,
      isInput: true,
      editing: true,
    };

    list.cards.push(newCard);
    setLists(updatedLists);

    // Save updated lists to storage
    if (board?.id) {
      try {
        const storageKey = `boardLists-${board.id}`;
        await AsyncStorage.setItem(storageKey, JSON.stringify(updatedLists));
      } catch (e) {
        console.error("Failed to save lists after adding card:", e);
      }
    }
  };

  const updateCardText = async (
    listIndex: number,
    cardId: string,
    newText: string
  ) => {
    const updatedLists = [...lists];
    const list = updatedLists[listIndex];
    const cardIndex = list.cards.findIndex((card: any) => card.id === cardId);

    if (cardIndex !== -1) {
      updatedLists[listIndex].cards[cardIndex].text = newText;
      updatedLists[listIndex].cards[cardIndex].isInput = false;
      updatedLists[listIndex].cards[cardIndex].editing = false;
      setLists(updatedLists);

      // Save updated lists to storage
      if (board?.id) {
        try {
          const storageKey = `boardLists-${board.id}`;
          await AsyncStorage.setItem(storageKey, JSON.stringify(updatedLists));
        } catch (e) {
          console.error("Failed to save lists after updating card text:", e);
        }
      }
    }
  };

  const removeEmptyCard = async (listIndex: number, cardId: string) => {
    const updatedLists = [...lists];
    const list = updatedLists[listIndex];
    const cardIndex = list.cards.findIndex((card: any) => card.id === cardId);

    if (cardIndex !== -1) {
      updatedLists[listIndex].cards.splice(cardIndex, 1);
      setLists(updatedLists);

      // Save updated lists to storage
      if (board?.id) {
        try {
          const storageKey = `boardLists-${board.id}`;
          await AsyncStorage.setItem(storageKey, JSON.stringify(updatedLists));
        } catch (e) {
          console.error("Failed to save lists after removing empty card:", e);
        }
      }
    }
  };

  const updateCardName = async (cardId: string, newName: string) => {
    const updatedLists = [...lists];

    for (let listIndex = 0; listIndex < updatedLists.length; listIndex++) {
      const list = updatedLists[listIndex];
      const cardIndex = list.cards.findIndex((card: any) => card.id === cardId);

      if (cardIndex !== -1) {
        updatedLists[listIndex].cards[cardIndex].text = newName;
        setLists(updatedLists);

        // Save updated lists to storage
        if (board?.id) {
          try {
            const storageKey = `boardLists-${board.id}`;
            await AsyncStorage.setItem(
              storageKey,
              JSON.stringify(updatedLists)
            );
          } catch (e) {
            console.error("Failed to save lists after updating card name:", e);
          }
        }
        break;
      }
    }
  };

  const updateCardCover = async (
    cardId: string,
    coverColor: string | null,
    coverImage: string | null
  ) => {
    const updatedLists = [...lists];

    for (let listIndex = 0; listIndex < updatedLists.length; listIndex++) {
      const list = updatedLists[listIndex];
      const cardIndex = list.cards.findIndex((card: any) => card.id === cardId);

      if (cardIndex !== -1) {
        updatedLists[listIndex].cards[cardIndex].coverColor = coverColor;
        updatedLists[listIndex].cards[cardIndex].coverImage = coverImage;
        setLists(updatedLists);

        // Save updated lists to storage
        if (board?.id) {
          try {
            const storageKey = `boardLists-${board.id}`;
            await AsyncStorage.setItem(
              storageKey,
              JSON.stringify(updatedLists)
            );
          } catch (e) {
            console.error("Failed to save lists after updating card cover:", e);
          }
        }
        break;
      }
    }
  };

  const updateCardData = async (cardId: string, cardData: any) => {
    // Update the cache
    setCardDataCache((prev) => ({
      ...prev,
      [cardId]: cardData,
    }));

    // Also save to AsyncStorage for persistence
    try {
      const storageKey = `cardData-${cardId}`;
      await AsyncStorage.setItem(storageKey, JSON.stringify(cardData));
    } catch (e) {
      console.error("Failed to save card data to storage:", e);
    }
  };

  const handleLongPressCard = (listId: string, cardIndex: number) => {
    setLongPressedCardId({ listId, cardIndex });

    // Find the list index and card information
    const listIndex = lists.findIndex((list) => list.id === listId);
    if (listIndex !== -1 && lists[listIndex].cards[cardIndex]) {
      const card = lists[listIndex].cards[cardIndex];
      setCardToDelete({
        listIndex,
        cardIndex,
        cardText: card.text || "Untitled Card",
      });
      setShowDeleteCardModal(true);
    }
  };

  const confirmDeleteCard = () => {
    if (cardToDelete) {
      const updated = [...lists];
      updated[cardToDelete.listIndex].cards.splice(cardToDelete.cardIndex, 1);
      setLists(updated);
    }

    setShowDeleteCardModal(false);
    setCardToDelete(null);
    setLongPressedCardId(null);
  };

  const cancelDeleteCard = () => {
    setShowDeleteCardModal(false);
    setCardToDelete(null);
    setLongPressedCardId(null);
  };

  const handleMenuClick = () => {
    setIsMenuLoading(true);
    setTimeout(() => {
      setIsMenuLoading(false);
      router.push({
        pathname: "/boards/boardScreenMenu",
        params: { board: JSON.stringify(board) },
      });
    }, 500);
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
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {board?.title ?? "Board"}
          </Text>
        </TouchableOpacity>

        {/* Icons Row */}
        <View style={styles.BoardDetailsiconContainer}>
        <TouchableOpacity
            style={styles.BoardDetailsiconButton}
          onPress={addNewList}
        >
            <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>

          <TouchableOpacity style={styles.BoardDetailsiconButton}>
            <Ionicons name="search-outline" size={28} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.BoardDetailsiconButton}>
            <Ionicons name="notifications-outline" size={28} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.BoardDetailsiconButton}
            onPress={handleMenuClick}
          >
            {isMenuLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="ellipsis-vertical" size={28} color="white" />
            )}
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
            contentContainerStyle={{ alignItems: "flex-start" }}
            renderItem={({ item: list, index: listIndex }) => {
              const eyeVisible = listEyeVisibility[list.id] ?? true;
              const isListDropdownVisible = listDropdownVisibleFor === list.id;
              const cardsToRender = eyeVisible ? list.cards : [];

              return (
                <View key={list.id} style={newStyles.listContainer}>
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
                        if (updated[listIndex].title.trim() === "") {
                          updated.splice(listIndex, 1);
                        } else {
                        updated[listIndex].editingTitle = false;
                        }
                        setLists(updated);
                      }}
                      onBlur={() => {
                        const updated = [...lists];
                        if (updated[listIndex].title.trim() === "") {
                          updated.splice(listIndex, 1);
                        } else {
                          updated[listIndex].editingTitle = false;
                        }
                        setLists(updated);
                      }}
                      style={newStyles.listTitleInput}
                      autoFocus
                    />
                  ) : (
                    <View style={newStyles.header}>
                      <Text
                        style={newStyles.headerText}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {list.title || "Untitled List"}
                      </Text>

                      <TouchableOpacity
                        onPress={() =>
                          setListDropdownVisibleFor(
                            isListDropdownVisible ? null : list.id
                          )
                        }
                        style={newStyles.ellipsisButton}
                      >
                        <Text style={newStyles.ellipsisText}>...</Text>
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
                    style={newStyles.listDropdown}
                  />

                  <ScrollView contentContainerStyle={newStyles.cardList}>
                    {cardsToRender.map((card: any, cardIndex: number) => {
                      const cardDropdownVisible =
                        cardDropdownVisibleFor?.listId === list.id &&
                        cardDropdownVisibleFor?.cardId === card.id;

                      return (
                        <TouchableOpacity
                          key={card.id}
                          activeOpacity={0.96}
                          onPress={() => {
                            if (!card.isInput && card.text.trim().length > 0) {
                              setSelectedCard(card);
                              setCardMenuVisible(true);
                              setCardDropdownVisibleFor(null);
                            }
                          }}
                          onLongPress={() =>
                            handleLongPressCard(list.id, cardIndex)
                          }
                        >
                          <View style={newStyles.card}>
                            {/* Only show title bar/cover if user has set a cover color or image */}
                            {(card.coverColor || card.coverImage) && (
                              <View
                          style={[
                                  newStyles.titleBar,
                            card.coverColor
                              ? { backgroundColor: card.coverColor }
                                    : null,
                                ]}
                              >
                          {card.coverImage && (
                            <ImageBackground
                              source={{ uri: card.coverImage }}
                                    style={newStyles.titleBarImage}
                                    imageStyle={newStyles.titleBarImageStyle}
                              resizeMode="cover"
                            />
                                )}
                              </View>
                            )}

                            <View style={newStyles.cardContent}>
                              {card.isInput ? (
                                <TextInput
                                  style={newStyles.cardTextInput}
                                  placeholder="Enter card name..."
                                  placeholderTextColor={
                                    theme === "dark"
                                      ? "rgba(234,239,255,0.6)"
                                      : "rgba(0,0,0,0.6)"
                                  }
                                  value={card.text}
                                  onChangeText={(text) => {
                                    const updatedLists = [...lists];
                                    const listToUpdate =
                                      updatedLists[listIndex];
                                    const cardToUpdate =
                                      listToUpdate.cards.find(
                                        (c: any) => c.id === card.id
                                      );
                                    if (cardToUpdate) {
                                      cardToUpdate.text = text;
                                      setLists(updatedLists);
                                    }
                                  }}
                                  onSubmitEditing={() => {
                                    if (card.text.trim().length > 0) {
                                      updateCardText(
                                        listIndex,
                                        card.id,
                                        card.text.trim()
                                      );
                                    } else {
                                      removeEmptyCard(listIndex, card.id);
                                    }
                                  }}
                                  onBlur={() => {
                                    if (card.text.trim().length === 0) {
                                      removeEmptyCard(listIndex, card.id);
                                    } else {
                                      updateCardText(
                                        listIndex,
                                        card.id,
                                        card.text.trim()
                                      );
                                    }
                                  }}
                                  autoFocus={true}
                                  returnKeyType="done"
                                  multiline={false}
                                  numberOfLines={1}
                                />
                              ) : (
                                <>
                                  {/* Card title text */}
                            <Text
                              style={[
                                      newStyles.cardTitleText,
                                      { marginBottom: 8 }, // Add bottom margin for icons
                              ]}
                              numberOfLines={2}
                            >
                                    {card.text || "Untitled Card"}
                            </Text>

                                  {/* Card indicators section */}
                                  {(() => {
                                    const cardData = cardDataCache[card.id];
                                    const hasDescription =
                                      cardData?.description &&
                                      cardData.description.trim().length > 0;
                                    const hasComments =
                                      cardData?.comments &&
                                      cardData.comments.length > 0;
                                    const hasChecklists =
                                      cardData?.checklists &&
                                      cardData.checklists.length > 0;
                                    const totalTodos =
                                      cardData?.checklists?.reduce(
                                        (acc: number, checklist: any) =>
                                          acc + (checklist.todos?.length || 0),
                                        0
                                      ) || 0;
                                    const completedTodos =
                                      cardData?.checklists?.reduce(
                                        (acc: number, checklist: any) =>
                                          acc +
                                          (checklist.todos?.filter(
                                            (todo: any) => todo.completed
                                          ).length || 0),
                                        0
                                      ) || 0;

                                    if (
                                      !hasDescription &&
                                      !hasComments &&
                                      !hasChecklists
                                    ) {
                                      return null;
                                    }

                                    return (
                                      <View style={newStyles.iconRow}>
                                        {/* Description icon */}
                                        {hasDescription && (
                                          <Ionicons
                                            name="document-text-outline"
                                            size={16}
                                            color={
                                              theme === "dark"
                                                ? "#8B92B0"
                                                : "#888"
                                            }
                                            style={newStyles.iconMargin}
                                          />
                                        )}

                                        {/* Checklist progress */}
                                        {hasChecklists && (
                                          <View
                                            style={newStyles.taskStatusRow}
                                          >
                                            <Ionicons
                                              name="checkbox-outline"
                                              size={16}
                                              color={
                                                completedTodos === totalTodos &&
                                                totalTodos > 0
                                                  ? "#22C55E"
                                                  : theme === "dark"
                                                  ? "#8B92B0"
                                                  : "#888"
                                              }
                                              style={newStyles.iconMargin}
                                            />
                              <Text
                                style={[
                                                newStyles.iconText,
                                                {
                                                  color:
                                                    theme === "dark"
                                                      ? "#B8BCC8"
                                                      : "#555",
                                                },
                                              ]}
                                            >
                                              {completedTodos}/{totalTodos}
                              </Text>
                          </View>
                                        )}

                                        {/* Comments icon */}
                                        {hasComments && (
                                          <View
                                            style={newStyles.taskStatusRow}
                            >
                              <Ionicons
                                              name="chatbubble-outline"
                                              size={16}
                                              color={
                                                theme === "dark"
                                                  ? "#8B92B0"
                                                  : "#888"
                                              }
                                              style={newStyles.iconMargin}
                                            />
                                            <Text
                                              style={[
                                                newStyles.iconText,
                                                {
                                                  color:
                                                    theme === "dark"
                                                      ? "#B8BCC8"
                                                      : "#555",
                                                },
                                              ]}
                                            >
                                              {cardData.comments.length}
                                            </Text>
                                          </View>
                                        )}
                                      </View>
                                    );
                                  })()}
                                </>
                              )}
                            </View>
                          </View>

                            <CardDropdownMenu
                            onArchive={() => {}}
                            onDelete={() =>
                              handleDeleteCard(listIndex, cardIndex)
                            }
                            onRename={() => {}}
                            onCopy={() => {}}
                              onClose={() => setCardDropdownVisibleFor(null)}
                            style={[
                              newStyles.cardDropdown,
                              cardDropdownVisible ? {} : { display: "none" },
                            ]}
                            />
                        </TouchableOpacity>
                      );
                    })}

                    <TouchableOpacity
                      style={newStyles.addCardButton}
                      onPress={() => addCardToList(listIndex)}
                    >
                      <Text style={newStyles.addCardIcon}>+</Text>
                      <Text style={newStyles.addCardText}>Add a card</Text>
                    </TouchableOpacity>
                  </ScrollView>
                </View>
              );
            }}
          />
        </Animated.View>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showTitleModal}
        onRequestClose={() => setShowTitleModal(false)}
      >
          <View style={styles.BoardDetailsmodalBackground}>
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

      {/* Delete Card Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showDeleteCardModal}
        onRequestClose={cancelDeleteCard}
      >
        <View style={styles.BoardDetailsmodalBackground}>
          <View style={styles.BoardDetailsmodalView}>
            <Text style={styles.BoardDetailsmodalTitle}>Delete Card</Text>
            <Text style={styles.BoardDetailsmodalText}>
              Are you sure you want to delete &ldquo;{cardToDelete?.cardText}
              &rdquo;? This action cannot be undone.
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 20,
                width: "100%",
              }}
            >
              <TouchableOpacity
                style={[
                  styles.BoardDetailsmodalButton,
                  { backgroundColor: "#ccc", marginRight: 10, flex: 1 },
                ]}
                onPress={cancelDeleteCard}
              >
                <Text
                  style={[
                    styles.BoardDetailsmodalButtonText,
                    { color: "#333" },
                  ]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.BoardDetailsmodalButton,
                  { backgroundColor: "#FF3B30", marginLeft: 10, flex: 1 },
                ]}
                onPress={confirmDeleteCard}
              >
                <Text style={styles.BoardDetailsmodalButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <CardMenuModal
        visible={isCardMenuVisible}
        card={selectedCard}
        styles={styles}
        boardBackgroundColor={board?.backgroundColor || "#ADD8E6"}
        onClose={() => {
          setCardMenuVisible(false);
          setSelectedCard(null);
        }}
        onUpdateCardName={updateCardName}
        onUpdateCardCover={updateCardCover}
        onUpdateCardData={updateCardData}
        workspaceId={currentWorkspaceId}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  BoardDetailscontainer: {
    flex: 1,
  },
  BoardDetailstopBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 8,
  },
  BoardDetailsbackButton: {
    marginRight: 16,
  },
  BoardDetailstitleContainer: {
    flex: 1,
  },
  BoardDetailstitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  BoardDetailsiconContainer: {
    flexDirection: "row",
  },
  BoardDetailsiconButton: {
    marginLeft: 16,
  },
  BoardDetailscontent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  dropdownOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  dropdownMenu: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.8)",
    borderRadius: 8,
    paddingVertical: 8,
    minWidth: 150,
    zIndex: 1001,
  },
  dropdownItem: {
    paddingHorizontal: 16,
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
    color: "#ccc",
  },
  BoardDetailsmodalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  BoardDetailsmodalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  BoardDetailsmodalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  BoardDetailsmodalText: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: "center",
  },
  BoardDetailsmodalButton: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  BoardDetailsmodalButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  // CardMenuModal styles
  CardMenuModalmenuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  CardMenuModalmenuContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 0,
    height: "100%",
    width: "100%",
  },
  CardMenuModalmenuTopBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "transparent",
  },
  CardMenuModalcoverButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "500",
  },
  CardMenuModalsection: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  CardMenuModalactivitiesRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  CardMenuModalactivitiesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  CardMenuModaltodoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  CardMenuModaltodoBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#007AFF",
    marginRight: 10,
  },
  CardMenuModaltodoTitle: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  CardMenuModaltodoSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  CardMenuModalquickActionsHeader: {
    marginBottom: 10,
  },
  CardMenuModalquickActionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  CardMenuModalquickActionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  CardMenuModalquickActionButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  CardMenuModalquickActionText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  CardMenuModalmenuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  CardMenuModalmenuRowText: {
    color: "white",
    fontSize: 16,
    marginLeft: 8,
  },
  CardMenuModaldescriptionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  CardMenuModaldescriptionTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  CardMenuModaldescriptionInput: {
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "white",
    padding: 12,
    borderRadius: 8,
    minHeight: 80,
    textAlignVertical: "top",
  },
  CardMenuModaldescriptionText: {
    color: "white",
    fontSize: 14,
    lineHeight: 20,
  },
});

// New styles only for lists and cards
const newStyles = StyleSheet.create({
  listContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
    padding: 16,
    marginRight: 16,
    minWidth: 280,
    maxWidth: SCREEN_WIDTH * 0.8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  ellipsisButton: {
    padding: 5,
  },
  ellipsisText: {
    fontSize: 20,
    color: "#888",
    fontWeight: "bold",
  },
  listTitleInput: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    backgroundColor: "transparent",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 16,
  },
  cardList: {
    flexGrow: 1,
  },
  card: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  titleBar: {
    height: 8,
    width: "100%",
    backgroundColor: "#6A5ACD",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  titleBarImage: {
    width: "100%",
    height: "100%",
  },
  titleBarImageStyle: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardContent: {
    padding: 16,
  },
  cardTitleText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    marginBottom: 2,
  },
  cardTextInput: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    backgroundColor: "transparent",
    paddingVertical: 0,
    paddingHorizontal: 0,
    minHeight: 20,
  },
  labelContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  labelText: {
    backgroundColor: "#e0e0e0",
    color: "#333",
    fontSize: 12,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 4,
    marginBottom: 2,
  },
  checklistContainer: {
    marginBottom: 8,
  },
  checklistTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  checkbox: {
    width: 14,
    height: 14,
    borderWidth: 1.5,
    borderColor: "#ccc",
    borderRadius: 2,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: "#22C55E",
    borderColor: "#22C55E",
  },
  checkboxCheck: {
    fontSize: 10,
    color: "white",
    fontWeight: "bold",
  },
  checklistItemText: {
    fontSize: 12,
    color: "#333",
    flex: 1,
  },
  checklistItemCompleted: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  moreItemsText: {
    fontSize: 11,
    color: "#666",
    fontStyle: "italic",
    marginLeft: 22,
    marginBottom: 4,
  },
  hamburgerIcon: {
    marginRight: 8,
  },
  startDateText: {
    fontSize: 12,
    color: "#555",
    marginLeft: 4,
  },
  textPlaceholder: {
    height: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 4,
    marginBottom: 8,
  },
  textPlaceholderLarge: {
    width: "90%",
  },
  textPlaceholderMedium: {
    width: "80%",
  },
  labelPlaceholder: {
    height: 10,
    width: 64,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginBottom: 12,
  },
  taskStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  checklistIcon: {
    fontSize: 14,
    color: "#22C55E",
    marginRight: 4,
    fontWeight: "bold",
  },
  taskCount: {
    fontSize: 14,
    color: "#555",
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  iconPlaceholder: {
    width: 16,
    height: 16,
    backgroundColor: "#888",
    marginRight: 8,
    borderRadius: 2,
  },
  menuIcon: {
    fontSize: 16,
    color: "#888",
    marginRight: 8,
  },
  commentIcon: {
    fontSize: 16,
    color: "#888",
    marginRight: 4,
  },
  commentCount: {
    fontSize: 12,
    color: "#555",
    marginRight: 12,
  },
  descriptionIcon: {
    fontSize: 16,
    color: "#888",
    marginRight: 12,
  },
  clockIcon: {
    fontSize: 16,
    color: "#888",
    marginRight: 4,
  },
  iconMargin: {
    marginRight: 5,
  },
  iconText: {
    fontSize: 12,
    color: "#555",
    marginRight: 15,
  },
  spacer: {
    flex: 1,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: -8,
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  addCardButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginTop: 16,
    borderRadius: 6,
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
  },
  addCardIcon: {
    fontSize: 20,
    color: "#888",
    marginRight: 8,
  },
  addCardText: {
    fontSize: 16,
    color: "#888",
    fontWeight: "500",
  },
  listDropdown: {
    top: 36,
    right: 12,
  },
  cardDropdown: {
    top: 30,
    right: 10,
  },
});

// Dark theme styles for lists and cards
const darkNewStyles = StyleSheet.create({
  listContainer: {
    backgroundColor: "#141627",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    padding: 16,
    marginRight: 16,
    minWidth: 280,
    maxWidth: SCREEN_WIDTH * 0.8,
    borderWidth: 1,
    borderColor: "#2A2C3E",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#EAEFFF",
    flex: 1,
  },
  ellipsisButton: {
    padding: 5,
  },
  ellipsisText: {
    fontSize: 20,
    color: "#8B92B0",
    fontWeight: "bold",
  },
  listTitleInput: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#EAEFFF",
    backgroundColor: "transparent",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 16,
  },
  cardList: {
    flexGrow: 1,
  },
  card: {
    backgroundColor: "#1A3555",
    borderRadius: 8,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#2A4A70",
  },
  titleBar: {
    height: 8,
    width: "100%",
    backgroundColor: "#4A5ACD",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  titleBarImage: {
    width: "100%",
    height: "100%",
  },
  titleBarImageStyle: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardContent: {
    padding: 16,
  },
  cardTitleText: {
    fontSize: 14,
    color: "#EAEFFF",
    fontWeight: "500",
    marginBottom: 2,
  },
  cardTextInput: {
    fontSize: 14,
    color: "#EAEFFF",
    fontWeight: "500",
    backgroundColor: "transparent",
    paddingVertical: 0,
    paddingHorizontal: 0,
    minHeight: 20,
  },
  labelContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  labelText: {
    backgroundColor: "#2A2C3E",
    color: "#EAEFFF",
    fontSize: 12,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 4,
    marginBottom: 2,
  },
  checklistContainer: {
    marginBottom: 8,
  },
  checklistTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#EAEFFF",
    marginBottom: 4,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  checkbox: {
    width: 14,
    height: 14,
    borderWidth: 1.5,
    borderColor: "#8B92B0",
    borderRadius: 2,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: "#22C55E",
    borderColor: "#22C55E",
  },
  checkboxCheck: {
    fontSize: 10,
    color: "white",
    fontWeight: "bold",
  },
  checklistItemText: {
    fontSize: 12,
    color: "#EAEFFF",
    flex: 1,
  },
  checklistItemCompleted: {
    textDecorationLine: "line-through",
    color: "#8B92B0",
  },
  moreItemsText: {
    fontSize: 11,
    color: "#8B92B0",
    fontStyle: "italic",
    marginLeft: 22,
    marginBottom: 4,
  },
  hamburgerIcon: {
    marginRight: 8,
  },
  startDateText: {
    fontSize: 12,
    color: "#B8BCC8",
    marginLeft: 4,
  },
  textPlaceholder: {
    height: 12,
    backgroundColor: "#2A2C3E",
    borderRadius: 4,
    marginBottom: 8,
  },
  textPlaceholderLarge: {
    width: "90%",
  },
  textPlaceholderMedium: {
    width: "80%",
  },
  labelPlaceholder: {
    height: 10,
    width: 64,
    backgroundColor: "#2A2C3E",
    borderRadius: 4,
    marginBottom: 12,
  },
  taskStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  checklistIcon: {
    fontSize: 14,
    color: "#22C55E",
    marginRight: 4,
    fontWeight: "bold",
  },
  taskCount: {
    fontSize: 14,
    color: "#B8BCC8",
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  iconPlaceholder: {
    width: 16,
    height: 16,
    backgroundColor: "#8B92B0",
    marginRight: 8,
    borderRadius: 2,
  },
  menuIcon: {
    fontSize: 16,
    color: "#8B92B0",
    marginRight: 8,
  },
  commentIcon: {
    fontSize: 16,
    color: "#8B92B0",
    marginRight: 4,
  },
  commentCount: {
    fontSize: 12,
    color: "#B8BCC8",
    marginRight: 12,
  },
  descriptionIcon: {
    fontSize: 16,
    color: "#8B92B0",
    marginRight: 12,
  },
  clockIcon: {
    fontSize: 16,
    color: "#8B92B0",
    marginRight: 4,
  },
  iconMargin: {
    marginRight: 5,
  },
  iconText: {
    fontSize: 12,
    color: "#B8BCC8",
    marginRight: 15,
  },
  spacer: {
    flex: 1,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: -8,
    borderWidth: 1.5,
    borderColor: "#2A4A70",
  },
  addCardButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginTop: 16,
    borderRadius: 6,
    backgroundColor: "#1A3555",
    borderWidth: 1,
    borderColor: "#2A4A70",
    borderStyle: "dashed",
  },
  addCardIcon: {
    fontSize: 20,
    color: "#8B92B0",
    marginRight: 8,
  },
  addCardText: {
    fontSize: 16,
    color: "#8B92B0",
    fontWeight: "500",
  },
  listDropdown: {
    top: 36,
    right: 12,
  },
  cardDropdown: {
    top: 30,
    right: 10,
  },
});
