import React, { useEffect, useState } from 'react';
import { Text, TextInput, View, StyleSheet, Button, Alert, ScrollView, Dimensions } from 'react-native';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";

export default function EditActivity(params) {
    const [id, setId] = useState(params.params.id);
    const [name, setName] = useState(params.params.name);
    const [description, setDescription] = useState(params.params.description);
    const [type, setType] = useState(params.params.type);

    const [activitySuccess, setActivitySuccess] = useState(false);
    
    const EditActivity = async ({ onActivitySuccess }) => {
        try {
            let aaaa = JSON.stringify({
                "id": id,
                "name": name,
                "description": description,
                "type": type
            });
            console.log(JSON.stringify({
                id,
                userID: params.params.id,
                name,
                type,
                description,
              }));
            const response = await fetch(`https://localhost:7267/api/activities/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id,
                    userID: params.params.id,
                    name,
                    type,
                    description,
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

            // Close the overlay
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
                defaultValue={params.params.name}
            />
            <TextInput
                style={styles.input}
                placeholder="Description"
                onChangeText={setDescription}
                defaultValue={params.params.description}
            />
            <TextInput
                style={styles.input}
                placeholder="Type"
                onChangeText={setType}
                defaultValue={params.params.type}
            />
            <Button title="Save" onPress={EditActivity} />
            <Button title="Cancel" color='#ff4034' onPress={params.onActivitySuccess} />
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
        width: 200,
        margin: 12,
        borderWidth: 1,
    },
});