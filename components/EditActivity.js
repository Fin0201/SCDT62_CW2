import React, { useEffect, useState } from 'react';
import { Text, TextInput, View, StyleSheet, Button, Alert, ScrollView, Dimensions } from 'react-native';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";

export default function EditActivity({ params, onActivitySuccess }) {
    const [id, setId] = useState(params.id);
    const [name, setName] = useState(params.name);
    const [description, setDescription] = useState(params.description);
    const [type, setType] = useState(params.type);

    const [activitySuccess, setActivitySuccess] = useState(false);
    
    const editActivity = async () => {
        try {
            const response = await fetch(`https://localhost:7267/api/activities/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id,
                    name,
                    description,
                    type,
                    userID: params.userID
                }),
            });
            
            if (!response.ok) {
                throw new Error(data.message || 'Edit failed');
            }

            setActivitySuccess(true);
            showMessage({
                message: 'Activity edited successfully',
                type: 'success',
            });

            onActivitySuccess();
        } catch (error) {
            console.error('Edit error:', error);
            setActivitySuccess(false);
            showMessage({
                message: 'Failed to edit activity',
                type: 'danger',
            });
        }
    };

    return (
        <View style={styles.container}>
            <Text>Edit Activity</Text>
            <TextInput
                style={styles.input}
                placeholder="Name"
                onChangeText={setName}
                defaultValue={params.name}
            />
            <TextInput
                style={styles.input}
                placeholder="Description"
                onChangeText={setDescription}
                defaultValue={params.description}
            />
            <TextInput
                style={styles.input}
                placeholder="Type"
                onChangeText={setType}
                defaultValue={params.type}
            />
            <Button title="Save" onPress={editActivity} />
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
        height: 40,
        width: Dimensions.get('window').width - 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
});
