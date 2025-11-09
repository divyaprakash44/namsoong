// --- File: NamsoongApp/src/screens/LoginScreen.tsx ---
import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import {useAuth} from '../../App';
import {authStyles} from '../styles/authStyles.ts'; // We will create this next

// --- This is our Login Screen Component ---
// A "component" is just a piece of the UI.
const LoginScreen = ({navigation}: {navigation: any}) => {
  // "State" holds data that can change.
  // We create state for the email and password text inputs.
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const {login} = useAuth();

  // This function will run when the "Login" button is pressed
  const handleLogin = async () => {
    // Basic validation
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    setIsLoading(true);
    try {
        await login(email, password);

    } catch (error: any) {
        Alert.alert("Login failed", error.message);
    }
    setIsLoading(false);
  };

  // This is the "View" - what the component looks like (written in JSX)
  return (
    <SafeAreaView style={authStyles.container}>
      <View style={authStyles.container}>
        <Image style={authStyles.logo}
        source={require("./assets/login_logo.png")}
        />

        <Text style={authStyles.title}>Welcome to Namsoong.</Text>
        <Text style={authStyles.subtitle}>Please log in to continue</Text>

        <TextInput
          style={authStyles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail} // Updates the 'email' state on every keystroke
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={authStyles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword} // Updates the 'password' state
          secureTextEntry // Hides the password
        />

        <TouchableOpacity style={authStyles.button} onPress={handleLogin} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={authStyles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
      </View>
    
      <TouchableOpacity
        style={authStyles.footerButton}
        onPress={() => navigation.navigate('Register')}>
        <Text style={authStyles.footerButtonText}>
          Don't have an account? <Text style={authStyles.linkText}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
      <Text style={authStyles.footerText}>An experiment from Blackbody Labs</Text>
      <Text style={authStyles.footerText}>By Divya Prakash Singh</Text>
    </SafeAreaView>
  );
};