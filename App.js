import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
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

const Stack = createStackNavigator();

function MainNavigator() {
  const [index, setIndex] = useState(0);
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

  return (
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
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
    <View style={styles.container}>
      <StatusBar style="auto" />
      <MainNavigator />
    </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
});