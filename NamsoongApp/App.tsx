// This is the main entry point for our app
import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity, // A button that fades on press
  Alert,
} from 'react-native';

// Navigation imports
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// API import
import axios from 'axios';

// --- This is our Login Screen Component ---
// A "component" is just a piece of the UI.
const LoginScreen = () => {
  // "State" holds data that can change.
  // We create state for the email and password text inputs.
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  // This function will run when the "Login" button is pressed
  const handleLogin = async () => {
    // Basic validation
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    try {
      // --- THIS IS THE API CALL ---
      // We're talking to our backend server!
      // NOTE: 10.0.2.2 is a special IP that the Android Emulator
      // uses to talk to your computer's "localhost".
      const response = await axios.post('http://10.0.2.2:4000/api/auth/login', {
        email: email,
        password: password,
      });

      // Show a success message
      // TODO: We will save the token and navigate to the home screen here.
      Alert.alert('Success!', `Welcome, ${response.data.user.name}!`);

    } catch (error) {
      // Show an error message
      console.log(error); // Log the full error to the terminal
      Alert.alert('Login Failed', 'Invalid credentials. Please try again.');
    }
  };

  // This is the "View" - what the component looks like (written in JSX)
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome to Inscribe</Text>
      <Text style={styles.subtitle}>Please log in to continue</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail} // Updates the 'email' state on every keystroke
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword} // Updates the 'password' state
        secureTextEntry // Hides the password
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* TODO: Add a "Register" button here */}
    </SafeAreaView>
  );
};

// --- This is our main App Component ---
// It sets up the navigation system.

// Create the "stack" navigator
const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <StatusBar barStyle={'dark-content'} />
      <Stack.Navigator>
        {/*
          We define our screens here.
          We only have one screen for now: "Login".
          We're also hiding the header at the top.
        */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        {/*
          TODO: Add an "App" stack (the main app)
          and a "Register" screen.
        */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// --- This is the Stylesheet ---
// It's like CSS, but for React Native.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    height: 50,
    borderColor: '#DDDDDD',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007AFF', // A nice blue color
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default App;
