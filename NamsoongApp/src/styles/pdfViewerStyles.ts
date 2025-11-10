import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    backgroundColor: '#FFFFFF',
  },
  headerIcon: {
    padding: 5,
  },
  pageNumberText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
    fontFamily: 'Helvetica',
  },
  pdfContainer: {
    flex: 1,
    backgroundColor: '#F0F0F0', // A light grey background
  },
  webview: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  // --- New styles for loading overlay ---
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject, // Cover the whole screen
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#000',
    fontFamily: 'Helvetica',
  },
  // --- Styles for the menu (Unchanged) ---
  highlightMenu: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#2c2c2e',
    borderRadius: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  menuButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Helvetica',
    marginLeft: 10,
  },
});