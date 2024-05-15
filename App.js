import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Activities from './components/Activities';
import Login from './components/Login';
import Profile from './components/Profile';
import Register from './components/Register';
import Workouts from './components/Workouts';
import Home from './components/Home';
import { BottomNavigation } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage'

const Stack = createStackNavigator();

export default function App() {
  //Set variables used when accessing Async Storage
  const STORAGE_TOKEN = '@token'
  const STORAGE_USER = '@user'
  const STORAGE_NAME = '@name'

  //Declare State Variables
  const [token, setToken] = useState(null)
  const [loginState, setLoginState] = useState(true)
  const [returned, setReturned] = useState('')

  const [index, setIndex] = useState(0);

  const saveToken = async (result) => {
    try {
      await AsyncStorage.setItem(STORAGE_TOKEN, result.token)
      console.log('Token Set Successfully')

      await AsyncStorage.setItem(STORAGE_USER, result.id)
      console.log('ID set Successfully')

      await AsyncStorage.setItem(STORAGE_NAME, result.firstName)

      setToken(result.token)
      return('Login Successfully Validated')
    }
    catch (e){
      return('Failed to Validate Login')
    }
  }

  const readToken = async () => {
    try {
      const asyncToken = await AsyncStorage.getItem(STORAGE_TOKEN)
  
      if(asyncToken !== null){
        setToken(asyncToken)
      }
    }
    catch (e){
      console.log('Not Logged In')
    }
  }
  
  const [routes] = useState([
    { key: 'home', title: 'Home', icon: 'home', color: '#6200ee' },
    { key: 'activities', title: 'Activities', icon: 'run', color: '#e91e63' },
    { key: 'workouts', title: 'Workouts', icon: 'dumbbell', color: '#e91e63' },
    { key: 'profile', title: 'Profile', icon: 'account-circle', color: '#e91e63' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: Home,
    activities: Activities,
    workouts: Workouts,
    profile: Profile,
  });

  if (token === null){
    return (
      <Register />
    )
  }
  else {
    return (
      <SafeAreaProvider>
        <View style={styles.container}>
          <StatusBar style="auto" />
            <BottomNavigation
              navigationState={{ index, routes }}
              onIndexChange={setIndex}
              renderScene={renderScene}
              shifting={true}
              barStyle={{ backgroundColor: '#b5e9ff' }}
              renderIcon={({ route, color }) => (
                <MaterialCommunityIcons name={route.icon} color={color} size={24} />
              )}
            />
        </View>
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
});