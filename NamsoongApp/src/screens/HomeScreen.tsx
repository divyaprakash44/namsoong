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
// Lazy-require native modules to avoid runtime errors during module evaluation
// if native modules are not yet linked or available (this can happen during
// development when the native build hasn't been refreshed). We'll require
// them inside the handler where they're actually used.
import DocumentPicker from 'react-native-document-picker';

import RNFS from 'react-native-fs';
import { WWW_ROOT } from '../server.ts';

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

    const handleOpenPdf = async () => {
      let DocumentPicker: any;
    let RNFS: any;
    try {
      DocumentPicker = require('react-native-document-picker');
      RNFS = require('react-native-fs');
    } catch (e) {
      Alert.alert('Native module missing', 'Required libraries not linked. Please rebuild the app.');
      return;
    }

    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf],
      });

      // --- THIS IS THE CRITICAL FIX ---
      // 1. Define where we will copy the file, inside the server's root
      // We use res.name to keep the original filename
      const destPath = `${WWW_ROOT}/${res.name}`;
      
      // 2. Copy the file from the picker's URI to our server's directory
      await RNFS.copyFile(res.uri, destPath);
      // --- END OF FIX ---

      console.log(`File copied to ${destPath}`);

      navigation.navigate('PdfViewer', {
        pdfId: res.name,
        title: res.name,
        // --- We now pass the FILENAME, not the source object ---
        filename: res.name, 
      });
    } catch (err: any) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled
      } else {
        Alert.alert('Error', 'Could not open or read file.');
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