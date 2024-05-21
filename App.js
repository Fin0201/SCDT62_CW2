import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getUser } from './AppStorage';

import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';


const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const userAccount = await getUser();
      if (userAccount) {
        console.log('User found');
        setUser(userAccount);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) {
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  }
  
  return (
    console.log(user),
    <NavigationContainer>
      {user == [] ? (
        <Stack.Navigator initialRouteName='Register' screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator initialRouteName='Home' screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Login" component={Login} />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});