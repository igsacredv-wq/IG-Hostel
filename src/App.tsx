/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { BookingSidebar } from './components/BookingSidebar';
import { ExperiencesSection } from './components/ExperiencesSection';
import { Header } from './components/Header';
import { HeroSearchSection } from './components/HeroSearchSection';
import { LocationContactFooter } from './components/LocationContactFooter';
import { ReservationManagerSection } from './components/ReservationManagerSection';
import { RoomCard } from './components/RoomCard';
import { RoomDetailsModal } from './components/RoomDetailsModal';
import {
  BOUTIQUE_ROOMS,
  addDaysIso,
  diffNights,
  formatIsoDate,
  type BoutiqueRoom,
  type CurrencyCode,
  type Reservation,
  type RoomAvailabilityResult,
  type RoomCalendarRow,
} from './shared/catalog';

type RoomFilter = 'all' | 'available' | 'matrimonial' | 'familiar';

export default function App() {
  const todayIso = useMemo(() => formatIsoDate(new Date()), []);
  const [checkIn, setCheckIn] = useState<string>(() => addDaysIso(todayIso, 1));
  const [checkOut, setCheckOut] = useState<string>(() => addDaysIso(todayIso, 3));
  const [guests, setGuests] = useState<number>(2);
  const [currency, setCurrency] = useState<CurrencyCode>('BASE');
  const [roomFilter, setRoomFilter] = useState<RoomFilter>('all');

  const [availabilityMap, setAvailabilityMap] = useState<Record<string, RoomAvailabilityResult>>({});
  const [calendarDays, setCalendarDays] = useState<string[]>([]);
  const [calendarRows, setCalendarRows] = useState<RoomCalendarRow[]>([]);
  const [loadingAvailability, setLoadingAvailability] = useState<boolean>(true);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);

  const [selectedRoomId, setSelectedRoomId] = useState<string>('suite-matrimonial');
  const [detailsRoom, setDetailsRoom] = useState<BoutiqueRoom | null>(null);
  const [selectedTourIds, setSelectedTourIds] = useState<string[]>([]);
  const [includeTrainPackage, setIncludeTrainPackage] = useState<boolean>(false);

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);

  const nights = useMemo(() => diffNights(checkIn, checkOut), [checkIn, checkOut]);

  const fetchAvailability = useCallback(
    async (targetIn: string, targetOut: string, targetGuests: number) => {
      setLoadingAvailability(true);
      setAvailabilityError(null);
      try {
        const params = new URLSearchParams({
          checkIn: targetIn,
          checkOut: targetOut,
          guests: String(targetGuests),
        });
        const res = await fetch(`/api/availability?${params.toString()}`);
        const data = await res.json();
        if (!res.ok) {
          setAvailabilityError(data.error || 'No se pudo verificar la disponibilidad.');
          return;
        }
        const map: Record<string, RoomAvailabilityResult> = {};
        for (const item of data.availability as RoomAvailabilityResult[]) {
          map[item.roomId] = item;
        }
        setAvailabilityMap(map);
        setCalendarDays(data.calendarDays || []);
        setCalendarRows(data.calendar || []);

        setSelectedRoomId((currentId) => {
          if (currentId && map[currentId]?.available) {
            return currentId;
          }
          const firstAvailable = BOUTIQUE_ROOMS.find((room) => map[room.id]?.available);
          return firstAvailable ? firstAvailable.id : '';
        });
      } catch {
        setAvailabilityError('Error de red al consultar la disponibilidad de habitaciones.');
      } finally {
        setLoadingAvailability(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchAvailability(checkIn, checkOut, guests);
  }, [checkIn, checkOut, guests, fetchAvailability]);

  const handleCheckInChange = (nextIn: string) => {
    setCheckIn(nextIn);
    if (nextIn >= checkOut) {
      setCheckOut(addDaysIso(nextIn, 2));
    }
    setConfirmedReservation(null);
  };

  const handleCheckOutChange = (nextOut: string) => {
    if (nextOut <= checkIn) {
      setCheckOut(addDaysIso(checkIn, 1));
    } else {
      setCheckOut(nextOut);
    }
    setConfirmedReservation(null);
  };

  const handleGuestsChange = (nextGuests: number) => {
    setGuests(nextGuests);
    setConfirmedReservation(null);
  };

  const scrollToElement = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const filteredRooms = useMemo(() => {
    return BOUTIQUE_ROOMS.filter((room) => {
      const avail = availabilityMap[room.id];
      if (roomFilter === 'available') {
        return avail ? avail.available : room.maxGuests >= guests;
      }
      if (roomFilter === 'matrimonial') {
        return room.category === 'matrimonial' || room.category === 'doble';
      }
      if (roomFilter === 'familiar') {
        return room.category === 'familiar';
      }
      return true;
    });
  }, [roomFilter, availabilityMap, guests]);

  const selectedRoom = useMemo(
    () => BOUTIQUE_ROOMS.find((r) => r.id === selectedRoomId) || null,
    [selectedRoomId],
  );

  const availableUnitsCount = useMemo(
    () =>
      BOUTIQUE_ROOMS.reduce((sum, r) => {
        const av = availabilityMap[r.id];
        if (!av) return sum + (r.maxGuests >= guests ? r.units : 0);
        return sum + (r.maxGuests >= guests ? av.availableUnits : 0);
      }, 0),
    [availabilityMap, guests],
  );

  const availableCategoriesCount = useMemo(
    () =>
      BOUTIQUE_ROOMS.filter((r) =>
        availabilityMap[r.id] ? availabilityMap[r.id].available : r.maxGuests >= guests,
      ).length,
    [availabilityMap, guests],
  );

  const handleToggleTour = (tourId: string) => {
    setSelectedTourIds((prev) =>
      prev.includes(tourId) ? prev.filter((id) => id !== tourId) : [...prev, tourId],
    );
  };

  const handleSubmitReservation = async (guestData: {
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    arrivalTime: string;
    notes: string;
  }) => {
    if (!selectedRoom) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: selectedRoom.id,
          checkIn,
          checkOut,
          guests,
          selectedTourIds,
          includeTrainPackage,
          ...guestData,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || 'No se pudo completar la reserva.');
        return;
      }
      setConfirmedReservation(data.reservation);
      await fetchAvailability(checkIn, checkOut, guests);
    } catch {
      setSubmitError('Error de conexión al registrar tu reserva.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickBookFromCalendar = (roomId: string, newIn: string, newOut: string) => {
    const room = BOUTIQUE_ROOMS.find((r) => r.id === roomId);
    if (room && guests > room.maxGuests) {
      setGuests(room.maxGuests);
    }
    setCheckIn(newIn);
    setCheckOut(newOut);
    setSelectedRoomId(roomId);
    setConfirmedReservation(null);
    scrollToElement('habitaciones');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800">
      <Header onReserveClick={() => scrollToElement('habitaciones')} />

      <main className="flex-1">
        <HeroSearchSection
          checkIn={checkIn}
          checkOut={checkOut}
          guests={guests}
          nights={nights}
          currency={currency}
          minDate={todayIso}
          availableUnitsCount={availableUnitsCount}
          loadingAvailability={loadingAvailability}
          onCheckInChange={handleCheckInChange}
          onCheckOutChange={handleCheckOutChange}
          onGuestsChange={handleGuestsChange}
          onCurrencyChange={setCurrency}
          onSearchSubmit={() => {
            fetchAvailability(checkIn, checkOut, guests);
            scrollToElement('habitaciones');
          }}
        />

        <section id="habitaciones" className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="font-display font-bold text-3xl lg:text-4xl text-slate-900 mb-3">
                Nuestras Habitaciones
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-6">
                Son espacios diseñados para brindarte el máximo confort y descanso en nuestro hotel
                boutique de 5 habitaciones
              </p>

              <div
                role="tablist"
                aria-label="Filtrar habitaciones"
                className="inline-flex flex-wrap justify-center gap-1 p-1 bg-slate-200/80 rounded-lg"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={roomFilter === 'all'}
                  onClick={() => setRoomFilter('all')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    roomFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Todas (4 tipos · 5 hab.)
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={roomFilter === 'available'}
                  onClick={() => setRoomFilter('available')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    roomFilter === 'available'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Disponibles ({availableCategoriesCount})
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={roomFilter === 'matrimonial'}
                  onClick={() => setRoomFilter('matrimonial')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    roomFilter === 'matrimonial'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Matrimonial / Doble
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={roomFilter === 'familiar'}
                  onClick={() => setRoomFilter('familiar')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    roomFilter === 'familiar'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Familiar Solarium
                </button>
              </div>
            </div>

            {availabilityError && (
              <div
                role="alert"
                className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-800"
              >
                {availabilityError}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8">
                {filteredRooms.length === 0 ? (
                  <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-3">
                    <p className="font-display text-2xl font-semibold text-slate-900">
                      No hay habitaciones disponibles con ese filtro
                    </p>
                    <p className="text-sm text-slate-600">
                      Muestra todas las habitaciones para revisar la próxima fecha disponible o
                      ajusta la cantidad de huéspedes.
                    </p>
                    <button
                      type="button"
                      onClick={() => setRoomFilter('all')}
                      className="min-h-[40px] px-4 py-2 text-xs font-semibold bg-[#2563EB] text-white rounded-md cursor-pointer"
                    >
                      Mostrar todas las habitaciones
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredRooms.map((room) => (
                      <RoomCard
                        key={room.id}
                        room={room}
                        availability={availabilityMap[room.id]}
                        nights={nights}
                        guests={guests}
                        currency={currency}
                        isSelected={selectedRoomId === room.id && !confirmedReservation}
                        onViewDetails={(chosen) => setDetailsRoom(chosen)}
                        onSelect={(chosen) => {
                          setSelectedRoomId(chosen.id);
                          setConfirmedReservation(null);
                          setSubmitError(null);
                          if (window.innerWidth < 1024) {
                            scrollToElement('resumen-reserva');
                          }
                        }}
                        onUseSuggestedDate={(nextDate) => {
                          const stayLen = Math.max(1, nights);
                          setCheckIn(nextDate);
                          setCheckOut(addDaysIso(nextDate, stayLen));
                          setSelectedRoomId(room.id);
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="lg:col-span-4">
                <BookingSidebar
                  selectedRoom={selectedRoom}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  nights={nights}
                  guests={guests}
                  currency={currency}
                  selectedTourIds={selectedTourIds}
                  includeTrainPackage={includeTrainPackage}
                  confirmedReservation={confirmedReservation}
                  onToggleTour={handleToggleTour}
                  onToggleTrainPackage={() => setIncludeTrainPackage((prev) => !prev)}
                  onSubmitReservation={handleSubmitReservation}
                  onResetConfirmed={() => {
                    setConfirmedReservation(null);
                    setSubmitError(null);
                  }}
                  submitting={submitting}
                  submitError={submitError}
                />
              </div>
            </div>
          </div>
        </section>

        <ExperiencesSection
          currency={currency}
          selectedTourIds={selectedTourIds}
          includeTrainPackage={includeTrainPackage}
          onToggleTourAndScroll={(tourId) => {
            handleToggleTour(tourId);
            setConfirmedReservation(null);
            scrollToElement('resumen-reserva');
          }}
          onToggleTrainAndScroll={() => {
            setIncludeTrainPackage((prev) => !prev);
            setConfirmedReservation(null);
            scrollToElement('resumen-reserva');
          }}
        />

        <ReservationManagerSection
          calendarDays={calendarDays}
          calendarRows={calendarRows}
          currency={currency}
          onQuickBookDate={handleQuickBookFromCalendar}
          onReservationCancelled={() => fetchAvailability(checkIn, checkOut, guests)}
        />
      </main>

      <LocationContactFooter defaultDate={checkIn} />

      <RoomDetailsModal
        room={detailsRoom}
        availability={detailsRoom ? availabilityMap[detailsRoom.id] : undefined}
        nights={nights}
        guests={guests}
        currency={currency}
        onClose={() => setDetailsRoom(null)}
        onSelectRoom={(chosen) => {
          setSelectedRoomId(chosen.id);
          setConfirmedReservation(null);
          setSubmitError(null);
          scrollToElement('resumen-reserva');
        }}
      />
    </div>
  );
}
