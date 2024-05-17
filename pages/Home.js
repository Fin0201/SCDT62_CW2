import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { StatusBar } from 'expo-status-bar';
import { BottomNavigation } from 'react-native-paper';

import HomeContent from '../components/HomeContent';
import ActivitiesContent from '../components/ActivitiesContent';
import WorkoutsContent from '../components/WorkoutsContent';


export default function Home({ navigation }) {
    const [user, setUser] = useState([]);
    const [index, setIndex] = useState(0);

    const [routes] = useState([
        { key: 'home', title: 'Home', icon: 'home' },
        { key: 'activities', title: 'Activities', icon: 'run' },
        { key: 'workouts', title: 'Workouts', icon: 'dumbbell' },
    ]);

    const renderScene = BottomNavigation.SceneMap({
        home: HomeContent,
        activities: ActivitiesContent,
        workouts: WorkoutsContent,
    });

    const logoutConfirm = () => {
        return (
            <SafeAreaProvider>
                {Alert.alert(
                "Are you sure you want to logout?",
                [
                    {text: "Logout", onPress: () => logoutUser()}, {text: "Cancel"},
                ]
                )}
            </SafeAreaProvider>
        )
    }

    const logoutUser = async () => {
        let response = await fetch('https://localhost:7267/api/auth/Logout', {
            method: 'POST',
        });
        
        if (!response.ok) {
            console.error('Logout failed');
            return;
        }

        try {
            await AsyncStorage.removeItem('user');
            setUser([]);
            navigation.reset({
                index: 0,
                routes: [{ name: 'Register' }],
            });
        } catch(e) {
            console.error(e);
        }
    }
    
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
