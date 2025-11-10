import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
    safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  editButton: {
    padding: 5,
  },
  profileContainer: {
    alignItems: 'center',
    paddingHorizontal: 30,
    marginTop: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#013247',
    fontFamily: 'Helvetica',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Helvetica',
    marginBottom: 20,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactIcon: {
    marginRight: 10,
  },
  contactText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Helvetica',
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 30,
    borderWidth: 1,
    borderColor: '#EEE',
    borderRadius: 10,
    backgroundColor: '#FAFAFA',
  },
  statBox: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'Helvetica',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#013247',
    fontFamily: 'Helvetica',
  },
  aboutContainer: {
    padding: 20,
    marginTop: 20,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#013247',
    fontFamily: 'Helvetica',
    marginBottom: 10,
  },
  aboutText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Helvetica',
    lineHeight: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fdecec',
    borderRadius: 10,
    paddingVertical: 15,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 40,
  },
  logoutButtonText: {
    color: '#dd5757',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
})