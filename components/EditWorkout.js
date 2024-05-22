import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Button, ScrollView, Dimensions, TextInput } from 'react-native';
import { Card, Overlay } from 'react-native-elements';
import FlashMessage from "react-native-flash-message";
import { Appbar } from 'react-native-paper';

export default function EditWorkoutActivity({ selectedWorkout, onWorkoutSuccess }) {
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(selectedWorkout.activity);
  const [duration, setDuration] = useState(String(selectedWorkout.duration));

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
          throw new Error(data.message || 'Edit failed');
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

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
          <Button
            title={selectedActivity.id === val.id ? 'Selected' : 'Select Activity'}
            onPress={() => { setSelectedActivity(val); }}
            color={selectedActivity.id === val.id ? '#28a745' : '#007BFF'}
          />
        </View>
      </Card>
    </View>
  ));

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content title="Edit Workout" titleStyle={{alignSelf: 'center'}} />               
      </Appbar.Header>
      <ScrollView style={styles.scrolling}>
        {activitiesMap}
      </ScrollView>
      <Text style={styles.heading}>Duration in minutes</Text>
      <TextInput
          style={styles.input}
          placeholder="Duration in minutes"
          defaultValue={selectedWorkout.duration.toString()}
          onChangeText={setDuration}
          keyboardType="numeric"
      />
      <View style={{ marginVertical: 10 }}>
        <Button 
          title={selectedActivity ? `Save ${selectedActivity.name} Workout` : "Save Workout"} 
          onPress={editWorkout} 
          color={selectedActivity ? '#28a745' : 'gray'}
        />
      </View>
      <View style={{ marginBottom: 10 }}>
        <Button title="Cancel" color='#ff4034' onPress={onWorkoutSuccess} />
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
  scrolling: {
    width: '100%',
  },
  itemContainer: {
    borderWidth: 2, 
    borderRadius: 16,
  },
  heading: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: -7,
    marginTop: 5,
    width: 300,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '80%',
    marginVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    textAlign: 'center',
    backgroundColor: 'white',
  },
  header: {
    width: Dimensions.get('window').width,
    backgroundColor: '#4bb5e3',
  },
});
