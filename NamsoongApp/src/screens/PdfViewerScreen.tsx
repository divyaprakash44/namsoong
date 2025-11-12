import React, {useRef} from 'react';
import {View, Alert} from 'react-native';
import {WebView, WebViewMessageEvent} from 'react-native-webview';
import {styles} from '../styles/pdfViewerStyles';
import Clipboard from '@react-native-clipboard/clipboard';

// We still need these to save the highlight
import {useAuth} from '../../App';
import {addHighlight} from '../../db';

// This is the permanent, correct path to your local HTML file
const viewerHtmlSource = {uri: 'file:///android_asset/viewer.html'};

/**
 * This component is now just a simple "shell" for the WebView.
 * All the PDF logic (picking, loading, rendering) is handled
 * inside the `viewer.html` file.
 * This component's only job is to load the WebView and listen for
 * messages coming back from it (like "COPY_TEXT" or "ADD_TO_DOCS").
 */
export const PdfViewerScreen = ({route}: any) => {
  const webviewRef = useRef<WebView>(null);
  const {db} = useAuth();

  // We still need to know which PDF this is to save highlights.
  // We'll adjust HomeScreen to pass this.
  const {pdfId} = route.params || {};

  // This function now *listens* for messages FROM the WebView
  const handleWebViewMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('[WebView Message]', data.type); // Good for debugging

      switch (data.type) {
        case 'COPY_TEXT':
          Clipboard.setString(data.text);
          console.log('Copied to clipboard');
          break;

        case 'ADD_TO_DOCS':
          console.log('Add to Docs:', data.text, 'on page', data.page);
          if (!pdfId) {
            Alert.alert(
              'Error',
              'Cannot save highlight: Unknown PDF. Please go back and try again.',
            );
            return;
          }
          // Call our database function
          handleAddHighlight(data.text, data.page, pdfId);
          break;

        case 'ERROR':
          // The WebView can now send us its own errors
          console.error('WebView Error:', data.message);
          Alert.alert('Error', data.message);
          break;
      }
    } catch (err) {
      console.error('Error handling message from WebView', err);
    }
  };

  // The database logic, now triggered by a WebView message
  const handleAddHighlight = async (
    selectedText: string,
    page: number,
    pdfToUpdate: number, // pdfId comes in as a number from route.params
  ) => {
    if (!db) {
      Alert.alert('Error', 'Database not connected.');
      return;
    }

    try {
      const formattedText = `P[${page}]: ${selectedText}`;
      // --- THIS IS THE FIX ---
      // Convert the 'number' type pdfToUpdate to a 'string' for the addHighlight function
      await addHighlight(db, pdfToUpdate.toString(), page, formattedText);
      // ---------------------
      Alert.alert('Success', 'Highlight added to your document!');
    } catch (error) {
      console.error('Failed to save highlight', error);
      Alert.alert('Error', 'Failed to save highlight.');
    }
  };

  return (
    // The container style is still useful to make it full-screen
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        source={viewerHtmlSource} // <-- Loads your local viewer.html
        onMessage={handleWebViewMessage} // <-- Listens for messages
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowFileAccess={true}
        // --- THIS PROP NEEDS THE REBUILD ---
        allowsFileUploads={true} // <-- Allows <input type="file"> to work
        // ----------------------------------
        style={styles.webview} // This was the other fix (lowercase 'w')
      />
    </View>
  );
};