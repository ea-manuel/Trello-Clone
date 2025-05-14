import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function Settings(){

    const navigation=useNavigation();
    const[isEnabled,setIsEnabled]=useState(false);
    const toggleSwitch=()=>setIsEnabled(previousState=>!previousState)

    useEffect(()=>{
        navigation.setOptions({
            header:()=>(
              <LinearGradient
                      colors={["#90EE90", "#0077B6"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >  
                <View style={styles.settingsHeader}>
                    <Ionicons name='arrow-back' size={30} color='white'/>
                    <Text style={styles.settingsheaderText}>Settings</Text>
                </View>
            </LinearGradient>
            ),
        });
        
    },[navigation]);

    return(
       
         <ScrollView>
        <View style={styles.mainpage}>
            <View style={styles.notificationsettings}>
              <Text style={styles.headertext}>Notifications</Text>
              <Text style={styles.subtext}>Open system settings</Text>
            </View>
            <View style={styles.notificationsettings}>
              <Text style={styles.headertext}>Application Theme</Text>
              <Text style={styles.subtext}>Select Theme</Text>
            </View>
            <View style={styles.notificationsettings}>
              <Text style={styles.headertext}>Accessibility</Text>
              <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                   <Text style={styles.subtext}>Color blind friendly mode</Text>
                   <Switch 
                      trackColor={{false: "#767577", true: "#636B2F"}}
                      thumbColor={isEnabled ? "#006400" : "#f4f3f4"}
                      onValueChange={toggleSwitch}
                      value={isEnabled}
                      style={{bottom:-8}}
                   />
              </View>
              <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                   <Text style={styles.subtext}>Enable Animations</Text>
                   <Switch 
                      trackColor={{false: "#767577", true: "#636B2F"}}
                      thumbColor={isEnabled ? "#006400" : "#f4f3f4"}
                      onValueChange={toggleSwitch}
                      value={isEnabled}
                      style={{bottom:-8}}
                   />
              </View>
              <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                   <Text style={styles.subtext}>Show label names on card front</Text>
                   <Switch 
                      trackColor={{false: "#767577", true: "#636B2F"}}
                      thumbColor={isEnabled ? "#006400" : "#f4f3f4"}
                      onValueChange={toggleSwitch}
                      value={isEnabled}
                      style={{bottom:-8}}
                   />
              </View>
            </View>
            <View style={styles.notificationsettings}>
              <Text style={styles.headertext}>Sync</Text>
              <Text style={styles.subtext}>Sync queue</Text>
            </View>
            <View style={styles.notificationsettings}>
              <Text style={styles.headertext}>General</Text>
              <Text style={styles.subtext}>Profile and visibility</Text>
              <Text style={styles.subtext}>Set app language</Text>
              <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                   <Text style={styles.subtext}>Show quick add</Text>
                   <Switch 
                      trackColor={{false: "#767577", true: "#636B2F"}}
                      thumbColor={isEnabled ? "#006400" : "#f4f3f4"}
                      onValueChange={toggleSwitch}
                      value={isEnabled}
                      style={{bottom:-8}}
                   />
              </View>
              <Text style={styles.subtext}>Delete account</Text>
              <Text style={styles.subtext}>About Trello</Text>
              <Text style={styles.subtext}>More Atlassian apps</Text>
              <Text style={styles.subtext}>Contact support</Text>
              <Text style={styles.subtext}>Manage accounts on browser</Text>
              <Text style={styles.subtext}>Log out</Text>
            </View>
        </View>
         
         </ScrollView> 
       
    );

}
const styles = StyleSheet.create({
  mainpage: {
    flex: 1,
    backgroundColor: "#36393e",
    paddingVertical: 10
  },

  settingsHeader:{
    height:110,
    paddingTop:60,
    paddingHorizontal:20,
    flexDirection:'row',
  },
  settingsheaderText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    paddingLeft: 13
  },
  headertext: {
    color: "#A8A8A8",
    fontWeight: "bold",
    fontSize: 15,
    left: 70,
    paddingTop: 30
  },
  subtext: {
    color: "#EEECE7",
    fontWeight: "medium",
    fontSize: 17,
    left: 70,
    paddingTop: 30,
    paddingBottom: 15
  },
  notificationsettings:{
    borderBottomColor:'#EEECE7',
    borderBottomWidth:0.2,
  },
})

