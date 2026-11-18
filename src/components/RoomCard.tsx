import { AlertCircle, Check } from 'lucide-react';
import {
  formatDisplayDateEs,
  formatMoney,
  formatRoomBasePrice,
  type BoutiqueRoom,
  type CurrencyCode,
  type RoomAvailabilityResult,
} from '../shared/catalog';
import { ResilientImage } from './ResilientImage';

interface RoomCardProps {
  room: BoutiqueRoom;
  availability?: RoomAvailabilityResult;
  nights: number;
  guests: number;
  currency: CurrencyCode;
  isSelected: boolean;
  onSelect: (room: BoutiqueRoom) => void;
  onViewDetails: (room: BoutiqueRoom) => void;
  onUseSuggestedDate: (nextCheckIn: string) => void;
}

export function RoomCard({
  room,
  availability,
  nights,
  guests,
  currency,
  isSelected,
  onSelect,
  onViewDetails,
  onUseSuggestedDate,
}: RoomCardProps) {
  const fitsGuests = room.maxGuests >= guests;
  const hasConflict = availability ? !availability.available && fitsGuests : false;
  const isAvailable = availability ? availability.available : fitsGuests;
  const stayTotalBase = room.basePrice * Math.max(1, nights);
  const stayTotalUsd = room.priceUsd * Math.max(1, nights);

  const formattedStayTotal =
    currency === 'BASE'
      ? room.baseCurrency === 'EUR'
        ? `€${stayTotalBase}`
        : `$${stayTotalBase}`
      : formatMoney(stayTotalUsd, currency);

  return (
    <article
      className={`bg-white border rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-200 shadow-xs hover:shadow-md ${
        isSelected
          ? 'border-[#2563EB] ring-2 ring-[#2563EB]/20'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div>
        <div className="aspect-[4/3] overflow-hidden bg-slate-100">
          <ResilientImage
            src={room.imageUrl}
            alt={room.name}
            titleFallback={room.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="p-5 pb-3">
          <div className="flex justify-between items-start gap-3">
            <div>
              <h3 className="font-display font-semibold text-xl text-slate-900 leading-snug">
                {room.name}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Máx. {room.maxGuests} huéspedes
                {room.units > 1 ? ` · ${room.units} unidades en el hotel` : ''}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-2xl font-bold text-[#2563EB] tabular-nums whitespace-nowrap">
                {formatRoomBasePrice(room, currency)}
              </span>
              <span className="text-xs text-slate-500 whitespace-nowrap">/noche</span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 leading-relaxed">
            {room.amenities.join(' · ')}
          </div>
        </div>
      </div>

      <div className="p-5 pt-3 space-y-3">
        <div className="text-xs">
          {!fitsGuests ? (
            <div className="flex items-center gap-1.5 font-medium text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Máximo {room.maxGuests} huéspedes (buscas {guests})</span>
            </div>
          ) : hasConflict && availability?.nextAvailableCheckIn ? (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 font-medium text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Ocupada en estas fechas</span>
              </div>
              <button
                type="button"
                onClick={() => onUseSuggestedDate(availability.nextAvailableCheckIn!)}
                className="text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer"
              >
                Libre desde {formatDisplayDateEs(availability.nextAvailableCheckIn)} (aplicar)
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700">
                <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>
                  Disponible
                  {availability && availability.totalUnits > 1
                    ? ` (${availability.availableUnits}/${availability.totalUnits})`
                    : ''}
                </span>
              </span>
              <span className="text-slate-600 tabular-nums">
                {nights} {nights === 1 ? 'noche' : 'noches'}:{' '}
                <strong className="text-slate-900">{formattedStayTotal}</strong>
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => onViewDetails(room)}
            className="min-h-[40px] px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 rounded-md transition-colors whitespace-nowrap cursor-pointer"
          >
            Ver Detalles
          </button>
          <button
            type="button"
            disabled={!isAvailable}
            onClick={() => onSelect(room)}
            className={`min-h-[40px] px-3 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed ${
              isSelected
                ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                : 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]'
            }`}
          >
            {isSelected ? 'Seleccionada' : 'Seleccionar'}
          </button>
        </div>
      </div>
    </article>
  );
}
