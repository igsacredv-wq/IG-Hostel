import { Check, Sun, X } from 'lucide-react';
import { useEffect } from 'react';
import {
  formatMoney,
  formatRoomBasePrice,
  type BoutiqueRoom,
  type CurrencyCode,
  type RoomAvailabilityResult,
} from '../shared/catalog';
import { ResilientImage } from './ResilientImage';

interface RoomDetailsModalProps {
  room: BoutiqueRoom | null;
  availability?: RoomAvailabilityResult;
  nights: number;
  guests: number;
  currency: CurrencyCode;
  onClose: () => void;
  onSelectRoom: (room: BoutiqueRoom) => void;
}

export function RoomDetailsModal({
  room,
  availability,
  nights,
  guests,
  currency,
  onClose,
  onSelectRoom,
}: RoomDetailsModalProps) {
  useEffect(() => {
    if (!room) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [room, onClose]);

  if (!room) return null;

  const fitsGuests = room.maxGuests >= guests;
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
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-room-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
          <ResilientImage
            src={room.imageUrl}
            alt={room.name}
            titleFallback={room.name}
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar detalles"
            className="absolute top-3 right-3 w-9 h-9 rounded-lg bg-white/95 hover:bg-white text-slate-900 shadow-sm flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 id="modal-room-title" className="font-display text-2xl font-bold text-slate-900">
                {room.name}
              </h3>
              <p className="text-sm text-slate-600 mt-0.5">{room.subtitle}</p>
            </div>
            <div className="sm:text-right shrink-0">
              <span className="text-2xl font-bold text-[#2563EB] tabular-nums">
                {formatRoomBasePrice(room, currency)}
              </span>
              <span className="text-xs text-slate-500 block">
                /noche · Total {nights} {nights === 1 ? 'noche' : 'noches'}: {formattedStayTotal}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-slate-600">
            <span className="tabular-nums">{room.sizeSqm} m²</span>
            <span aria-hidden="true">·</span>
            <span>Máx. {room.maxGuests} huéspedes</span>
            <span aria-hidden="true">·</span>
            <span>{room.bedsLabel}</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
              <Sun className="w-4 h-4 text-amber-500" aria-hidden="true" />
              {room.orientation}
            </span>
          </div>

          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">{room.description}</p>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-2.5">
              Características incluidas
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600">
              {room.amenities.map((amenity) => (
                <li key={amenity} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{amenity}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-600">
              {isAvailable
                ? 'Disponible para las fechas y huéspedes seleccionados.'
                : 'No disponible para las fechas o cantidad de huéspedes actuales.'}
            </span>
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none min-h-[42px] px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md cursor-pointer"
              >
                Cerrar
              </button>
              <button
                type="button"
                disabled={!isAvailable}
                onClick={() => {
                  onSelectRoom(room);
                  onClose();
                }}
                className="flex-1 sm:flex-none min-h-[42px] px-5 py-2 text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-45 rounded-md cursor-pointer"
              >
                Reservar esta habitación
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
