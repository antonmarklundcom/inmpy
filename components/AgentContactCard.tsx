import { MessageCircle, Phone } from 'lucide-react';
import type { Listing } from '@/lib/types';
import { WHATSAPP_FALLBACK } from '@/lib/config';
import { abs } from '@/lib/seo';

/** Sanitize a phone string down to wa.me-friendly digits. */
function waNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return digits || WHATSAPP_FALLBACK.replace(/\D/g, '');
}

export function AgentContactCard({ listing }: { listing: Listing }) {
  const number = waNumber(listing.inmobiliaria.telefono);
  const url = abs(`/propiedad/${listing.slug}`);
  const mensaje = `Hola, me interesa la propiedad "${listing.titulo}" que vi en Vivienda Paraguay (${url}). ¿Podrías darme más información?`;
  const waLink = `https://wa.me/${number}?text=${encodeURIComponent(mensaje)}`;

  return (
    <div className="card border border-line p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
        Publicado por
      </p>
      <p className="mt-1 font-serif text-lg font-semibold text-forest">
        {listing.inmobiliaria.nombre}
      </p>

      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary mt-4 w-full text-base"
      >
        <MessageCircle className="h-5 w-5" />
        Contactar por WhatsApp
      </a>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-sm text-muted">
        <Phone className="h-4 w-4" />
        {listing.inmobiliaria.telefono}
      </p>
    </div>
  );
}
