import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,TextInput,Button
} from "react-native";
import { useState } from "react";
import { FlatList } from "react-native";

const PRIMARY_COLOR = "#34495e";

export default function HomeScreen() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [boards, setBoards] = useState<{ id: number; title: string }[]>([]);
  const [boardTitle, setBoardTitle] = useState('');
  const handleCreateBoard = () => {
    if (!boardTitle.trim()) return;
    const newBoard = { id: Date.now(), title: boardTitle,createdAt: new Date().toLocaleString(), };
    setBoards([...boards, newBoard]);
    setShowModal(false);
    setBoardTitle('');
    router.push({pathname:"/screens/boards",params: { board: JSON.stringify({ id: Date.now(), title: boardTitle })}}); 
  
  };



  return (
   <View  style={styles.mainpage}>
    
       <FlatList
          contentContainerStyle={styles.scrollContent}
          data={boards}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
          <TouchableOpacity>
              <View style={styles.boardcard}>
                <Ionicons name="grid" size={30} color='white'/>
                 <Text style={styles.boardcardtext}>{item.title}</Text>
              </View> 
          </TouchableOpacity>
           
         )}
    
    ListEmptyComponent={
    <View style={styles.body}>
        <Text style={styles.maintext}>No Boards</Text>
        <Text style={styles.subtext}>Create Your First Task Board</Text>
      
       
    </View>
       }
       />
        {showModal&&(
        <Modal visible={showModal} transparent animationType="slide">
            <View style={styles.modalView}>
                <Text style={styles.modalTitle}>Enter Board Title</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. Sprint Tasks"
                    value={boardTitle}
                    onChangeText={setBoardTitle}
                />
                
               <View style={{flexDirection:'row',justifyContent:'space-between'}}>  
                   <View style={{ backgroundColor: '#34495e', borderRadius:6,margin:5,}}>
                      <Button title="Create" onPress={handleCreateBoard} color="#34495e"/>  
                   </View>
                  <View style={{  borderRadius: 6,margin:5,}}>  
                     <Button title="Cancel" onPress={() => setShowModal(false)} color="#ADD8E6" />
                  </View>
              </View>
            </View>
      </Modal>
        )}
        <View style={styles.createBoardButton}>
          <TouchableOpacity
            onPress={() => setShowModal(true)} 
            style={styles.button}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="add" size={20} color="white" />
              <Text style={styles.buttonText}>Create Board</Text>
            </View>
          </TouchableOpacity>
        </View>
       </View>
  );
}

const styles = StyleSheet.create({
  mainpage: {
    flex: 1,
    backgroundColor: "white"
  },
  scrollContent: {
    flexGrow:1,
    justifyContent: "flex-start",
    paddingVertical: 20,
    marginTop:80,
  },
  boardcard:{
    backgroundColor:'#778899',
    paddingVertical:15,
    borderColor:'white',
    borderWidth:3,
    paddingHorizontal:15,
    flexDirection:'row',
   

  },
  boardcardtext:{
    color:'white',
    fontWeight:'medium',
    fontSize:22,
    left:15,

  },
  body: {
    padding: 20,
    alignItems: "center"
  },
  maintext: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#36454F"
  },
  subtext: {
    fontSize: 18,
    fontWeight: "500",
    color: "#808080",
    marginBottom: 20
  },
  createBoardButton: {
      width:170,
      left:220,
      bottom:10,
      
  },
  button: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 14,
    elevation:5,
  
    borderRadius: 8,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,

  },
  modalView: {
    backgroundColor: 'd5ffff',
    padding: 50,
    margin: 30,
    borderRadius: 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  modalTitle: { 
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
});
