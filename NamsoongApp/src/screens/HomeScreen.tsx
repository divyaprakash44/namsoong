import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import {useAuth} from '../../App';
import {styles} from '../styles/homeStyles.ts';

// --- REMOVED ---
// We no longer need DocumentPicker, RNFS, or WWW_ROOT
// The WebView will handle its own file picking.

// --- Helper function for the greeting ---
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
};

// --- Mock data for Quick Access. ---
// NOTE: This flow will need to be updated.
// This button will now just open the PDF viewer,
// and the user will have to manually select the file again.
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

  // --- MODIFIED "Open PDF" Handler ---
  // This now just navigates to the PdfViewerScreen.
  // The PdfViewerScreen will load viewer.html, which has the
  // <input type="file"> button to let the user pick a file.
  const handleOpenPdf = async () => {
    // We pass NO params, so the viewer knows to show the "Select file" button
    // for a *new* file.
    navigation.navigate('PdfViewer', {});
  };

  // --- MODIFIED "Quick Access" Handler ---
  // This navigates to the viewer and *passes the pdfId*.
  // The viewer.html will *still* ask the user to pick a file,
  // but the PdfViewerScreen will have the `pdfId` ready
  // to save any highlights the user makes.
  const handleOpenQuickAccessPdf = (item: {id: string; name: string}) => {
    navigation.navigate('PdfViewer', {
      pdfId: item.id, // Pass the database ID for saving highlights
    });
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
          // --- FIX: Using relative path ---
          source={require('../../assets/logo_dark.png')}
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
              // --- FIX: Using relative path ---
              source={require('../../assets/book_stack.png')}
              style={styles.actionImage}
            />
            <Text style={styles.actionText}>Open a new PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleExportNotes}>
            <Image
              // --- FIX: Using relative path ---
              source={require('../../assets/book_stack.png')}
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
            <TouchableOpacity
              key={item.id}
              style={styles.quickAccessItem}
              // --- ADDED: onPress handler ---
              onPress={() => handleOpenQuickAccessPdf(item)}>
              <Image
                // --- FIX: Using relative path ---
                source={require('../../assets/pdf_icon.png')}
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
    </SafeAreaView>
  );
};