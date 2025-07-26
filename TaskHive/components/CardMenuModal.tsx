import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Alert,
  ImageBackground,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import CardComments from "./CardComment"; // Adjust path accordingly
import CoverPickerModal from "./CoverPickerModal"; // Adjust path accordingly

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface Checklist {
  id: string;
  title: string;
  editing: boolean;
  todos: Todo[];
}

interface Comment {
  id: string;
  text: string;
  author: string;
}

interface CardMenuModalProps {
  visible: boolean;
  onClose: () => void;
  card: any;
  styles: any;
  // Optionally, you might want an onDeleteCard callback to handle UI changes after delete
  onDeleteCard?: () => void;
}

export default function CardMenuModal({
  visible,
  onClose,
  card,
  styles,
  onDeleteCard,
}: CardMenuModalProps) {
  const storageKey = `cardData-${card?.id ?? "default"}`;

  // States
  const [description, setDescription] = useState("");
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState("");
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [showStartDateModal, setShowStartDateModal] = useState(false);
  const [labels, setLabels] = useState<string[]>([]);
  const [showLabelsModal, setShowLabelsModal] = useState(false);
  const [labelInput, setLabelInput] = useState("");
  const [coverColor, setCoverColor] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [showCoverPickerModal, setShowCoverPickerModal] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Load saved card data on mount or card change
  useEffect(() => {
    const loadData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(storageKey);
        if (jsonValue != null) {
          const savedData = JSON.parse(jsonValue);
          setDescription(savedData.description || "");
          setIsEditingDescription(!savedData.description);
          setComments(savedData.comments || []);
          setChecklists(
            savedData.checklists || [
              {
                id: Date.now().toString(),
                title: "Default Checklist",
                editing: false,
                todos: [
                  {
                    id: Date.now().toString() + "-todo-1",
                    text: "",
                    completed: false,
                  },
                ],
              },
            ]
          );
          setStartDate(
            savedData.startDate ? new Date(savedData.startDate) : null
          );
          setLabels(savedData.labels || []);
          setCoverColor(savedData.coverColor || null);
          setCoverImage(savedData.coverImage || null);
        } else {
          // Initialize if no saved data
          setDescription(card?.description || "");
          setIsEditingDescription(!card?.description);
          setComments(card?.comments || []);
          setChecklists([
            {
              id: Date.now().toString(),
              title: "Default Checklist",
              editing: false,
              todos: [
                {
                  id: Date.now().toString() + "-todo-1",
                  text: "",
                  completed: false,
                },
              ],
            },
          ]);
          setStartDate(null);
          setLabels([]);
          setCoverColor(null);
          setCoverImage(null);
        }
      } catch (e) {
        console.error("Failed to load card data from storage:", e);
      }
      setComment("");
      setShowStartDateModal(false);
      setShowLabelsModal(false);
      setLabelInput("");
    };

    if (visible) {
      loadData();
    }
  }, [card, visible]);

  // Save all editable card data whenever any part changes
  useEffect(() => {
    const saveData = async () => {
      try {
        const cardDataToSave = {
          description,
          comments,
          checklists,
          startDate: startDate ? startDate.toISOString() : null,
          labels,
          coverColor,
          coverImage,
        };
        await AsyncStorage.setItem(storageKey, JSON.stringify(cardDataToSave));
      } catch (e) {
        console.error("Failed to save card data to storage:", e);
      }
    };

    if (visible) {
      saveData();
    }
  }, [
    description,
    comments,
    checklists,
    startDate,
    labels,
    coverColor,
    coverImage,
    storageKey,
    visible,
  ]);

  // Description handlers
  const finishEditingDescription = () => {
    if (description.trim().length > 0) setIsEditingDescription(false);
  };

  // Checklist handlers
  const toggleEditChecklistTitle = (id: string) => {
    setChecklists((prev) =>
      prev.map((cl) => (cl.id === id ? { ...cl, editing: !cl.editing } : cl))
    );
  };

  const updateChecklistTitle = (id: string, newTitle: string) => {
    setChecklists((prev) =>
      prev.map((cl) => (cl.id === id ? { ...cl, title: newTitle } : cl))
    );
  };

  const handleAddChecklist = () => {
    const newChecklist: Checklist = {
      id: Date.now().toString(),
      title: "New Checklist",
      editing: false,
      todos: [
        { id: Date.now().toString() + "-todo-1", text: "", completed: false },
      ],
    };
    setChecklists((prev) => [...prev, newChecklist]);
  };

  const updateTodoText = (
    checklistId: string,
    todoId: string,
    newText: string
  ) => {
    setChecklists((prev) =>
      prev.map((cl) => {
        if (cl.id === checklistId) {
          return {
            ...cl,
            todos: cl.todos.map((todo) =>
              todo.id === todoId ? { ...todo, text: newText } : todo
            ),
          };
        }
        return cl;
      })
    );
  };

  const toggleTodoCompleted = (checklistId: string, todoId: string) => {
    setChecklists((prev) =>
      prev.map((cl) => {
        if (cl.id === checklistId) {
          return {
            ...cl,
            todos: cl.todos.map((todo) =>
              todo.id === todoId
                ? { ...todo, completed: !todo.completed }
                : todo
            ),
          };
        }
        return cl;
      })
    );
  };

  const addTodoOnSubmitEditing = (checklistId: string, todoId: string) => {
    setChecklists((prev) =>
      prev.map((cl) => {
        if (cl.id === checklistId) {
          const todoIndex = cl.todos.findIndex((todo) => todo.id === todoId);
          if (todoIndex === -1) return cl;
          const currentTodo = cl.todos[todoIndex];
          if (!currentTodo.text.trim()) {
            return cl;
          }
          const newTodo: Todo = {
            id: Date.now().toString() + "-todo-" + (cl.todos.length + 1),
            text: "",
            completed: false,
          };
          const newTodos = [...cl.todos];
          newTodos.splice(todoIndex + 1, 0, newTodo);
          return { ...cl, todos: newTodos };
        }
        return cl;
      })
    );
  };

  // Enhanced deleteChecklist handler
  const deleteChecklist = (id: string) => {
    Alert.alert(
      "Delete Checklist",
      "Are you sure you want to delete this checklist?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setChecklists((prev) => prev.filter((cl) => cl.id !== id));
          },
        },
      ]
    );
  };

  // Enhance deleteTodo handler remains unchanged except no deleting checklist here
  const deleteTodo = (checklistId: string, todoId: string) => {
    Alert.alert(
      "Delete Todo",
      "Are you sure you want to delete this todo item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setChecklists((prev) =>
              prev.map((cl) => {
                if (cl.id === checklistId) {
                  const filteredTodos = cl.todos.filter((t) => t.id !== todoId);
                  return {
                    ...cl,
                    todos:
                      filteredTodos.length > 0
                        ? filteredTodos
                        : [
                            {
                              id: Date.now().toString() + "-todo-1",
                              text: "",
                              completed: false,
                            },
                          ],
                  };
                }
                return cl;
              })
            );
          },
        },
      ]
    );
  };

  // Start date handlers
  const handleStartDateConfirm = (date: Date) => {
    setStartDate(date);
    setShowStartDateModal(false);
  };

  const handleStartDateCancel = () => {
    setShowStartDateModal(false);
  };

  // Labels handlers
  const handleAddLabel = () => {
    const trimmed = labelInput.trim();
    if (trimmed && !labels.includes(trimmed)) {
      setLabels((prev) => [...prev, trimmed]);
      setLabelInput("");
    }
  };

  const handleRemoveLabel = (labelToRemove: string) => {
    setLabels((prev) => prev.filter((l) => l !== labelToRemove));
  };

  // Comments handlers
  const handleAddComment = () => {
    const trimmedComment = comment.trim();
    if (!trimmedComment) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      text: trimmedComment,
      author: "RN", // Replace as needed
    };

    setComments((prev) => [...prev, newComment]);
    setComment("");
  };

  // Delete card data handler from dropdown 'Delete Card'
  const handleDeleteCard = () => {
    Alert.alert(
      "Delete Card",
      "Are you sure you want to delete this card? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(storageKey);
              // Optionally, if you want to clear state after deletion:
              setDescription("");
              setComments([]);
              setChecklists([]);
              setStartDate(null);
              setLabels([]);
              setCoverColor(null);
              setCoverImage(null);
              setDropdownVisible(false);

              if (onDeleteCard) {
                onDeleteCard();
              }

              onClose();
            } catch (e) {
              console.error("Failed to delete card data from storage:", e);
              Alert.alert(
                "Error",
                "Failed to delete the card. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={onClose}
      >
        <View style={styles.CardMenuModalmenuOverlay}>
          <BlurView
            style={StyleSheet.absoluteFill}
            intensity={80}
            tint="dark"
          />

          <View style={styles.CardMenuModalmenuContainer}>
            {/* Top Bar */}
            <View style={[styles.CardMenuModalmenuTopBar]}>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={28} color="white" />
              </TouchableOpacity>
              <View style={{ flex: 1 }} />
              <TouchableOpacity onPress={() => setDropdownVisible((v) => !v)}>
                <Ionicons name="ellipsis-vertical" size={28} color="white" />
              </TouchableOpacity>
            </View>

            {/* Dropdown menu */}
            {dropdownVisible && (
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: 48,
                  right: 16,
                  backgroundColor: "#222",
                  borderRadius: 8,
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  zIndex: 100,
                  elevation: 10,
                  minWidth: 140,
                  shadowColor: "#000",
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 2 },
                }}
                activeOpacity={1}
                onPressOut={() => setDropdownVisible(false)}
              >
                <TouchableOpacity
                  onPress={() => {
                    setDropdownVisible(false);
                    // Add your archive action here
                    Alert.alert("Archive", "Archive action not implemented.");
                  }}
                  style={{ paddingVertical: 8 }}
                >
                  <Text style={{ color: "white" }}>Archive Card</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleDeleteCard}
                  style={{ paddingVertical: 8 }}
                >
                  <Text style={{ color: "white" }}>Delete Card</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setDropdownVisible(false)}
                  style={{ paddingVertical: 8 }}
                >
                  <Text style={{ color: "#3b82f6" }}>Cancel</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            )}

            {/* Scrollable content */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Cover Header */}
              <View
                style={{
                  height: 110,
                  width: "100%",
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  overflow: "hidden",
                  marginBottom: 12,
                  backgroundColor: coverColor || "#222",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {coverImage ? (
                  <ImageBackground
                    source={{ uri: coverImage }}
                    style={{
                      width: "100%",
                      height: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    imageStyle={{
                      borderTopLeftRadius: 16,
                      borderTopRightRadius: 16,
                    }}
                    resizeMode="cover"
                  >
                    {/** Overlay for semi-transparent background */}
                    {coverColor && (
                      <View
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: coverColor + "80",
                          borderTopLeftRadius: 16,
                          borderTopRightRadius: 16,
                        }}
                      />
                    )}

                    {/* The button */}
                    <TouchableOpacity
                      onPress={() => setShowCoverPickerModal(true)}
                      style={{
                        paddingVertical: 10,
                        paddingHorizontal: 20,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        borderRadius: 25,
                        zIndex: 10,
                      }}
                    >
                      <Text
                        style={[
                          styles.CardMenuModalcoverButtonText,
                          { fontSize: 16 },
                        ]}
                      >
                        Cover
                      </Text>
                    </TouchableOpacity>
                  </ImageBackground>
                ) : (
                  <TouchableOpacity
                    onPress={() => setShowCoverPickerModal(true)}
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 20,
                      backgroundColor: "rgba(255,255,255,0.2)",
                      borderRadius: 25,
                    }}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.CardMenuModalcoverButtonText,
                        { fontSize: 16 },
                      ]}
                    >
                      Cover
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Activities Section */}
              <View style={styles.CardMenuModalsection}>
                <View style={styles.CardMenuModalactivitiesRow}>
                  <Ionicons
                    name="ellipse-outline"
                    size={24}
                    color="#ccc"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.CardMenuModalactivitiesTitle}>
                    Activities
                  </Text>
                </View>
                <View style={styles.CardMenuModaltodoRow}>
                  <View style={styles.CardMenuModaltodoBadge} />
                  <View>
                    <Text style={styles.CardMenuModaltodoTitle}>
                      {card?.text ?? "Todos"}
                    </Text>
                    <Text style={styles.CardMenuModaltodoSubtitle}>
                      Todo list
                    </Text>
                  </View>
                  <View style={{ flex: 1 }} />
                </View>
              </View>

              {/* Quick Actions */}
              <View style={styles.CardMenuModalsection}>
                <View style={styles.CardMenuModalquickActionsHeader}>
                  <Text style={styles.CardMenuModalquickActionsTitle}>
                    Quick Actions
                  </Text>
                  <Ionicons name="chevron-up" size={22} color="#ccc" />
                </View>
                <View style={styles.CardMenuModalquickActionsRow}>
                  <TouchableOpacity
                    style={[
                      styles.CardMenuModalquickActionButton,
                      { backgroundColor: "#1a2d1a" },
                    ]}
                    onPress={handleAddChecklist}
                  >
                    <Ionicons
                      name="checkbox-outline"
                      size={22}
                      color="#3CD6FF"
                    />
                    <Text style={styles.CardMenuModalquickActionText}>
                      Add Checklist
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.CardMenuModalquickActionButton,
                      { backgroundColor: "#1a2631" },
                    ]}
                  >
                    <Ionicons name="attach-outline" size={22} color="#3CD6FF" />
                    <Text style={styles.CardMenuModalquickActionText}>
                      Add Attachment
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.CardMenuModalquickActionsRow}>
                  <TouchableOpacity
                    style={[
                      styles.CardMenuModalquickActionButton,
                      { backgroundColor: "#221a2d" },
                    ]}
                  >
                    <Ionicons
                      name="person-add-outline"
                      size={22}
                      color="#B37BFF"
                    />
                    <Text style={styles.CardMenuModalquickActionText}>
                      Members
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Description Section */}
              <View style={styles.CardMenuModalsection}>
                <View style={styles.CardMenuModaldescriptionRow}>
                  <Ionicons
                    name="document-text-outline"
                    size={22}
                    color="#ccc"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.CardMenuModaldescriptionTitle}>
                    Card description
                  </Text>
                </View>
                {isEditingDescription ? (
                  <TextInput
                    style={styles.CardMenuModaldescriptionInput}
                    placeholder="Add a more detailed description..."
                    placeholderTextColor="#888"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    autoFocus={false}
                    onBlur={finishEditingDescription}
                    onSubmitEditing={finishEditingDescription}
                    returnKeyType="done"
                  />
                ) : (
                  <TouchableOpacity
                    onPress={() => setIsEditingDescription(true)}
                    style={{ flexDirection: "row", alignItems: "center" }}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.CardMenuModaldescriptionText,
                        { flex: 1, color: "white" },
                      ]}
                    >
                      {description}
                    </Text>
                    <Ionicons
                      name="pencil-outline"
                      size={20}
                      color="white"
                      style={{ marginLeft: 8 }}
                    />
                  </TouchableOpacity>
                )}
              </View>

              {/* Checklist Rendering */}
              {checklists.map((checklist) => (
                <View key={checklist.id} style={{ marginBottom: 24 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    {checklist.editing ? (
                      <TextInput
                        style={{
                          flex: 1,
                          fontSize: 18,
                          fontWeight: "600",
                          color: "white",
                          borderBottomWidth: 1,
                          borderBottomColor: "white",
                          paddingVertical: 2,
                        }}
                        value={checklist.title}
                        onChangeText={(text) =>
                          updateChecklistTitle(checklist.id, text)
                        }
                        onBlur={() => toggleEditChecklistTitle(checklist.id)}
                        autoFocus
                        returnKeyType="done"
                      />
                    ) : (
                      <>
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Text
                            style={{
                              fontSize: 18,
                              fontWeight: "600",
                              color: "white",
                            }}
                          >
                            {checklist.title}
                          </Text>
                          <TouchableOpacity
                            onPress={() =>
                              toggleEditChecklistTitle(checklist.id)
                            }
                            style={{ marginLeft: 8 }}
                            accessibilityLabel={`Edit checklist ${checklist.title}`}
                          >
                            <Ionicons
                              name="pencil-outline"
                              size={22}
                              color="white"
                            />
                          </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1 }} />
                        <TouchableOpacity
                          onPress={() => deleteChecklist(checklist.id)}
                          style={{ marginLeft: 12 }}
                          accessibilityLabel={`Delete checklist ${checklist.title}`}
                        >
                          <Ionicons
                            name="trash-outline"
                            size={22}
                            color="#ff6b6b"
                          />
                        </TouchableOpacity>
                      </>
                    )}
                  </View>

                  {/* ... render todos here ... */}
                </View>
              ))}

              {/* Start Date */}
              <TouchableOpacity
                style={styles.CardMenuModalmenuRow}
                onPress={() => setShowStartDateModal(true)}
              >
                <Ionicons
                  name="calendar-outline"
                  size={22}
                  color="#ccc"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.CardMenuModalmenuRowText}>
                  {startDate ? startDate.toLocaleString() : "Set Start Date"}
                </Text>
              </TouchableOpacity>

              {/* Labels */}
              <TouchableOpacity
                style={styles.CardMenuModalmenuRow}
                onPress={() => setShowLabelsModal(true)}
              >
                <Ionicons
                  name="pricetag-outline"
                  size={22}
                  color="#ccc"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.CardMenuModalmenuRowText}>
                  {labels.length > 0 ? labels.join(", ") : "Add Labels"}
                </Text>
              </TouchableOpacity>

              {/* Members (placeholder) */}
              <TouchableOpacity style={styles.CardMenuModalmenuRow}>
                <Ionicons
                  name="person-outline"
                  size={22}
                  color="#ccc"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.CardMenuModalmenuRowText}>Members</Text>
              </TouchableOpacity>

              {/* Comments list above input field */}
              {comments.length > 0 && (
                <View style={{ marginTop: 12, paddingHorizontal: 16 }}>
                  {comments.map(({ id, author, text }) => (
                    <View
                      key={id}
                      style={{
                        marginBottom: 12,
                        backgroundColor: "rgba(255,255,255,0.1)",
                        padding: 10,
                        borderRadius: 8,
                      }}
                    >
                      <Text style={{ color: "#aaa", fontWeight: "600" }}>
                        {author}
                      </Text>
                      <Text style={{ color: "white", fontStyle: "italic" }}>
                        "{text}"
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Add Comment Section */}
              <CardComments
                comments={comments}
                commentInput={comment}
                setCommentInput={setComment}
                onAddComment={handleAddComment}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Start Date Picker Modal */}
      <DateTimePickerModal
        isVisible={showStartDateModal}
        mode="datetime"
        date={startDate || new Date()}
        onConfirm={handleStartDateConfirm}
        onCancel={handleStartDateCancel}
      />

      {/* Labels Modal */}
      <Modal
        visible={showLabelsModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLabelsModal(false)}
      >
        <View style={localStyles.modalOverlay}>
          <View style={localStyles.modalContent}>
            <Text style={localStyles.modalTitle}>Manage Urgency Labels</Text>
            <View style={{ flexDirection: "row", marginBottom: 12 }}>
              <TextInput
                style={localStyles.textInput}
                value={labelInput}
                onChangeText={setLabelInput}
                placeholder="Add new label"
                placeholderTextColor="#888"
                onSubmitEditing={handleAddLabel}
                autoFocus
              />
              <TouchableOpacity
                onPress={handleAddLabel}
                style={[localStyles.addButton, { marginLeft: 8 }]}
                accessibilityLabel="Add label"
              >
                <Ionicons name="add" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {labels.length === 0 ? (
              <Text style={{ color: "#888", marginBottom: 8 }}>
                No labels yet.
              </Text>
            ) : (
              labels.map((label) => (
                <View key={label} style={localStyles.labelRow}>
                  <Text style={localStyles.labelText}>{label}</Text>
                  <TouchableOpacity onPress={() => handleRemoveLabel(label)}>
                    <Ionicons name="trash-outline" size={20} color="#ff6b6b" />
                  </TouchableOpacity>
                </View>
              ))
            )}

            <TouchableOpacity
              onPress={() => setShowLabelsModal(false)}
              style={[localStyles.closeButton, { marginTop: 16 }]}
            >
              <Text style={{ color: "#3b82f6", fontWeight: "600" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Cover Picker Modal */}
      <CoverPickerModal
        visible={showCoverPickerModal}
        onClose={() => setShowCoverPickerModal(false)}
        selectedColor={coverColor}
        selectedImage={coverImage}
        onSelectColor={(color) => {
          setCoverColor(color);
          setCoverImage(null);
          setShowCoverPickerModal(false);
        }}
        onSelectImage={(uri) => {
          setCoverImage(uri);
          setCoverColor(null);
          setShowCoverPickerModal(false);
        }}
      />
    </>
  );
}

const localStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#222",
    borderRadius: 12,
    padding: 20,
    maxHeight: 400,
  },
  modalTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  labelText: {
    color: "white",
    fontSize: 16,
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  textInput: {
    flex: 1,
    backgroundColor: "#333",
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: "white",
    borderRadius: 8,
  },
  addButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
});
