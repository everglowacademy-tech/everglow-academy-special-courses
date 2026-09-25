// =========================================================================
// i18n.js — traducción de la landing.
//
// Cómo funciona:
//   · El inglés vive en el HTML (es lo que indexa Google).
//   · Cada texto traducible lleva data-i18n="clave" y aquí está su versión en español.
//   · Atributos (aria-label, alt, content…): data-i18n-attr="atributo:clave;otro:clave2".
//   · Para cambiar un texto en español, edita la clave aquí. Para cambiarlo en inglés, en index.html.
//   · Los ejemplos de inglés (el mensaje del hero, las respuestas de la sala,
//     los títulos de los módulos) NO se traducen: son lo que se practica.
// =========================================================================
import { currentLang, setLang, initLangSwitch, reveal } from "./lang.js";

// ---------- Textos del HTML en español ----------
const ES = {
  "meta.title": "Leading in English — Curso de inglés para líderes del sector energético | Everglow Academy",
  "meta.description": "Curso de inglés en vivo para gerentes, directores y ejecutivos del sector energético (B2–C1). 12 semanas, 22 sesiones en vivo, grupos de 8 a 10. Aprende a decir primero lo importante. $500 USD o 3 × $175.",
  skip: "Saltar al contenido",
  "brand.home": "Everglow Academy — volver arriba",
  "nav.label": "Principal",
  "nav.program": "Programa",
  "nav.check": "¿Es para ti?",
  "nav.pricing": "Precio",
  "nav.faq": "Preguntas",
  "lang.label": "Idioma",
  "cta.enroll": "Inscríbete",
  "cta.check": "¿Este curso es para ti?",

  "hero.eyebrow": 'Curso en vivo · <span class="nowrap">B2–C1</span> · 12 semanas',
  "call.live": "En vivo",
  "hero.promise": "Para gerentes, directores y ejecutivos: aprende a decir primero lo importante en inglés — en reportes, reuniones y conversaciones difíciles.",
  "hero.priceAlt": "un solo pago, o 3 cuotas de $175",

  "call.bar": "Revisión de proyecto · Reporte semanal",
  "call.participants": "Participantes",
  "call.youShort": "TÚ",
  "call.you": "Tú · Director(a)",
  "call.sc": "Comité",
  "call.op": "Operaciones",
  "call.cr": "Comunidad",
  "call.off": "Enredado",
  "call.on": "Al grano",
  "call.meter": "palabras antes de ir al grano",
  "call.say": "Tú dices:",
  "call.replies": "Respuestas de la sala",
  "call.hint": "Mueve el switch. Mismos datos, mismo inglés — otro orden.",
  "call.caption": "Una escena típica del curso. Los ejemplos están en inglés: es lo que vas a practicar.",

  "facts.label": "El curso en cifras",
  "facts.weeks": "semanas",
  "facts.sessions": "sesiones en vivo",
  "facts.minutes": "minutos cada una",
  "facts.group": "personas por grupo",
  "facts.level": "nivel MCER",
  "facts.homework": "tareas",

  "problem.eyebrow": "El problema",
  "problem.title": 'Sabes inglés. <span class="hl">Pero el momento se te escapa.</span>',
  "problem.point": "lo importante",
  "problem.c1.title": "El reporte que se alarga",
  "problem.c1.text": "Cuando por fin llegas a lo que necesitas, la sala ya está en otra cosa.",
  "problem.c1.module": "Módulo 1 · Get to the Point",
  "problem.c2.title": "La pregunta que no haces",
  "problem.c2.text": "No captaste la fecha, asentiste igual… y el error sigue su camino.",
  "problem.c2.module": "Módulo 2 · Listen, Clarify, Confirm",
  "problem.tone": "Se lee: <b>irritado</b>",
  "problem.c3.title": "El correo que suena molesto",
  "problem.c3.text": "Querías ser directo. Llegó como frío.",
  "problem.c3.module": "Módulo 4 · Tone, Register and Writing",

  "program.eyebrow": "Lo que vas a practicar",
  "program.title": '12 módulos, <span class="hl">una habilidad a la vez</span>',
  "program.lead": "Cada módulo suma una herramienta. Los dos últimos las ponen a trabajar en situaciones reales.",
  m0: "Identifica dónde está tu inglés hoy y qué cambiar primero.",
  m1: "Abre cualquier reporte con lo importante: estado, causa, petición.",
  m2: "Aclara y confirma cifras, fechas y decisiones antes de que se pierdan.",
  m3: "Toma la palabra e interrumpe sin sonar grosero.",
  m4: "Escribe correos que suenen como tú quieres que suenen.",
  m5: "Discrepa sin dañar la relación.",
  m6: "Comunica retrasos y temas de seguridad con claridad y calma.",
  m7: "Presenta una recomendación y sostenla ante preguntas.",
  m8: "Negocia tiempo, presupuesto y alcance con quien quiere otra cosa.",
  m9: "Adáptate a juntas directivas, reguladores y comunidades.",
  m10: "Ensaya una situación real de tu propio trabajo.",
  m11: "Todo junto, en una simulación completa y realista.",

  "check.eyebrow": "Autodiagnóstico · 1 minuto",
  "check.title": '¿Este curso <span class="hl">es para ti?</span>',
  "check.lead": "Una respuesta honesta, aunque sea un no.",
  "check.note": "No es un examen de nivel. Tus respuestas se quedan en tu navegador, salvo que te inscribas.",

  "session.eyebrow": "Cómo es una sesión",
  "session.title": '60 minutos. <span class="hl">Tú hablas casi todo el tiempo.</span>',
  "session.lead": "Un instructor y un coach de práctica. Sin tareas: la práctica ocurre en vivo.",
  "session.s1": "Modelo",
  "session.s1t": "Ves cómo se hace bien.",
  "session.s2": "Observa",
  "session.s2t": "Detectas qué lo hace funcionar.",
  "session.s3": "Ensaya",
  "session.s3t": "Lo pruebas con el coach escuchando.",
  "session.s4": "Actúa",
  "session.s4t": "Lo haces de verdad, con presión.",
  "session.s5": "Feedback",
  "session.s5t": "Comentarios concretos, en el momento.",

  "instructor.alt": "Retrato de Beatriz Chacón, sonriendo, con un blazer beige en una oficina",
  "instructor.eyebrow": "Tu instructora",
  "instructor.role": "CEO y fundadora de Everglow Academy",
  "instructor.bio": "Beatriz fundó Everglow Academy y dicta Leading in English junto a un coach de práctica, para que cada ejercicio reciba feedback en vivo.",

  "fit.eyebrow": "Sin rodeos",
  "fit.title": 'Para quién es — <span class="hl">y para quién no</span>',
  "fit.yes": "Es para ti si",
  "fit.y1": "Ya lideras un equipo, un proyecto o un área.",
  "fit.y2": "Tu inglés es B2–C1.",
  "fit.y3": "El inglés es parte de tu semana laboral.",
  "fit.y4": "Quieres práctica en vivo, con feedback.",
  "fit.no": "No es para ti si",
  "fit.n1": 'Tu inglés está por debajo de B2 — <a href="https://www.cambridgeenglish.org/test-your-english/business/" target="_blank" rel="noopener">haz el test de Cambridge</a>.',
  "fit.n2": "Buscas un curso de liderazgo o técnico.",
  "fit.n3": "Buscas clases grabadas para ver por tu cuenta.",
  "fit.n4": "Esperas hablar con fluidez en 12 semanas. Nadie puede prometerte eso con honestidad.",

  "price.eyebrow": "Precio",
  "price.title": 'Un precio. <span class="hl">Dos formas de pagar.</span>',
  "price.switch": "Forma de pago",
  "price.full": "Un pago",
  "price.split": "3 cuotas",
  "price.fullNote": "Pagas una sola vez, antes de empezar.",
  "price.splitNote": '$525 en total. Las fechas están en los <a href="terms.html#price">Términos de uso</a>.',
  "price.cta": "Inscribirme con esta opción",
  "price.includes": "Incluye",
  "price.i1": "Una llamada diagnóstica individual",
  "price.i2": "22 sesiones en vivo en 12 semanas",
  "price.i3": "Grupo de 8 a 10, instructor y coach",
  "price.i4": "Material de una página por módulo",
  "price.i5": "Feedback en vivo en cada práctica",
  "price.i6": "Certificado con perfil en seis criterios",
  "price.step1": "<b>Inscríbete</b> con el formulario de abajo.",
  "price.step2": "<b>En 24 horas</b> te enviamos por correo las instrucciones de Zelle.",
  "price.step3": "<b>Tu cupo queda confirmado</b> cuando llega tu pago.",

  "enroll.eyebrow": "Inscripción",
  "enroll.title": "Reserva tu cupo",
  "enroll.lead": "Grupos de 8 a 10. Inscribirte toma un minuto; el pago viene después.",
  "enroll.cohort": "<b>Próxima cohorte:</b> fecha de inicio por anunciar.",

  "form.name": "Nombre completo",
  "form.email": "Correo electrónico",
  "form.phone": 'Teléfono / WhatsApp <span class="field__hint">con código de país</span>',
  "form.country": "País",
  "form.payment": "Forma de pago",
  "form.payFull": "<b>Un pago</b> — $500 USD",
  "form.paySplit": "<b>3 cuotas</b> — $175 USD cada una",
  "form.terms": 'Acepto los <a href="terms.html" target="_blank" rel="noopener">Términos de uso</a> y la <a href="privacy.html" target="_blank" rel="noopener">Política de privacidad</a>.',
  "form.submit": "Inscribirme",
  "form.fine": "Te enviaremos por correo las instrucciones de pago por Zelle.",
  "form.fallback": '¿El formulario no funciona? <a class="js-mailto" href="mailto:everglowacademy@gmail.com">Inscríbete por correo</a>.',

  "success.title": "Recibimos tu inscripción",
  "success.next": "Esto es exactamente lo que sigue:",
  "success.s1": "<b>En las próximas 24 horas:</b> te enviamos por correo las instrucciones de pago por Zelle.",
  "success.s2": "<b>Cuando llegue tu pago:</b> confirmamos tu cupo por escrito.",
  "success.s3": "<b>Antes de empezar el curso:</b> agendamos tu llamada diagnóstica individual.",
  "success.help": '¿No ves nuestro correo? Revisa la carpeta de spam o escríbenos a <a href="mailto:everglowacademy@gmail.com">everglowacademy@gmail.com</a>.',

  "faq.eyebrow": "Preguntas frecuentes",
  "faq.title": 'Preguntas, <span class="hl">respondidas primero</span>',
  "faq.q1": "¿Es un curso de liderazgo?",
  "faq.a1": "No. Es inglés para personas que ya lideran: reportes, reuniones, feedback y malas noticias — en inglés y con claridad.",
  "faq.q2": "¿Qué nivel de inglés necesito?",
  "faq.a2": 'De B2 a C1 en la escala MCER. ¿No estás seguro? Haz el <a href="#self-check">autodiagnóstico de 1 minuto</a>.',
  "faq.q3": "¿Es en vivo? ¿Se graban las sesiones?",
  "faq.a3": "Es 100% en vivo por videollamada y, por defecto, las sesiones no se graban. No hay clases a tu propio ritmo.",
  "faq.q4": "¿Cuánto tiempo me toma?",
  "faq.a4": "Dos sesiones de 60 minutos por semana durante 12 semanas: 22 sesiones. Sin tareas.",
  "faq.q5": "¿Y si falto a una sesión?",
  "faq.a5": "La semana 6 incluye una sesión de recuperación. Para obtener el certificado necesitas asistir al menos a 17 de las 22 sesiones.",
  "faq.q6": "¿Cómo pago?",
  "faq.a6": "Por Zelle, después de inscribirte: $500 USD en un pago, o 3 cuotas de $175 ($525 en total). En 24 horas te enviamos las instrucciones.",
  "faq.q7": "¿Y si necesito cancelar?",
  "faq.a7": 'Las cancelaciones y reembolsos están explicados en nuestros <a href="terms.html#refunds">Términos de uso</a>.',
  "faq.q8": "¿Qué recibo al final?",
  "faq.a8": "Un certificado con un perfil de desempeño en seis criterios, si cumples la asistencia mínima y completas la simulación final.",
  "faq.q9": "¿Cuándo empieza el próximo grupo?",
  "faq.a9": "La fecha se anunciará pronto. Inscríbete para reservar tu cupo y te enviaremos el horario.",

  "footer.contact": "Contacto",
  "footer.follow": "Síguenos",
  "footer.newTab": "(se abre en una pestaña nueva)",
  "footer.privacy": "Política de privacidad",
  "footer.terms": "Términos de uso",
  "footer.copy": "© 2026 Everglow Academy. Todos los derechos reservados.",
};

