import { StyleSheet, Text, View } from "react-native";

export default function Help() {
  return (
    <View style={styles.mainpage}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          color: "#36454F",
          textAlign: "center"
        }}
      >
        Help Screen
      </Text>
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
