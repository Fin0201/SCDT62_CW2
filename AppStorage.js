import AsyncStorage from '@react-native-async-storage/async-storage';

// Retrieves the user from AsyncStorage
export const getUser = async () => {
  try {
    const user = await AsyncStorage.getItem('user');
    if(user !== null) {
      return JSON.parse(user);
    }
  } catch (e) {
    console.error(e);
  }
  return null;
}
