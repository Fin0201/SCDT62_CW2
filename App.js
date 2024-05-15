import React, { useState } from 'react';
import { View, StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { BottomNavigation } from 'react-native-paper';
import Home from './Home';
import Activities from './Activities';
import Workouts from './Workouts';
import Profile from './Profile';
import Login from './Login';
import Register from './Register';

const Stack = createStackNavigator();

export default function App() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'home', title: 'Home', icon: 'home', color: '#6200ee' },
    { key: 'activities', title: 'Activities', icon: 'directions-run', color: '#e91e63' },
    { key: 'workouts', title: 'Workouts', icon: 'fitness-center', color: '#e91e63' },
    { key: 'profile', title: 'Profile', icon: 'account-circle', color: '#e91e63' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: Home,
    activities: Activities,
    workouts: Workouts,
    profile: Profile,
  });

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Activities" component={Activities} />
        <Stack.Screen name="Workouts" component={Workouts} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Register" component={Register} />
      </Stack.Navigator>
      <View style={styles.container}>
        <StatusBar style="auto" />
      </View>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        shifting={true}
      />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});