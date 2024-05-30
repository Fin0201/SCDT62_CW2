import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, Dimensions, Pressable } from 'react-native';
import { Card, Overlay } from 'react-native-elements';
import FlashMessage, { showMessage } from "react-native-flash-message";
import { Appbar } from 'react-native-paper';
import alert from './alert';

import CreateWorkout from './CreateWorkout';
import EditWorkout from './EditWorkout';
import { TouchableOpacity } from 'react-native-gesture-handler';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

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

  // Delete a workout
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

  const workoutsMap = workouts.map((val, key) => (
      <View key={key}> 
          <Card key={key} style={styles.item} containerStyle={styles.itemContainer}>
              <Card.Title h4>Workout: {val.activity.name}</Card.Title>
              <Card.Divider />
              <View style={{ textAlign: 'center', justifyContent: 'flex-start' }}>
                <Text style={{ fontSize: 16, textAlign: 'center' }}>Description: {val.activity.description}</Text>
                <Text style={{ fontSize: 16, textAlign: 'center' }}>Type: {val.activity.type}</Text>
                <Card.Divider />
                <Text style={{fontSize: 18}}>Duration: {val.duration} minutes</Text>
              </View>
              <View style={{justifyContent: 'space-evenly', flexDirection: 'row', marginTop: 20}}>
                <Pressable onPress={() => {setSelectWorkout(val); setShowEdit(true)}} style={[styles.button, {backgroundColor: 'orange'}]}>
                  <Text style={{color: 'white', fontWeight: '600'}}>Edit Workout</Text>
                </Pressable>
                <Pressable onPress={() => deleteConfirm(val)} style={[styles.button, {backgroundColor: '#ff4034'}]}>
                  <Text style={{color: 'white', fontWeight: '600'}}>Delete Workout</Text>
                </Pressable>
              </View>
          </Card>
      </View>
  ));

  return (    
    <View style={styles.container}>
        <Appbar.Header style={styles.header}>
          <Appbar.Content title="Workouts" />
        </Appbar.Header>
        <Overlay isVisible={showSelectActivity} onBackdropPress={() => setShowSelectActivity(false)} overlayStyle={{ padding: 0, maxWidth: screenWidth*0.9, maxHeight: screenHeight*0.9 }}>
          <CreateWorkout onWorkoutSuccess={() => { fetchWorkouts(); setShowSelectActivity(false) }} />
        </Overlay>
        <Overlay isVisible={showEdit} onBackdropPress={() => setShowEdit(false)} overlayStyle={{ padding: 0, maxWidth: screenWidth*0.9, maxHeight: screenHeight*0.9 }}>
          <EditWorkout selectedWorkout={selectWorkout} onWorkoutSuccess={() => { fetchWorkouts(); setShowEdit(false) }} />
        </Overlay>
          <Pressable onPress={() => setShowSelectActivity(true)} style={[styles.button, styles.createButton]}>
            <Text style={{color: 'white', fontWeight: '600'}}>Create Workout</Text>
          </Pressable>
        <ScrollView style={styles.scroll}>
          {workoutsMap}
        </ScrollView>
        <FlashMessage position="top" />
    </View>
  );
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
    width: screenWidth,
    backgroundColor: '#4bb5e3',
  },
  scroll: {
    width: '100%',
  },
  button: {
    alignItems: 'center', 
    borderRadius: 10,
    padding: 10,
  },
  createButton: {
    backgroundColor: '#4bb543',
    marginTop: 30,
    marginBottom: 10,
    width: 300,
  },
  item: {
    marginBottom: 20,
  },
  itemContainer: {
    borderWidth: 1, 
    borderRadius: 16,
    backgroundColor: '#d9fcff',
    borderColor: '#47504f',
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
});
