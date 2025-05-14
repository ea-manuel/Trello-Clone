import { Text, View,StyleSheet } from "react-native";

export default function Cards() {
  return (
    <View style={styles.mainpage}>
      <Text className="text-5xl text-white" style={{color:'black'}} >Help Screen</Text>
    </View>
  );
}


const styles=StyleSheet.create({

mainpage:{
    flex:1,
    alignContent:'center',
    justifyContent:'center',
    backgroundColor:'white',
},
})