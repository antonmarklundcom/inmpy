# Image manifest — Vivienda Paraguay (Phase 1)

The app **builds and runs perfectly with zero image files present**. Every photo
is rendered through `ImageWithFallback`, so any missing file shows a tasteful
gray placeholder with a house glyph — the site never looks broken. To replace a
placeholder with a real photo, generate an image to the exact filename below and
drop it into **`/public/images`**, then commit. A filename typo is the only way
it "fails" (you'll just keep seeing the placeholder).

The six featured listings (the ones reviewers will click) each have a unique
**8-image gallery** — that's **48 filenames** total (`prop1-1.jpg … prop6-8.jpg`).
The remaining ~30 listings **reuse** images from this 48-image pool, so once these
48 exist the whole site is photographed.

Keep each property's 8 shots describing **one coherent home** so the gallery
feels real.

---

## Prop1 — Casa moderna con piscina, Villa Morra, Asunción (warm minimalist, oak + white, contemporary)
```
prop1-1.jpg  Fachada / exterior frontal al atardecer
prop1-2.jpg  Living / sala de estar con doble altura
prop1-3.jpg  Cocina integrada (isla, roble y blanco)
prop1-4.jpg  Dormitorio principal en suite
prop1-5.jpg  Segundo dormitorio
prop1-6.jpg  Baño principal (mármol)
prop1-7.jpg  Patio con piscina y quincho
prop1-8.jpg  Comedor / detalle de terminaciones
```

## Prop2 — Departamento premium en torre, Carmelitas, Asunción (bright, city views, modern high-rise)
```
prop2-1.jpg  Living comedor con ventanal de piso a techo
prop2-2.jpg  Vista a la ciudad desde el balcón
prop2-3.jpg  Cocina equipada moderna
prop2-4.jpg  Suite principal con vestidor
prop2-5.jpg  Segundo dormitorio
prop2-6.jpg  Baño completo
prop2-7.jpg  Balcón / terraza
prop2-8.jpg  Amenities del edificio (piscina / gimnasio)
```

## Prop3 — Dúplex luminoso, Las Mercedes, Asunción (cozy two-storey, neutral tones)
```
prop3-1.jpg  Fachada del dúplex
prop3-2.jpg  Living planta baja
prop3-3.jpg  Cocina abierta al comedor
prop3-4.jpg  Escalera / planta alta
prop3-5.jpg  Dormitorio principal
prop3-6.jpg  Segundo dormitorio
prop3-7.jpg  Patio interno con parrilla
prop3-8.jpg  Baño
```

## Prop4 — Terreno en barrio cerrado, Luque, Central (vacant land, NO buildings)
```
prop4-1.jpg  Vista aérea del lote
prop4-2.jpg  Frente del terreno desde la calle
prop4-3.jpg  Calle interna del barrio cerrado
prop4-4.jpg  Acceso / portón de seguridad del barrio
prop4-5.jpg  Terreno plano (panorámica a nivel de suelo)
prop4-6.jpg  Entorno / áreas verdes del loteamiento
prop4-7.jpg  Plano de ubicación / mensura (ilustrativo)
prop4-8.jpg  Servicios subterráneos / cordón cuneta
```

## Prop5 — Oficina corporativa, Recoleta, Asunción (open-plan office, professional)
```
prop5-1.jpg  Oficina en planta libre
prop5-2.jpg  Recepción / ingreso
prop5-3.jpg  Sala de reuniones
prop5-4.jpg  Puestos de trabajo
prop5-5.jpg  Kitchenette / office
prop5-6.jpg  Baños privados
prop5-7.jpg  Vista desde la oficina
prop5-8.jpg  Fachada del edificio corporativo
```

## Prop6 — Casa con vista al río, Encarnación, Itapúa (single-storey, bright, riverside warmth)
```
prop6-1.jpg  Fachada frontal de la casa
prop6-2.jpg  Living comedor
prop6-3.jpg  Cocina
prop6-4.jpg  Dormitorio principal
prop6-5.jpg  Segundo dormitorio
prop6-6.jpg  Baño
prop6-7.jpg  Galería techada / churrasquera
prop6-8.jpg  Patio con vista hacia la costanera
```

---

### Reuse map (for reference)
The ~30 non-featured listings reuse 1–4 images from the pool above, chosen to
match each listing's **type** (house exteriors for casas/dúplex, interiors for
departamentos, the land set for terrenos, the office set for oficinas/locales).
You don't need to generate anything extra for them — once the 48 files exist,
every listing is illustrated. See `imagenes` on each entry in
`content/listings.ts` for the exact assignments.
