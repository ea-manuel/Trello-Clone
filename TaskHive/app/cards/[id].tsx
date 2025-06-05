import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet, TextInput, ScrollView } from "react-native";
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

const PRIMARY_COLOR = "#0B1F3A";

export default function CardMenuModal({ visible, onClose, card }) {
  const [description, setDescription] = useState(card?.description || "");
  const [comment, setComment] = useState("");

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <BlurView style={StyleSheet.absoluteFill} intensity={80} tint="dark" />
        <View style={styles.container}>
          {/* Top Bar */}
          <View style={styles.topBar}>
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
                <Ionicons name="ellipse-outline" size={24} color="#ccc" style={{ marginRight: 8 }} />
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
                <MaterialIcons name="keyboard-arrow-up" size={22} color="#ccc" />
              </View>
              <View style={styles.quickActionsRow}>
                <TouchableOpacity style={[styles.quickActionButton, { backgroundColor: "#1a2d1a" }]}>
                  <Ionicons name="checkbox-outline" size={22} color="#3CD6FF" />
                  <Text style={styles.quickActionText}>Add Checklist</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.quickActionButton, { backgroundColor: "#1a2631" }]}>
                  <Ionicons name="attach-outline" size={22} color="#3CD6FF" />
                  <Text style={styles.quickActionText}>Add Attachment</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.quickActionsRow}>
                <TouchableOpacity style={[styles.quickActionButton, { backgroundColor: "#221a2d" }]}>
                  <Ionicons name="person-add-outline" size={22} color="#B37BFF" />
                  <Text style={styles.quickActionText}>Members</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Description */}
            <View style={styles.section}>
              <View style={styles.descriptionRow}>
                <MaterialCommunityIcons name="text-box-outline" size={22} color="#ccc" style={{ marginRight: 8 }} />
                <Text style={styles.descriptionTitle}>Add card description</Text>
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
              <MaterialIcons name="label-outline" size={22} color="#ccc" style={{ marginRight: 8 }} />
              <Text style={styles.menuRowText}>Labels</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuRow}>
              <Ionicons name="person-outline" size={22} color="#ccc" style={{ marginRight: 8 }} />
              <Text style={styles.menuRowText}>Members</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuRow}>
              <MaterialIcons name="date-range" size={22} color="#ccc" style={{ marginRight: 8 }} />
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

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#181A20",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 10,
    paddingHorizontal: 18,
    paddingBottom: 24,
    minHeight: "85%",
    maxHeight: "95%",
    elevation: 12,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  coverButton: {
    backgroundColor: "#23263A",
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 14,
  },
  coverButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  section: {
    backgroundColor: "#22242d",
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
  },
  activitiesRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  activitiesTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
  todoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 4,
  },
  todoBadge: {
    width: 32,
    height: 24,
    backgroundColor: "#3CD6FF",
    borderRadius: 6,
    marginRight: 10,
  },
  todoTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  todoSubtitle: {
    color: "#aaa",
    fontSize: 13,
  },
  moveText: {
    color: "#3CD6FF",
    fontWeight: "bold",
    fontSize: 15,
  },
  quickActionsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  quickActionsTitle: {
    color: "#aaa",
    fontWeight: "bold",
    fontSize: 14,
    flex: 1,
  },
  quickActionsRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 8,
  },
  quickActionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginRight: 10,
  },
  quickActionText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
    fontSize: 15,
  },
  descriptionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  descriptionTitle: {
    color: "#aaa",
    fontWeight: "bold",
    fontSize: 15,
  },
  descriptionInput: {
    color: "#fff",
    backgroundColor: "#23263A",
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
    fontSize: 15,
    minHeight: 48,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#23263A",
  },
  menuRowText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  commentSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#23263A",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#3CD6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  avatarText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  commentInput: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
    marginRight: 8,
  },
});
