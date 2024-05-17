import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { StatusBar } from 'expo-status-bar';
import { BottomNavigation } from 'react-native-paper';

import Navbar from '../components/Navbar';


export default function Home({ navigation }) {
    const [user, setUser] = useState(null);

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

    const logoutUser = async () => {
        try {
        await AsyncStorage.removeItem('user');
        setCreateWorkoutActivities([]);
        setUser([]);
    
        // Reload the app
        navigation.push('index');
        } catch(e) {
            console.error(e);
        }
    }
    
    if (user === null) {
        return (
            navigation.navigate('register')
        );
    } else {
        return (
            <SafeAreaProvider>
                <View style={styles.logoutButton}>
                <TouchableOpacity onPress={logoutUser}>
                    <MaterialCommunityIcons name="logout" size={24} color="black" />
                </TouchableOpacity>
                </View>
                <Navbar />
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
