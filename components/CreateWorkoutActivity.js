import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Button, ScrollView, Dimensions } from 'react-native';
import { Card, Overlay } from 'react-native-elements';
import FlashMessage from "react-native-flash-message";
import { Appbar } from 'react-native-paper';

import CreateWorkout from './CreateWorkout';

export default function CreateWorkoutActivity({ onWorkoutSuccess }) {
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [selectActivity, setSelectActivity] = useState('');
  const [showCreateWorkout, setShowCreateWorkout] = useState(false);

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

  const activitiesMap = activities.map((val, key) => (
    <View key={key}> 
      <Card key={key} style={styles.item} containerStyle={styles.itemContainer}>
        <Card.Title h4>{val.name}</Card.Title>
        <Card.Divider />
        <View style={{ textAlign: 'center', justifyContent: 'flex-start' }}>
          <Text style={{ fontSize: 16 }}>Description: {val.description}</Text>
          <Text style={{ fontSize: 16 }}>Type: {val.type}</Text>
        </View>
        <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', marginTop: 20 }}>
          <Button title="Select Activity" color='green' onPress={() => { setSelectActivity(val); setShowCreateWorkout(true); }} /> 
        </View>
      </Card>
    </View>
  ));

  return (    
    <View style={styles.container}>
      <Appbar.Header style={{ width: Dimensions.get('window').width }}>
        <Appbar.Content title="Activities" />               
      </Appbar.Header>
      <Overlay isVisible={showCreateWorkout} onBackdropPress={() => setShowCreateWorkout(false)}>
        <CreateWorkout selectedActivity={selectActivity} onWorkoutSuccess={() => { fetchActivities(); setShowCreateWorkout(false); onWorkoutSuccess(); }} />
      </Overlay>
      <ScrollView style={styles.scrolling}>
        {activitiesMap}
      </ScrollView>
      <Button title="Cancel" color='#ff4034' onPress={onWorkoutSuccess} />
      <FlashMessage position="top" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
});
