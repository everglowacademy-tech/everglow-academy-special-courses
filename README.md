# Leading in English: landing del curso

Landing de venta de **Leading in English: Communication Tools for Global Energy Leaders**, de Everglow Academy.

Es un sitio estático hecho con HTML, CSS y JavaScript puros, sin build y sin dependencias. La carpeta `site/` se sube a Netlify tal cual.

```
site/
├── index.html          ← la página (todo el texto visible está aquí)
├── privacy.html        ← Política de privacidad (EN + ES)
├── terms.html          ← Términos de uso (EN + ES)
├── css/
│   ├── tokens.css      ← colores, tipografías y espaciados de la marca (lo único que hay que tocar para cambiar el look)
│   └── main.css        ← estilos de las secciones
├── js/
│   ├── config.js       ← endpoint y token del formulario, versión de términos, correo
│   ├── lang.js         ← idioma elegido (EN/ES) y selector
│   ├── i18n.js         ← TODOS los textos en español de la landing
│   ├── main.js         ← animaciones, hero interactivo, programa, precio, barra pegajosa
│   ├── quiz.js         ← autodiagnóstico (preguntas en inglés y español)
│   ├── form.js         ← validación y envío al Apps Script
│   └── legal.js        ← idioma e índice de las páginas legales
├── fonts/              ← fuentes locales (woff2)
├── assets/             ← logos y foto
├── og-image.png        ← imagen para compartir en redes (1200×630)
└── netlify.toml        ← cabeceras y caché
brand/                  ← archivos originales de marca (no se publican)
```

---

## Qué editar para…

### Cambiar el precio

Busca `$500`, `$175` y `$525` en `site/index.html`: todos están ahí. Las ubicaciones son:

1. `<meta name="description">`, en el `<head>`
2. El JSON-LD (`"price": "500"`), en el `<head>`
3. El hero (`price-tag`)
4. La sección Pricing (las dos tarjetas, más **$525 en total** en la de cuotas)
5. Los dos radios del formulario (`value="One payment — $500 USD"` y `value="3 installments — $175 USD each"`). El `value` es lo que recibe la hoja; si lo cambias, avisa al script
6. El FAQ "How do I pay?"
7. La barra pegajosa de abajo (`enroll-bar`)

Y en español, las mismas cifras en `site/js/i18n.js` (busca `$500`, `$175`, `$525`). En los términos: `site/terms.html`, sección 3, en los dos idiomas.

### Poner la fecha de inicio

En `site/index.html`:
- Busca `Next cohort:` (sección Enrollment) y cambia `start date to be announced`.
- Busca `When does the next group start?` en el FAQ.

### Cambiar textos

- **Inglés:** en `site/index.html`, ordenado por secciones.
- **Español:** en `site/js/i18n.js`, en el objeto `ES`. Cada texto tiene la misma clave que su `data-i18n="…"` en el HTML. Si cambias un texto en inglés, cambia también su versión en español.
- **Textos que genera el JavaScript** (autodiagnóstico, errores del formulario, mensajes de envío): objeto `STRINGS` de `site/js/i18n.js`, con `en` y `es`.
- **Preguntas del autodiagnóstico:** `QUESTIONS` en `site/js/quiz.js`, cada una en los dos idiomas.
- **Lo que NO se traduce a propósito:** el nombre del curso, los títulos de los módulos, el mensaje de ejemplo del hero y las respuestas de la sala. Son el inglés que se practica en el curso.

Busca `[BORRADOR]` y `[PENDIENTE]` para encontrar lo que falta validar.

### Idioma

- Arriba a la derecha hay un selector **EN / ES**. La elección se guarda en el navegador.
- La primera vez, la página usa el idioma del navegador (español si el navegador está en español).
- Puedes forzar el idioma con un enlace: `https://tu-sitio/?lang=es` o `?lang=en`. Sirve para anuncios dirigidos a un público concreto.
- Google indexa la versión en inglés (la que está en el HTML).

### Cambiar colores o tipografías

