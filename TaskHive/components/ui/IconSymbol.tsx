import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolViewProps, SymbolWeight } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<
  SymbolViewProps["name"],
  ComponentProps<typeof MaterialIcons>["name"]
>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Mapping SF Symbols to Material Icons for your bottom tab icons.
 */
const MAPPING = {
  "person.3.fill": "group", // Workspace icon
  "rectangle.stack.fill": "layers", // My Cards icon
  "folder.fill": "folder", // Templates icon
  "questionmark.circle": "help-outline" // Help icon
} as IconMapping;

/**
 * IconSymbol component that uses native SF Symbols on iOS, and Material Icons on Android/web.
 */
export function IconSymbol({
  name,
  size,
  color,
  style,
  weight
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <MaterialIcons
      color={color}
      size={size}
      name={MAPPING[name]}
      style={style}
    />
  );
}
