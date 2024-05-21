import React, { useEffect, useState } from 'react';
import { Text, TextInput, View, StyleSheet, Button, Alert, ScrollView, Dimensions } from 'react-native';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";

export default function EditWorkout({ selectedWorkout, selectedActivity, onWorkoutSuccess }) {
    const [duration, setDuration] = useState(String(selectedWorkout.duration));
    const [workoutSuccess, setWorkoutSuccess] = useState(false);

    const editWorkout = async () => {
        try {
            const response = await fetch(`https://localhost:7267/api/workouts/${selectedWorkout.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  id: selectedWorkout.id,
                  activityID: selectedActivity.id,
                  duration: parseInt(duration),
                }),
            });

            if (!response.ok) {
                throw new Error(data.message || 'Workout creation failed');
            }

            setWorkoutSuccess(true);
            showMessage({
                message: 'Workout edited successfully',
                type: 'success',
            });

            onWorkoutSuccess();
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Edit Workout</Text>
            <Text style={styles.heading}>Duration in Minutes</Text>
            <TextInput
                style={styles.input}
                placeholder="Duration in minutes"
                value={duration}
                onChangeText={setDuration}
                keyboardType="numeric"
            />
            <Button title="Edit Workout" onPress={editWorkout} />
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