Solo en `site/css/tokens.css`. Si cambias `--eg-blue` o `--eg-sun`, cambia toda la página.
Para usar **Gilroy** y **Placard Next** (las oficiales), las instrucciones están al principio de ese archivo. Necesitas los `.woff2` con licencia web.

---

## Conectar el formulario

Ya está conectado a tu Google Apps Script, en `site/js/config.js`:

```js
export const FORM_ENDPOINT = "https://script.google.com/macros/s/AKfycby…/exec";
export const FORM_TOKEN = "everglow-2026-CAMBIA-ESTO"; // debe ser idéntico al TOKEN del script
export const TERMS_VERSION = "2026-09-25";            // súbela cada vez que cambies los términos
```

La página envía un `POST` con `Content-Type: text/plain` (así se evita el bloqueo CORS de Apps Script) y este JSON:

| Campo | Contenido |
|---|---|
| `token` | El de `config.js` |
| `name`, `email`, `phone`, `country` | Lo que escribió la persona |
| `payment` | Siempre en inglés: `One payment — $500 USD` o `3 installments — $175 USD each` |
| `selfCheck` | Resultado del autodiagnóstico (en el idioma de la página), o `""` |
| `website` | Honeypot: siempre vacío si es una persona |
| `source` | `landing`, o `utm_source / utm_medium / utm_campaign` si el enlace trae UTM |
| `lang` | `en` o `es`: idioma en que se inscribió |
| `termsVersion` | Versión de los términos aceptados |
| `termsAcceptedAt` | Fecha y hora de aceptación (ISO) |

Los tres últimos campos son nuevos: tu script los ignora hasta que les añadas columnas. **Conviene guardarlos**: son la prueba de qué términos aceptó cada persona y cuándo.

La página espera que el script responda `{"ok": true}`. Si responde `{"ok": false, "error": "…"}` o falla la red, muestra un error y ofrece enviar la inscripción por correo, ya escrita.

> **Sobre el token:** se ve en el código de la página, así que no es una contraseña. Solo filtra envíos automáticos que no vienen de la landing. El honeypot (`website`) es la segunda barrera.

**Cómo probarlo cuando publiques:** inscríbete tú con datos reales en la página publicada y confirma que la fila aparece en la hoja y que llega el correo de aviso. Yo no pude probarlo, porque este entorno no tiene acceso a script.google.com.

## Publicar en Netlify

**Opción rápida (arrastrar):**
1. Entra en [app.netlify.com/drop](https://app.netlify.com/drop).
2. Arrastra la carpeta **`site`** (no la raíz del repositorio).
3. Netlify te da una URL tipo `https://nombre.netlify.app`.

**Opción conectada a GitHub (se publica sola en cada cambio):**
1. Netlify → **Add new site → Import an existing project** → elige este repositorio.
2. **Base directory:** `site` · **Build command:** vacío · **Publish directory:** `site`.

**Después de publicar:** reemplaza `https://SITE-URL` por tu URL real en el `<head>` de `site/index.html` (canonical, og:url y og:image). Si no lo haces, la vista previa al compartir el enlace en WhatsApp o LinkedIn sale sin imagen.

---

## Qué se revisó

- **Lighthouse móvil** (en español), con servidor local sin compresión: Performance 97 · Accessibility 100 · Best Practices 100 · SEO 100.
- **axe-core** (WCAG 2.2 AA): 0 violaciones en inglés y en español, también con errores del formulario, resultado del quiz y precio en cuotas; 0 en las páginas legales.
- **Teclado:** todo se recorre con Tab; el switch se activa con Espacio y el FAQ con Enter.
- **`prefers-reduced-motion`:** todo aparece sin animación y el switch cambia al instante.
- **390 px:** sin desplazamiento horizontal.
- **Formulario:** validación, foco en el primer error, carga, éxito, error del servidor (`ok:false`) y respaldo mailto, probados con un endpoint simulado que responde como tu script. El cambio de idioma a mitad del formulario re-traduce los errores.
