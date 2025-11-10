// This is the main entry point for our app
import React, {
  useState,
  useContext,
  createContext,
  useEffect,
} from 'react';

import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// Import from 'react-native-safe-area-context' instead
// import {SafeAreaView} from 'react-native-safe-area-context';

// Navigation imports
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
// API import
import axios from 'axios';

// Secure storage import
import * as Keychain from 'react-native-keychain';
import { initDatabase, getDBConnection } from './db';
import { SQLiteDatabase } from 'react-native-sqlite-storage';

// --- New Screen Imports ---
import {HomeScreen} from './src/screens/HomeScreen';
import {PdfViewerScreen} from './src/screens/PdfViewerScreen'
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import {RegisterScreen} from './src/screens/RegisterScreen';
import { AccountScreen } from './src/screens/AccountScreen';

// API Config
const API_URL = 'http://10.0.2.2:4000';

// We create an axios instance so we can easily set the auth token later
export const api = axios.create({
  baseURL: API_URL,
});

// Define the shape of our User object
type UserType = {
  id: number;
  name: string;
  email: string;
};
type AuthType = 'new' | 'restored' | null;

// Define the shape of our Auth Context
type AuthContextType = {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  user: UserType | null;
  token: string | null;
  db: SQLiteDatabase | null;
  authType: AuthType;
};
// --- END OF NEW TYPES ---

// --- Auth Context ---
// This is the global state for managing user authentication
const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const [user, setUser] = useState<UserType | null>(null); // the user object
  const [token, setToken] = useState<string | null>(null); // The auth token
  const [db, setDb] = useState<SQLiteDatabase | null>(null);
  const [authType, setAuthType] = useState<AuthType>(null);
  const [isLoading, setIsLoading] = useState(true); // Loading on app start

  //This function is called from our screens
  const authContextValue: AuthContextType = {
    login: async (email: string, password: string) => {
      try {
        const response = await api.post('/api/auth/login', {email, password});
        const {token: newToken, user: newUser} = response.data;
        
        setUser(newUser);
        setToken(newToken);
        setAuthType('new');
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        await Keychain.setGenericPassword(
          'session', 
          JSON.stringify({token: newToken, user: newUser}),
        );
      } catch (error) {
        console.error('Login error', error);
        throw new Error('Login failed. Please check your credentials.');
      }
    },
    register: async (name: string, email: string, password: string) => {
      try {
        const response = await api.post('/api/auth/register', {
          name, 
          email, 
          password
        });
        const {token: newToken, user: newUser} = response.data;

        setUser(newUser);
        setToken(newToken);
        setAuthType('new');
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        await Keychain.setGenericPassword(
          'session', 
          JSON.stringify({token: newToken, user: newUser}),
        );
      } catch (error) {
        console.error('Register error', error);
        throw new Error(
          'Registration failed. That email may already be in use.'
        );
      }
    },
    logout: async () => {
      setUser(null);
      setToken(null);
      setAuthType(null);
      api.defaults.headers.common['Authorization'] = null;
      await Keychain.resetGenericPassword();
    },
    user,
    token,
    db,
    authType,
  }

  // On app start, try to load the session from the keychain
  useEffect(() => {
    const loadApp = async () => {
      try {
        // init DB
        const dbConneection = await getDBConnection();
        await initDatabase();
        setDb(dbConneection);
        
        // Load Session
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          const session = JSON.parse(credentials.password);
          setUser(session.user);
          setToken(session.token);
          setAuthType('restored');
          api.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${session.token}`;
        }
      } catch (error) {
        console.error('Failed to load session', error);
      }
      setIsLoading(false);
    };
    loadApp();
  }, []);

  return (
    <AuthContext.Provider value={authContextValue}>
      {isLoading ? <LoadingScreen /> : children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily access auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// --- Screens ---

const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" />
    <Text style={styles.subtitle}>Loading...</Text>
  </View>
);

// --- Navigation ---
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// --- NEW bottom tab manager ---
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false, // We use our own headers inside the screens
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'AccountTab') {
            iconName = focused ? 'person' : 'person-outline';
          }
          // @ts-ignore - iconName will be set
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF', // Active icon color
        tabBarInactiveTintColor: '#666', // Inactive icon color
        tabBarStyle: {
          backgroundColor: '#FFFFFF', // Tab bar background
        },
        tabBarLabelStyle: {
          fontFamily: 'Helvetica',
        },
      })}>
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{title: 'Home'}}
      />
      <Tab.Screen
        name="AccountTab"
        component={AccountScreen}
        options={{title: 'Account'}}
      />
    </Tab.Navigator>
  );
};

// This stack is shown when the user is NOT logged in
const AuthStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// This stack is shown when the user IS logged in
const AppStack = ({initialRouteName}: {initialRouteName: string}) => (
  <Stack.Navigator 
    initialRouteName={initialRouteName}
    screenOptions={{headerShown: false}}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Main" component={MainTabNavigator} />
    <Stack.Screen name="PdfViewer" component={PdfViewerScreen} />
  </Stack.Navigator>
);

// This is the main navigator, which decides which stack to show
const RootNavigator = () => {
  const {token, authType} = useAuth();

  if (!token) {
    return <AuthStack />;
  }

  return (
    <AppStack
      initialRouteName={authType === 'restored' ? 'Main' : 'Welcome'}
      />
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
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default App;
