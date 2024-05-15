import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function Activities() {
    return (
        <View style={styles.container}>
        <Text>Activities</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });