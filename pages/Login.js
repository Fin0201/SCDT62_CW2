import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, Pressable, View, Alert, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appbar } from 'react-native-paper';

export default function Login({ navigation, route }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessages, setErrorMessages] = useState([]);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // This will display an alert if a message is set when navigating to this screen
  useEffect(() => {
    if (route.params?.message) {
      Alert.alert('Success', route.params.message);
    }
  }, [route.params?.message]);
 
  const handleLogin = async () => {
    try {
      const response = await fetch('https://localhost:7267/api/auth/Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
 
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      await AsyncStorage.setItem('user', JSON.stringify(data));

      navigation.navigate('Home');
    } catch (error) {
      console.error('Login error:', error);
      setLoginSuccess(false); // Reset Login success state
      setErrorMessages([]);
 
      if (error instanceof SyntaxError) {
        setErrorMessages(['Error parsing server response']);
      } else if (error instanceof Error) {
        setErrorMessages([error.message]);
      } else if (error && error.errors) {
        const messages = Object.values(error.errors).flatMap((errorObj) =>
          errorObj.errors.map((e) => e.errorMessage)
        );
        setErrorMessages(messages);
      } else {
        setErrorMessages(['Unknown error occurred']);
      }
 
      Alert.alert('Error', 'Failed to Login');
    }
  };
 
  return (
<View style={styles.container}>
  <Appbar.Header style={styles.header}>
    <Appbar.Content title="Register" />
  </Appbar.Header>
  <Text style={styles.heading}>Login</Text>
        {errorMessages.map((errorMessage, index) => (
  <Text key={index} style={styles.errorText}>{errorMessage}</Text>
        ))}
        {loginSuccess && (
  <Text style={styles.successText}>Login successful!</Text>
        )}
  <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(text) => setEmail(text)}
          value={email}
          keyboardType="email-address"
        />
  <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry
        />
  <Pressable style={[styles.button, {backgroundColor: '#28a745'}]} onPress={handleLogin}>
    <Text style={{color: 'white', fontWeight: '600'}}>Login</Text>
  </Pressable>
  <View style={{marginTop: 20, marginBottom: 5}}>
    <Text style={{textDecorationLine: 'underline'}}>Don't have an account?</Text>
  </View>
  <Pressable style={[styles.button, {backgroundColor: 'orange'}]} onPress={() => navigation.navigate('Register')}>
    <Text style={{color: 'white', fontWeight: '600'}}>Register</Text>
  </Pressable>
</View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#BAF1FF',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '90%',
    backgroundColor: 'white',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  successText: {
    color: 'green',
    marginBottom: 10,
  },
  header: {
    width: Dimensions.get('window').width,
    backgroundColor: '#4bb5e3',
  },
  heading: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 3,
    marginTop: 30,
    width: 300,
  },
  button: {
    alignItems: 'center', 
    borderRadius: 10,
    padding: 10,
  },
});