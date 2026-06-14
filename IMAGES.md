# Manifest de imágenes — Vivienda Paraguay

This is the photo manifest used to generate the seed gallery images. Generate
each file to the exact filename below and drop it into **`public/images/`**,
then commit it — the app picks it up automatically by filename, no code change
required. A filename typo is the only way an image "fails" to attach.

**The app builds and runs perfectly with zero image files present.** Every image
routes through `ImageWithFallback`, so until a matching file exists you'll see a
tasteful gray placeholder with a small house icon (never a broken image).

The 6 featured properties below each get a **unique 8-photo gallery** (48 files
total). The remaining ~34 listings reuse coherent subsets of these 48 images,
matched to their property type — so generating these 48 covers the whole site.

Keep each property's 8 shots describing **ONE coherent home** (consistent style,
materials and palette across its 8 photos).

---

## Prop1 — Casa moderna con piscina, Villa Morra, Asunción
*(venta · warm minimalist, roble + blanco, abundant light, premium)*

```
prop1-1.jpg  Fachada / exterior frontal al atardecer
prop1-2.jpg  Living / sala de estar integrada
prop1-3.jpg  Cocina moderna con isla
prop1-4.jpg  Dormitorio principal en suite
prop1-5.jpg  Segundo dormitorio
prop1-6.jpg  Baño principal
prop1-7.jpg  Patio con piscina y quincho
prop1-8.jpg  Comedor / detalle de terminaciones
```

## Prop2 — Departamento de categoría, Carmelitas, Asunción
*(venta · torre premium, elegante, vista a la ciudad)*

```
prop2-1.jpg  Living comedor con balcón aterrazado
prop2-2.jpg  Vista desde el balcón a la ciudad
prop2-3.jpg  Cocina equipada integrada
prop2-4.jpg  Suite principal con vestidor
prop2-5.jpg  Segundo dormitorio
prop2-6.jpg  Baño en suite
prop2-7.jpg  Amenities del edificio (piscina / gimnasio)
prop2-8.jpg  Hall de acceso / lobby
```

## Prop3 — Casa familiar con amplio jardín, Lambaré, Central
*(venta · dos plantas, cálida, jardín verde, familiar)*

```
prop3-1.jpg  Fachada / frente de la casa
prop3-2.jpg  Living luminoso
prop3-3.jpg  Cocina con comedor diario
prop3-4.jpg  Dormitorio principal
prop3-5.jpg  Dormitorio secundario
prop3-6.jpg  Baño familiar
prop3-7.jpg  Fondo verde con espacio para piscina
prop3-8.jpg  Galería / comedor exterior
```

## Prop4 — Dúplex a estrenar, San Lorenzo, Central
*(venta · construcción reciente, complejo cerrado, líneas actuales)*

```
prop4-1.jpg  Fachada del dúplex en el complejo
prop4-2.jpg  Planta baja con ambientes integrados
prop4-3.jpg  Cocina nueva
prop4-4.jpg  Escalera / doble altura
prop4-5.jpg  Suite en planta alta
prop4-6.jpg  Segunda suite
prop4-7.jpg  Patio interno
prop4-8.jpg  Baño moderno / detalle
```

## Prop5 — Departamento amoblado en alquiler, Recoleta, Asunción
*(alquiler · amoblado, listo para mudarse, luminoso, contemporáneo)*

```
prop5-1.jpg  Living amoblado
prop5-2.jpg  Cocina equipada
prop5-3.jpg  Dormitorio principal amoblado
prop5-4.jpg  Segundo dormitorio / escritorio
prop5-5.jpg  Baño
prop5-6.jpg  Comedor / barra
prop5-7.jpg  Balcón
prop5-8.jpg  Vista del edificio / fachada
```

## Prop6 — Terreno en esquina, Luque, Central
*(venta · lote baldío, calle asfaltada, zona en desarrollo — SIN interiores)*

```
prop6-1.jpg  Vista general del terreno desde la calle
prop6-2.jpg  Esquina / frente del lote
prop6-3.jpg  Vista lateral del terreno
prop6-4.jpg  Calle asfaltada y entorno
prop6-5.jpg  Vista aérea / cenital del lote
prop6-6.jpg  Cartel de venta / referencia de servicios
prop6-7.jpg  Vegetación / superficie del terreno
prop6-8.jpg  Contexto del barrio / construcciones vecinas
```

---

### Recommended specs
- **Aspect ratio:** 4:3 landscape (cards and gallery hero are 4:3).
- **Size:** ~1600×1200 px is plenty; keep files web-optimized (JPEG, <300 KB).
- **Format/extension:** `.jpg` (filenames above are authoritative).
- After adding files, run `npm run build` (or just refresh `npm run dev`) — no
  other change is needed.
