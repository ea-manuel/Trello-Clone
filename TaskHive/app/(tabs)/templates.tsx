import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Templates() {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <View style={styles.templatesheader}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
            <Text>Choose Template</Text>
          </TouchableOpacity>
        </View>
      )
    });
  }, [navigation]);
  return (
    <View style={styles.mainpage}>
      <View style={styles.templatesheader}></View>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          color: "#36454F",
          textAlign: "center"
        }}
      >
        Templates Screen
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mainpage: {
    flex: 1,
    backgroundColor: "white"
  },
  templatesheader: {
    height: 100,
    backgroundColor: "#34495e",
    alignItems: "center"
  }
});
