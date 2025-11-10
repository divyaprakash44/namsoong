import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import {useAuth} from '../../App';
import {styles} from '../styles/homeStyles.ts'
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import DocumentPicker from 'react-native-document-picker';

// --- Helper function for the greeting ---
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
};

// --- Mock data for Quick Access. We will load this from the DB later. ---
const quickAccessData = [
  {id: '1', name: 'Filename.pdf', date: '09/11/2025'},
  {id: '2', name: 'Filename.pdf', date: '09/11/2025'},
  {id: '3', name: 'Filename.pdf', date: '09/11/2025'},
  {id: '4', name: 'Filename.pdf', date: '09/11/2025'},
];

export const HomeScreen = ({navigation}: {navigation: any}) => {
  const {user} = useAuth();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  const requestFilePermission = async () => {
    // We only need to ask on Android
    if (Platform.OS === 'android') {
      try {
        // We need 'read' permission
        const result = await request(
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        );
        if (result === RESULTS.GRANTED) {
          return true; // Permission granted
        } else {
          Alert.alert(
            'Permission Denied',
            'Cannot open files without permission.',
          );
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; // On iOS or other platforms, assume true
  };

  const handleOpenPdf = async () => {
    const hasPermission = await requestFilePermission();
    if (!hasPermission) {
      return; // Stop if no permission
    }

    // Now, open the file picker
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf], // Only allow PDFs
      });

      // User picked a file!
      console.log('Selected file:', res);

      // Now we navigate to the PdfViewer
      navigation.navigate('PdfViewer', {
        pdfId: res.name, // Use filename as the ID
        title: res.name,
        // The source is now a 'file://' URI
        source: {uri: res.uri, cache: false}, 
      });

    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
      } else {
        Alert.alert('Error', 'Could not open file picker.');
        console.error(err);
      }
    }
  };

  const handleExportNotes = () => {
    Alert.alert('Exporting...', 'This feature is coming soon!');
    // TODO: Link to our export API
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{paddingBottom: 40}}>
        {/* --- Header --- */}
        
          <Image
            source={require('C:/Projects/namsoong-backend/NamsoongApp/assets/logo_dark.png')}
            style={styles.logo}
          />
        

        {/* --- Greeting --- */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingTitle}>
            {greeting}, {user?.name}
          </Text>
          <Text style={styles.greetingSubtitle}>
            We Wish you have a good day
          </Text>
        </View>

        {/* --- Action Buttons --- */}
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionButton} onPress={handleOpenPdf}>
            <Image
              source={require('C:/Projects/namsoong-backend/NamsoongApp/assets/book_stack.png')}
              style={styles.actionImage}
            />
            <Text style={styles.actionText}>Open a new PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleExportNotes}>
            <Image
              source={require('C:/Projects/namsoong-backend/NamsoongApp/assets/book_stack.png')}
              style={styles.actionImage}
            />
            <Text style={styles.actionText}>Export notes to PDF</Text>
          </TouchableOpacity>
        </View>

        {/* --- Daily Thought (Placeholder) --- */}
        <View style={styles.dailyThought}>
          <View>
            <Text style={styles.dailyThoughtTitle}>Daily Thought</Text>
            <Text style={styles.dailyThoughtSubtitle}>
              MEDITATION • 3-10 MIN
            </Text>
          </View>
          <View style={styles.playButton}>
            <View style={styles.playIcon} />
          </View>
        </View>

        {/* --- Quick Access --- */}
        <View style={styles.quickAccessContainer}>
          <Text style={styles.quickAccessTitle}>Quick access</Text>
          {quickAccessData.map(item => (
            <TouchableOpacity key={item.id} style={styles.quickAccessItem}>
              <Image
                source={require('C:/Projects/namsoong-backend/NamsoongApp/assets/pdf_icon.png')}
                style={styles.quickAccessIcon}
              />
              <View style={styles.quickAccessDetails}>
                <Text style={styles.quickAccessName}>{item.name}</Text>
                <Text style={styles.quickAccessDate}>
                  Created: {item.date}
                </Text>
              </View>
              <View style={styles.openButton}>
                <Text style={styles.openButtonText}>Open</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      {/* TODO: Add Bottom Tab Navigator here */}
    </SafeAreaView>
  );
};