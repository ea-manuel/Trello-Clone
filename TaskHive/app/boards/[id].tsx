import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Animated, FlatList, TextInput, Modal, Dimensions } from "react-native";
import { BlurView } from "expo-blur";

const PRIMARY_COLOR = "#0B1F3A";
const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function BoardDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const floatAnim = useRef(new Animated.Value(0)).current;
  const [showTitleModal, setShowTitleModal] = useState(false);

  // Parse the board param
  let board = null;
  try {
    board = params.board ? JSON.parse(params.board as string) : null;
    // Ensure board has backgroundColor
    if (board && !board.backgroundColor) {
      board.backgroundColor = "#ADD8E6";
    }
  } catch (e) {
    console.error("BoardDetails: Failed to parse board:", e);
  }

  // Initialize lists from board.lists or empty array
  const [lists, setLists] = useState<
    { id: string; title: string; cards: { text: string; completed: boolean }[]; editingTitle: boolean; newCardText: string }[]
  >(board?.lists || []);

  // Ensure lists are reset when board.id changes
  useEffect(() => {
    setLists(board?.lists || []);
    console.log('BoardDetails: Initialized lists for board', board?.id, ':', JSON.stringify(board?.lists, null, 2));
  }, [board?.id]);

  // Animation for Create List button
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

  // Log lists for debugging
  useEffect(() => {
    console.log('BoardDetails: Current lists for board', board?.id, ':', JSON.stringify(lists, null, 2));
  }, [lists, board?.id]);

  if (!board) {
    return <Text>Error: No board data available</Text>;
  }

  const navigateBack = () => {
    const updatedBoard = { ...board, lists };
    console.log('BoardDetails: Navigating back with updated board:', JSON.stringify(updatedBoard, null, 2));
    router.push({
      pathname: "/(tabs)",
      params: { board: JSON.stringify(updatedBoard) }
    });
  };

  return (
    <View key={board.id} style={[styles.container, { backgroundColor: board.backgroundColor }]}>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={navigateBack}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowTitleModal(true)}
          style={styles.titleContainer}
        >
          <Text
            style={styles.title}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {board.title ?? "Board"}
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
              console.log('BoardDetails: Navigating to boardScreenMenu for board:', board.id);
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
      <View style={styles.content}>
        <View>
          <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
            <TouchableOpacity
              style={styles.createlist}
              onPress={() => {
                setLists(prev => [
                  ...prev,
                  {
                    id: Date.now().toString(),
                    title: '',
                    cards: [],
                    editingTitle: true,
                    newCardText: '',
                  },
                ]);
              }}
            >
              <Ionicons name='add' size={25} color='white' />
              <Text style={{ color: 'white' }}>Create List</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <FlatList
          data={lists}
          keyExtractor={item => item.id}
          horizontal
          renderItem={({ item, index }) => (
            <View style={styles.listCard}>
              {item.editingTitle ? (
                <TextInput
                  value={item.title}
                  placeholder="Enter list title"
                  onChangeText={text => {
                    const updated = [...lists];
                    updated[index].title = text;
                    setLists(updated);
                  }}
                  onSubmitEditing={() => {
                    const updated = [...lists];
                    updated[index].editingTitle = false;
                    setLists(updated);
                  }}
                  style={styles.listTitleInput}
                />
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    const updated = [...lists];
                    updated[index].editingTitle = true;
                    setLists(updated);
                  }}
                >
                  <Text style={styles.listTitle}>{item.title || 'Untitled List'}</Text>
                </TouchableOpacity>
              )}

              <FlatList
                data={item.cards}
                keyExtractor={(card, i) => i.toString()}
                renderItem={({ item: card, index: cardIndex }) => (
                  <View style={styles.card}>
                    <TouchableOpacity
                      onPress={() => {
                        const updated = [...lists];
                        updated[index].cards[cardIndex].completed = !updated[index].cards[cardIndex].completed;
                        setLists(updated);
                      }}
                    >
                      {card.completed ? (
                        <Ionicons name="checkmark-circle" size={24} color="#2ecc71" />
                      ) : (
                        <Ionicons name="ellipse-outline" size={24} color="#555" />
                      )}
                    </TouchableOpacity>
                    <Text style={[styles.cardText, card.completed && styles.completedText]}>
                      {card.text}
                    </Text>
                    <TouchableOpacity>
                       <Ionicons name="ellipsis-vertical-sharp" size={30} color='white' style={{left:140}}/>
                    </TouchableOpacity>
                  </View>
                )}
              />

              <TextInput
                placeholder="+ Add a card..."
                style={styles.cardInput}
                value={item.newCardText}
                onChangeText={text => {
                  const updated = [...lists];
                  updated[index].newCardText = text;
                  setLists(updated);
                }}
                onSubmitEditing={() => {
                  const updated = [...lists];
                  const text = updated[index].newCardText.trim();
                  if (text) {
                    updated[index].cards.push({ text, completed: false });
                    updated[index].newCardText = '';
                    setLists(updated);
                  }
                }}
              />
            </View>
          )}
        />
      </View>

      {showTitleModal && (
        <Modal visible={showTitleModal} transparent animationType="fade">
          <View style={styles.modalBackground}>
            <BlurView style={StyleSheet.absoluteFill} intensity={100} tint="dark" />
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Board Title</Text>
              <Text style={styles.modalText}>{board.title ?? "Board"}</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: "black",
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
  titleContainer: {
    flex: 1,
    maxWidth: SCREEN_WIDTH * 0.4,
    marginHorizontal: 10,
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    textAlign: "left",
  },
  iconContainer: {
    flexDirection: "row",
    position: "absolute",
    right: -5,
    top: 50,
    alignItems: "center",
  },
  iconButton: {
    padding: 10,
  },
  content: {
    flex: 1,
    alignItems: "center",
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
    borderWidth: 2,
  },
  listTitleInput: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
  listTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 15,
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
  },
  cardInput: {
    borderColor: "white",
    borderWidth: 1,
    width: 270,
    alignItems: "center",
    textAlign: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  cardText: {
    fontSize: 16,
    color: "white",
    fontWeight: "medium",
    paddingLeft: 10,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#888",
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
    minWidth: 300,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});