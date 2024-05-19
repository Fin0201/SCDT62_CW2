import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, Button, View, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
<Text>Login</Text>
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
<Button title="Login" onPress={handleLogin} />
<Text style={styles.linkText}>Don't have an account?</Text>
<Button title="Register" onPress={() => navigation.navigate('Register')} />
</View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  successText: {
    color: 'green',
    marginBottom: 10,
  },
  linkText: {
    textDecorationLine: 'underline',
  },
});