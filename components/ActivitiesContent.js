import React, { useEffect, useState } from 'react';
import { Text, TextInput, View, StyleSheet, Button, Alert, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { getUser } from '../AppStorage';
import { Card, Overlay, Header } from 'react-native-elements';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import { Appbar } from 'react-native-paper';

export default function ActivitiesContent() {
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const userAccount = await getUser();
      if (userAccount) {
        console.log('User found');
        setUser(userAccount);
      }
      setLoading(false);
    };
    fetchUser();

    const fetchActivities = async () => {
      try {
        const response = await fetch(`https://localhost:7267/api/activities/user/${user.id}`);
        const data = await response.json();
        setActivities(data);
      } catch (error) {
        console.error('Error fetching activities:', error);
        setActivities([]);
      }
    };
    fetchActivities();
  }, []);

  if (loading) {
    return <Text style={styles.loadingText}>Loading...</Text>
  }

  const deleteConfirm = (val) => {
    return Alert.alert(
      "Are you sure?",
      `Are you sure you want to delete ${val.name}?`,
      [
        {text: "Delete", onPress: () => deleteActivity(val.id)}, {text: "Back"}
      ]
    )
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
              <Card.Title h4>{val.name} ({val.type})</Card.Title>
              <Card.Divider />
              <View style={{textAlign: 'center', justifyContent: 'flex-start'}}>
                  <Text style={{fontSize: 16}}>Description: {val.description}</Text>
              </View>     
              <View style={{justifyContent: 'space-evenly', flexDirection: 'row', marginTop: 20}}>
                  <Button title="Edit Activity" color={'orange'} onPress={() => {setToEdit(val); setEditVisible(true);}} /> 
                  <Button title="Delete Activity" color={'#ff4034'} onPress={() => deleteConfirm(val)} />
              </View>
          </Card>
      </View>
    )
  })

  return (
    <View style={styles.container}>
        <Appbar.Header style={{width: Dimensions.get('window').width, backgroundColor: '#f06c64'}}>
           <Appbar.Action icon="plus" onPress={toggleCreate} accessibiltyLevel />
           <Appbar.Content title="Activities" subtitle={'Activities are used when creating a Workout'} />               
       </Appbar.Header>
        <Overlay isVisible={createVisible} onBackdropPress={toggleCreate} overlayStyle={{backgroundColor: '#f8c4c4', borderColor: '#47504f', borderWidth: 2, borderRadius: 15,}}>
            <Create params={user} />
            <View style={{marginTop: 30}}>
                <Button color={'#FF6961'} onPress={() => toggleCreate()} title={"Go Back"} />
            </View>
        </Overlay>
        <Overlay isVisible={editVisible} onBackdropPress={toggleEdit} overlayStyle={{backgroundColor: '#f8c4c4', borderColor: '#47504f', borderWidth: 2, borderRadius: 15,}} >
            <Edit activ={toEdit} />
            <View style={{marginTop: 30}}>
                <Button color={'#FF6961'} onPress={() => toggleEdit()} title={"Go Back"} />
            </View>
        </Overlay>
        <ScrollView style={styles.scrolling}>
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
    loadingText: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });