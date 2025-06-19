import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const MAPPING = {
  "person.3.fill": { name: "group", set: "MaterialIcons" },
  "rectangle.stack.fill": { name: "wifi-off", set: "MaterialCommunityIcons" },
  "folder.fill": { name: "folder", set: "MaterialIcons" },
  "questionmark.circle": { name: "error-outline", set: "MaterialIcons" }
} as const;

type IconName = keyof typeof MAPPING;

export function IconSymbol({
  name,
  size = 24,
  color,
  style
}: {
  name: IconName;
  size?: number;
  color: string;
  style?: StyleProp<TextStyle>;
}) {
  const icon = MAPPING[name];
  if (icon.set === "MaterialCommunityIcons") {
    return (
      <MaterialCommunityIcons
        name={icon.name}
        size={size}
        color={color}
        style={style}
      />
    );
  }
  return (
    <MaterialIcons name={icon.name} size={size} color={color} style={style} />
  );
}
