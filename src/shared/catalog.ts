export type CurrencyCode = 'BASE' | 'USD' | 'EUR' | 'PEN';

export type RoomCategory = 'matrimonial' | 'doble' | 'familiar';

export interface BoutiqueRoom {
  id: string;
  number: string;
  name: string;
  subtitle: string;
  category: RoomCategory;
  units: number;
  maxGuests: number;
  bedsLabel: string;
  sizeSqm: number;
  orientation: string;
  basePrice: number;
  baseCurrency: 'EUR' | 'USD';
  priceUsd: number;
  description: string;
  amenities: string[];
  imageUrl: string;
}

export interface BikeTourAddon {
  id: string;
  name: string;
  route: string;
  duration: string;
  distanceKm: number;
  level: string;
  priceUsdPerPerson: number;
  description: string;
  includes: string[];
  imageUrl: string;
}

export interface TrainTransferPackage {
  id: string;
  name: string;
  priceUsdPerPerson: number;
  scheduleNote: string;
  description: string;
  includes: string[];
}

export type ReservationStatus = 'confirmada' | 'cancelada';

export interface Reservation {
  code: string;
  roomId: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  arrivalTime: string;
  notes: string;
  selectedTourIds: string[];
  includeTrainPackage: boolean;
  roomSubtotalUsd: number;
  toursSubtotalUsd: number;
  trainSubtotalUsd: number;
  totalUsd: number;
  status: ReservationStatus;
  createdAt: string;
}

export interface RoomAvailabilityResult {
  roomId: string;
  available: boolean;
  availableUnits: number;
  totalUnits: number;
  conflictingRanges: Array<{ checkIn: string; checkOut: string }>;
  nextAvailableCheckIn: string | null;
}

export interface CalendarDayCell {
  date: string;
  occupied: boolean;
  freeUnits: number;
}

export interface RoomCalendarRow {
  roomId: string;
  roomNumber: string;
  roomName: string;
  totalUnits: number;
  days: CalendarDayCell[];
}

export interface InquiryRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  topic: 'tour_bici' | 'tren_machupicchu' | 'estadia_grupal' | 'consulta_general';
  preferredDate: string;
  guests: number;
  message: string;
  createdAt: string;
}

export const USD_TO_PEN_RATE = 3.75;
export const EUR_TO_USD_RATE = 1.08;

export const HOSTEL_CONTACT = {
  brandName: 'Inka Garden Hostel',
  phoneDisplay: '+51 992 009 619',
  whatsappDigits: '51992009619',
  email: 'igarthostel@gmail.com',
  instagram: '@hostel_inkas_garden',
  cuscoAddress: 'Calle Fortunato L. Herrera 120 - Cusco',
  cuscoReference: 'Ref. Frente a la comisaría canina de Coripata',
  valleyAddress: 'Paucarabamba - Yanahuara, Valle Sagrado Cusco',
  mapsUrl: 'https://maps.app.goo.gl/kg7DpPg95r98CDhq9?g_st=aw',
  checkInTime: '12:00',
  checkOutTime: '11:00',
} as const;

export const HERO_IMAGE_URL = '/src/assets/images/hero_inka_garden_1794845295340.jpg';
export const LOCATION_MAP_IMAGE_URL = '/src/assets/images/mapa-ubicacion.jpg';
export const BIKE_TOUR_IMAGE_URL = '/src/assets/images/tour_bici_moray_1794845298992.jpg';
export const TRAIN_VALLEY_IMAGE_URL = '/src/assets/images/tren_machupicchu_valle_1794845299756.jpg';

