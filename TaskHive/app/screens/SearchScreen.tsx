import Header from "@/components/Header";
import {StyleSheet,TextInput,Text,View,Image, TouchableOpacity} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from 'react';



export default function SearchScreen(){

    const router = useRouter();

    const navigateBack = () => {
    router.push({
      pathname: "/(tabs)",
    });
  };
   const [searchText, setSearchText] = useState('');

  const handleClear = () => {
    setSearchText('');
  };
    return(
      <View style={{flex:1,backgroundColor:'white',}}>
        <View style={styles.header}>
             <TouchableOpacity onPress={navigateBack}>
                 <Ionicons name="arrow-back" color='white' size={28}/>
             </TouchableOpacity>
             <TextInput style={styles.searchInput} 
                  placeholder="Search..." 
                  placeholderTextColor='gray'
                  value={searchText}
                  onChangeText={setSearchText} > 
             </TextInput>
            {searchText.length > 0 && (
                <TouchableOpacity onPress={handleClear} >
                  <Ionicons name="close" size={28} color="white" style={{top:3,}}/>
                </TouchableOpacity>
             )}
        </View>
         <ScrollView>
            <View style={styles.mainpage}>
             
             
            </View>
         </ScrollView>
      </View>


    );







}

const styles=StyleSheet.create({
    mainpage:{
      //  flex:1,
      //  backgroundColor:'white',
    },
    header: {
    height: 110,
    backgroundColor:'#0B1F3A',
    paddingTop: 40,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    bottom: 20,
  },
  searchInput:{
    width:290,
    height:50,
    borderRadius:10,
    marginLeft:15,
    marginTop:5,
    paddingVertical:2,
    fontSize:20,
    color:'white',

  },
})