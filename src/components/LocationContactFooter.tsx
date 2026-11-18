import { CheckCircle2, MapPin, MessageCircle } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { HOSTEL_CONTACT, LOCATION_MAP_IMAGE_URL } from '../shared/catalog';
import { ResilientImage } from './ResilientImage';

interface LocationContactFooterProps {
  defaultDate: string;
}

export function LocationContactFooter({ defaultDate }: LocationContactFooterProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState<
    'tour_bici' | 'tren_machupicchu' | 'estadia_grupal' | 'consulta_general'
  >('tour_bici');
  const [preferredDate, setPreferredDate] = useState(defaultDate);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sentId, setSentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInquiry = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, topic, preferredDate, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'No se pudo enviar tu consulta.');
      } else {
        setSentId(data.inquiry.id);
        setMessage('');
      }
    } catch {
      setError('Error de conexión al enviar tu mensaje.');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <section id="contacto" className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div>
                <h2 className="font-display font-bold text-3xl lg:text-4xl text-slate-900 mb-4">
                  Ubicación Privilegiada en Cusco &amp; Valle Sagrado
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Contáctanos y asegura tu habitación hoy mismo. Te esperamos con sol andino en el
                  corazón del Cusco y con nuestro refugio de descanso en el Valle Sagrado.
                </p>
              </div>

              <div className="space-y-3 text-sm text-slate-700">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <strong className="text-slate-900">Cusco Centro:</strong>{' '}
                    {HOSTEL_CONTACT.cuscoAddress} ({HOSTEL_CONTACT.cuscoReference})
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <strong className="text-slate-900">Valle Sagrado:</strong>{' '}
                    {HOSTEL_CONTACT.valleyAddress}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href={HOSTEL_CONTACT.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center min-h-[42px] px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold rounded-md shadow-xs transition-colors"
                >
                  Ver en Mapa
                </a>
                <a
                  href={`https://wa.me/${HOSTEL_CONTACT.whatsappDigits}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 min-h-[42px] px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 text-sm font-semibold rounded-md transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#2563EB]" aria-hidden="true" />
                  <span>WhatsApp {HOSTEL_CONTACT.phoneDisplay}</span>
                </a>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <h3 className="font-display text-lg font-semibold text-slate-900 mb-3">
                  Consulta directa de tours o grupos
                </h3>
                {sentId ? (
                  <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-900 space-y-2">
                    <div className="flex items-center gap-2 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" aria-hidden="true" />
                      <span>Consulta registrada ({sentId})</span>
                    </div>
                    <p className="text-xs text-emerald-800">
                      Gracias, {name}. Te responderemos al correo {email} o vía WhatsApp.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSentId(null)}
                      className="text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer"
                    >
                      Enviar otra consulta
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleInquiry} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        aria-label="Nombre"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Tu nombre"
                        className="w-full min-h-[40px] px-3 py-2 text-sm bg-white border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:border-[#2563EB]"
                      />
                      <input
                        type="email"
                        required
                        aria-label="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@correo.com"
                        className="w-full min-h-[40px] px-3 py-2 text-sm bg-white border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:border-[#2563EB]"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="tel"
                        aria-label="WhatsApp"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="WhatsApp (+51...)"
                        className="w-full min-h-[40px] px-3 py-2 text-sm bg-white border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:border-[#2563EB]"
                      />
                      <select
                        aria-label="Motivo de consulta"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value as typeof topic)}
                        className="w-full min-h-[40px] px-3 py-2 text-sm bg-white border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:border-[#2563EB]"
                      >
                        <option value="tour_bici">Tours en Bicicleta</option>
                        <option value="tren_machupicchu">Tren a Machu Picchu</option>
                        <option value="estadia_grupal">Grupo / 5 Habitaciones</option>
                        <option value="consulta_general">Consulta general</option>
                      </select>
                      <input
                        type="date"
                        aria-label="Fecha tentativa"
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full min-h-[40px] px-3 py-2 text-sm tabular-nums bg-white border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:border-[#2563EB]"
                      />
                    </div>
                    <textarea
                      rows={2}
                      required
                      aria-label="Mensaje"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Cuéntanos sobre tu viaje a Cusco, bicicletas o tren..."
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:border-[#2563EB]"
                    />
                    {error && (
                      <p role="alert" className="text-xs text-rose-700">
                        {error}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full min-h-[40px] px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-md transition-colors cursor-pointer"
                    >
                      {sending ? 'Enviando...' : 'Enviar consulta'}
                    </button>
                  </form>
                )}
              </div>
            </div>

            <div className="aspect-[4/3] overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
              <ResilientImage
                src={LOCATION_MAP_IMAGE_URL}
                alt="Mapa de ubicación del hotel en Calle Fortunato L. Herrera 120 Coripata Cusco"
                titleFallback="Ubicación Inka Garden Hostel · Cusco"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="font-display font-bold text-xl text-slate-900 mb-3">
                Inka Garden Hostel
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Tu refugio soleado en el corazón del Cusco y del Valle Sagrado. Somos tu casa con
                alma y mucho sol.
              </p>
            </div>

            <div>
              <h3 className="font-display font-semibold text-slate-900 mb-3">Contacto</h3>
              <div className="space-y-1.5 text-sm text-slate-600">
                <p className="tabular-nums">{HOSTEL_CONTACT.phoneDisplay}</p>
                <p>{HOSTEL_CONTACT.email}</p>
                <p>{HOSTEL_CONTACT.instagram}</p>
                <p>{HOSTEL_CONTACT.cuscoAddress}</p>
              </div>
            </div>

            <div>
              <h3 className="font-display font-semibold text-slate-900 mb-3">Experiencias</h3>
              <div className="space-y-1.5 text-sm text-slate-600">
                <p>5 Habitaciones Boutique</p>
                <p>Tours en Bici: Moray y Salineras</p>
                <p>Rutas: Yanahuara y Ollantaytambo</p>
                <p>Conexión Tren a Machu Picchu</p>
              </div>
            </div>

            <div>
              <h3 className="font-display font-semibold text-slate-900 mb-3">Horarios y Sedes</h3>
              <div className="space-y-1.5 text-sm text-slate-600">
                <p className="tabular-nums">Check-in: {HOSTEL_CONTACT.checkInTime}</p>
                <p className="tabular-nums">Check-out: {HOSTEL_CONTACT.checkOutTime}</p>
                <p>Coripata — Cusco</p>
                <p>Paucarabamba — Yanahuara</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 mt-8 pt-8 text-center">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} {HOSTEL_CONTACT.brandName}. Todos los derechos
              reservados.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
