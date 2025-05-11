import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import { registerRootComponent } from 'expo';

// Register the HomeScreen as the root component of the app
registerRootComponent(HomeScreen);