// ---------- Textos que genera el JavaScript ----------
const STRINGS = {
  en: {
    "hero.status": "{mode}. {n} words before the point. The room replies: {replies}",
    "hero.buried": "Buried version",
    "hero.clear": "Point-first version",

    "quiz.progress": "Question {n} of {total}",
    "quiz.back": "← Back",
    "quiz.next": "Next",
    "quiz.see": "See my result",
    "quiz.pick": "Choose the option closest to you.",
    "quiz.retake": "Retake the self-check",
    "quiz.before": "You took this self-check before.",
    "quiz.gain": "Where you’d likely gain the most:",
    "quiz.label.fit": "Good fit",
    "quiz.label.not-leading": "English fits — check the role",
    "quiz.label.below": "Below B2 for now",
    "quiz.tag.fit": "Good fit",
    "quiz.h.fit": "This course was built for people like you.",
    "quiz.p.fit": "You already lead, and your English is in the range we work with. What’s left is what we practice: order, timing and tone under pressure.",
    "quiz.cta.fit": "Enroll now",
    "quiz.small.fit": "Your result will be attached to your registration. The diagnostic call looks at your English in more detail.",
    "quiz.tag.not-leading": "Check the role",
    "quiz.h.not-leading": "Your English fits. The context may not — yet.",
    "quiz.p.not-leading": "The course is built around situations leaders face. If you’re about to step into a leadership role, it can still work — mention it when you register and we’ll look at it on your diagnostic call.",
    "quiz.cta.not-leading": "Register and tell us more",
    "quiz.tag.below": "Not this course — yet",
    "quiz.h.below": "We’d rather tell you now.",
    "quiz.p.below": "Your answers suggest your English is below B2 right now. This course assumes you can follow a fast meeting; without that, you’d spend the sessions translating instead of practicing — and paying for the wrong course.",
    "quiz.p2.below": "Our general English program is built for this step. When you reach B2, this course will be here.",
    "quiz.cta.below": "See the general program",
    "quiz.cta.belowMail": "Ask us about the general program",
    "quiz.small.below": "This is a self-check, not a level test. If you think it got you wrong, register anyway — the diagnostic call will tell us both.",

    "form.err.name": "Please enter your full name.",
    "form.err.name2": "Please enter your first and last name.",
    "form.err.email": "Please enter your email.",
    "form.err.email2": "That email doesn’t look right. Check for typos, e.g. name@company.com.",
    "form.err.phone": "Please enter a phone or WhatsApp number.",
    "form.err.phone2": "Include your country code, e.g. +58 412 555 0100.",
    "form.err.country": "Please enter your country.",
    "form.err.payment": "Choose how you’d like to pay.",
    "form.err.terms": "Please accept the Terms of Use and the Privacy Policy to continue.",
    "form.fix1": "Please fix 1 field below.",
    "form.fixN": "Please fix {n} fields below.",
    "form.sending": "Sending…",
    "form.submit": "Register",
    "form.selfcheck": "Your self-check result (“{label}”) will be sent with your registration.",
    "form.selfcheckRemove": "Don’t include it",
    "form.failed": "We couldn’t send your registration. Check your connection and try again, or <a href=\"{mailto}\">send it by email</a> — it’s already filled in.",
    "form.noEndpoint": "Online registration isn’t connected yet. <a href=\"{mailto}\">Send your registration by email</a> — it’s already filled in.",
    "mail.subject": "Registration — Leading in English",
    "mail.intro": "Hello Everglow Academy,\n\nI’d like to register for Leading in English: Communication Tools for Global Energy Leaders.",
    "mail.name": "Full name",
    "mail.email": "Email",
    "mail.phone": "Phone / WhatsApp",
    "mail.country": "Country",
    "mail.payment": "Payment option",
  },
  es: {
    "hero.status": "{mode}. {n} palabras antes de ir al grano. La sala responde: {replies}",
    "hero.buried": "Versión enredada",
    "hero.clear": "Versión al grano",

    "quiz.progress": "Pregunta {n} de {total}",
    "quiz.back": "← Atrás",
    "quiz.next": "Siguiente",
    "quiz.see": "Ver mi resultado",
    "quiz.pick": "Elige la opción que más se parezca a ti.",
    "quiz.retake": "Repetir el autodiagnóstico",
    "quiz.before": "Ya hiciste este autodiagnóstico.",
    "quiz.gain": "Donde probablemente más vas a ganar:",
    "quiz.label.fit": "Buen encaje",
    "quiz.label.not-leading": "El inglés encaja — revisar el rol",
    "quiz.label.below": "Por debajo de B2 por ahora",
    "quiz.tag.fit": "Buen encaje",
    "quiz.h.fit": "Este curso se hizo para personas como tú.",
    "quiz.p.fit": "Ya lideras y tu inglés está en el rango con el que trabajamos. Lo que falta es justo lo que practicamos: orden, momento y tono bajo presión.",
    "quiz.cta.fit": "Inscríbete",
    "quiz.small.fit": "Tu resultado se adjuntará a tu inscripción. La llamada diagnóstica revisa tu inglés con más detalle.",
    "quiz.tag.not-leading": "Revisa el rol",
    "quiz.h.not-leading": "Tu inglés encaja. El contexto, quizás todavía no.",
    "quiz.p.not-leading": "El curso gira en torno a situaciones que enfrenta quien lidera. Si estás por asumir un rol de liderazgo, igual puede servirte: menciónalo al inscribirte y lo vemos en tu llamada diagnóstica.",
    "quiz.cta.not-leading": "Inscribirme y contarles más",
    "quiz.tag.below": "Este curso no — todavía",
    "quiz.h.below": "Preferimos decírtelo ahora.",
    "quiz.p.below": "Tus respuestas sugieren que hoy tu inglés está por debajo de B2. Este curso asume que puedes seguir una reunión rápida; sin eso, pasarías las sesiones traduciendo en vez de practicando, y pagando por el curso equivocado.",
    "quiz.p2.below": "Nuestro programa general de inglés está hecho para esta etapa. Cuando llegues a B2, este curso te estará esperando.",
    "quiz.cta.below": "Ver el programa general",
    "quiz.cta.belowMail": "Pregúntanos por el programa general",
    "quiz.small.below": "Es un autodiagnóstico, no un examen de nivel. Si crees que se equivocó, inscríbete igual: la llamada diagnóstica nos lo dirá a los dos.",

    "form.err.name": "Escribe tu nombre completo.",
    "form.err.name2": "Escribe tu nombre y tu apellido.",
    "form.err.email": "Escribe tu correo electrónico.",
    "form.err.email2": "Ese correo no parece correcto. Revisa si hay un error, por ejemplo nombre@empresa.com.",
    "form.err.phone": "Escribe un teléfono o WhatsApp.",
    "form.err.phone2": "Incluye el código de país, por ejemplo +58 412 555 0100.",
    "form.err.country": "Escribe tu país.",
    "form.err.payment": "Elige cómo quieres pagar.",
    "form.err.terms": "Para continuar, acepta los Términos de uso y la Política de privacidad.",
    "form.fix1": "Revisa 1 campo del formulario.",
    "form.fixN": "Revisa {n} campos del formulario.",
    "form.sending": "Enviando…",
    "form.submit": "Inscribirme",
    "form.selfcheck": "El resultado de tu autodiagnóstico («{label}») se enviará con tu inscripción.",
    "form.selfcheckRemove": "No incluirlo",
    "form.failed": "No pudimos enviar tu inscripción. Revisa tu conexión e inténtalo de nuevo, o <a href=\"{mailto}\">envíala por correo</a> — ya está escrita.",
    "form.noEndpoint": "La inscripción en línea todavía no está conectada. <a href=\"{mailto}\">Envía tu inscripción por correo</a> — ya está escrita.",
    "mail.subject": "Inscripción — Leading in English",
    "mail.intro": "Hola, Everglow Academy:\n\nQuiero inscribirme en Leading in English: Communication Tools for Global Energy Leaders.",
    "mail.name": "Nombre completo",
    "mail.email": "Correo",
    "mail.phone": "Teléfono / WhatsApp",
    "mail.country": "País",
    "mail.payment": "Forma de pago",
  },
};

