import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Pressable, ScrollView, Dimensions, TextInput, Alert } from 'react-native';
import { Card } from 'react-native-elements';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import { Appbar } from 'react-native-paper';

export default function CreateWorkoutActivity({ onWorkoutSuccess }) {
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState('');
  const [duration, setDuration] = useState('');

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      // Fetch all activities
      const response = await fetch(`https://localhost:7267/api/activities`);
      const responseJson = await response.json();
      setActivities(responseJson);
    }
    catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const createWorkout = async () => {
    try {
      const response = await fetch('https://localhost:7267/api/workouts', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            activityID: selectedActivity.id,
            duration: duration
          }),
      });

      console.log(JSON.stringify({ activityID: selectedActivity.id, duration: duration }));

      const data = await response.json();

      if (!response.ok) {
          throw new Error(data.message || 'Workout creation failed');
      }

      showMessage({
          message: 'Workout created successfully',
          type: 'success',
      });

      onWorkoutSuccess();
    } catch (error) {
        Alert.alert('Error', error.message);
    }
  };

  const activitiesMap = activities.map((val, key) => (
    <View key={key}> 
      <Card key={key} style={styles.item} containerStyle={styles.itemContainer}>
        <Card.Title h4>{val.name}</Card.Title>
        <Card.Divider />
        <View style={{ textAlign: 'center', justifyContent: 'flex-start' }}>
          <Text style={{ fontSize: 16, textAlign: 'center' }}>Description: {val.description}</Text>
          <Text style={{ fontSize: 16, textAlign: 'center' }}>Type: {val.type}</Text>
        </View>
        <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', marginTop: 20 }}>
          <Pressable onPress={() => { setSelectedActivity(val); }} style={[styles.button, { backgroundColor: selectedActivity.id === val.id ? '#28a745' : '#007BFF' }]}>
            <Text style={{ color: 'white', fontWeight: '600' }}>{selectedActivity.id === val.id ? 'Selected' : 'Select Activity'}</Text>
          </Pressable>
        </View>
      </Card>
    </View>
  ));

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content title="Create Workout" titleStyle={{alignSelf: 'center'}} />               
      </Appbar.Header>
      <ScrollView style={styles.scroll}>
        {activitiesMap}
      </ScrollView>
      <Text style={styles.heading}>Duration in minutes</Text>
      <TextInput
        style={styles.input}
        placeholder="Duration"
        value={duration}
        onChangeText={(text) => {
          // Only update the duration if the new text is an integer
          if (/^\d+$/.test(text) || text === '') {
            setDuration(text);
          }
        }}
      />
      <View style={{ marginVertical: 10 }}>
        <Pressable onPress={createWorkout} style={[styles.button, { backgroundColor: selectedActivity ? '#28a745' : 'gray' } ]}>
          <Text style={{ color: 'white', fontWeight: '600' }}>{selectedActivity ? `Create ${selectedActivity.name} Workout` : "Create Workout"}</Text>
        </Pressable>
      </View>
      <View style={{ marginBottom: 10 }}>
        <Pressable onPress={onWorkoutSuccess} style={[styles.button, { backgroundColor: '#ff4034' }]}>
          <Text style={{ color: 'white', fontWeight: '600' }}>Cancel</Text>
        </Pressable>
      </View>
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
  item: {
    marginBottom: 20,
  },
  itemContainer: {
    width: '100%',
  },
  scroll: {
    width: '100%',
  },
  itemContainer: {
    borderWidth: 1, 
    borderRadius: 16,
    backgroundColor: '#c2fff8',
    borderColor: '#47504f',
  },
  heading: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 1,
    marginTop: 5,
    width: 300,
  },
  button: {
    alignItems: 'center', 
    borderRadius: 10,
    padding: 10,
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
  header: {
    width: Dimensions.get('window').width * 0.9,
    backgroundColor: '#4bb5e3',
  },
});
