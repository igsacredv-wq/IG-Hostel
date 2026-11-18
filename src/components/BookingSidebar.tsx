import { Bike, Check, CheckCircle2, Copy, MessageCircle, TrainFront } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import {
  BIKE_TOURS,
  HOSTEL_CONTACT,
  TRAIN_TRANSFER_PACKAGE,
  USD_TO_PEN_RATE,
  formatDisplayDateEs,
  formatMoney,
  formatRoomBasePrice,
  type BoutiqueRoom,
  type CurrencyCode,
  type Reservation,
} from '../shared/catalog';

interface BookingSidebarProps {
  selectedRoom: BoutiqueRoom | null;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  currency: CurrencyCode;
  selectedTourIds: string[];
  includeTrainPackage: boolean;
  confirmedReservation: Reservation | null;
  onToggleTour: (tourId: string) => void;
  onToggleTrainPackage: () => void;
  onSubmitReservation: (guestData: {
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    arrivalTime: string;
    notes: string;
  }) => Promise<void>;
  onResetConfirmed: () => void;
  submitting: boolean;
  submitError: string | null;
}

export function BookingSidebar({
  selectedRoom,
  checkIn,
  checkOut,
  nights,
  guests,
  currency,
  selectedTourIds,
  includeTrainPackage,
  confirmedReservation,
  onToggleTour,
  onToggleTrainPackage,
  onSubmitReservation,
  onResetConfirmed,
  submitting,
  submitError,
}: BookingSidebarProps) {
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [arrivalTime, setArrivalTime] = useState('12:00');
  const [notes, setNotes] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  const selectedTours = BIKE_TOURS.filter((t) => selectedTourIds.includes(t.id));
  const roomSubtotalUsd = selectedRoom ? selectedRoom.priceUsd * nights : 0;
  const toursSubtotalUsd = selectedTours.reduce(
    (sum, tour) => sum + tour.priceUsdPerPerson * guests,
    0,
  );
  const trainSubtotalUsd = includeTrainPackage
    ? TRAIN_TRANSFER_PACKAGE.priceUsdPerPerson * guests
    : 0;
  const totalUsd = roomSubtotalUsd + toursSubtotalUsd + trainSubtotalUsd;
  const totalPen = Math.round(totalUsd * USD_TO_PEN_RATE);

  const displayRoomSubtotal = () => {
    if (!selectedRoom) return '';
    if (currency === 'BASE') {
      const val = selectedRoom.basePrice * nights;
      return selectedRoom.baseCurrency === 'EUR' ? `€${val} EUR` : `$${val} USD`;
    }
    return formatMoney(roomSubtotalUsd, currency);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmitReservation({
      guestName,
      guestEmail,
      guestPhone,
      arrivalTime,
      notes,
    });
  };

  if (confirmedReservation) {
    const whatsappMessage = encodeURIComponent(
      `Hola Inka Garden Hostel, acabo de registrar mi reserva ${confirmedReservation.code} para ${confirmedReservation.roomName} del ${confirmedReservation.checkIn} al ${confirmedReservation.checkOut} (${confirmedReservation.guests} huéspedes). Nombre: ${confirmedReservation.guestName}.`,
    );
    const whatsappHref = `https://wa.me/${HOSTEL_CONTACT.whatsappDigits}?text=${whatsappMessage}`;

    return (
      <aside
        id="resumen-reserva"
        className="bg-white border border-emerald-600/30 rounded-xl p-6 shadow-sm lg:sticky lg:top-24"
      >
        <div className="flex items-start gap-3 pb-4 border-b border-slate-100">
          <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-xs font-semibold text-emerald-700">Reserva confirmada</p>
            <h3 className="font-display text-2xl font-bold text-slate-900">
              ¡Te esperamos en Cusco!
            </h3>
          </div>
        </div>

        <div className="py-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-500 block">Código de reserva</span>
            <span className="font-mono text-lg font-semibold text-slate-900 tabular-nums">
              {confirmedReservation.code}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(confirmedReservation.code);
              setCopiedCode(true);
              setTimeout(() => setCopiedCode(false), 2000);
            }}
            className="min-h-[38px] px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-md inline-flex items-center gap-1.5 cursor-pointer"
          >
            {copiedCode ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                <span>Copiado</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Copiar</span>
              </>
            )}
          </button>
        </div>

        <dl className="py-4 space-y-2.5 text-sm border-b border-slate-100">
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">Habitación</dt>
            <dd className="font-semibold text-slate-900 text-right">
              {confirmedReservation.roomName}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">Fechas</dt>
            <dd className="font-medium text-slate-900 tabular-nums text-right">
              {formatDisplayDateEs(confirmedReservation.checkIn)} —{' '}
              {formatDisplayDateEs(confirmedReservation.checkOut)}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">Estadía</dt>
            <dd className="text-slate-900 tabular-nums">
              {confirmedReservation.nights} noches · {confirmedReservation.guests} huéspedes
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">Titular</dt>
            <dd className="text-slate-900 text-right">{confirmedReservation.guestName}</dd>
          </div>
          <div className="flex justify-between gap-3 pt-2 border-t border-slate-100">
            <dt className="font-semibold text-slate-900">Total estimado</dt>
            <dd className="font-bold text-[#2563EB] tabular-nums">
              {formatMoney(confirmedReservation.totalUsd, currency)}
            </dd>
          </div>
        </dl>

        <div className="pt-4 space-y-3">
          <p className="text-xs text-slate-600 leading-relaxed">
            Guarda tu código para consultar o modificar tu estadía en «Mi Reserva». También puedes
            coordinar tu llegada directo por WhatsApp.
          </p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full min-h-[44px] px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-md transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
            <span>Enviar comprobante por WhatsApp</span>
          </a>
          <button
            type="button"
            onClick={onResetConfirmed}
            className="w-full min-h-[40px] px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
          >
            Hacer otra reserva
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside
      id="resumen-reserva"
      className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm lg:sticky lg:top-24"
    >
      <div className="pb-4 border-b border-slate-100">
        <p className="text-xs font-semibold text-[#2563EB] mb-1">Motor de Reserva Directa</p>
        <h3 className="font-display text-2xl font-bold text-slate-900">
          Resumen de tu estadía
        </h3>
        <p className="text-xs text-slate-600 mt-1 tabular-nums">
          {formatDisplayDateEs(checkIn)} — {formatDisplayDateEs(checkOut)} · {nights}{' '}
          {nights === 1 ? 'noche' : 'noches'} · {guests} {guests === 1 ? 'huésped' : 'huéspedes'}
        </p>
      </div>

      {!selectedRoom ? (
        <div className="py-6 text-sm text-slate-600 border-b border-slate-100">
          Selecciona una de nuestras habitaciones disponibles para calcular tu tarifa y completar
          la reserva directa.
        </div>
      ) : (
        <>
          <div className="py-4 border-b border-slate-100 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-slate-900">{selectedRoom.name}</div>
                <div className="text-xs text-slate-600 tabular-nums">
                  {formatRoomBasePrice(selectedRoom, currency)} × {nights}{' '}
                  {nights === 1 ? 'noche' : 'noches'}
                </div>
              </div>
              <div className="text-sm font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                {displayRoomSubtotal()}
              </div>
            </div>

            <div className="pt-2">
              <div className="text-xs font-semibold text-slate-700 mb-2">
                Completa tu aventura en Cusco y Valle Sagrado
              </div>
              <div className="space-y-2">
                {BIKE_TOURS.map((tour) => {
                  const checked = selectedTourIds.includes(tour.id);
                  return (
                    <label
                      key={tour.id}
                      className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                        checked
                          ? 'bg-[#2563EB]/5 border-[#2563EB]'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => onToggleTour(tour.id)}
                        className="mt-0.5 accent-[#2563EB] w-4 h-4 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-slate-900 inline-flex items-center gap-1">
                            <Bike className="w-3.5 h-3.5 text-[#2563EB] shrink-0" aria-hidden="true" />
                            <span>{tour.name}</span>
                          </span>
                          <span className="font-semibold text-slate-900 tabular-nums shrink-0">
                            +{formatMoney(tour.priceUsdPerPerson * guests, currency)}
                          </span>
                        </div>
                        <span className="text-slate-600 block mt-0.5 tabular-nums">
                          {tour.duration} · {tour.distanceKm} km · {guests} pers.
                        </span>
                      </div>
                    </label>
                  );
                })}

                <label
                  className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                    includeTrainPackage
                      ? 'bg-[#2563EB]/5 border-[#2563EB]'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={includeTrainPackage}
                    onChange={onToggleTrainPackage}
                    className="mt-0.5 accent-[#2563EB] w-4 h-4 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-slate-900 inline-flex items-center gap-1">
                        <TrainFront
                          className="w-3.5 h-3.5 text-[#2563EB] shrink-0"
                          aria-hidden="true"
                        />
                        <span>Conexión Tren a Machu Picchu</span>
                      </span>
                      <span className="font-semibold text-slate-900 tabular-nums shrink-0">
                        +{formatMoney(TRAIN_TRANSFER_PACKAGE.priceUsdPerPerson * guests, currency)}
                      </span>
                    </div>
                    <span className="text-slate-600 block mt-0.5">
                      Traslado a Ollantaytambo, desayuno temprano y descanso en Yanahuara ({guests}{' '}
                      pers.)
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="py-4 border-b border-slate-100 space-y-1.5">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold text-slate-900">Total de la reserva</span>
              <span className="text-xl font-bold text-[#2563EB] tabular-nums">
                {formatMoney(totalUsd, currency)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 tabular-nums">
              <span>Reserva directa · Desayuno incluido</span>
              <span>
                {currency === 'PEN'
                  ? `≈ $${totalUsd.toLocaleString('en-US')} USD`
                  : `≈ S/ ${totalPen.toLocaleString('es-PE')}`}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="pt-4 space-y-3">
            <div>
              <label htmlFor="guest-name" className="block text-xs font-semibold text-slate-700 mb-1">
                Nombre completo
              </label>
              <input
                id="guest-name"
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Ej. Sofía Quispe"
                className="w-full min-h-[42px] px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="guest-email"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Correo electrónico
                </label>
                <input
                  id="guest-email"
                  type="email"
                  required
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="w-full min-h-[42px] px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>

              <div>
                <label
                  htmlFor="guest-phone"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  WhatsApp / Teléfono
                </label>
                <input
                  id="guest-phone"
                  type="tel"
                  required
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="+51 992 009 619"
                  className="w-full min-h-[42px] px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="arrival-time"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Hora estimada de llegada
              </label>
              <select
                id="arrival-time"
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
                className="w-full min-h-[42px] px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
              >
                <option value="09:00">09:00 h (Guardaequipaje temprano)</option>
                <option value="12:00">12:00 h (Check-in estándar)</option>
                <option value="16:00">16:00 h (Tarde soleada)</option>
                <option value="20:00">20:00 h (Llegada nocturna)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="guest-notes"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Notas sobre tu vuelo, tren o bicicletas (opcional)
              </label>
              <textarea
                id="guest-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej. Tomamos el tren temprano en Ollantaytambo o queremos talla M de bici."
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
              />
            </div>

            {submitError && (
              <div
                role="alert"
                className="p-3 rounded-md bg-rose-50 border border-rose-200 text-xs font-medium text-rose-800"
              >
                {submitError}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full min-h-[46px] px-4 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-60 text-white text-sm font-semibold rounded-md shadow-xs transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
            >
              {submitting ? 'Confirmando reserva...' : 'Confirmar reserva ahora'}
            </button>
          </form>
        </>
      )}
    </aside>
  );
}
