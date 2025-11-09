// --- File: NamsoongApp/src/screens/RegisterScreen.tsx ---
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
import {authStyles} from '../styles/loginStyles.ts'; // We will create this next

export const RegisterScreen = ({navigation}: {navigation: any}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {register} = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    setIsLoading(true);
    try {
      await register(name, email, password);
      // On success, the main navigator will automatically switch screens
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message);
    }
    setIsLoading(false);
  };

  return (
    <SafeAreaView style={authStyles.container}>
      <View style={authStyles.contentContainer}>
        <Image
          style={authStyles.logo}
          source={require("C:/Projects/namsoong-backend/NamsoongApp/assets/login_logo.png")}
        />
        <Text style={authStyles.title}>Create Account</Text>

        <TextInput
          style={authStyles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
        <TextInput
          style={authStyles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={authStyles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={authStyles.button}
          onPress={handleRegister}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={authStyles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={authStyles.footerButton}
        onPress={() => navigation.goBack()}>
        <Text style={authStyles.footerButtonText}>
          Already have an account? <Text style={authStyles.linkText}>Log In</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};