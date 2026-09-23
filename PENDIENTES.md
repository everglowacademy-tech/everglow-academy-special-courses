# Pendientes de tu lado

La página funciona, pero hay cosas que solo tú puedes darme o confirmar. Van ordenadas de más a menos urgente para publicar.

## Bloquean la publicación

- [ ] **Privacy Policy y Terms of Use.** El formulario obliga a aceptarlas y ahora mismo `privacy.html` y `terms.html` solo dicen "This page is being prepared". Publicar un formulario que recoge datos personales sin política de privacidad es un riesgo legal. Pásame los textos y los monto.
- [ ] **URL del Google Apps Script.** Va en `site/js/config.js` → `FORM_ENDPOINT`. Sin ella, la inscripción solo se puede enviar por correo.
- [ ] **Dominio final.** Hay que reemplazar `https://SITE-URL` en el `<head>` de `index.html` (sin eso, la vista previa en redes sale sin imagen).
- [ ] **Confirmar el plazo de 24 horas.** Lo interpreté como *"tienes 24 horas desde que te inscribes para enviar el pago por Zelle"*. Si significa otra cosa (por ejemplo, que ustedes responden en 24 horas), hay que cambiarlo en la sección Pricing y en el mensaje de éxito (busca `[CONFIRMAR]`).

## Contenido que falta

- [ ] **Fecha de inicio de la próxima cohorte**, y días y horarios de las sesiones (con zona horaria).
- [ ] **Fechas de las cuotas.** Hoy dice "We’ll share the installment dates when we confirm your seat".
- [ ] **Cuánto tardan en confirmar la plaza** después de recibir el pago (mensaje de éxito, paso 2).
- [ ] **Bio real de Beatriz:** trayectoria, formación, certificaciones. No inventé nada; el texto actual solo dice que fundó la academia y dicta el curso con un coach de práctica.
- [ ] **Nombre del coach de práctica**, si quieren mostrarlo.
- [ ] **Enlace al programa general de inglés**, para quien sale por debajo de B2 en el autodiagnóstico. Va en `config.js` → `GENERAL_PROGRAM_URL`. Mientras no esté, el botón abre un correo.
- [ ] **URLs de Instagram y LinkedIn** (footer). Hoy apuntan a `#`.
- [ ] **Política de sesiones perdidas y de reembolso.** No las puse en el FAQ porque no las conozco, pero es lo primero que pregunta alguien que va a pagar $500.
- [ ] **¿Se graban las sesiones?** Tampoco lo menciono.
- [ ] **¿Cuáles son los seis criterios del certificado?** Nombrarlos le daría peso al certificado.

## Textos para validar con el equipo académico

Los escribí yo a partir del brief y están marcados `[BORRADOR]` en el código:
- [ ] Los dos mensajes del hero (versión larga y versión clara) y las respuestas de la sala. Solo *"Just to confirm — the 4th of June?"* viene del curso.
- [ ] Las descripciones de una línea de los 12 módulos.
- [ ] Las 5 preguntas del autodiagnóstico y el umbral para decir "debajo de B2" (`MIN_LEVEL_SCORE = 6` de 12, o no poder seguir una llamada).
- [ ] Los pasos de "Inside a session" (model → notice → rehearse → perform → feedback).

## Marca

- [ ] **Logo de INDELSER.** Hay un recuadro provisional con el nombre.
- [ ] **Permiso de uso de los logos de YLAI, ASU e IESA.** Estas instituciones suelen tener normas de uso de marca; conviene tener la autorización por escrito antes de publicar.
- [ ] **Fuentes Gilroy y Placard Next** en `.woff2` con licencia web. Mientras tanto se usan Plus Jakarta Sans y Barlow Condensed, que se parecen bastante.
- [ ] **Logo de Everglow en SVG original.** Vectoricé el PNG que mandaste (`brand/logos/everglow-wordmark-traced.svg`) y se ve bien, pero el archivo de la diseñadora siempre será más limpio.
- [ ] **Evy y Glowy.** No los usé. Si los quieren en esta página, mándame los archivos.
