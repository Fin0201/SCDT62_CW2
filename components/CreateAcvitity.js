import React, { useEffect, useState } from 'react';
import { Text, TextInput, View, StyleSheet, Button, Alert, ScrollView, Dimensions } from 'react-native';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";

export default function CreateActivity({ params, onActivitySuccess }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const [userId, setUserId] = useState(params);
    const [activitySuccess, setActivitySuccess] = useState(false);
    
    const createActivity = async () => {
        try {
            console.log(JSON.stringify({ name, description, type, userId }))
            const response = await fetch('https://localhost:7267/api/activities', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, description, type, userId }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Activity creation failed');
            }

            setActivitySuccess(true);
            showMessage({
                message: 'Activity created successfully',
                type: 'success',
            });

            onActivitySuccess();
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text>Create Activity</Text>
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
            />
            <TextInput
                style={styles.input}
                placeholder="Type"
                value={type}
                onChangeText={setType}
            />
            <Button title="Create Activity" onPress={createActivity} />
            <Button title="Cancel" color='#ff4034' onPress={onActivitySuccess} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: Dimensions.get('window').width - 40,
        padding: 10,
        margin: 5,
        borderWidth: 1,
        borderColor: 'black',
    },
});
