import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Activities from './components/Activities';
import Login from './pages/Login';
import Profile from './components/Profile';
import Register from './pages/Register';
import Workouts from './components/Workouts';
import Home from './components/Home';
import { BottomNavigation } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Updates from 'expo-updates';

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const checkStorage = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser !== null) {
        setUser(JSON.parse(storedUser));
        console.log('User data is stored in AsyncStorage');
      } else {
        console.log('User data is not stored in AsyncStorage');
      }
    };

    checkStorage();
  }, []);

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

  const logoutUser = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setCreateWorkoutActivities([]);
      setUser([]);
      setLoading(false);
  
      // Reload the app
      await Updates.reloadAsync();
    } catch(e) {
      console.error(e);
    }
  }

  if (user === null){
    return (
      <NavigationContainer>
      <Stack.Navigator initialRouteName="Register">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
      </Stack.Navigator>
    </NavigationContainer>
    )
  }
  else {
    return (
      
      <SafeAreaProvider>
        <View style={styles.logoutButton}>
          <TouchableOpacity onPress={logoutUser}>
            <MaterialCommunityIcons name="logout" size={24} color="black" />
          </TouchableOpacity>
        </View>
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
  logoutButton: {
    position: 'absolute',
    top: 30,
    right: 10,
    zIndex: 15,
  },
});