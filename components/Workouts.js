import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Button, ScrollView, Dimensions } from 'react-native';
import { getUser } from '../AppStorage';
import { Card, Overlay } from 'react-native-elements';
import FlashMessage, { showMessage } from "react-native-flash-message";
import { Appbar } from 'react-native-paper';
import alert from './alert';

import CreateWorkout from './CreateWorkout';
import EditWorkout from './EditWorkout';

export default function WorkoutsContent() {
  const [loading, setLoading] = useState(true);
  const [workouts, setWorkouts] = useState([]);
  const [showSelectActivity, setShowSelectActivity] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectWorkout, setSelectWorkout] = useState('');

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {      
      // Fetch all workouts associated with the current user
      const response = await fetch(`https://localhost:7267/api/workouts`);
      const responseJson = await response.json();
      setWorkouts(responseJson);
    } catch (error) {
      console.error('Error fetching user or workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  }

  const deleteConfirm = (val) => {
    alert(
      "Are you sure?",
      `Are you sure you want to delete ${val.name}?`,
      [
        {text: "Delete", onPress: () => {deleteWorkout(val.id)}},
        {text: "Cancel", style: "cancel", onPress: () => console.log('Cancel Pressed')}
    ]);
  }

  const deleteWorkout = async (workoutId) => {
    try {
      const response = await fetch(`https://localhost:7267/api/workouts/${workoutId}`, {
        method: 'DELETE',
        body: JSON.stringify({ id: workoutId }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete workout');
      }
    
      showMessage({
        message: "Workout deleted",
        type: "success",
      });

      // Remove the workout from the state directly
      setWorkouts((prevWorkouts) => prevWorkouts.filter(workout => workout.id !== workoutId));

    } catch (error) {
      console.error('Error deleting workout:', error);
      showMessage({
        message: "Failed to delete workout",
        type: "danger",
      });
    }
  }

  let workoutsMap = workouts.map((val, key) => {
    return (
      <View key={key}> 
          <Card key={key} style={styles.item} containerStyle={styles.itemContainer}>
              <Card.Title h4>Workout: {val.activity.name}</Card.Title>
              <Card.Divider />
              <View style={{textAlign: 'center', justifyContent: 'flex-start'}}>
                <Text style={{fontSize: 16}}>Description: {val.activity.description}</Text>
                <Text style={{fontSize: 16, marginBottom: 25}}>Type: {val.activity.type}</Text>
                <Card.Divider />
                <Text style={{fontSize: 18}}>Duration: {val.duration} minutes</Text>
              </View>
              <View style={{justifyContent: 'space-evenly', flexDirection: 'row', marginTop: 20}}>
                <Button title="Edit Workout" color='orange' onPress={() => {setSelectWorkout(val); setShowEdit(true)}} /> 
                <Button title="Delete Workout" color='#ff4034' onPress={() => deleteConfirm(val)} />
              </View>
          </Card>
      </View>
    )
  })

  return (    
    <View style={styles.container}>
        <Appbar.Header style={styles.header}>
          <Appbar.Content title="Workouts" />
        </Appbar.Header>
        <Overlay isVisible={showSelectActivity} onBackdropPress={() => setShowSelectActivity(false)} overlayStyle={{ padding: 0 }}>
          <CreateWorkout onWorkoutSuccess={() => { fetchWorkouts(); setShowSelectActivity(false) }} />
        </Overlay>
        <Overlay isVisible={showEdit} onBackdropPress={() => setShowEdit(false)} overlayStyle={{ padding: 0 }}>
          <EditWorkout selectedWorkout={selectWorkout} onWorkoutSuccess={() => { fetchWorkouts(); setShowEdit(false) }} />
        </Overlay>
        <View style={styles.createButton}>
          <Button title="Create" color='#4bb543' onPress={() => setShowSelectActivity(true)} />
        </View>
        <ScrollView style={styles.scroll}>
          {workoutsMap}
        </ScrollView>
        <FlashMessage position="top" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#BAF1FF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  header: {
    width: Dimensions.get('window').width,
    backgroundColor: '#4bb5e3',
  },
  scroll: {
    width: Dimensions.get('window').width,
  },
  createButton: {
    marginTop: 30,
    marginBottom: 10,
    width: 300,
  },
});
