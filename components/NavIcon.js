import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Navigation Bar Item Image with Title
export default NavItem = ({ handlePress, selectedTab, icon, itemName, styles }) => (
  <View style={styles.navItem}>
    <TouchableOpacity onPress={() => handlePress(itemName)} style={{  alignItems: 'center', justifyContent: 'center' }}>
      <MaterialIcons 
        name={icon}
        size={24}
        color={selectedTab === itemName ? '#514eb5' : '#b6b6b6'}
      />
      <Text style={selectedTab === itemName ? styles.navTextSelected : styles.navText}>{itemName}</Text>
    </TouchableOpacity>
  </View>
);