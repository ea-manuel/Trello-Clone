import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CardDescriptionProps {
  descriptionProp: string;
  onChangeDescription: (desc: string) => void;
  styles: any;
}

export default function CardDescription({
  descriptionProp,
  onChangeDescription,
  styles,
}: CardDescriptionProps) {
  const [description, setDescription] = useState(descriptionProp || "");
  const [isEditing, setIsEditing] = useState(!descriptionProp);

  useEffect(() => {
    setDescription(descriptionProp || "");
    setIsEditing(!descriptionProp);
  }, [descriptionProp]);

  return (
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
      {isEditing ? (
        <TextInput
          style={styles.CardMenuModaldescriptionInput}
          placeholder="Add a more detailed description..."
          placeholderTextColor="#888"
          value={description}
          onChangeText={(text) => {
            setDescription(text);
            onChangeDescription(text);
          }}
          multiline
          autoFocus
          onBlur={() => {
            if (description.trim().length > 0) setIsEditing(false);
          }}
          onSubmitEditing={() => {
            if (description.trim().length > 0) setIsEditing(false);
          }}
          returnKeyType="done"
        />
      ) : (
        <TouchableOpacity
          onPress={() => setIsEditing(true)}
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
  );
}
