# Leading in English: landing del curso

Landing de venta de **Leading in English: Communication Tools for Global Energy Leaders**, de Everglow Academy.

Es un sitio estático hecho con HTML, CSS y JavaScript puros, sin build y sin dependencias. La carpeta `site/` se sube a Netlify tal cual.

```
site/
├── index.html          ← la página (todo el texto visible está aquí)
├── privacy.html        ← PROVISIONAL, falta el texto legal
├── terms.html          ← PROVISIONAL, falta el texto legal
├── css/
│   ├── tokens.css      ← colores, tipografías y espaciados de la marca (lo único que hay que tocar para cambiar el look)
│   └── main.css        ← estilos de las secciones
├── js/
│   ├── config.js       ← endpoint del formulario, correo, enlace al programa general
│   ├── main.js         ← animaciones, hero interactivo, barra pegajosa, línea de tiempo
│   ├── quiz.js         ← autodiagnóstico "Is this course for you?"
│   └── form.js         ← validación y envío del formulario
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
5. Los dos radios del formulario (`value="One payment — $500 USD"` y `value="3 installments — $175 USD each"`)
6. El FAQ "How do I pay?"
7. La barra pegajosa de abajo (`enroll-bar`)

Si cambias el texto de un radio de pago, cambia también la clave correspondiente en `PAYMENT_AMOUNTS` dentro de `site/js/config.js`. De ahí sale el monto que aparece en el mensaje de éxito.

### Poner la fecha de inicio

En `site/index.html`:
- Busca `Next cohort:` (sección Enrollment) y cambia `start date to be announced`.
- Busca `When does the next group start?` en el FAQ.

### Cambiar textos

Todo el texto visible está en `site/index.html`, ordenado por secciones y marcado con comentarios `<!-- ===== 4. The problem ===== -->`. Hay dos excepciones:
- Las **respuestas de la videollamada del hero** están en `REPLIES`, al principio de `site/js/main.js`. Los dos mensajes del hero (versión larga y versión clara) están en los atributos `data-buried` y `data-clear` de `index.html`. Las palabras entre `[[ ]]` son "el punto" que se resalta en amarillo.
- Las **preguntas del autodiagnóstico** y sus umbrales están en `QUESTIONS` y `MIN_LEVEL_SCORE`, dentro de `site/js/quiz.js`.

Busca `[BORRADOR]`, `[PENDIENTE]` y `[CONFIRMAR]` para encontrar todo lo que falta validar.

### Cambiar colores o tipografías

Solo en `site/css/tokens.css`. Si cambias `--eg-blue` o `--eg-sun`, cambia toda la página.
Para usar **Gilroy** y **Placard Next** (las oficiales), las instrucciones están al principio de ese archivo. Necesitas los `.woff2` con licencia web.

---

## Conectar el formulario

### Con Google Apps Script (el que ya usan)

1. Abre tu proyecto de Apps Script → **Implementar → Gestionar implementaciones** y copia la **URL de la aplicación web** (termina en `/exec`).
2. Pégala en `site/js/config.js`:
   ```js
   export const FORM_ENDPOINT = "https://script.google.com/macros/s/XXXXXXXX/exec";
   export const FORM_MODE = "no-cors";
   ```
3. El formulario envía estos campos como `application/x-www-form-urlencoded`:
   `name, email, phone, country, payment, terms, self_check, course, submitted_at, page`.
   Tu script los lee con `e.parameter.name`, `e.parameter.email`, etc.

Si tu script actual espera otros nombres de campo, ajusta el script o el objeto `payload` en `site/js/form.js`. Este es un ejemplo mínimo de `doPost` compatible:

```js
function doPost(e) {
  const p = e.parameter;
  const sheet = SpreadsheetApp.openById("ID_DE_TU_HOJA").getSheetByName("Inscripciones");
  sheet.appendRow([new Date(), p.name, p.email, p.phone, p.country, p.payment, p.self_check, p.course, p.page]);
  MailApp.sendEmail("everglowacademy@gmail.com", "Nueva inscripción: " + p.name,
    `Nombre: ${p.name}\nEmail: ${p.email}\nTeléfono: ${p.phone}\nPaís: ${p.country}\nPago: ${p.payment}\n\n${p.self_check}`);
  return ContentService.createTextOutput("ok");
}
```

> **Importante:** Apps Script no devuelve cabeceras CORS, así que el navegador no puede leer su respuesta (`no-cors`). La página da el envío por bueno si la red no falla. Si el script tiene un error interno, la persona verá el mensaje de éxito igual. Revisa la hoja los primeros días.

### Con Formspree o un webhook (Make, Zapier, n8n)

```js
export const FORM_ENDPOINT = "https://formspree.io/f/TU_ID"; // o la URL del webhook
export const FORM_MODE = "cors";
```
En modo `cors` la página sí comprueba la respuesta. Si no es 2xx, muestra el error y ofrece enviar por correo.

### Sin backend

Si `FORM_ENDPOINT` está vacío, al enviar aparece un enlace **mailto** a everglowacademy@gmail.com con los datos ya escritos. El enlace "Form not working? Register by email instead" funciona siempre.

### Antispam

El formulario tiene un campo trampa invisible (`company_website`). Si llega relleno, la página finge el éxito y no envía nada.

---

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

- **Lighthouse móvil**, con servidor local sin compresión: Performance 97 · Accessibility 100 · Best Practices 100 · SEO 100. En Netlify debería mejorar, porque comprime y cachea.
- **axe-core** (WCAG 2.2 AA): 0 violaciones, revisando también los estados de error del formulario, el resultado del quiz y la versión clara del hero.
- **Teclado:** todo se recorre con Tab; el switch se activa con Espacio y el FAQ con Enter.
- **`prefers-reduced-motion`:** todo aparece sin animación y el switch cambia al instante.
- **390 px:** sin desplazamiento horizontal.
- **Formulario:** validación, foco en el primer error, carga, éxito, honeypot y respaldo mailto, probados con un endpoint simulado.
