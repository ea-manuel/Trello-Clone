import React from "react";
import { TouchableOpacity, View, Text, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Heart } from "lucide-react-native";
import { useTheme } from "../ThemeContext";
import { lightTheme, darkTheme } from "../styles/themes";

interface BoardCardProps {
  id: string;
  title: string;
  isFavorite: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
  onLongPress?: () => void;
  showDelete?: boolean;
  onDelete?: () => void;
  showToggle?: boolean;
  toggleValue?: boolean;
  onToggleSwitch?: (value: boolean) => void;
  style?: any;
}

const BoardCard: React.FC<BoardCardProps> = ({
  id,
  title,
  isFavorite,
  onPress,
  onToggleFavorite,
  onLongPress,
  showDelete = false,
  onDelete,
  showToggle = false,
  toggleValue = false,
  onToggleSwitch,
  style,
}) => {
  const { theme } = useTheme();
  const styles = theme === "dark" ? darkTheme : lightTheme;

  return (
    <View style={[styles.boardcard, style]}>  
      <TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
        style={styles.boardcardTouchable}
        activeOpacity={0.85}
      >
        <Ionicons name="grid" size={30} color="#34495e" />
        <Text style={styles.boardcardText}>{title}</Text>
        <TouchableOpacity style={styles.favouriteicon} onPress={onToggleFavorite}>
          {isFavorite ? <Heart color="red" /> : <Heart color="gray" />}
        </TouchableOpacity>
      </TouchableOpacity>
      {showToggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggleSwitch}
        />
      ) : showDelete && (
        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={24} color="#e74c3c" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default BoardCard; 