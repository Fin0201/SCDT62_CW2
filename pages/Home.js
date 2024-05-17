import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { StatusBar } from 'expo-status-bar';
import { BottomNavigation } from 'react-native-paper';

import Activities from '../components/Activities';
import Profile from '../components/Profile';
import Workouts from '../components/Workouts';
import Index from '../components/Index';


export default function Home({ navigation }) {
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
        { key: 'index', title: 'Index', icon: 'index', color: '#6200ee' },
        { key: 'activities', title: 'Activities', icon: 'run', color: '#e91e63' },
        { key: 'workouts', title: 'Workouts', icon: 'dumbbell', color: '#e91e63' },
        { key: 'profile', title: 'Profile', icon: 'account-circle', color: '#e91e63' },
    ]);

    const renderScene = BottomNavigation.SceneMap({
        index: Index,
        activities: Activities,
        workouts: Workouts,
        profile: Profile,
    });

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
