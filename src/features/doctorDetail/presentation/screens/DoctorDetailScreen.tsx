import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../../core/theme';
import { RootStackParamList } from '../../../../core/navigation/RootNavigator';
import { mockDoctors } from '../../../../features/discovery/data/datasources/MockDoctorDataSource';

type DoctorDetailRouteProp = RouteProp<RootStackParamList, 'DoctorDetail'>;

export const DoctorDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<DoctorDetailRouteProp>();
  
  const doctor = mockDoctors.find(d => d.id === route.params?.id) || mockDoctors[0];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Curator Profile</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profileBox}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarText}>{doctor.name.charAt(4)}</Text>
          </View>
          <Text style={styles.doctorName}>{doctor.name}</Text>
          <Text style={styles.specialty}>{doctor.specialty} · {doctor.hospital}</Text>
          
          <View style={styles.ratingRow}>
            <MaterialIcons name="star" size={16} color={theme.colors.primaryDark} />
            <Text style={styles.ratingText}>{doctor.rating}</Text>
            {doctor.isVerified && (
              <View style={styles.verifiedBadge}>
                <MaterialIcons name="verified" size={12} color={theme.colors.primaryDark} />
                <Text style={styles.verifiedText}>Verified Curator</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Wait Time</Text>
            <Text style={styles.statValue}>{doctor.waitTime}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Distance</Text>
            <Text style={styles.statValue}>{doctor.distance} km</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Consult Fee</Text>
            <Text style={styles.statValue}>₹{doctor.consultationFee}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Languages Spoken</Text>
          <View style={styles.chipRow}>
            {doctor.languages.map(lang => (
              <View key={lang} style={styles.chip}>
                <Text style={styles.chipText}>{lang}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>
            {doctor.name} is a renowned {doctor.specialty} practicing at {doctor.hospital}. 
            With an emphasis on preventative care and patient-first clinical methodology, they are part of the Clinical Mint verified network.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.secondaryBtn}>
          <MaterialIcons name="directions" size={20} color={theme.colors.primary} />
          <Text style={styles.secondaryBtnText}>Directions</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryBtn}>
          <Text style={styles.primaryBtnText}>Book Consult</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    ...theme.typography.h2,
    fontSize: 16,
  },
  headerRight: {
    width: 32,
  },
  container: {
    padding: theme.spacing.xl,
    paddingBottom: 40,
  },
  profileBox: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.primaryDark,
  },
  doctorName: {
    ...theme.typography.h1,
    marginBottom: 4,
  },
  specialty: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginRight: theme.spacing.md,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.radius.pill,
    gap: 4,
  },
  verifiedText: {
    fontSize: 12,
    color: theme.colors.primaryDark,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  statBox: {
    flex: 1,
    backgroundColor: theme.colors.surfaceMuted,
    padding: theme.spacing.md,
    borderRadius: theme.radius.card,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.md,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  chip: {
    backgroundColor: theme.colors.surfaceMuted,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chipText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  aboutText: {
    ...theme.typography.body,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    padding: theme.spacing.xl,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    gap: theme.spacing.md,
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.btn,
    paddingVertical: 14,
    gap: 8,
  },
  secondaryBtnText: {
    color: theme.colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  primaryBtn: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.btn,
    paddingVertical: 14,
  },
  primaryBtnText: {
    color: theme.colors.surface,
    fontWeight: '600',
    fontSize: 16,
  }
});
