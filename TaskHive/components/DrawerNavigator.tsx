import DashBoard from "@/app/screens/DashBoard";
import HomeScreen from "@/app/screens/HomeScreen";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
// import ProfileScreen from './ProfileScreen';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Profile" component={DashBoard} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
