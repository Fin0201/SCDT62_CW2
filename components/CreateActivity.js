import React, { useEffect, useState } from 'react';
import { Text, TextInput, View, StyleSheet, Pressable, Dimensions } from 'react-native';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import { Appbar } from 'react-native-paper';
import alert from './alert';

export default function CreateActivity({ onActivitySuccess }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    
    // Creates a new activity using the API
    const createActivity = async () => {
        try {
            console.log(JSON.stringify({ name, description, type }))
            const response = await fetch('https://localhost:7267/api/activities', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, description, type }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Activity creation failed');
            }

            showMessage({
                message: 'Activity created successfully',
                type: 'success',
            });

            onActivitySuccess();
        } catch (error) {
            alert('Error', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.header}>
                <Appbar.Content title="Create Activity" titleStyle={{alignSelf: 'center'}} />               
            </Appbar.Header>
            <Text style={styles.heading}>Name</Text>
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
            />
            <Text style={styles.heading}>Description</Text>
            <TextInput
                style={styles.input}
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
            />
            <Text style={styles.heading}>Type</Text>
            <TextInput
                style={styles.input}
                placeholder="Type"
                value={type}
                onChangeText={setType}
            />
            <Pressable style={[styles.button, {backgroundColor: '#28a745', marginTop: 10 }]} onPress={createActivity}>
                <Text style={{color: 'white', fontWeight: '600'}}>Create Activity</Text>
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
