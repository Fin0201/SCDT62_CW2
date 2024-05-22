import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Button, ScrollView, Dimensions, TextInput, Alert } from 'react-native';
import { Card } from 'react-native-elements';
import FlashMessage, { showMessage } from "react-native-flash-message";
import { Appbar } from 'react-native-paper';

export default function CreateWorkoutActivity({ onWorkoutSuccess }) {
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState('');
  const [duration, setDuration] = useState(0);

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
          <Button
            title={selectedActivity === val ? 'Selected' : 'Select Activity'}
            onPress={() => { setSelectedActivity(val); }}
            color={selectedActivity === val ? '#28a745' : '#007BFF'}
          />
        </View>
      </Card>
    </View>
  ));

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content title="Workout Creation" titleStyle={{alignSelf: 'center'}} />               
      </Appbar.Header>
      <ScrollView style={styles.scroll}>
        {activitiesMap}
      </ScrollView>
      <Text style={styles.heading}>Duration in minutes</Text>
      <TextInput
        style={styles.input}
        placeholder="Duration in minutes"
        value={duration.toString()}
        onChangeText={setDuration}
        keyboardType="numeric"
      />
      <View style={{ marginVertical: 10 }}>
        <Button 
          title={selectedActivity ? `Create ${selectedActivity.name} Workout` : "Create Workout"} 
          onPress={createWorkout} 
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
  scroll: {
    width: Dimensions.get('window').width,
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
