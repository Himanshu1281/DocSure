import { Doctor } from '../../domain/entities/Doctor';
import { DoctorRepository, NearbyQuery } from '../../domain/repositories/DoctorRepository';
import { distanceKm } from '../../utils/distance';

// OpenStreetMap via the Overpass API — free, no key. Data © OpenStreetMap contributors (ODbL).
// https://wiki.openstreetmap.org/wiki/Overpass_API
// Main instance is retried (it 504s briefly under load); mirror is a last resort
const OVERPASS_ATTEMPTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass-api.de/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
  'https://overpass-api.de/api/interpreter',
];
const RETRY_DELAY_MS = 1500;
const MAX_RESULTS = 50;
const REQUEST_TIMEOUT_MS = 25000;
const USER_AGENT = 'DocSure/1.0 (doctor discovery app)';

interface OsmElement {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

const AMENITY_LABELS: Record<string, string> = {
  doctors: 'Doctor',
  doctor: 'Doctor',
  clinic: 'Clinic',
  hospital: 'Hospital',
  dentist: 'Dentist',
  physiotherapist: 'Physiotherapist',
};

const titleCase = (s: string) =>
  s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

// Navigation-safe id: "node/123" -> "node-123"
const toId = (el: OsmElement) => `${el.type}-${el.id}`;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class OsmDoctorRepository implements DoctorRepository {
  // Overpass allows ~2 concurrent requests per IP; share identical in-flight queries
  private inFlight = new Map<string, Promise<OsmElement[]>>();

  async getNearby({ latitude, longitude, city, radiusMeters = 5000 }: NearbyQuery): Promise<Doctor[]> {
    // A global bbox is several times faster on Overpass than an `around:` filter
    const dLat = radiusMeters / 111320;
    const dLon = radiusMeters / (111320 * Math.cos((latitude * Math.PI) / 180));
    const bbox = [latitude - dLat, longitude - dLon, latitude + dLat, longitude + dLon]
      .map(n => n.toFixed(4))
      .join(',');
    const query =
      `[out:json][timeout:25][bbox:${bbox}];` +
      '(nwr["amenity"~"^(doctors|clinic|hospital|dentist)$"];' +
      'nwr["healthcare"~"^(doctor|clinic|hospital|dentist|physiotherapist)$"];);' +
      'out center tags;';

    const elements = await this.run(query);
    const radiusKm = radiusMeters / 1000;
    return elements
      .map(el => this.toDoctor(el, latitude, longitude, city))
      .filter((d): d is Doctor => d !== null && d.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, MAX_RESULTS);
  }

  async getById(id: string, origin?: { latitude: number; longitude: number; city: string }): Promise<Doctor | null> {
    const [type, osmId] = id.split('-');
    if (!['node', 'way', 'relation'].includes(type) || !/^\d+$/.test(osmId ?? '')) return null;

    const elements = await this.run(`[out:json][timeout:25];${type}(${osmId});out center tags;`);
    const el = elements[0];
    if (!el) return null;
    const point = this.pointOf(el);
    if (!point) return null;
    return this.toDoctor(el, origin?.latitude ?? point.lat, origin?.longitude ?? point.lon, origin?.city ?? '');
  }

  private run(query: string): Promise<OsmElement[]> {
    const existing = this.inFlight.get(query);
    if (existing) return existing;
    const request = this.runWithRetries(query).finally(() => this.inFlight.delete(query));
    this.inFlight.set(query, request);
    return request;
  }

  private async runWithRetries(query: string): Promise<OsmElement[]> {
    let lastError: unknown;
    for (const [attempt, url] of OVERPASS_ATTEMPTS.entries()) {
      if (attempt > 0) await sleep(RETRY_DELAY_MS);
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            // overpass-api.de answers 406 to clients without an identifying User-Agent
            'User-Agent': USER_AGENT,
          },
          body: `data=${encodeURIComponent(query)}`,
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Overpass ${url} failed (${res.status})`);
        // Overloaded servers can answer 200 with an HTML error page, so parse defensively
        const json: { elements?: OsmElement[] } = JSON.parse(await res.text());
        return json.elements ?? [];
      } catch (e) {
        lastError = e;
      } finally {
        clearTimeout(timer);
      }
    }
    throw lastError;
  }

  private pointOf(el: OsmElement) {
    if (el.lat != null && el.lon != null) return { lat: el.lat, lon: el.lon };
    return el.center ?? null;
  }

  private toDoctor(el: OsmElement, originLat: number, originLng: number, city: string): Doctor | null {
    const tags = el.tags ?? {};
    const point = this.pointOf(el);
    // Unnamed entries are mostly mapping noise and can't be shown meaningfully
    if (!point || !tags.name) return null;

    const speciality = tags['healthcare:speciality']?.split(';')[0];
    const kind = AMENITY_LABELS[tags.amenity] ?? AMENITY_LABELS[tags.healthcare] ?? 'Medical Practice';
    const street = [tags['addr:housenumber'], tags['addr:street']].filter(Boolean).join(' ');
    const address = [street, tags['addr:suburb'], tags['addr:city'], tags['addr:postcode']]
      .filter(Boolean)
      .join(', ');

    return {
      id: toId(el),
      name: tags.name,
      specialty: speciality ? titleCase(speciality) : kind,
      // Fall back to the area name, not the kind, to avoid "Hospital · Hospital"
      hospital: tags['operator'] ?? tags['addr:suburb'] ?? tags['addr:city'] ?? city,
      // OSM has no ratings, fees, wait times or credentials
      rating: 0,
      reviewCount: 0,
      consultationFee: null,
      waitTime: null,
      languages: [],
      isVerified: false,
      // opening_hours is a complex grammar; only the unambiguous 24/7 case is evaluated
      isOpenNow: tags.opening_hours === '24/7' ? true : null,
      address: address || null,
      phone: tags.phone ?? tags['contact:phone'] ?? null,
      distance: distanceKm(originLat, originLng, point.lat, point.lon),
      city: tags['addr:city'] ?? city,
      latitude: point.lat,
      longitude: point.lon,
      source: 'osm',
    };
  }
}
