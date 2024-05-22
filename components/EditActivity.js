import React, { useEffect, useState } from 'react';
import { Text, TextInput, View, StyleSheet, Pressable, Dimensions } from 'react-native';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import { Appbar } from 'react-native-paper';

export default function EditActivity({ selectedActivity, onActivitySuccess }) {
    const [name, setName] = useState(selectedActivity.name);
    const [description, setDescription] = useState(selectedActivity.description);
    const [type, setType] = useState(selectedActivity.type);
    
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

            showMessage({
                message: 'Activity edited successfully',
                type: 'success',
            });

            onActivitySuccess();
        } catch (error) {
            console.error('Edit error:', error);
            showMessage({
                message: 'Failed to edit activity',
                type: 'danger',
            });
        }
    };

    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.header}>
                <Appbar.Content title="Edit Activity" titleStyle={{alignSelf: 'center'}} />               
            </Appbar.Header>
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
            <Pressable style={[styles.button, { backgroundColor: '#28a745', marginTop: 10 }]} onPress={editActivity}>
                <Text style={{color: 'white', fontWeight: '600'}}>Save</Text>
            </Pressable>
            <Pressable style={[styles.button, {backgroundColor: '#ff4034'}]} onPress={onActivitySuccess}>
                <Text style={{color: 'white', fontWeight: '600'}}>Cancel</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#BAF1FF',
    },
    input: {
        width: Dimensions.get('window').width * 0.9 - 40,
        padding: 10,
        margin: 5,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        backgroundColor: 'white',
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
        marginBottom: 1,
        marginTop: 5,
        width: 300,
    },
    header: {
        width: Dimensions.get('window').width * 0.9,
        backgroundColor: '#4bb5e3',
    },
    button: {
        alignItems: 'center', 
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
});