// Traduce una clave de STRINGS, reemplazando {variables}
export function t(key, vars = {}) {
  const s = STRINGS[currentLang()]?.[key] ?? STRINGS.en[key] ?? key;
  return s.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ""));
}

// ---------- Aplicar traducciones al HTML ----------
const originals = new Map();     // textos en inglés, leídos del HTML al arrancar
const originalAttrs = new Map(); // atributos en inglés

function snapshot() {
  document.querySelectorAll("[data-i18n]").forEach((el) => originals.set(el, el.innerHTML));
  document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
    const pairs = el.dataset.i18nAttr.split(";").map((p) => p.split(":"));
    originalAttrs.set(el, pairs.map(([attr, key]) => [attr, key, el.getAttribute(attr)]));
  });
}

function apply(lang) {
  originals.forEach((en, el) => {
    const html = lang === "es" ? ES[el.dataset.i18n] ?? en : en;
    if (el.tagName === "TITLE") document.title = html.replace(/&amp;/g, "&");
    else el.innerHTML = html;
  });
  originalAttrs.forEach((pairs, el) => {
    pairs.forEach(([attr, key, en]) => el.setAttribute(attr, lang === "es" ? ES[key] ?? en : en));
  });
}

export function initI18n() {
  snapshot();
  initLangSwitch();
  document.addEventListener("langchange", (e) => apply(e.detail.lang));
  // Aplica el idioma inicial sin guardarlo (así el navegador sigue decidiendo hasta que la persona elija)
  setLang(currentLang(), { save: false });
  reveal();
}
