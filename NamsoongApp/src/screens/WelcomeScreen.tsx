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
  const {user} = useAuth();

  const onGetStarted = () => {
    // This REPLACES the Welcome screen with the Home screen.
    // This means the user can't press "back" to get to this screen.
    navigation.replace('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#50bcfc" />
      {/* Top Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/logo_dark.png')}
          style={styles.logo}
        />
        {/*<Text style={styles.logoText}>Namsoong.</Text>*/}
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.title}>
          Hi {user?.name}, Welcome to Namsoong.
        </Text>
        <Text style={styles.subtitle}>
          Explore the app, Easily create notes while reading a PDF.
        </Text>

        <Image
          source={require('../../assets/welcome_graphics.png')}
          style={styles.illustration}
        />
      </View>

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
    width: 30,
    height: 30,
    resizeMode: 'contain',
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
    paddingTop: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#013247',
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: '#013247',
    textAlign: 'center',
    marginBottom: 40,
  },
  illustration: {
    width: 300,
    height: 300,
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
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#013247',
  },
});