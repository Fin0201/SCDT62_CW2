import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomNavigation } from 'react-native-paper';

import alert from '../components/alert';
import Activities from '../components/Activities';
import Workouts from '../components/Workouts';

export default function Home({ navigation }) {
    const [user, setUser] = useState([]);
    const [index, setIndex] = useState(0);

    const [routes] = useState([
        { key: 'activities', title: 'Activities', icon: 'run' },
        { key: 'workouts', title: 'Workouts', icon: 'dumbbell' },
    ]);

    const renderScene = BottomNavigation.SceneMap({
        activities: Activities,
        workouts: Workouts,
    });

    const logoutConfirm = () => {
        alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel", onPress: () => console.log('Cancel Pressed') },
                { text: "Logout", onPress: () => logoutUser() },
            ]
        );
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
                <TouchableOpacity onPress={logoutConfirm}>
                    <MaterialCommunityIcons name="logout" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                <BottomNavigation
                    navigationState={{ index, routes }}
                    onIndexChange={setIndex}
                    renderScene={renderScene}
                    shifting={false}
                    barStyle={{ backgroundColor: '#4bb5e3' }}
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
        top: 20,
        right: 10,
        zIndex: 15,
    },
});
