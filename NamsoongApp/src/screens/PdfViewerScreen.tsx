import React, {useState, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Dimensions,
  ActivityIndicator,
  Platform, // We need this to check the OS
} from 'react-native';
import {useAuth} from '../../App'; // To get the DB connection
import {addHighlight} from '../../db'; // Our function to save highlights
import {styles} from '../styles/pdfViewerStyles'

// --- NEW IMPORTS ---
import {WebView} from 'react-native-webview'; // Replaced 'Pdf'
import Icon from 'react-native-vector-icons/Ionicons';

// This is the "bridge" for sending messages *to* the WebView
const webViewBridge = (action: object) => {
  return `
    window.postMessage(${JSON.stringify(action)});
    true; // Required for Android
  `;
};

export const PdfViewerScreen = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  // Get the PDF data that was passed from the HomeScreen
  const {pdfId, title, source} = route.params;

  // Get the database connection from our global context
  const {db} = useAuth();
  const webViewRef = useRef<WebView>(null); // A ref to talk to our WebView

  // --- State for our new features ---
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedText, setSelectedText] = useState('');
  const [isHighlightMenuVisible, setIsHighlightMenuVisible] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(true); // For our spinner

  // --- This is the core "Add to Doc" logic (mostly unchanged) ---
  const handleAddHighlight = async () => {
    if (!db) {
      Alert.alert('Error', 'Database not connected.');
      return;
    }
    if (!selectedText) {
      Alert.alert('Error', 'No text selected.');
      return;
    }

    try {
      const formattedText = `P[${currentPage}]: ${selectedText}`;
      await addHighlight(db, pdfId, currentPage, formattedText);

      Alert.alert('Success', 'Highlight added to your document!');
      setIsHighlightMenuVisible(false);
      setSelectedText('');
    } catch (error) {
      console.error('Failed to save highlight', error);
      Alert.alert('Error', 'Failed to save highlight.');
    }
  };

  // --- This function handles messages FROM the WebView ---
  const onWebViewMessage = (event: any) => {
    const data = JSON.parse(event.nativeEvent.data);

    switch (data.type) {
      case 'LOAD_COMPLETE':
        setTotalPages(data.totalPages);
        setIsPdfLoading(false); // Hide spinner
        break;
      case 'SELECTION_CHANGED':
        const text = data.text.trim();
        if (text.length > 0) {
          setSelectedText(text);
          setCurrentPage(data.page || 1); // Get the page number from PDF.js
          setIsHighlightMenuVisible(true);
        } else {
          setIsHighlightMenuVisible(false);
          setSelectedText('');
        }
        break;
      case 'ERROR':
        Alert.alert('Error', `Could not load PDF: ${data.message}`);
        navigation.goBack();
        break;
    }
  };

  // This tells the WebView to load the PDF *after* the HTML page is ready
  const handleWebViewLoad = () => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(
        webViewBridge({type: 'LOAD_PDF', source: source}),
      );
    }
  };

  // This is the path to our local HTML file
  const htmlSource =
    Platform.OS === 'android'
      ? {uri: 'file:///android_asset/viewer.html'}
      : // TODO: Add iOS path if needed
        {uri: ''};

  return (
    <SafeAreaView style={styles.container}>
      {/* Header for the PDF Viewer */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back-outline" size={24} color="#007AFF" />
        </TouchableOpacity>

        {/* Page number indicator */}
        <Text style={styles.pageNumberText}>
          {currentPage} / {totalPages || '...'}
        </Text>

        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => Alert.alert('Export!', 'Coming soon...')}>
          <Icon name="document-text-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* --- The updated WebView PDF Viewer --- */}
      <View style={styles.pdfContainer}>
        <WebView
          ref={webViewRef}
          source={htmlSource}
          style={styles.webview}
          originWhitelist={['*']}
          allowFileAccess={true}
          allowFileAccessFromFileURLs={true}
          allowUniversalAccessFromFileURLs={true}
          javaScriptEnabled={true}
          onMessage={onWebViewMessage}
          onLoadEnd={handleWebViewLoad}
          showsVerticalScrollIndicator={false}
          bounces={false}
          // --- NEW ERROR HANDLERS ---
          onError={syntheticEvent => {
            const {nativeEvent} = syntheticEvent;
            console.warn('WebView error: ', nativeEvent);
            Alert.alert('WebView Error', `Failed to load viewer: ${nativeEvent.description}`);
            setIsPdfLoading(false);
          }}
          onHttpError={syntheticEvent => {
            const {nativeEvent} = syntheticEvent;
            console.warn(
              'WebView HTTP error: ',
              nativeEvent.statusCode,
              nativeEvent.url,
            );
            Alert.alert('WebView HTTP Error', `Failed to load resource: ${nativeEvent.url}`);
            setIsPdfLoading(false);
          }}
        />

        {/* Show a loading spinner on top */}
        {isPdfLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator color="#007AFF" size="large" />
            <Text style={styles.loadingText}>Loading PDF...</Text>
          </View>
        )}
      </View>

      {/* --- Our Custom Highlight Menu (Unchanged) --- */}
      {isHighlightMenuVisible && (
        <View style={styles.highlightMenu}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={handleAddHighlight}>
            <Icon name="add-circle" size={22} color="#FFFFFF" />
            <Text style={styles.menuButtonText}>Add to Doc</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => {
              Alert.alert('Copied!', '(Coming soon)');
              setIsHighlightMenuVisible(false);
            }}>
            <Icon name="copy-outline" size={20} color="#FFFFFF" />
            <Text style={styles.menuButtonText}>Copy</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};