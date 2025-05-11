import {View,Text,StyleSheet,TouchableOpacity} from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';
import React from 'react';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RouteProp } from '@react-navigation/native';

type RootDrawerParamList = {
  Home: undefined;
};

type HomeScreenProps = {
  navigation: DrawerNavigationProp<RootDrawerParamList, 'Home'>;
  route: RouteProp<RootDrawerParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <View style={styles.mainpage}>
      <View>
        <LinearGradient
        colors={['#90EE90','#0077B6']}
        style={styles.header}
        start={{x:0,y:0}}
        end={{x:1,y:0}}
        >
        <TouchableOpacity onPress={()=>navigation.openDrawer()}>
              <Ionicons name='menu' size={28} color='white' style={styles.menuicon}/>
        </TouchableOpacity>
              <Text style={styles.headerText}>DashBoard</Text>
              <Ionicons name='search' size={28} color='white' style={styles.searchicon}/>
              <Ionicons name='notifications-outline' size={28} color='white' style={styles.notificationicon}/>
              <Ionicons name='settings-outline' size={28} color='white' style={styles.settingsicon}/>
      </LinearGradient>
      </View>
      <View style={styles.body}>
        <Text style={styles.maintext}>No Boards</Text>
        <Text style={styles.subtext}>Create Your First Task Board</Text>
        <View style={styles.createBoardButton}>
          <TouchableOpacity  onPress={() => console.log('Button pressed')}>
              <LinearGradient
                colors={['#90EE90','#0077B6']}
                style={styles.button}
                
                >
                <Text style={styles.buttonText}>
                   <Ionicons name='add' size={20} color="white" style={styles.addicon}/>
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
  mainpage:{
    flex: 1,
    backgroundColor:'white',
  },
  header: {
    height: 100,
    backgroundColor: '#0000FF',
    // justifyContent: 'center',
    paddingTop: 50,
    textAlign:'left',
    display:'flex',
    flexDirection:'row',
    paddingLeft:10,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft:15,
    bottom:-3,
    // right:-60

  },
  body: {
    flex: 1,
    padding: 20,
    justifyContent:'center',
    alignItems:'center'
  },
  maintext:{
    fontSize:24,
    fontWeight:'bold',
    color:'#36454F',
  },
  subtext:{
    fontSize:18,
    fontWeight:'medium',
    color:'#808080',
  },
  menuicon: {
    marginTop:7,
  },
  searchicon: {
    marginTop:7,
    left:90,
  },
  notificationicon: {
    marginTop:7,
    left:110,
  },
  settingsicon: {
    marginTop:7,
    left:130,
  },

  createBoardButton:{
      bottom:-220,
      left:120,
  },
  button:{
    backgroundColor:'blue',
    paddingVertical:14,
    paddingHorizontal:14,
    borderRadius:15,
  },
  buttonText:{
      color:'white',
      fontWeight:'bold',
      bottom:5,
  },
  addicon:{
    bottom:-7,
  }

});