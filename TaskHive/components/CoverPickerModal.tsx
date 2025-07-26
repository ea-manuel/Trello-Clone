import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

interface CoverPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectColor: (color: string) => void;
  onSelectImage: (uri: string) => void;
  selectedColor: string | null;
  selectedImage: string | null;
}

// Some preset colors for selection
const COLORS = [
  "#FF6B6B",
  "#6BCB77",
  "#4D96FF",
  "#FFD93D",
  "#FF6FFF",
  "#2B2D42",
  "#F72585",
  "#720026",
  "#3A536B",
  "#DBE9E9",
];

const { width } = Dimensions.get("window");
const PALETTE_ITEM_SIZE = 50;

export default function CoverPickerModal({
  visible,
  onClose,
  onSelectColor,
  onSelectImage,
  selectedColor,
  selectedImage,
}: CoverPickerModalProps) {
  const [loadingImage, setLoadingImage] = useState(false);

  const pickImage = async () => {
    // Ask for permission first
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access gallery is required!");
      return;
    }

    setLoadingImage(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        allowsEditing: true,
      });

      if (!result.cancelled) {
        onSelectImage(result.uri);
      }
    } catch (e) {
      console.error("Error picking image: ", e);
    } finally {
      setLoadingImage(false);
    }
  };

  const renderColorItem = ({ item }: { item: string }) => {
    const isSelected = selectedColor === item && !selectedImage;
    return (
      <TouchableOpacity
        style={[
          styles.colorCircle,
          { backgroundColor: item },
          isSelected && styles.selectedColorCircle,
        ]}
        onPress={() => onSelectColor(item)}
      >
        {isSelected && (
          <Ionicons
            name="checkmark"
            size={24}
            color="white"
            style={{ alignSelf: "center" }}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Select Cover</Text>

          <Text style={styles.sectionTitle}>Colors</Text>
          <FlatList
            data={COLORS}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderColorItem}
            style={{ marginBottom: 20 }}
            contentContainerStyle={{ paddingHorizontal: 10 }}
          />

          <TouchableOpacity
            style={styles.imagePickerButton}
            onPress={pickImage}
            disabled={loadingImage}
          >
            <Ionicons name="image-outline" size={24} color="white" />
            <Text style={styles.imagePickerButtonText}>
              {loadingImage ? "Loading..." : "Pick an Image"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.70)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  container: {
    width: "100%",
    backgroundColor: "#222",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    maxHeight: "80%",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
    marginBottom: 16,
  },
  sectionTitle: {
    alignSelf: "flex-start",
    color: "white",
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 12,
  },
  colorCircle: {
    height: PALETTE_ITEM_SIZE,
    width: PALETTE_ITEM_SIZE,
    borderRadius: PALETTE_ITEM_SIZE / 2,
    marginRight: 12,
    justifyContent: "center",
  },
  selectedColorCircle: {
    borderWidth: 3,
    borderColor: "white",
  },
  imagePickerButton: {
    flexDirection: "row",
    backgroundColor: "#3b82f6",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  imagePickerButtonText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "600",
    fontSize: 16,
  },
  closeButton: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderColor: "#3b82f6",
    borderWidth: 1,
  },
  closeButtonText: {
    color: "#3b82f6",
    fontWeight: "600",
    fontSize: 16,
  },
});
