
import { useLocalSearchParams } from 'expo-router';
import { View, Text,StyleSheet } from 'react-native';

export default function BoardScreen() {
  const { board } = useLocalSearchParams(); 
  const parsedBoard = JSON.parse(Array.isArray(board) ? board[0] : board);

  return (
    <View style={styles.mainpage}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color:'black' }}>
        {parsedBoard.title}
      </Text>

    </View>
  );
}
const styles=StyleSheet.create({
mainpage:{
flex:1,
backgroundColor:'white',
alignItems:'center',
justifyContent:'center',
},


})
