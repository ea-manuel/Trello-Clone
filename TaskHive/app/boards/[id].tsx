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
                onPress={() => router.push("/(tabs)")}
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
                         newCardText: '',
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
             
                   <FlatList
                     data={item.cards}
                     keyExtractor={(card, i) => i.toString()}
                     renderItem={({ item: card, index: cardIndex }) => (
                      <View style={styles.card}>
                        <TouchableOpacity
                          // style={styles.radio}
                          onPress={() => {
                            const updated = [...lists];
                            updated[index].cards[cardIndex].completed = !updated[index].cards[cardIndex].completed;
                            setLists(updated);
                          }}
                        >
                        {card.completed ? (
                                <Ionicons name="checkmark-circle" size={24} color="#2ecc71" />
                              ) : (
                                <Ionicons name="ellipse-outline" size={24} color="#555" />
                              )}
                        
                        </TouchableOpacity>
                        
                        <Text style={[styles.cardText, card.completed && styles.completedText]}>
                          {card.text}
                        </Text>
                      </View>
                    )}
                    
                   />
             
                   {/* Add card input */}
                   <TextInput
                         placeholder="+ Add a card..."
                         style={styles.cardInput}
                         value={item.newCardText}
                         onChangeText={text => {
                           const updated = [...lists];
                           updated[index].newCardText = text;
                           setLists(updated);
                         }}
                         onSubmitEditing={(e) => {
                           const updated = [...lists];
                           const text = updated[index].newCardText.trim();
                           if (text) {
                             updated[index].cards.push({ text: text, completed: false });
                             updated[index].newCardText = ''; 
                             setLists(updated);
                           }
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
    backgroundColor:'#6F8FAF',
    alignItems:'center',
    marginLeft:20,
    width:270,
    borderRadius:30,
    height:350,
    paddingTop:10,
    marginTop:20,
   borderColor:'white',
   borderWidth:2,
  },
  listTitleInput:{
    color:'white',
    fontWeight:'bold',
    fontSize:20,
  },
  listTitle:{
    color:'white',
    fontWeight:'bold',
    fontSize:20,
    marginBottom:15,

  },
  card:{
    backgroundColor:'#0e1d3e',
    marginHorizontal:10,
    textAlign:'left',
    width:250,
    height:50,
    marginVertical:5,
    borderRadius:15,
    paddingHorizontal:15,
    paddingVertical:10,
    color:'white',
    flexDirection:'row',
  },
  cardInput:{
    borderColor:'white',
    borderWidth:1,
    width:270,
    alignItems:'center',
    textAlign:'center',
    borderBottomLeftRadius:30,
    borderBottomRightRadius:30,
  },

  cardText: {
    fontSize: 16,
    color: "white",
    fontWeight:'medium',
    paddingLeft:10,
  },
  
  completedText: {
    textDecorationLine: "line-through",
    color: "#888",
  },
});
