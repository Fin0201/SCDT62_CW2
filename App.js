import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { getUser } from './AppStorage';

import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';


const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState([]); // Store user data
  const [loading, setLoading] = useState(true); // Store loading state

  // Fetch user data from storage on app load
  useEffect(() => {
    const fetchUser = async () => {
      const userAccount = await getUser();
      if (userAccount) {
        console.log('User found');
        setUser(userAccount);
      }
      // Set loading to false after fetching user data
      setLoading(false);
    };
    fetchUser();
  }, []);


  // Show loading screen while fetching user data
  if (loading) {
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  } else { // Will be displayed after fetching user data
    return (
      <NavigationContainer>
        {/* Check if user is logged in */}
        {user.length == 0 ? (
          // If the user is not logged in, shows Register screen
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