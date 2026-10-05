// OpenStreetMap Nominatim — free geocoding, no key. Usage policy: identify the app
// via User-Agent and stay under ~1 request/second (callers debounce input).
// https://operations.osmfoundation.org/policies/nominatim/
const SEARCH_URL = 'https://nominatim.openstreetmap.org/search';
const USER_AGENT = 'DocSure/1.0 (doctor discovery app)';

export interface Place {
  id: string;
  label: string; // short, e.g. "Kothrud, Pune"
  description: string; // full address
  latitude: number;
  longitude: number;
}

interface NominatimResult {
  place_id: number;
  lat: string;
  lon: string;
  name?: string;
  display_name: string;
}

// "Kothrud, Karve Nagar, Pune, ..., India" -> "Kothrud, Pune"-ish: first part + a city-level part
const shortLabel = (r: NominatimResult) => {
  const parts = r.display_name.split(',').map(p => p.trim());
  const first = r.name || parts[0];
  const rest = parts.filter(p => p !== first && !/^\d+$/.test(p));
  // Third-from-last is usually the city/district before state and country
  const city = rest.length >= 3 ? rest[rest.length - 3] : rest[0];
  return city && city !== first ? `${first}, ${city}` : first;
};

export const searchPlaces = async (query: string, signal?: AbortSignal): Promise<Place[]> => {
  const q = query.trim();
  if (q.length < 3) return [];

  const googleKey = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;
  const provider = process.env.EXPO_PUBLIC_DOCTOR_PROVIDER;

  if (googleKey && provider === 'google') {
    const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': googleKey,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location',
      },
      body: JSON.stringify({ textQuery: q }),
      signal,
    });
    if (!res.ok) throw new Error(`Google Places search failed (${res.status})`);
    const json = await res.json();
    return (json.places || []).filter((p: any) => p.location).map((p: any) => {
      const parts = (p.formattedAddress || '').split(',');
      const city = parts.length >= 2 ? parts[parts.length - 2].trim() : p.displayName.text;
      return {
        id: p.id,
        label: `${p.displayName.text}, ${city}`,
        description: p.formattedAddress,
        latitude: p.location.latitude,
        longitude: p.location.longitude,
      };
    });
  }

  // Fallback to Nominatim
  const url = `${SEARCH_URL}?q=${encodeURIComponent(q)}&format=jsonv2&limit=8`;
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, 'Accept-Language': 'en' },
    signal,
  });
  if (!res.ok) throw new Error(`Place search failed (${res.status})`);

  const results: NominatimResult[] = await res.json();
  return results.map(r => ({
    id: String(r.place_id),
    label: shortLabel(r),
    description: r.display_name,
    latitude: parseFloat(r.lat),
    longitude: parseFloat(r.lon),
  }));
};
