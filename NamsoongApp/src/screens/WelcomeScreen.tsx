// --- File: NamsoongApp/src/screens/WelcomeScreen.tsx ---

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import {useAuth} from '../../App'; // We will export this from App.tsx

export const WelcomeScreen = ({navigation}: {navigation: any}) => {
  const {user, logout} = useAuth();

  const onGetStarted = () => {
    // This REPLACES the Welcome screen with the Home screen.
    // This means the user can't press "back" to get to this screen.
    navigation.replace('Main');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#50bcfc" />
      {/* Top Logo */}
      
        <Image
          source={require("C:/Projects/namsoong-backend/NamsoongApp/assets/logo_dark.png")}
          style={styles.logo}
        />
        {/*<Text style={styles.logoText}>Namsoong.</Text>*/}
      

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.title}>
          Hi {user?.name}, Welcome to Namsoong.
        </Text>
        <Text style={styles.subtitle}>
          Explore the app, Easily create notes while reading a PDF.
        </Text>

        <Image
          source={require('C:/Projects/namsoong-backend/NamsoongApp/assets/welcome_graphics.png')}
          style={styles.illustration}
        />
      </View>

      {/* --- NEW TEMPORARY LOGOUT BUTTON --- */}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>Temp Log Out</Text>
      </TouchableOpacity>
      {/* --- END OF NEW BUTTON --- */}

      {/* Footer Button */}
      <TouchableOpacity style={styles.button} onPress={onGetStarted}>
        <Text style={styles.buttonText}>GET STARTED</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// Styles for this screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#50bcfc', // Your design's blue color
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    paddingTop: 120,
    width: 150,
    height: 30,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginRight: 8,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#013247', // Dark text from your design
  },
  content: {
    flex: 1, // Pushes button to bottom
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 10,
    
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#013247',
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: 'Helvetica',
  },
  subtitle: {
    fontSize: 16,
    color: '#013247',
    textAlign: 'center',
    marginBottom: 40,
  },
  illustration: {
    width: 500,
    height: 350,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: 'center',
    margin: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#013247',
  },
  logoutButton: {
    backgroundColor: '#ff6b6b', // A red color
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 10, // Add some space between buttons
    elevation: 3,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});