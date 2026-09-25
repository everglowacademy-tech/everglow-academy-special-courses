# Pendientes de tu lado

La página ya funciona en inglés y español y está conectada a tu hoja. Esto es lo que falta, de más a menos urgente.

## Antes de publicar

- [ ] **Token del formulario.** En `site/js/config.js`, `FORM_TOKEN` todavía dice `everglow-2026-CAMBIA-ESTO`. Tiene que ser el mismo texto que en tu Apps Script: si no coinciden, el script rechazará todas las inscripciones y la gente verá el mensaje de error.
- [ ] **Probar una inscripción real** en la página publicada. Confirma que aparece la fila en la hoja y que llega el correo de aviso. Yo no pude probar tu script desde aquí porque este entorno no tiene acceso a Google.
- [ ] **Añadir 3 columnas al script:** `lang`, `termsVersion` y `termsAcceptedAt`. La página ya las envía; son tu prueba de qué términos aceptó cada persona y cuándo (lo recomienda tu propio documento legal).
- [ ] **Decisiones de los textos legales**, resaltadas en amarillo en `privacy.html` y `terms.html`:
  - Razón social y RIF.
  - Fecha de "última actualización".
  - Cupos por grupo (10), cuotas en las semanas 5 y 9, mora de 7 días.
  - Reembolso: total hasta 5 días antes; sin reembolso una vez empezado. Tu documento sugería además un 50 % con menos de 5 días; no lo puse porque es una decisión tuya.
  - Mínimo de 6 participantes para abrir grupo, plazo de 15 días hábiles para reembolsos y límite de 5 faltas.
  - Conservación de datos (12 meses / 5 años), borrado de grabaciones (30 días) y respuesta en 10 días hábiles.
  - Tribunales de Caracas.

  Cuando decidas cada valor, cámbialo **en inglés y en español** y quita `class="todo"` para que deje de verse resaltado.
- [ ] **Revisión legal**, como dice tu documento. Sobre todo, la jurisdicción si vendes a personas en EE. UU. También conviene decidir qué versión manda si hay diferencias entre el inglés y el español (yo traduje el texto fielmente, pero no añadí ninguna cláusula al respecto).
- [ ] **Cookies:** si agregas Google Analytics o el píxel de Meta, la política necesita una sección de cookies y un banner de consentimiento. Hoy la página no usa ninguno.
- [ ] **Dominio final:** reemplaza `https://SITE-URL` en el `<head>` de `index.html`.

## Contenido que falta

- [ ] **Fecha de inicio de la próxima cohorte**, y días y horarios (con zona horaria).
- [ ] **Bio real de Beatriz:** trayectoria, formación, certificaciones.
- [ ] **Enlace al programa general de inglés** (`GENERAL_PROGRAM_URL` en `config.js`), para quien sale por debajo de B2. Mientras no esté, el botón abre un correo.
- [ ] **LinkedIn u otras redes:** solo está Instagram. Si quieres sumar otra red, pásame el enlace.
- [ ] **¿Cuáles son los seis criterios del certificado?** Nombrarlos le daría peso.

## Textos para validar

Los escribí yo y están marcados `[BORRADOR]` en el código:
- [ ] El mensaje de ejemplo del hero y las respuestas de la sala. Solo *"Just to confirm — the 4th of June?"* viene del curso. Quité toda mención a Northgate Energy, como pediste.
- [ ] La línea que describe cada uno de los 12 módulos (en inglés y español).
- [ ] Las 5 preguntas del autodiagnóstico y el umbral para decir "por debajo de B2".
- [ ] **El tono en español:** usé **tú** en toda la página. Si la academia habla de **usted** a sus clientes ejecutivos, dímelo y lo cambio en todos los textos.

## Marca

- [ ] **Fuentes Gilroy y Placard Next** en `.woff2` con licencia web. Hoy se usan Plus Jakarta Sans y Barlow Condensed.
- [ ] **Logo de Everglow en SVG original.** El actual es un vectorizado automático del PNG.

## Ya resuelto

- ~~Logos de YLAI, ASU, IESA e INDELSER~~: quitados de la página, como pediste. Los archivos originales siguen en `brand/logos/` por si los necesitas en otro lugar.
- ~~Privacy Policy y Terms~~: publicados en inglés y español, con los valores pendientes resaltados.
- ~~El plazo de 24 horas~~: según los términos, la academia **envía las instrucciones de pago** en 24 horas. Ajusté la página, el mensaje de éxito y el FAQ para que digan eso.
- ~~URL del Apps Script~~: conectada.
