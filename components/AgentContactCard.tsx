"use client";

import { Building2, MessageCircle, Phone } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/listings";
import { SITE_URL, WHATSAPP_FALLBACK } from "@/lib/config";

interface Props {
  inmobiliaria: { nombre: string; telefono: string };
  titulo: string;
  slug: string;
}

export function AgentContactCard({ inmobiliaria, titulo, slug }: Props) {
  const digits = inmobiliaria.telefono.replace(/\D/g, "");
  const phone = digits.length >= 8 ? digits : WHATSAPP_FALLBACK;
  const url = `${SITE_URL}/propiedad/${slug}`;
  const mensaje = `Hola, me interesa la propiedad "${titulo}". ${url}`;
  const waLink = buildWhatsAppLink(phone, mensaje);

  return (
    <div className="rounded-card border border-border bg-white p-5 shadow-soft">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
          <Building2 className="h-5 w-5 text-primary" aria-hidden />
        </span>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">Inmobiliaria</p>
          <p className="font-medium text-text">{inmobiliaria.nombre}</p>
        </div>
      </div>

      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary w-full bg-[#25D366] hover:bg-[#1eb858]"
      >
        <MessageCircle className="h-5 w-5" aria-hidden />
        Contactar por WhatsApp
      </a>

      {digits.length >= 8 && (
        <p className="mt-3 flex items-center justify-center gap-1.5 text-sm text-muted">
          <Phone className="h-4 w-4" aria-hidden />
          {inmobiliaria.telefono}
        </p>
      )}
      <p className="mt-3 text-center text-xs text-muted">
        Coordiná una visita sin compromiso. Sin cuentas, sin formularios.
      </p>
    </div>
  );
}
