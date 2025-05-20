// app/boards/[id].tsx
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React,{useRef,useEffect,useState} from "react";
import { StyleSheet, Text, TouchableOpacity, View,Animated,FlatList,TextInput } from "react-native";

const PRIMARY_COLOR = "#34495e";

export default function BoardDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const floatAnim = useRef(new Animated.Value(0)).current;
  const [lists, setLists] = useState<{ id: string; title: string; cards: any[]; editingTitle: boolean }[]>([]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Parse the board param (JSON string)
  const board = params.board ? JSON.parse(params.board as string) : null;

  return (
    <View style={styles.container}>
         <View style={styles.topBar}>
             <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
              >
                  <Ionicons name="arrow-back" size={28} color="white" />
             </TouchableOpacity>
             <Text style={styles.title}>{board?.title ?? "Board"}</Text>
         </View>
         <View style={styles.content}>
             <View>
                <Animated.View style={{ transform: [{ translateY: floatAnim }] }}> 
                   <TouchableOpacity  style={styles.createlist} onPress={()=> {
                       setLists(prev => [...prev,{
                         id: Date.now().toString(),
                         title:'',
                         cards:[],
                         editingTitle:true,  
                         }]);
                    }}>
                        <Ionicons name='add' size={25} color='white'/>
                        <Text style={{color:'white'}}>Create List</Text>
                  </TouchableOpacity>
               </Animated.View> 
             </View>
        
         <FlatList
             data={lists}
             keyExtractor={item => item.id}
             horizontal
             renderItem={({ item, index }) => (
            <View style={styles.listCard}>
                {item.editingTitle ? (
                  <TextInput
                    value={item.title}
                    placeholder="Enter list title"
                    onChangeText={text => {
                      const updated = [...lists];
                      updated[index].title = text;
                      setLists(updated);
                    }}
                    onSubmitEditing={() => {
                      const updated = [...lists];
                      updated[index].editingTitle = false;
                      setLists(updated);
                    }}
                    style={styles.listTitleInput}
                     />
                   ) : (
                     <TouchableOpacity onPress={() => {
                       const updated = [...lists];
                       updated[index].editingTitle = true;
                       setLists(updated);
                     }}>
                       <Text style={styles.listTitle}>{item.title || 'Untitled List'}</Text>
                     </TouchableOpacity>
                   )}
             
                   {/* Render cards here */}
                   <FlatList
                     data={item.cards}
                     keyExtractor={(card, i) => i.toString()}
                     renderItem={({ item: card }) => (
                       <View style={styles.card}>
                         <Text>{card}</Text>
                       </View>
                     )}
                   />
             
                   {/* Add card input */}
                   <TextInput
                     placeholder="Add a card..."
                     style={styles.cardInput}
                     onSubmitEditing={(e) => {
                       const updated = [...lists];
                       updated[index].cards.push(e.nativeEvent.text);
                       setLists(updated);
                     }}
                   />
               </View>
             
           )}
        />
        </View>
    </View>
        );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ADD8E6",
    color: "black"
  },
  topBar: {
    height: 110,
    backgroundColor: PRIMARY_COLOR, // Use your primary color here
    paddingTop: 40,
    textAlign: "left",
    display: "flex",
    flexDirection: "row",
    paddingLeft: 10,
    bottom: 20
  },
  backButton: {
    paddingTop: 25,
    left:10,
  },
  content: {
    flex: 1,
    alignItems:'center',
  
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    left:30,
    top:15,
    alignItems:'center',
  },
  createlist:{
    backgroundColor:'#09143c',
    width:160,
    height:45,
    flexDirection:'row',
    borderRadius:25,
    borderColor:'#722f37',
    borderWidth:1.5,
    alignItems:'center',
    paddingHorizontal:20,
    elevation:8,
  },
  listCard:{
    backgroundColor:'gray',
    alignItems:'center',
    marginLeft:20,
    width:270,
    borderRadius:20,
    height:350,
   
  },
  listTitleInput:{
   
  },
  listTitle:{
    color:'white',
    fontWeight:'bold',
    fontSize:20,

  },
  card:{},
  cardInput:{},
});
