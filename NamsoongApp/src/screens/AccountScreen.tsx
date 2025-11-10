import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import {useAuth} from '../../App';
import {styles} from '../styles/accoutStyles.ts'
import Icon from 'react-native-vector-icons/Ionicons'; // We'll use this for the icons

export const AccountScreen = () => {
  const {user, logout} = useAuth();

  // We'll hard-code these for now.
  // TODO: Load these from the user's profile
  const memberSince = 'Nov 10, 2025';
  const totalNotes = 12;
  const userSubtitle = 'Fashion Model';
  const userPhone = '(581)-307-6902';
  const aboutMeText =
    'This is a placeholder for the "About Me" section. Users will be able to edit this in a future update.';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* --- Custom Header --- */}
        <View style={styles.header}>
          {/* The 'Back' button from the design is omitted 
            because this is a main tab screen.
          */}
          <View style={{width: 50}} />
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => Alert.alert('Edit', 'Edit profile coming soon!')}>
            <Icon name="create-outline" size={26} color="#013247" />
          </TouchableOpacity>
        </View>

        {/* --- Profile Info --- */}
        <View style={styles.profileContainer}>
          <Image
            style={styles.avatar}
            source={{
              uri: `https://ui-avatars.com/api/?name=${user?.name}&size=128&background=e0e0e0&color=013247`,
            }}
          />
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.subtitle}>{userSubtitle}</Text>

          <View style={styles.contactRow}>
            <Icon
              name="call-outline"
              size={18}
              color="#666"
              style={styles.contactIcon}
            />
            <Text style={styles.contactText}>{userPhone}</Text>
          </View>
          <View style={styles.contactRow}>
            <Icon
              name="mail-outline"
              size={18}
              color="#666"
              style={styles.contactIcon}
            />
            <Text style={styles.contactText}>{user?.email}</Text>
          </View>
        </View>

        {/* --- Stats --- */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Member Since</Text>
            <Text style={styles.statValue}>{memberSince}</Text>
          </View>
          <View
            style={[styles.statBox, {borderLeftWidth: 1, borderColor: '#EEE'}]}>
            <Text style={styles.statLabel}>Notes</Text>
            <Text style={styles.statValue}>{totalNotes}</Text>
          </View>
        </View>

        {/* --- About Me --- */}
        <View style={styles.aboutContainer}>
          <Text style={styles.aboutTitle}>About Me</Text>
          <Text style={styles.aboutText}>{aboutMeText}</Text>
        </View>

        {/* --- Log Out --- */}
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Icon name="log-out-outline" size={22} color="#dd5757" />
          <Text style={styles.logoutButtonText}>Log out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};
