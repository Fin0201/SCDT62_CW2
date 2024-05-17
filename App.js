import React, { useState, useEffect } from 'react';
import { StyleSheet} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getUser } from './AppStorage';

import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Activities from './pages/Activities';
import Profile from './pages/Profile';
import Workouts from './pages/Workouts';


const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const userAccount = await getUser();
      if (userAccount) {
        setUser(userAccount);
      }
    };
    fetchUser();
  }, []);
  
  return (
    <NavigationContainer>
      {user == [] ? (
        <Stack.Navigator initialRouteName='Register' screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Activities" component={Activities} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Workouts" component={Workouts} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator initialRouteName='Home' screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Activities" component={Activities} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Workouts" component={Workouts} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
});