import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Button, ScrollView, Dimensions } from 'react-native';
import { getUser } from '../AppStorage';
import { Card, Overlay } from 'react-native-elements';
import FlashMessage, { showMessage } from "react-native-flash-message";
import { Appbar } from 'react-native-paper';
import alert from './alert';
import CreateActivity from './CreateActivity';
import EditActivity from './EditActivity';

export default function ActivitiesContent() {
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectActivity, setSelectActivity] = useState('');

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
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  }

  const deleteConfirm = (val) => {
    alert(
      "Are you sure?",
      `Are you sure you want to delete ${val.name}?`,
      [
        {text: "Delete", onPress: () => {deleteActivity(val.id)}},
        {text: "Cancel", style: "cancel", onPress: () => console.log('Cancel Pressed')}
    ]);
  }

  const deleteActivity = async (activityId) => {
    try {
      const response = await fetch(`https://localhost:7267/api/activities/${activityId}`, {
        method: 'DELETE',
        body: JSON.stringify({ id: activityId }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete activity');
      }
    
      showMessage({
        message: "Activity deleted",
        type: "success",
      });

      // Remove the activity from the state directly
      setActivities((prevActivities) => prevActivities.filter(activity => activity.id !== activityId));

    } catch (error) {
      console.error('Error deleting activity:', error);
      showMessage({
        message: "Failed to delete activity",
        type: "danger",
      });
    }
  }

  let activitiesMap = activities.map((val, key) => {
    return (
      <View key={key}> 
          <Card key={key} style={styles.item} containerStyle={styles.itemContainer}>
              <Card.Title h4>{val.name}</Card.Title>
              <Card.Divider />
              <View style={{textAlign: 'center', justifyContent: 'flex-start'}}>
                <Text style={{fontSize: 16}}>Description: {val.description}</Text>
                <Text style={{fontSize: 16}}>Type: {val.type}</Text>
              </View>
              <View style={{justifyContent: 'space-evenly', flexDirection: 'row', marginTop: 20}}>
                <Button title="Edit Activity" color='orange' onPress={() => {setSelectActivity(val); setShowEdit(true)}} /> 
                <Button title="Delete Activity" color='#ff4034' onPress={() => deleteConfirm(val)} />
              </View>
          </Card>
      </View>
    )
  })

  return (    
    <View style={styles.container}>
        <Appbar.Header style={{width: Dimensions.get('window').width}}>
           <Appbar.Content title="Activities" />               
        </Appbar.Header>
        <Overlay isVisible={showCreate} onBackdropPress={() => setShowCreate(false)}>
          <CreateActivity onActivitySuccess={() => { fetchActivities(); setShowCreate(false) }} />
        </Overlay>
        <Overlay isVisible={showEdit} onBackdropPress={() => setShowEdit(false)}>
          <EditActivity selectedActivity={selectActivity} onActivitySuccess={() => { fetchActivities(); setShowEdit(false) }} />
        </Overlay>
        <ScrollView style={styles.scrolling}>
          <Button title="Create" color='#4bb543' onPress={() => setShowCreate(true)} />
            {activitiesMap}
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
});
