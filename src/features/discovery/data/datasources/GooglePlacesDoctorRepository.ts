import { Doctor } from '../../domain/entities/Doctor';
import { DoctorRepository, NearbyQuery } from '../../domain/repositories/DoctorRepository';
import { distanceKm } from '../../utils/distance';

// Google Places API (New) — https://developers.google.com/maps/documentation/places/web-service/nearby-search
const BASE_URL = 'https://places.googleapis.com/v1';

const PLACE_FIELDS = [
  'id',
  'displayName',
  'primaryTypeDisplayName',
  'shortFormattedAddress',
  'formattedAddress',
  'location',
  'rating',
  'userRatingCount',
  'currentOpeningHours.openNow',
  'nationalPhoneNumber',
  'businessStatus',
];

const HEALTH_TYPES = ['doctor', 'hospital', 'dentist', 'dental_clinic', 'physiotherapist', 'chiropractor'];

interface PlaceResult {
  id: string;
  displayName?: { text: string };
  primaryTypeDisplayName?: { text: string };
  shortFormattedAddress?: string;
  formattedAddress?: string;
  location?: { latitude: number; longitude: number };
  rating?: number;
  userRatingCount?: number;
  currentOpeningHours?: { openNow?: boolean };
  nationalPhoneNumber?: string;
  businessStatus?: string;
}

export class GooglePlacesDoctorRepository implements DoctorRepository {
  constructor(private readonly apiKey: string) {}

  async getNearby({ latitude, longitude, city, radiusMeters = 5000 }: NearbyQuery): Promise<Doctor[]> {
    const res = await fetch(`${BASE_URL}/places:searchNearby`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': this.apiKey,
        'X-Goog-FieldMask': PLACE_FIELDS.map(f => `places.${f}`).join(','),
      },
      body: JSON.stringify({
        includedTypes: HEALTH_TYPES,
        maxResultCount: 20,
        rankPreference: 'DISTANCE',
        locationRestriction: {
          circle: { center: { latitude, longitude }, radius: radiusMeters },
        },
      }),
    });

    if (!res.ok) {
      throw new Error(`Places nearby search failed (${res.status}): ${await res.text()}`);
    }

    const json: { places?: PlaceResult[] } = await res.json();
    return (json.places ?? [])
      .filter(p => p.location && p.businessStatus !== 'CLOSED_PERMANENTLY')
      .map(p => this.toDoctor(p, latitude, longitude, city));
  }

  async getById(id: string, origin?: { latitude: number; longitude: number; city: string }): Promise<Doctor | null> {
    const res = await fetch(`${BASE_URL}/places/${encodeURIComponent(id)}`, {
      headers: {
        'X-Goog-Api-Key': this.apiKey,
        'X-Goog-FieldMask': PLACE_FIELDS.join(','),
      },
    });

    if (res.status === 404) return null;
    if (!res.ok) {
      throw new Error(`Places details failed (${res.status}): ${await res.text()}`);
    }

    const place: PlaceResult = await res.json();
    if (!place.location) return null;
    const lat = origin?.latitude ?? place.location.latitude;
    const lng = origin?.longitude ?? place.location.longitude;
    return this.toDoctor(place, lat, lng, origin?.city ?? '');
  }

  private toDoctor(p: PlaceResult, originLat: number, originLng: number, city: string): Doctor {
    const loc = p.location!;
    return {
      id: p.id,
      name: p.displayName?.text ?? 'Unnamed clinic',
      specialty: p.primaryTypeDisplayName?.text ?? 'Medical Practice',
      hospital: p.shortFormattedAddress ?? p.formattedAddress ?? '',
      rating: p.rating ?? 0,
      reviewCount: p.userRatingCount ?? 0,
      // Google has no fee, wait-time, language or credential data — these stay
      // empty until the practice claims its listing on DocSure.
      consultationFee: null,
      waitTime: null,
      languages: [],
      isVerified: false,
      isOpenNow: p.currentOpeningHours?.openNow ?? null,
      address: p.formattedAddress ?? null,
      phone: p.nationalPhoneNumber ?? null,
      distance: distanceKm(originLat, originLng, loc.latitude, loc.longitude),
      city,
      latitude: loc.latitude,
      longitude: loc.longitude,
      source: 'google',
    };
  }
}
