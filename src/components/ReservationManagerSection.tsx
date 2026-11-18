import { CalendarDays, Search, XCircle } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import {
  addDaysIso,
  formatDisplayDateEs,
  formatMoney,
  formatShortDayEs,
  type CurrencyCode,
  type Reservation,
  type RoomCalendarRow,
} from '../shared/catalog';

interface ReservationManagerSectionProps {
  calendarDays: string[];
  calendarRows: RoomCalendarRow[];
  currency: CurrencyCode;
  onQuickBookDate: (roomId: string, checkInDate: string, checkOutDate: string) => void;
  onReservationCancelled: () => Promise<void>;
}

export function ReservationManagerSection({
  calendarDays,
  calendarRows,
  currency,
  onQuickBookDate,
  onReservationCancelled,
}: ReservationManagerSectionProps) {
  const [activeTab, setActiveTab] = useState<'lookup' | 'calendar'>('calendar');
  const [codeInput, setCodeInput] = useState('');
  const [foundReservation, setFoundReservation] = useState<Reservation | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [loadingLookup, setLoadingLookup] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const performLookup = async (codeToSearch: string) => {
    const clean = codeToSearch.trim().toUpperCase();
    if (!clean) return;
    setLoadingLookup(true);
    setLookupError(null);
    try {
      const res = await fetch(`/api/reservations/${encodeURIComponent(clean)}`);
      const data = await res.json();
      if (!res.ok) {
        setFoundReservation(null);
        setLookupError(data.error || 'No se encontró la reserva.');
      } else {
        setFoundReservation(data.reservation);
      }
    } catch {
      setLookupError('Error al consultar tu reserva. Intenta nuevamente.');
    } finally {
      setLoadingLookup(false);
    }
  };

  const handleLookupSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await performLookup(codeInput);
  };

  const handleCancelReservation = async () => {
    if (!foundReservation) return;
    setCancelling(true);
    setLookupError(null);
    try {
      const res = await fetch(
        `/api/reservations/${encodeURIComponent(foundReservation.code)}/cancel`,
        { method: 'PATCH' },
      );
      const data = await res.json();
      if (!res.ok) {
        setLookupError(data.error || 'No se pudo cancelar la reserva.');
      } else {
        setFoundReservation(data.reservation);
        await onReservationCancelled();
      }
    } catch {
      setLookupError('No se pudo conectar para cancelar la reserva.');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <section id="mi-reserva" className="py-16 border-t border-slate-200 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold text-[#2563EB] mb-1.5">
              Transparencia y gestión directa
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
              Disponibilidad de las 5 habitaciones y Mi Reserva
            </h2>
          </div>

          <div className="inline-flex p-1 bg-slate-200/80 rounded-lg self-start">
            <button
              type="button"
              onClick={() => setActiveTab('calendar')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'calendar'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Calendario 5 habitaciones
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('lookup')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'lookup'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Buscar mi reserva
            </button>
          </div>
        </div>

        {activeTab === 'calendar' ? (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1.5 font-medium text-slate-900">
                <CalendarDays className="w-4 h-4 text-[#2563EB]" aria-hidden="true" />
                Próximos 14 días — Haz clic en cualquier día «Libre» para iniciar tu reserva
              </span>
              <span className="tabular-nums">Libre = disponible · Ocup. = reservada</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[760px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="py-3 px-4 text-xs font-semibold text-slate-700 w-60">
                      Habitación
                    </th>
                    {calendarDays.map((day) => {
                      const { dayNum, weekday, month } = formatShortDayEs(day);
                      return (
                        <th
                          key={day}
                          className="py-2.5 px-1.5 text-center text-[11px] font-medium text-slate-500 tabular-nums"
                        >
                          <div className="capitalize">{weekday}</div>
                          <div className="text-xs font-bold text-slate-900">{dayNum}</div>
                          <div className="capitalize text-[10px]">{month}</div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {calendarRows.map((row) => (
                    <tr key={row.roomId} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 text-sm font-semibold text-slate-900 whitespace-nowrap">
                        {row.roomName}
                        {row.totalUnits > 1 && (
                          <span className="text-xs font-normal text-slate-500 ml-1.5">
                            ({row.totalUnits} u.)
                          </span>
                        )}
                      </td>
                      {row.days.map((cell) => (
                        <td key={cell.date} className="p-1 text-center">
                          {cell.occupied ? (
                            <span
                              title={`Ocupada el ${cell.date}`}
                              className="inline-flex items-center justify-center w-full py-2 text-[11px] font-medium rounded bg-rose-50 text-rose-700 tabular-nums"
                            >
                              Ocup.
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                onQuickBookDate(row.roomId, cell.date, addDaysIso(cell.date, 2))
                              }
                              title={`Reservar ${row.roomName} desde ${cell.date}`}
                              className="inline-flex items-center justify-center w-full py-2 text-[11px] font-semibold rounded bg-emerald-50 hover:bg-[#2563EB] text-emerald-700 hover:text-white transition-colors cursor-pointer tabular-nums"
                            >
                              {row.totalUnits > 1 ? `${cell.freeUnits}/${row.totalUnits}` : 'Libre'}
                            </button>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-2xl shadow-xs">
            <form onSubmit={handleLookupSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label htmlFor="lookup-code" className="sr-only">
                  Código de reserva
                </label>
                <input
                  id="lookup-code"
                  type="text"
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  placeholder="Ingresa tu código (ej. IG-2026-1042)"
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm font-mono bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>
              <button
                type="submit"
                disabled={loadingLookup}
                className="min-h-[44px] px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold rounded-md transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <Search className="w-4 h-4" aria-hidden="true" />
                <span>{loadingLookup ? 'Buscando...' : 'Consultar reserva'}</span>
              </button>
            </form>

            <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
              <span>Código de demostración disponible:</span>
              <button
                type="button"
                onClick={() => {
                  setCodeInput('IG-2026-1042');
                  performLookup('IG-2026-1042');
                }}
                className="font-mono font-semibold text-[#2563EB] hover:underline cursor-pointer"
              >
                IG-2026-1042
              </button>
            </div>

            {lookupError && (
              <div
                role="alert"
                className="mt-4 p-3 rounded-md bg-rose-50 border border-rose-200 text-xs font-medium text-rose-800"
              >
                {lookupError}
              </div>
            )}

            {foundReservation && (
              <div className="mt-6 pt-5 border-t border-slate-100 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-mono text-sm font-semibold text-slate-900">
                      {foundReservation.code}
                    </div>
                    <h3 className="font-display text-2xl font-bold text-slate-900">
                      {foundReservation.roomName}
                    </h3>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded ${
                      foundReservation.status === 'confirmada'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {foundReservation.status === 'confirmada' ? 'Confirmada' : 'Cancelada'}
                  </span>
                </div>

                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-xs text-slate-500">Huésped</dt>
                    <dd className="font-medium text-slate-900">{foundReservation.guestName}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">Fechas</dt>
                    <dd className="font-medium text-slate-900 tabular-nums">
                      {formatDisplayDateEs(foundReservation.checkIn)} —{' '}
                      {formatDisplayDateEs(foundReservation.checkOut)} ({foundReservation.nights}{' '}
                      noches)
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">Huéspedes y llegada</dt>
                    <dd className="text-slate-900 tabular-nums">
                      {foundReservation.guests} pers. · {foundReservation.arrivalTime} h
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">Total reserva</dt>
                    <dd className="font-bold text-[#2563EB] tabular-nums">
                      {formatMoney(foundReservation.totalUsd, currency)}
                    </dd>
                  </div>
                </dl>

                {foundReservation.status === 'confirmada' && (
                  <div className="pt-2">
                    <button
                      type="button"
                      disabled={cancelling}
                      onClick={handleCancelReservation}
                      className="min-h-[40px] px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" aria-hidden="true" />
                      <span>
                        {cancelling ? 'Cancelando...' : 'Cancelar esta reserva y liberar fechas'}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
