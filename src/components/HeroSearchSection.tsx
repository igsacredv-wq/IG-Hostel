import { CalendarDays, Search, Users } from 'lucide-react';
import { HOSTEL_CONTACT, type CurrencyCode } from '../shared/catalog';

interface HeroSearchSectionProps {
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  currency: CurrencyCode;
  minDate: string;
  availableUnitsCount: number;
  loadingAvailability: boolean;
  onCheckInChange: (date: string) => void;
  onCheckOutChange: (date: string) => void;
  onGuestsChange: (guests: number) => void;
  onCurrencyChange: (currency: CurrencyCode) => void;
  onSearchSubmit: () => void;
}

export function HeroSearchSection({
  checkIn,
  checkOut,
  guests,
  nights,
  currency,
  minDate,
  availableUnitsCount,
  loadingAvailability,
  onCheckInChange,
  onCheckOutChange,
  onGuestsChange,
  onCurrencyChange,
  onSearchSubmit,
}: HeroSearchSectionProps) {
  return (
    <section
      id="inicio"
      className="relative bg-gradient-to-br from-[#2563EB]/6 via-white to-[#0EA5E9]/8 py-14 lg:py-24 border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-medium text-[#2563EB] mb-3">
            Inka Garden Hostel · Hotel Boutique de 5 Habitaciones en Cusco &amp; Valle Sagrado
          </p>
          <h1
            className="font-display font-bold text-slate-900 leading-[1.1] tracking-tight mb-5"
            style={{ fontSize: 'clamp(2.25rem, 4.2vw, 3.75rem)', textWrap: 'balance' }}
          >
            Tu refugio soleado en el corazón del Cusco y del Valle Sagrado
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Somos tu casa con alma y mucho sol. Reserva directo nuestras habitaciones y apartamentos
            en Cusco, disfruta tours en bicicleta a Moray y Salineras, y conecta directo con el tren
            a Machu Picchu.
          </p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl max-w-4xl mx-auto shadow-lg">
          <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-left">
              <h2 className="font-display text-xl sm:text-2xl font-semibold text-slate-900">
                Verificar Disponibilidad
              </h2>
              <p className="text-sm text-slate-600 mt-0.5">
                Atención directa al{' '}
                <a
                  href={`tel:${HOSTEL_CONTACT.whatsappDigits}`}
                  className="font-semibold text-[#2563EB] hover:underline tabular-nums"
                >
                  {HOSTEL_CONTACT.phoneDisplay}
                </a>{' '}
                · {availableUnitsCount} de 5 habitaciones libres en estas fechas
              </p>
            </div>

            <div
              role="group"
              aria-label="Seleccionar moneda"
              className="inline-flex p-1 bg-slate-100 rounded-lg self-start sm:self-center shrink-0"
            >
              <button
                type="button"
                onClick={() => onCurrencyChange('BASE')}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  currency === 'BASE'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                € / $
              </button>
              <button
                type="button"
                onClick={() => onCurrencyChange('USD')}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  currency === 'USD'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                USD ($)
              </button>
              <button
                type="button"
                onClick={() => onCurrencyChange('PEN')}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  currency === 'PEN'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                PEN (S/)
              </button>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSearchSubmit();
            }}
            className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
          >
            <div className="space-y-1.5 text-left">
              <label htmlFor="checkin" className="block text-sm font-medium text-slate-700">
                Check-in
              </label>
              <div className="relative">
                <CalendarDays
                  className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="checkin"
                  type="date"
                  min={minDate}
                  value={checkIn}
                  onChange={(e) => onCheckInChange(e.target.value)}
                  required
                  className="w-full min-h-[42px] pl-10 pr-3 py-2 text-sm tabular-nums bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <label htmlFor="checkout" className="block text-sm font-medium text-slate-700">
                Check-out ({nights > 0 ? `${nights} ${nights === 1 ? 'noche' : 'noches'}` : 'Elige'})
              </label>
              <div className="relative">
                <CalendarDays
                  className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="checkout"
                  type="date"
                  min={checkIn}
                  value={checkOut}
                  onChange={(e) => onCheckOutChange(e.target.value)}
                  required
                  className="w-full min-h-[42px] pl-10 pr-3 py-2 text-sm tabular-nums bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <label htmlFor="guests" className="block text-sm font-medium text-slate-700">
                Huéspedes
              </label>
              <div className="relative">
                <Users
                  className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <select
                  id="guests"
                  value={guests}
                  onChange={(e) => onGuestsChange(Number(e.target.value))}
                  className="w-full min-h-[42px] pl-10 pr-3 py-2 text-sm tabular-nums bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                >
                  <option value={1}>1 huésped</option>
                  <option value={2}>2 huéspedes</option>
                  <option value={3}>3 huéspedes</option>
                  <option value={4}>4 huéspedes</option>
                </select>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loadingAvailability}
                className="w-full min-h-[42px] px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-60 text-white text-sm font-semibold rounded-md shadow-xs transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
              >
                <Search className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{loadingAvailability ? 'Buscando...' : 'Buscar Habitaciones'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
