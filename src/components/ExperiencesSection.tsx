import { Bike, Check, Coffee, Sun, TrainFront, Wifi } from 'lucide-react';
import {
  BIKE_TOURS,
  BIKE_TOUR_IMAGE_URL,
  TRAIN_TRANSFER_PACKAGE,
  TRAIN_VALLEY_IMAGE_URL,
  formatMoney,
  type CurrencyCode,
} from '../shared/catalog';
import { ResilientImage } from './ResilientImage';

interface ExperiencesSectionProps {
  currency: CurrencyCode;
  selectedTourIds: string[];
  includeTrainPackage: boolean;
  onToggleTourAndScroll: (tourId: string) => void;
  onToggleTrainAndScroll: () => void;
}

export function ExperiencesSection({
  currency,
  selectedTourIds,
  includeTrainPackage,
  onToggleTourAndScroll,
  onToggleTrainAndScroll,
}: ExperiencesSectionProps) {
  return (
    <>
      <section id="servicios" className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl lg:text-4xl text-slate-900 mb-3">
              Servicios y Experiencia Inka Garden
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Disfruta una estadía con alma y mucho sol entre el centro de Cusco y el Valle Sagrado
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
              <div className="mx-auto w-12 h-12 bg-[#2563EB]/10 rounded-lg flex items-center justify-center mb-4">
                <Bike className="w-6 h-6 text-[#2563EB]" aria-hidden="true" />
              </div>
              <h3 className="font-display font-semibold text-lg text-slate-900 mb-2">
                Tours en Bicicleta
              </h3>
              <p className="text-sm text-slate-600">
                Salidas guiadas hacia Moray, Salineras, Yanahuara y Ollantaytambo con equipo completo.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
              <div className="mx-auto w-12 h-12 bg-[#2563EB]/10 rounded-lg flex items-center justify-center mb-4">
                <TrainFront className="w-6 h-6 text-[#2563EB]" aria-hidden="true" />
              </div>
              <h3 className="font-display font-semibold text-lg text-slate-900 mb-2">
                Tren a Machu Picchu
              </h3>
              <p className="text-sm text-slate-600">
                Traslado coordinado a Ollantaytambo, desayuno temprano y descanso en Yanahuara.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
              <div className="mx-auto w-12 h-12 bg-[#2563EB]/10 rounded-lg flex items-center justify-center mb-4">
                <Sun className="w-6 h-6 text-[#2563EB]" aria-hidden="true" />
              </div>
              <h3 className="font-display font-semibold text-lg text-slate-900 mb-2">
                Patio Soleado &amp; Jardín
              </h3>
              <p className="text-sm text-slate-600">
                Casa boutique de solo 5 habitaciones con jardín tranquilo para aclimatarse al Cusco.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
              <div className="mx-auto w-12 h-12 bg-[#2563EB]/10 rounded-lg flex items-center justify-center mb-4">
                <Wifi className="w-6 h-6 text-[#2563EB]" aria-hidden="true" />
              </div>
              <h3 className="font-display font-semibold text-lg text-slate-900 mb-2">
                Wi-Fi &amp; Desayuno Andino
              </h3>
              <p className="text-sm text-slate-600">
                Internet estable en todas las áreas, infusiones calientes y café recién pasado.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="tours-bici" className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            <div className="lg:col-span-5 aspect-[4/3] lg:aspect-auto lg:min-h-[420px] rounded-xl overflow-hidden bg-slate-200">
              <ResilientImage
                src={BIKE_TOUR_IMAGE_URL}
                alt="Bicicletas de ruta frente a las terrazas circulares incas de Moray en el Valle Sagrado"
                titleFallback="Tours en Bicicleta · Moray & Salineras"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="lg:col-span-7 flex flex-col justify-between gap-6">
              <div>
                <p className="text-xs font-semibold text-[#2563EB] mb-2">
                  Experiencias reservables
                </p>
                <h2
                  className="font-display text-3xl sm:text-4xl font-bold text-slate-900 leading-tight mb-3"
                  style={{ textWrap: 'balance' }}
                >
                  Tours en Bicicletas a Moray, Salineras, Yanahuara y Ollantaytambo
                </h2>
                <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
                  Agrégalos directo a tu reserva de habitación. Incluimos bicicletas mantenidas,
                  casco, guía local y conexión con nuestra casa en Paucarabamba, Yanahuara.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {BIKE_TOURS.map((tour, index) => {
                  const isAdded = selectedTourIds.includes(tour.id);
                  return (
                    <div
                      key={tour.id}
                      className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between gap-4 shadow-xs"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="font-display text-xl font-semibold text-slate-900 leading-snug">
                            0{index + 1}. {tour.name}
                          </h3>
                          <span className="text-base font-bold text-[#2563EB] tabular-nums whitespace-nowrap">
                            {formatMoney(tour.priceUsdPerPerson, currency)}
                            <span className="block text-[11px] font-normal text-slate-500 text-right">
                              por persona
                            </span>
                          </span>
                        </div>

                        <div className="text-xs text-slate-600 pb-3 border-b border-slate-100 tabular-nums">
                          {tour.route} · {tour.duration} · {tour.distanceKm} km · {tour.level}
                        </div>

                        <p className="text-sm text-slate-600 leading-relaxed mt-3">
                          {tour.description}
                        </p>

                        <ul className="mt-3 space-y-1 text-xs text-slate-600">
                          {tour.includes.map((item) => (
                            <li key={item} className="flex items-start gap-1.5">
                              <Check
                                className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5"
                                aria-hidden="true"
                              />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        type="button"
                        onClick={() => onToggleTourAndScroll(tour.id)}
                        className={`w-full min-h-[42px] px-4 py-2 text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer ${
                          isAdded
                            ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                            : 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]'
                        }`}
                      >
                        <Bike className="w-4 h-4 shrink-0" aria-hidden="true" />
                        <span>
                          {isAdded ? 'Incluido en tu reserva (Quitar)' : 'Añadir tour a mi reserva'}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="tren-machupicchu" className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            <div className="lg:col-span-7 flex flex-col justify-between gap-6 order-2 lg:order-1">
              <div>
                <p className="text-xs font-semibold text-[#2563EB] mb-2">
                  Conexión directa a Machu Picchu
                </p>
                <h2
                  className="font-display text-3xl sm:text-4xl font-bold text-slate-900 leading-tight mb-3"
                  style={{ textWrap: 'balance' }}
                >
                  La mejor forma de llegar al tren destino a Machu Picchu y descansar
                </h2>
                <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
                  {TRAIN_TRANSFER_PACKAGE.description}
                </p>

                <div className="mt-4 text-xs font-medium text-slate-600 tabular-nums">
                  {TRAIN_TRANSFER_PACKAGE.scheduleNote} · Tarifa por pasajero:{' '}
                  <strong className="text-[#2563EB]">
                    {formatMoney(TRAIN_TRANSFER_PACKAGE.priceUsdPerPerson, currency)}
                  </strong>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 sm:p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-3 inline-flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-[#2563EB]" aria-hidden="true" />
                  <span>Qué incluye el paquete Conexión Machu Picchu</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700">
                  {TRAIN_TRANSFER_PACKAGE.includes.map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <Check
                        className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-xs text-slate-600">
                    Paucarabamba, Yanahuara — Valle Sagrado a minutos de estación Ollantaytambo
                  </span>
                  <button
                    type="button"
                    onClick={onToggleTrainAndScroll}
                    className={`min-h-[42px] px-4 py-2 text-xs font-semibold rounded-md transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer shrink-0 ${
                      includeTrainPackage
                        ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                        : 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]'
                    }`}
                  >
                    <TrainFront className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>
                      {includeTrainPackage
                        ? 'Conexión incluida (Quitar)'
                        : 'Añadir conexión al tren'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 aspect-[4/3] lg:aspect-auto lg:min-h-[380px] rounded-xl overflow-hidden bg-slate-200 order-1 lg:order-2">
              <ResilientImage
                src={TRAIN_VALLEY_IMAGE_URL}
                alt="Tren turístico avanzando junto al río Urubamba rumbo a Machu Picchu desde Ollantaytambo"
                titleFallback="Ruta del Tren a Machu Picchu"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
