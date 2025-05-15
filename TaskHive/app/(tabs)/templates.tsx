import { View, Text, StyleSheet } from "react-native";

export default function Templates() {
  return (
    <View style={styles.mainpage}>
      <Text style={{ fontSize: 24, fontWeight: "bold", color: "#36454F", textAlign: "center" }}>Templates Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mainpage: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: "white"
  }
});
