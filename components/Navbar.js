import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import NavItem from './NavIcon';

// Navigation Bar Element
export default function Navbar({ onSelect, currentPage }) {
  const [selectedTab, setSelectedTab] = useState(currentPage);

  // Handler for changing pages and setting state of current tab
  const handlePress = (tab) => {
    setSelectedTab(tab);
    onSelect(tab);
  };

  useEffect(() => {
    setSelectedTab(currentPage);
  }, [currentPage]);
  
  return (
    // Navigation bar image background with Home, Workouts and Activity buttons
    <View style={styles.navBar}>
      <NavIcon handlePress={handlePress} selectedTab={selectedTab} icon="home" itemName='Home' styles={styles} />
      <NavIcon handlePress={handlePress} selectedTab={selectedTab} icon="fitness-center" itemName='Workouts' styles={styles} />
      <NavIcon handlePress={handlePress} selectedTab={selectedTab} icon="directions-run" itemName='Activities' styles={styles} />
    </View>
  );
}

// Custom styling for elements
const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    paddingTop: 8,
    backgroundColor: '#ffffff',
    borderTopWidth: 0,
    borderTopColor: '#e0e0e0',
    shadowColor: '#868686',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 4.84,
    elevation: 5,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    zIndex: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  navText: {
    color: '#b6b6b6',
    fontWeight: '400',
  },
  navTextSelected: {
    color: '#514eb5',
    fontWeight: '600',
  },
});