import { ThemedView } from "@/components/ThemedView";
import { Text, View } from "react-native";
import "../../global.css";

export default function HomeScreen() {
  return (
    <View className="mt-[30px] pt-5 h-screen bg-white">
      <ThemedView className="">
        <Text className="bg-white text-black text-3xl font-bold text-center">
          Welcome!
        </Text>
      </ThemedView>
    </View>
  );
}