export const BOUTIQUE_ROOMS: BoutiqueRoom[] = [
  {
    id: 'suite-matrimonial',
    number: '01',
    name: 'Suite Matrimonial',
    subtitle: 'Vista a las montañas · 1 Cama Matrimonial Queen',
    category: 'matrimonial',
    units: 1,
    maxGuests: 2,
    bedsLabel: '1 Cama Matrimonial Queen',
    sizeSqm: 40,
    orientation: 'Vista a las montañas',
    basePrice: 30,
    baseCurrency: 'EUR',
    priceUsd: Math.round(30 * EUR_TO_USD_RATE),
    description:
      'Suite luminosa de 40 m² con cama matrimonial Queen, baño privado, minibar y vista directa a las montañas de Cusco.',
    amenities: [
      '40m²',
      'Vista a las montañas',
      '1 Cama Matrimonial Queen',
      'Baño Privado',
      'Minibar',
    ],
    imageUrl: '/src/assets/images/suite-ejecutiva-vista-mar.png',
  },
  {
    id: 'apartamento-dobles-triples',
    number: '02',
    name: 'Apartamento Dobles / Triples',
    subtitle: 'Vista Jardín · Balcón · Cocina Full Equipo',
    category: 'doble',
    units: 1,
    maxGuests: 3,
    bedsLabel: '1 o 2 Camas Queen',
    sizeSqm: 45,
    orientation: 'Vista Jardín · Balcón',
    basePrice: 40,
    baseCurrency: 'EUR',
    priceUsd: Math.round(40 * EUR_TO_USD_RATE),
    description:
      'Apartamento de 45 m² con balcón hacia el jardín soleado, cocina full equipo, baño privado y Wi-Fi / Tv Smart.',
    amenities: [
      '45m²',
      'Vista Jardín',
      'Balcón',
      '1 o 2 Camas Queen',
      'Cocina Full Equipo',
      'Baño Privado',
      'Wi-Fi / Tv Smart',
    ],
    imageUrl: '/src/assets/images/habitacion-deluxe-principal.jpg',
  },
  {
    id: 'apartamentos-familiares-solarium',
    number: '03',
    name: 'Apartamentos Familiares Solarium',
    subtitle: 'Balcón Solarium · 2 Camas King · Cocina / Comedor',
    category: 'familiar',
    units: 2,
    maxGuests: 4,
    bedsLabel: '2 Camas King',
    sizeSqm: 55,
    orientation: 'Balcón Solarium',
    basePrice: 55,
    baseCurrency: 'EUR',
    priceUsd: Math.round(55 * EUR_TO_USD_RATE),
    description:
      'Nuestros dos amplios apartamentos familiares de 55 m² con balcón solarium, cocina comedor, Tv Smart, 2 camas King y baño privado.',
    amenities: [
      '55m²',
      'Balcón Solarium',
      'Cocina / Comedor',
      'Tv Smart',
      '2 Camas King',
      'Baño Privado',
    ],
    imageUrl: '/src/assets/images/nueva-suite-presidencial.JPG',
  },
  {
    id: 'habitacion-doble',
    number: '04',
    name: 'Habitacion Doble',
    subtitle: 'Increíble Vista Panorámica · 2 Camas Queen',
    category: 'doble',
    units: 1,
    maxGuests: 3,
    bedsLabel: '2 Camas Queen',
    sizeSqm: 40,
    orientation: 'Increíble Vista Panorámica',
    basePrice: 30,
    baseCurrency: 'USD',
    priceUsd: 30,
    description:
      'Habitación doble de 40 m² con 2 camas Queen, increíble vista panorámica, baño privado y área privada de estar.',
    amenities: [
      '40m²',
      '2 Camas Queen',
      'Increíble Vista Panorámica',
      'Baño privado',
      'Área Privada de Star',
    ],
    imageUrl: '/src/assets/images/mirador-twinn-principal.jpg',
  },
];

export const TOTAL_BOUTIQUE_UNITS = BOUTIQUE_ROOMS.reduce((sum, r) => sum + r.units, 0);

