// This is the main entry point for our app
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import React, {
  useState,
  useContext,
  createContext,
  useEffect,
  Children,
} from 'react';

import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image
} from 'react-native';

// Import from 'react-native-safe-area-context' instead
import {SafeAreaView} from 'react-native-safe-area-context';

// Navigation imports
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// API import
import axios from 'axios';

// Secure storage import
import * as Keychain from 'react-native-keychain';
import { initDatabase } from './db';
console.log('Keychain:', Keychain);

// Define the shape of our User object
type UserType = {
  id: number;
  name: string;
  email: string;
};

// Define the shape of our Auth Context
type AuthContextType = {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  user: UserType | null;
  token: string | null;
};
// --- END OF NEW TYPES ---

// API Config
const API_URL = 'http://10.0.2.2:4000';

// We create an axios instance so we can easily set the auth token later
const api = axios.create({
  baseURL: API_URL,
})

// --- Auth Context ---
// This is the global state for managing user authentication
const AuthContext = createContext<AuthContextType | null>(null)
const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const [user, setUser] = useState(null); // the user object
  const [token, setToken] = useState(null); // The auth token
  const [isLoading, setIsLoading] = useState(true); // Loading on app start

  //This function is called from our screens
  const authContextValue = {
    login: async (email: string, password: string) => {
      try {
        const response = await api.post('/api/auth/login', {email, password});
        const {token: newToken, user: newUser} = response.data;
        
        setUser(newUser);
        setToken(newToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        await Keychain.setGenericPassword('session', JSON.stringify({token: newToken, user: newUser}));
      } catch (error) {
        console.error('Login error', error);
        throw new Error('Login failed. Please check your credentials.');
      }
    },
    register: async (name: string, email: string, password: string) => {
      try {
        const response = await api.post('/api/auth/register', {name, email, password});
        const {token: newToken, user: newUser} = response.data;

        setUser(newUser);
        setToken(newToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        await Keychain.setGenericPassword('session', JSON.stringify({token: newToken, user: newUser}));
      } catch (error) {
        console.error('Register error', error);
        throw new Error('Registration failed. That email may already be in use.');
      }
    },
    logout: async () => {
      setUser(null);
      setToken(null);
      api.defaults.headers.common['Authorization'] = null;
      await Keychain.resetGenericPassword();
    },
    user,
    token,
  }

  // On app start, try to load the session from the keychain
  useEffect(() => {
    const loadSession = async () => {
      try {
        await initDatabase();
        
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          const session = JSON.parse(credentials.password);
          setUser(session.user);
          setToken(session.token);
          api.defaults.headers.common['Authorization'] = `Bearer ${session.token}`;
        }
      } catch (error) {
        console.error('Failed to load session', error);
      }
      setIsLoading(false);
    };
    loadSession();
  }, []);

  return (
    <AuthContext.Provider value={authContextValue}>
      {isLoading ? <LoadingScreen /> : children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily access auth context
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// --- Screens ---

const LoadingScreen = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" />
    <Text style={styles.subtitle}>Loading...</Text>
  </View>
);

const HomeScreen = () => {
    const {user, logout} = useAuth();

  const handleExport = async () => {
    try {
      // This is where we will call our export API
      // TODO: Get highlights from local DB
      const highlights = [
        "P[1]: This is a test highlight.",
        "P[5]: This is another test highlight."
      ];
      
      const response = await api.post('/api/export/queue', {highlights});
      Alert.alert('Success', response.data.message);

    } catch (error: any) { // <-- ADD :any HERE
      console.error(error);
      Alert.alert('Error', 'Could not start export job.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Welcome,</Text>
        <Text style={styles.subtitle}>{user?.name || 'User'}</Text>
        {/* TODO: Add PDF List here */}
        <TouchableOpacity style={styles.button} onPress={handleExport}>
          <Text style={styles.buttonText}>Test Export</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.footerButton} onPress={logout}>
        <Text style={styles.footerButtonText}>Log Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

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
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Image style={styles.logo}
        source={require("./assets/login_logo.png")}
        />

        <Text style={styles.title}>Welcome to Namsoong.</Text>
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

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
      </View>
    
      <TouchableOpacity
        style={styles.footerButton}
        onPress={() => navigation.navigate('Register')}>
        <Text style={styles.footerButtonText}>
          Don't have an account? <Text style={styles.linkText}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
      <Text style={styles.footerText}>An experiment from Blackbody Labs</Text>
      <Text style={styles.footerText}>By Divya Prakash Singh</Text>
    </SafeAreaView>
  );
};

const RegisterScreen = ({navigation}: {navigation: any}) => {
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
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Image
          style={styles.logo}
          source={require('./assets/login_logo.png')}
        />
        <Text style={styles.title}>Create Account</Text>

        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.footerButton}
        onPress={() => navigation.goBack()}>
        <Text style={styles.footerButtonText}>
          Already have an account? <Text style={styles.linkText}>Log In</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// --- Navigation ---

const Stack = createNativeStackNavigator();

// This stack is shown when the user is NOT logged in
const AuthStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// This stack is shown when the user IS logged in
const AppStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Home" component={HomeScreen} />
    {/* TODO: Add PDF Viewer Screen here */}
  </Stack.Navigator>
);

// This is the main navigator, which decides which stack to show
const RootNavigator = () => {
  const {token} = useAuth();

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {token ? (
        <Stack.Screen name="App" component={AppStack} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

// --- Main App Component ---
function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar barStyle={'dark-content'} />
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
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
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    width: 350,
    height: 200,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
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
  footerButton: {
    paddingVertical: 10,
    marginBottom: 5,
  },
  footerButtonText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  linkText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  footerText: {
    fontSize: 14,
    color: '#AAAAAA',
    textAlign: 'center',
    //paddingBottom: 20,
    fontStyle: 'italic',
  },
});

export default App;
