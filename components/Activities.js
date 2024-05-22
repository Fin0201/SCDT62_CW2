import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Pressable, ScrollView, Dimensions } from 'react-native';
import { Card, Overlay } from 'react-native-elements';
import FlashMessage, { showMessage } from "react-native-flash-message";
import { Appbar } from 'react-native-paper';
import alert from './alert';
import CreateActivity from './CreateActivity';
import EditActivity from './EditActivity';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

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
              <View style={{ textAlign: 'center', justifyContent: 'flex-start' }}>
                <Text style={{ fontSize: 16, textAlign: 'center' }}>Description: {val.description}</Text>
                <Text style={{ fontSize: 16, textAlign: 'center' }}>Type: {val.type}</Text>
              </View>
              <View style={{justifyContent: 'space-evenly', flexDirection: 'row', marginTop: 20}}>
                <Pressable style={[styles.button, {backgroundColor: 'orange'}]} onPress={() => {setSelectActivity(val); setShowEdit(true)}}>
                  <Text style={{color: 'white', fontWeight: '600'}}>Edit Activity</Text>
                </Pressable>
                <Pressable style={[styles.button, {backgroundColor: '#ff4034'}]} onPress={() => deleteConfirm(val)}>
                  <Text style={{color: 'white', fontWeight: '600'}}>Delete Activity</Text>
                </Pressable>
              </View>
          </Card>
      </View>
    )
  })

  return (    
    <View style={styles.container}>
        <Appbar.Header style={styles.header}>
           <Appbar.Content title="Activities" />               
        </Appbar.Header>
        <Overlay isVisible={showCreate} onBackdropPress={() => setShowCreate(false)} overlayStyle={{ padding: 0, maxWidth: screenWidth*0.9, maxHeight: screenHeight*0.9 }}>
          <CreateActivity onActivitySuccess={() => { fetchActivities(); setShowCreate(false) }} />
        </Overlay>
        <Overlay isVisible={showEdit} onBackdropPress={() => setShowEdit(false)} overlayStyle={{ padding: 0, maxWidth: screenWidth*0.9, maxHeight: screenHeight*0.9 }}>
          <EditActivity selectedActivity={selectActivity} onActivitySuccess={() => { fetchActivities(); setShowEdit(false) }} />
        </Overlay>
        <Pressable style={[styles.button, styles.createButton]} onPress={() => setShowCreate(true)}>
          <Text style={{color: 'white', fontWeight: '600'}}>Create Activity</Text>
        </Pressable>
        <ScrollView style={styles.scroll}>
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
  item: {
    marginBottom: 20,
  },
  itemContainer: {
    borderWidth: 1, 
    borderRadius: 16,
    backgroundColor: '#c2fff8',
    borderColor: '#47504f',
  },
  createButton: {
    backgroundColor: '#4bb543',
    marginTop: 30,
    marginBottom: 10,
    width: 300,
  },
  button: {
    alignItems: 'center', 
    borderRadius: 10,
    padding: 10,
  },
});
