import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../../core/theme';
import { searchPlaces, Place } from '../../data/datasources/NominatimGeocoder';
import { useDiscoveryViewModel } from '../../viewmodels/useDiscoveryViewModel';
import { useRecentPlacesStore } from '../../viewmodels/useRecentPlacesStore';

// Nominatim asks for <= 1 request/second, so wait for typing to pause
const DEBOUNCE_MS = 600;

export const LocationSearchScreen = () => {
  const navigation = useNavigation();
  const { searchLocation, setSearchLocation, userLocation } = useDiscoveryViewModel();
  const { places: recent, add: addRecent, remove: removeRecent } = useRecentPlacesStore();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Place[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 3) {
      setResults([]);
      setIsSearching(false);
      setError(null);
      return;
    }
    const controller = new AbortController();
    setIsSearching(true);
    const timer = setTimeout(() => {
      searchPlaces(q, controller.signal)
        .then(places => { setResults(places); setError(null); })
        .catch(e => { if (e?.name !== 'AbortError') setError('Could not search places. Check your connection.'); })
        .finally(() => { if (!controller.signal.aborted) setIsSearching(false); });
    }, DEBOUNCE_MS);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [query]);

  const choose = (place: Place) => {
    addRecent(place);
    setSearchLocation(place);
    navigation.goBack();
  };

  const useCurrentLocation = () => {
    setSearchLocation(null);
    navigation.goBack();
  };

  const showRecent = query.trim().length < 3;
  const data = showRecent ? recent : results;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.inputWrap}>
          <MaterialIcons name="search" size={20} color={theme.colors.textHint} />
          <TextInput
            style={styles.input}
            value={query}
            onChangeText={setQuery}
            placeholder="Search city, area or address"
            placeholderTextColor={theme.colors.textHint}
            autoFocus
            returnKeyType="search"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} hitSlop={8}>
              <MaterialIcons name="close" size={18} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <TouchableOpacity style={styles.row} onPress={useCurrentLocation}>
        <MaterialIcons name="my-location" size={22} color={theme.colors.primary} />
        <View style={styles.rowText}>
          <Text style={[styles.rowTitle, styles.primaryText]}>Use my current location</Text>
          {userLocation.city && !userLocation.error && (
            <Text style={styles.rowSubtitle}>{userLocation.city}</Text>
          )}
        </View>
        {!searchLocation && <MaterialIcons name="check" size={20} color={theme.colors.primary} />}
      </TouchableOpacity>

      {showRecent && recent.length > 0 && <Text style={styles.sectionLabel}>Recent</Text>}

      <FlatList
        data={data}
        keyExtractor={p => p.id}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={isSearching ? <ActivityIndicator style={styles.status} color={theme.colors.primary} /> : null}
        ListEmptyComponent={
          !isSearching && !showRecent ? (
            <Text style={styles.statusText}>{error ?? 'No places found.'}</Text>
          ) : null
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.row} onPress={() => choose(item)}>
            <MaterialIcons
              name={showRecent ? 'history' : 'place'}
              size={22}
              color={theme.colors.textSecondary}
            />
            <View style={styles.rowText}>
              <Text style={styles.rowTitle} numberOfLines={1}>{item.label}</Text>
              <Text style={styles.rowSubtitle} numberOfLines={2}>{item.description}</Text>
            </View>
            {searchLocation?.id === item.id ? (
              <MaterialIcons name="check" size={20} color={theme.colors.primary} />
            ) : showRecent ? (
              <TouchableOpacity onPress={() => removeRecent(item.id)} hitSlop={8}>
                <MaterialIcons name="close" size={18} color={theme.colors.textHint} />
              </TouchableOpacity>
            ) : null}
          </TouchableOpacity>
        )}
      />

      <Text style={styles.attribution}>Search © OpenStreetMap contributors</Text>
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
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.btn,
    paddingHorizontal: theme.spacing.md,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
    color: theme.colors.textPrimary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.border,
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.colors.textPrimary,
  },
  primaryText: {
    color: theme.colors.primary,
  },
  rowSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xs,
    textTransform: 'uppercase',
  },
  status: {
    paddingVertical: theme.spacing.lg,
  },
  statusText: {
    ...theme.typography.body,
    textAlign: 'center',
    paddingVertical: theme.spacing.xl,
  },
  attribution: {
    fontSize: 10,
    color: theme.colors.textHint,
    textAlign: 'center',
    paddingVertical: theme.spacing.sm,
  },
});
