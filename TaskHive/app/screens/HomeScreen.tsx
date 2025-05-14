import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View,Image } from "react-native";
import { useNavigation } from "@react-navigation/native";



export default function HomeScreen() {
        const navigation=useNavigation();
        return (
          
              <View style={styles.mainpage}>
                <View style={styles.body}> 
                  <Text style={styles.maintext}>No Boards again</Text>
                  <Text style={styles.subtext}>Create Your First Task Board</Text>
                  <View style={styles.createBoardButton}>
                    <TouchableOpacity onPress={() => console.log("Button pressed")}>
                      <LinearGradient
                        colors={["#90EE90", "#0077B6"]}
                        style={styles.button}
                      >
                        <Text style={styles.buttonText}>
                          <Ionicons
                            name="add"
                            size={20}
                            color="white"
                            style={styles.addicon}
                          />
                          Create Board
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
          
        );
      }
      
      const styles = StyleSheet.create({
        mainpage: {
          flex: 1,
          backgroundColor: "white"
        },
        header: {
          height: 100,
          backgroundColor: "#0000FF",
          // justifyContent: 'center',
          paddingTop: 50,
          textAlign: "left",
          display: "flex",
          flexDirection: "row",
          paddingLeft: 10
        },
        headerText: {
          color: "#fff",
          fontSize: 20,
          fontWeight: "bold",
          paddingLeft: 11,
          bottom: -3
          // right:-60
        },
        body: {
          flex: 1,
          padding: 20,
          justifyContent: "center",
          alignItems: "center"
        },
        maintext: {
          fontSize: 24,
          fontWeight: "bold",
          color: "#36454F"
        },
        subtext: {
          fontSize: 18,
          fontWeight: "medium",
          color: "#808080"
        },
      
        searchicon: {
          marginTop: 7,
          left: 80
        },
        notificationicon: {
          marginTop: 7,
          left: 100
        },
        settingsicon: {
          marginTop: 7,
          left: 120
        },
      
        createBoardButton: {
          bottom: -300,
          left: 120
        },
        button: {
          backgroundColor: "blue",
          paddingVertical: 14,
          paddingHorizontal: 14,
          borderRadius: 15
        },
        buttonText: {
          color: "white",
          fontWeight: "bold",
          bottom: 5
        },
        addicon: {
          bottom: -7
        },
        footer: {
          height: 70,
          flexDirection: "row",
          justifyContent: "space-between",
          paddingVertical: 6,
          paddingHorizontal: 10
        },
        workspaceicon: {}
      });
      