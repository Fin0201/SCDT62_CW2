import React, { useEffect, useState } from 'react';
import { Text, TextInput, View, StyleSheet, Button, Alert, ScrollView, Dimensions } from 'react-native';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";

export default function EditActivity({ selectedActivity, onActivitySuccess }) {
    const [name, setName] = useState(selectedActivity.name);
    const [description, setDescription] = useState(selectedActivity.description);
    const [type, setType] = useState(selectedActivity.type);

    const [activitySuccess, setActivitySuccess] = useState(false);
    
    const editActivity = async () => {
        try {
            const response = await fetch(`https://localhost:7267/api/activities/${selectedActivity.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: selectedActivity.id,
                    name,
                    description,
                    type,
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
            <Text style={styles.title}>Edit Activity</Text>
            <Text style={styles.heading}>Name</Text>
            <TextInput
                style={styles.input}
                placeholder="Name"
                onChangeText={setName}
                defaultValue={selectedActivity.name}
            />
            <Text style={styles.heading}>Description</Text>
            <TextInput
                style={styles.input}
                placeholder="Description"
                onChangeText={setDescription}
                defaultValue={selectedActivity.description}
            />
            <Text style={styles.heading}>Type</Text>
            <TextInput
                style={styles.input}
                placeholder="Type"
                onChangeText={setType}
                defaultValue={selectedActivity.type}
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
    itemContainer: {
        borderWidth: 2, 
        borderRadius: 16,
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
