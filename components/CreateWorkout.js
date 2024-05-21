import React, { useEffect, useState } from 'react';
import { Text, TextInput, View, StyleSheet, Button, Alert, ScrollView, Dimensions } from 'react-native';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";

export default function CreateWorkout({ selectedActivity, onWorkoutSuccess }) {
    const [duration, setDuration] = useState(0);
    const [workoutSuccess, setWorkoutSuccess] = useState(false);

    const createWorkout = async () => {
        try {
            const response = await fetch('https://localhost:7267/api/workouts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ activityID: selectedActivity.id, duration }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Workout creation failed');
            }

            setWorkoutSuccess(true);
            showMessage({
                message: 'Workout created successfully',
                type: 'success',
            });

            onWorkoutSuccess();
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Workout</Text>
            <Text style={styles.heading}>Duration in minutes</Text>
            <TextInput
                style={styles.input}
                placeholder="Duration in minutes"
                value={duration}
                onChangeText={setDuration}
                type="number"
            />
            <Button title="Create Workout" onPress={createWorkout} />
            <Button title="Cancel" color='#ff4034' onPress={onWorkoutSuccess} />
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        width: Dimensions.get('window').width * 0.8,
        padding: 10,
        margin: 10,
        borderWidth: 1,
        borderColor: 'black',
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
    },
    heading: {
        textAlign: 'center',
        fontSize: 16,
        marginBottom: -7,
        marginTop: 5,
        width: 300,
    },
});