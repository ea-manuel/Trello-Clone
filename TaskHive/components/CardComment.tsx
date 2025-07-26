import React, { useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Comment {
  id: string;
  text: string;
  author: string;
}

interface CardCommentsProps {
  comments: Comment[];
  commentInput: string;
  setCommentInput: (text: string) => void;
  onAddComment: () => void;
}

export default function CardComments({
  comments,
  commentInput,
  setCommentInput,
  onAddComment,
}: CardCommentsProps) {
  const scrollViewRef = useRef<ScrollView>(null);

  // When a new comment is added, scroll to bottom can be controlled outside or here if desired.

  return (
    <View style={{ marginTop: 16 }}>
      {/* Comment input row */}
      <View style={styles.commentInputSection}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>RN</Text>
        </View>
        <TextInput
          style={styles.commentInput}
          placeholder="Add comment"
          placeholderTextColor="#888"
          value={commentInput}
          onChangeText={setCommentInput}
          onSubmitEditing={onAddComment}
          returnKeyType="send"
        />
        <TouchableOpacity
          onPress={onAddComment}
          accessibilityLabel="Send comment"
        >
          <Ionicons name="send" size={22} color="#3CD6FF" />
        </TouchableOpacity>
      </View>

      {/* Comments list */}
      <ScrollView
        style={{ marginTop: 12, maxHeight: 200 }}
        ref={scrollViewRef}
        keyboardShouldPersistTaps="handled"
      >
        {comments.map(({ id, author, text }) => (
          <View key={id} style={styles.commentContainer}>
            <Text style={styles.commentAuthor}>{author}</Text>
            <Text style={styles.commentText}>"{text}"</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  commentInputSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  avatarText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 20,
    paddingHorizontal: 12,
    color: "white",
    marginRight: 8,
  },
  commentContainer: {
    marginBottom: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  commentAuthor: {
    color: "#aaa",
    fontWeight: "600",
    marginBottom: 2,
  },
  commentText: {
    color: "white",
    fontStyle: "italic",
  },
});
