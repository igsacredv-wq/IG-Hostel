import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  BIKE_TOURS,
  BOUTIQUE_ROOMS,
  TOTAL_BOUTIQUE_UNITS,
  TRAIN_TRANSFER_PACKAGE,
  USD_TO_PEN_RATE,
  addDaysIso,
  diffNights,
  formatIsoDate,
  rangesOverlap,
  type InquiryRecord,
  type Reservation,
  type RoomAvailabilityResult,
  type RoomCalendarRow,
} from './src/shared/catalog.ts';

interface StoreData {
  reservations: Reservation[];
  inquiries: InquiryRecord[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'reservations.json');

function buildInitialSeed(): StoreData {
  const today = formatIsoDate(new Date());
  const seedReservations: Reservation[] = [
    {
      code: 'IG-2026-1042',
      roomId: 'suite-matrimonial',
      roomName: 'Suite Matrimonial',
      checkIn: addDaysIso(today, 5),
      checkOut: addDaysIso(today, 8),
      nights: 3,
      guests: 2,
      guestName: 'Camila Mendoza',
      guestEmail: 'camila.mendoza@ejemplo.pe',
      guestPhone: '+51 984 310 225',
      arrivalTime: '14:00',
      notes: 'Llegamos en vuelo de la mañana y queremos hacer el tour en bici a Moray.',
      selectedTourIds: ['tour-moray-salineras'],
      includeTrainPackage: true,
      roomSubtotalUsd: 96,
      toursSubtotalUsd: 96,
      trainSubtotalUsd: 52,
      totalUsd: 244,
      status: 'confirmada',
      createdAt: new Date().toISOString(),
    },
    {
      code: 'IG-2026-1039',
      roomId: 'apartamento-dobles-triples',
      roomName: 'Apartamento Dobles / Triples',
      checkIn: addDaysIso(today, 1),
      checkOut: addDaysIso(today, 3),
      nights: 2,
      guests: 2,
      guestName: 'Mateo & Lucas Herrera',
      guestEmail: 'mateo.herrera@ejemplo.cl',
      guestPhone: '+56 9 8412 5531',
      arrivalTime: '13:30',
      notes: 'Viaje en bicicleta por el Valle Sagrado.',
      selectedTourIds: ['tour-yanahuara-ollantaytambo'],
      includeTrainPackage: false,
      roomSubtotalUsd: 86,
      toursSubtotalUsd: 84,
      trainSubtotalUsd: 0,
      totalUsd: 170,
      status: 'confirmada',
      createdAt: new Date().toISOString(),
    },
    {
      code: 'IG-2026-1045',
      roomId: 'apartamentos-familiares-solarium',
      roomName: 'Apartamentos Familiares Solarium',
      checkIn: addDaysIso(today, 3),
      checkOut: addDaysIso(today, 6),
      nights: 3,
      guests: 4,
      guestName: 'Elena Vargas',
      guestEmail: 'elena.vargas@ejemplo.es',
      guestPhone: '+34 612 884 910',
      arrivalTime: '15:00',
      notes: 'Tren temprano a Machu Picchu el último día.',
      selectedTourIds: [],
      includeTrainPackage: true,
      roomSubtotalUsd: 177,
      toursSubtotalUsd: 0,
      trainSubtotalUsd: 104,
      totalUsd: 281,
      status: 'confirmada',
      createdAt: new Date().toISOString(),
    },
  ];

  return {
    reservations: seedReservations,
    inquiries: [],
  };
}

function readStore(): StoreData {
  const validIds = new Set(BOUTIQUE_ROOMS.map((r) => r.id));
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      const initial = buildInitialSeed();
      fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<StoreData>;
    const reservations = Array.isArray(parsed.reservations) ? parsed.reservations : [];
    const hasCurrentCatalog = reservations.some((r) => validIds.has(r.roomId));
    if (reservations.length > 0 && !hasCurrentCatalog) {
      const initial = buildInitialSeed();
      fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    return {
      reservations,
      inquiries: Array.isArray(parsed.inquiries) ? parsed.inquiries : [],
    };
  } catch {
    return buildInitialSeed();
  }
}

function writeStore(data: StoreData): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function isIsoDate(val: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(val);
}

function countMaxConcurrentReservations(
  checkIn: string,
  checkOut: string,
  roomReservations: Reservation[],
): number {
  const overlapping = roomReservations.filter((r) =>
    rangesOverlap(checkIn, checkOut, r.checkIn, r.checkOut),
  );
  if (overlapping.length === 0) return 0;

  let maxSimultaneous = 0;
  const totalDays = Math.max(1, diffNights(checkIn, checkOut));
  for (let i = 0; i < totalDays; i++) {
    const dayStart = addDaysIso(checkIn, i);
    const dayEnd = addDaysIso(dayStart, 1);
    const count = overlapping.filter((r) => rangesOverlap(dayStart, dayEnd, r.checkIn, r.checkOut)).length;
    if (count > maxSimultaneous) maxSimultaneous = count;
  }
  return maxSimultaneous;
}

function computeNextAvailableCheckIn(
  roomId: string,
  units: number,
  fromDate: string,
  nights: number,
  activeReservations: Reservation[],
): string {
  const roomRes = activeReservations.filter((r) => r.roomId === roomId);
  let candidate = fromDate;
  for (let i = 0; i < 60; i++) {
    const candidateOut = addDaysIso(candidate, nights);
    const concurrent = countMaxConcurrentReservations(candidate, candidateOut, roomRes);
    if (concurrent < units) {
      return candidate;
    }
    candidate = addDaysIso(candidate, 1);
  }
  return addDaysIso(fromDate, 14);
}

function generateBookingCode(existingCodes: Set<string>): string {
  for (let attempt = 0; attempt < 25; attempt++) {
    const num = Math.floor(1000 + Math.random() * 9000);
    const code = `IG-2026-${num}`;
    if (!existingCodes.has(code)) {
      return code;
    }
  }
  return `IG-2026-${Date.now().toString().slice(-4)}`;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, rooms: TOTAL_BOUTIQUE_UNITS, categories: BOUTIQUE_ROOMS.length, currencyRate: USD_TO_PEN_RATE });
  });

  app.get('/api/catalog', (_req, res) => {
    res.json({
      rooms: BOUTIQUE_ROOMS,
      tours: BIKE_TOURS,
      trainPackage: TRAIN_TRANSFER_PACKAGE,
      currencyRate: USD_TO_PEN_RATE,
    });
  });

  app.get('/api/availability', (req, res) => {
    const today = formatIsoDate(new Date());
    const checkIn =
      typeof req.query.checkIn === 'string' && isIsoDate(req.query.checkIn)
        ? req.query.checkIn
        : addDaysIso(today, 1);
    const checkOut =
      typeof req.query.checkOut === 'string' && isIsoDate(req.query.checkOut)
        ? req.query.checkOut
        : addDaysIso(checkIn, 2);
    const guests = Math.max(1, Math.min(4, Number(req.query.guests) || 2));

    const nights = diffNights(checkIn, checkOut);
    if (nights <= 0) {
      res.status(400).json({ error: 'La fecha de salida debe ser posterior a la fecha de llegada.' });
      return;
    }

    const store = readStore();
    const activeReservations = store.reservations.filter((r) => r.status === 'confirmada');

    const availability: RoomAvailabilityResult[] = BOUTIQUE_ROOMS.map((room) => {
      const roomRes = activeReservations.filter((r) => r.roomId === room.id);
      const conflicts = roomRes
        .filter((r) => rangesOverlap(checkIn, checkOut, r.checkIn, r.checkOut))
        .map((r) => ({ checkIn: r.checkIn, checkOut: r.checkOut }));

      const maxOccupied = countMaxConcurrentReservations(checkIn, checkOut, roomRes);
      const availableUnits = Math.max(0, room.units - maxOccupied);
      const fitsGuests = room.maxGuests >= guests;
      const available = availableUnits > 0 && fitsGuests;

      return {
        roomId: room.id,
        available,
        availableUnits,
        totalUnits: room.units,
        conflictingRanges: conflicts,
        nextAvailableCheckIn:
          availableUnits === 0
            ? computeNextAvailableCheckIn(room.id, room.units, checkIn, nights, activeReservations)
            : null,
      };
    });

    const calendarDays = Array.from({ length: 14 }, (_, idx) => addDaysIso(today, idx));
    const calendar: RoomCalendarRow[] = BOUTIQUE_ROOMS.map((room) => {
      const roomRes = activeReservations.filter((r) => r.roomId === room.id);
      return {
        roomId: room.id,
        roomNumber: room.number,
        roomName: room.name,
        totalUnits: room.units,
        days: calendarDays.map((day) => {
          const nextDay = addDaysIso(day, 1);
          const occupiedCount = roomRes.filter((r) =>
            rangesOverlap(day, nextDay, r.checkIn, r.checkOut),
          ).length;
          const freeUnits = Math.max(0, room.units - occupiedCount);
          return {
            date: day,
            occupied: freeUnits === 0,
            freeUnits,
          };
        }),
      };
    });

    res.json({
      checkIn,
      checkOut,
      nights,
      guests,
      availability,
      calendarDays,
      calendar,
    });
  });

  app.post('/api/reservations', (req, res) => {
    const body = req.body as Record<string, unknown>;
    const roomId = typeof body.roomId === 'string' ? body.roomId.trim() : '';
    const checkIn = typeof body.checkIn === 'string' ? body.checkIn.trim() : '';
    const checkOut = typeof body.checkOut === 'string' ? body.checkOut.trim() : '';
    const guests = Number(body.guests) || 1;
    const guestName = typeof body.guestName === 'string' ? body.guestName.trim() : '';
    const guestEmail = typeof body.guestEmail === 'string' ? body.guestEmail.trim() : '';
    const guestPhone = typeof body.guestPhone === 'string' ? body.guestPhone.trim() : '';
    const arrivalTime = typeof body.arrivalTime === 'string' ? body.arrivalTime.trim() : '12:00';
    const notes = typeof body.notes === 'string' ? body.notes.trim().slice(0, 500) : '';
    const selectedTourIds = Array.isArray(body.selectedTourIds)
      ? body.selectedTourIds.filter((id): id is string => typeof id === 'string')
      : [];
    const includeTrainPackage = Boolean(body.includeTrainPackage);

    const room = BOUTIQUE_ROOMS.find((r) => r.id === roomId);
    if (!room) {
      res.status(400).json({ error: 'Selecciona una de las habitaciones válidas.' });
      return;
    }

    if (!isIsoDate(checkIn) || !isIsoDate(checkOut)) {
      res.status(400).json({ error: 'Formato de fechas inválido.' });
      return;
    }

    const nights = diffNights(checkIn, checkOut);
    if (nights <= 0 || nights > 30) {
      res.status(400).json({ error: 'La estadía debe ser entre 1 y 30 noches.' });
      return;
    }

    if (guests < 1 || guests > room.maxGuests) {
      res.status(400).json({
        error: `${room.name} admite máximo ${room.maxGuests} huéspedes.`,
      });
      return;
    }

    if (guestName.length < 2) {
      res.status(400).json({ error: 'Ingresa tu nombre completo para la reserva.' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) {
      res.status(400).json({ error: 'Ingresa un correo electrónico válido.' });
      return;
    }
    if (guestPhone.replace(/\D/g, '').length < 7) {
      res.status(400).json({ error: 'Ingresa un número de WhatsApp o teléfono válido.' });
      return;
    }

    const store = readStore();
    const roomRes = store.reservations.filter(
      (r) => r.status === 'confirmada' && r.roomId === room.id,
    );
    const maxConcurrent = countMaxConcurrentReservations(checkIn, checkOut, roomRes);

    if (maxConcurrent >= room.units) {
      res.status(409).json({
        error: `${room.name} ya no cuenta con disponibilidad en esas fechas. Elige otras fechas o selecciona otra habitación.`,
      });
      return;
    }

    const validTours = BIKE_TOURS.filter((t) => selectedTourIds.includes(t.id));
    const roomSubtotalUsd = room.priceUsd * nights;
    const toursSubtotalUsd = validTours.reduce(
      (sum, tour) => sum + tour.priceUsdPerPerson * guests,
      0,
    );
    const trainSubtotalUsd = includeTrainPackage
      ? TRAIN_TRANSFER_PACKAGE.priceUsdPerPerson * guests
      : 0;
    const totalUsd = roomSubtotalUsd + toursSubtotalUsd + trainSubtotalUsd;

    const existingCodes = new Set(store.reservations.map((r) => r.code));
    const code = generateBookingCode(existingCodes);

    const created: Reservation = {
      code,
      roomId: room.id,
      roomName: room.name,
      checkIn,
      checkOut,
      nights,
      guests,
      guestName,
      guestEmail,
      guestPhone,
      arrivalTime,
      notes,
      selectedTourIds: validTours.map((t) => t.id),
      includeTrainPackage,
      roomSubtotalUsd,
      toursSubtotalUsd,
      trainSubtotalUsd,
      totalUsd,
      status: 'confirmada',
      createdAt: new Date().toISOString(),
    };

    store.reservations.unshift(created);
    writeStore(store);

    res.status(201).json({ reservation: created });
  });

  app.get('/api/reservations/:code', (req, res) => {
    const code = req.params.code.trim().toUpperCase();
    const store = readStore();
    const reservation = store.reservations.find((r) => r.code.toUpperCase() === code);
    if (!reservation) {
      res.status(404).json({
        error: 'No encontramos ninguna reserva con ese código. Verifica e intenta nuevamente.',
      });
      return;
    }
    res.json({ reservation });
  });

  app.patch('/api/reservations/:code/cancel', (req, res) => {
    const code = req.params.code.trim().toUpperCase();
    const store = readStore();
    const idx = store.reservations.findIndex((r) => r.code.toUpperCase() === code);
    if (idx === -1) {
      res.status(404).json({ error: 'Código de reserva no encontrado.' });
      return;
    }
    store.reservations[idx] = {
      ...store.reservations[idx],
      status: 'cancelada',
    };
    writeStore(store);
    res.json({ reservation: store.reservations[idx] });
  });

  app.post('/api/inquiries', (req, res) => {
    const body = req.body as Record<string, unknown>;
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    const topicRaw = typeof body.topic === 'string' ? body.topic : 'consulta_general';
    const preferredDate = typeof body.preferredDate === 'string' ? body.preferredDate.trim() : '';
    const guests = Math.max(1, Math.min(12, Number(body.guests) || 2));
    const message = typeof body.message === 'string' ? body.message.trim().slice(0, 600) : '';

    if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ error: 'Ingresa tu nombre y un correo electrónico válido.' });
      return;
    }

    const allowedTopics = [
      'tour_bici',
      'tren_machupicchu',
      'estadia_grupal',
      'consulta_general',
    ] as const;
    const topic = allowedTopics.includes(topicRaw as (typeof allowedTopics)[number])
      ? (topicRaw as InquiryRecord['topic'])
      : 'consulta_general';

    const store = readStore();
    const inquiry: InquiryRecord = {
      id: `INQ-${Date.now().toString().slice(-5)}`,
      name,
      email,
      phone,
      topic,
      preferredDate,
      guests,
      message,
      createdAt: new Date().toISOString(),
    };
    store.inquiries.unshift(inquiry);
    writeStore(store);

    res.status(201).json({ inquiry });
  });

  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Inka Garden Hostel server running on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