export const BIKE_TOURS: BikeTourAddon[] = [
  {
    id: 'tour-moray-salineras',
    name: 'Tour en Bicicleta: Moray y Salineras',
    route: 'Cruzpata · Moray · Salineras · Yanahuara',
    duration: '4.5 horas',
    distanceKm: 28,
    level: 'Intermedio',
    priceUsdPerPerson: 48,
    description:
      'Descenso panorámico entre andenes circulares incas y terrazas de sal milenarias culminando en nuestro refugio soleado en Yanahuara.',
    includes: [
      'Bicicleta MTB o gravel de suspensión delantera',
      'Casco, guantes y kit mecánico',
      'Guía local bilingüe y transporte de apoyo',
      'Box lunch andino e hidratación',
    ],
    imageUrl: BIKE_TOUR_IMAGE_URL,
  },
  {
    id: 'tour-yanahuara-ollantaytambo',
    name: 'Tour en Bicicleta: Yanahuara a Ollantaytambo',
    route: 'Paucarabamba · Yanahuara · Río Urubamba · Ollantaytambo',
    duration: '3.5 horas',
    distanceKm: 22,
    level: 'Accesible / Escénico',
    priceUsdPerPerson: 42,
    description:
      'Pedalea por caminos rurales planos junto al río Urubamba entre chacras de maíz gigante hasta llegar a la estación de Ollantaytambo.',
    includes: [
      'Bicicleta equipada y casco',
      'Traslado de equipaje al punto final',
      'Guía anfitrión del Valle Sagrado',
      'Fruta fresca, agua y café en ruta',
    ],
    imageUrl: BIKE_TOUR_IMAGE_URL,
  },
];

export const TRAIN_TRANSFER_PACKAGE: TrainTransferPackage = {
  id: 'conexion-tren-machupicchu',
  name: 'Conexión Tren a Machu Picchu & Descanso en Yanahuara',
  priceUsdPerPerson: 26,
  scheduleNote: 'Salidas coordinadas desde las 04:30 h · Guardaequipaje incluido',
  description:
    'La mejor forma de llegar al tren destino a Machu Picchu: duerme sin estrés en Cusco o descansa en nuestro refugio de Yanahuara en el Valle Sagrado con traslado directo a la estación de Ollantaytambo.',
  includes: [
    'Traslado privado coordinado hacia/desde estación Ollantaytambo',
    'Desayuno para llevar si sales en el primer tren',
    'Guardaequipaje seguro mientras visitas Machu Picchu',
    'Acceso a ducha y jardín soleado en Yanahuara al regreso',
  ],
};

export function formatIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDaysIso(iso: string, days: number): string {
  const d = parseIsoDate(iso);
  d.setDate(d.getDate() + days);
  return formatIsoDate(d);
}

export function diffNights(checkIn: string, checkOut: string): number {
  const start = parseIsoDate(checkIn).getTime();
  const end = parseIsoDate(checkOut).getTime();
  const diff = Math.round((end - start) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

export function rangesOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
): boolean {
  return aStart < bEnd && bStart < aEnd;
}

export function formatDisplayDateEs(iso: string): string {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  const date = parseIsoDate(iso);
  return date.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatShortDayEs(iso: string): { dayNum: string; weekday: string; month: string } {
  const date = parseIsoDate(iso);
  const dayNum = String(date.getDate()).padStart(2, '0');
  const weekday = date.toLocaleDateString('es-PE', { weekday: 'short' }).replace('.', '');
  const month = date.toLocaleDateString('es-PE', { month: 'short' }).replace('.', '');
  return { dayNum, weekday, month };
}

export function formatRoomBasePrice(room: BoutiqueRoom, currency: CurrencyCode): string {
  if (currency === 'BASE') {
    return room.baseCurrency === 'EUR' ? `€${room.basePrice}` : `$${room.basePrice}`;
  }
  if (currency === 'EUR') {
    const eur =
      room.baseCurrency === 'EUR' ? room.basePrice : Math.round(room.priceUsd / EUR_TO_USD_RATE);
    return `€${eur}`;
  }
  if (currency === 'PEN') {
    const pen = Math.round(room.priceUsd * USD_TO_PEN_RATE);
    return `S/ ${pen.toLocaleString('es-PE')}`;
  }
  return `$${room.priceUsd}`;
}

export function formatMoney(amountUsd: number, currency: CurrencyCode): string {
  if (currency === 'PEN') {
    const pen = Math.round(amountUsd * USD_TO_PEN_RATE);
    return `S/ ${pen.toLocaleString('es-PE')}`;
  }
  if (currency === 'EUR') {
    const eur = Math.round(amountUsd / EUR_TO_USD_RATE);
    return `€${eur.toLocaleString('en-US')} EUR`;
  }
  return `$${amountUsd.toLocaleString('en-US')} USD`;
}
