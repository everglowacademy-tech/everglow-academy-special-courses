// =========================================================================
// quiz.js — autodiagnóstico "Is this course for you?" (bilingüe).
// Funciona sin backend: el resultado se guarda en localStorage (solo los
// índices de las respuestas) y el formulario lo adjunta a la inscripción.
// =========================================================================
import { CONTACT_EMAIL, GENERAL_PROGRAM_URL, SELF_CHECK_KEY } from "./config.js";
import { t } from "./i18n.js";
import { currentLang } from "./lang.js";

// lvl: puntos de nivel (0–3). lead: false = aún no lidera. focus: área donde más ganaría.
// [BORRADOR] Preguntas y umbrales: validar con el equipo académico.
const FOCUS = {
  details: { en: "Catching and confirming details — numbers, dates, names.", es: "Captar y confirmar detalles: cifras, fechas, nombres." },
  point: { en: "Opening with the point: status, cause, request.", es: "Abrir con lo importante: estado, causa, petición." },
  script: { en: "Speaking without a script when the moment comes.", es: "Hablar sin guion cuando llega el momento." },
  clarify: { en: "Asking for clarification without feeling exposed.", es: "Pedir aclaraciones sin sentirte expuesto." },
  tone: { en: "Delivering bad news with the right tone.", es: "Dar malas noticias con el tono adecuado." },
};

const QUESTIONS = [
  {
    q: { en: "What best describes your role today?", es: "¿Qué describe mejor tu rol hoy?" },
    options: [
      { t: { en: "I manage a team, a project or a business area.", es: "Dirijo un equipo, un proyecto o un área de negocio." }, lead: true },
      { t: { en: "I’m a director or an executive.", es: "Soy director(a) o ejecutivo(a)." }, lead: true },
      { t: { en: "I’m not in a leadership role yet.", es: "Todavía no tengo un rol de liderazgo." }, lead: false },
    ],
  },
  {
    q: { en: "In a video call with native English speakers, you…", es: "En una videollamada con hablantes nativos de inglés…" },
    options: [
      { t: { en: "Follow almost everything, including side comments and jokes.", es: "Sigues casi todo, incluso comentarios al margen y chistes." }, lvl: 3 },
      { t: { en: "Get the main points, but miss some details.", es: "Captas las ideas principales, pero se te escapan detalles." }, lvl: 2, focus: "details" },
      { t: { en: "Often lose the thread and need to check afterwards.", es: "A menudo pierdes el hilo y tienes que confirmar después." }, lvl: 0 },
    ],
  },
  {
    q: { en: "You have two minutes to give a status update in English. You…", es: "Tienes dos minutos para dar un reporte de avance en inglés. Tú…" },
    options: [
      { t: { en: "Do it well; I want it sharper under pressure.", es: "Lo haces bien; quieres sonar más preciso bajo presión." }, lvl: 3 },
      { t: { en: "Can do it, but it runs longer than I’d like.", es: "Puedes hacerlo, pero se alarga más de lo que quisieras." }, lvl: 2, focus: "point" },
      { t: { en: "Write it out first and read it.", es: "Lo escribes antes y lo lees." }, lvl: 1, focus: "script" },
      { t: { en: "Avoid it, or ask someone else to do it.", es: "Lo evitas o le pides a otra persona que lo haga." }, lvl: 0 },
    ],
  },
  {
    q: { en: "Someone asks you a question in a meeting and you didn’t fully catch it. You…", es: "En una reunión te hacen una pregunta y no la entendiste del todo. Tú…" },
    options: [
      { t: { en: "Ask them to rephrase, then confirm what they meant.", es: "Pides que la reformulen y confirmas lo que quisieron decir." }, lvl: 3 },
      { t: { en: "Nod and hope it becomes clear.", es: "Asientes y esperas que se aclare sola." }, lvl: 2, focus: "clarify" },
      { t: { en: "Give a general answer; I’m not sure how to ask.", es: "Respondes algo general; no sabes bien cómo preguntar." }, lvl: 1, focus: "clarify" },
    ],
  },
  {
    q: { en: "You need to tell a client the project is delayed. In English, you…", es: "Tienes que decirle a un cliente que el proyecto se retrasa. En inglés…" },
    options: [
      { t: { en: "Could do it on a call or by email.", es: "Podrías hacerlo por llamada o por correo." }, lvl: 3 },
      { t: { en: "Can write it, but I worry about how the tone lands.", es: "Puedes escribirlo, pero te preocupa cómo suena el tono." }, lvl: 2, focus: "tone" },
      { t: { en: "Would write it in my language and translate it.", es: "Lo escribirías en español y lo traducirías." }, lvl: 0 },
    ],
  },
];

const MIN_LEVEL_SCORE = 6; // de 12 posibles (preguntas 2–5); por debajo, sugerimos el programa general

function evaluate(answers) {
  const picked = answers.map((a, i) => QUESTIONS[i].options[a]);
  const level = picked.slice(1).reduce((s, o) => s + (o.lvl ?? 0), 0);
  const cantFollow = picked[1].lvl === 0; // si no sigue una llamada, no está en B2
  let tier = "fit";
  if (cantFollow || level < MIN_LEVEL_SCORE) tier = "below";
  else if (!picked[0].lead) tier = "not-leading";
  return { tier, answers: [...answers], date: new Date().toISOString() };
}

const focusOf = (r) => [...new Set(r.answers.map((a, i) => QUESTIONS[i].options[a].focus).filter(Boolean))];

// localStorage puede fallar (modo privado, bloqueado): siempre con try/catch
function load() {
  try {
    const r = JSON.parse(localStorage.getItem(SELF_CHECK_KEY));
    const valid = r && Array.isArray(r.answers) && r.answers.length === QUESTIONS.length
      && r.answers.every((a, i) => Number.isInteger(a) && QUESTIONS[i].options[a]);
    return valid ? r : null;
  } catch { return null; }
}
function save(r) { try { localStorage.setItem(SELF_CHECK_KEY, JSON.stringify(r)); } catch { /* sin almacenamiento */ } }
function clear() { try { localStorage.removeItem(SELF_CHECK_KEY); } catch { /* nada */ } }

// Etiqueta corta del resultado, en el idioma actual
export const labelOf = (r) => (r ? t(`quiz.label.${r.tier}`) : "");

// Texto que viaja a la hoja de cálculo (en el idioma de la página)
export function summarize(r) {
  if (!r) return "";
  const L = currentLang();
  const focus = focusOf(r).map((f) => FOCUS[f][L]);
  const answers = r.answers.map((a, i) => `Q${i + 1}: ${QUESTIONS[i].options[a].t[L]}`).join(" | ");
  return `${labelOf(r)}${focus.length ? ` | ${L === "es" ? "Enfoque" : "Focus"}: ${focus.join(" / ")}` : ""} | ${answers}`;
}

export function initQuiz() {
  const root = document.getElementById("quiz");
  let result = load();
  const listeners = new Set();
  const emit = () => listeners.forEach((fn) => fn(result));
  if (!root) return { get: () => result, onChange: (fn) => listeners.add(fn) };

  let step = 0;
  let answers = [];
  let view = result ? "result" : "step";

  const el = (html) => {
    const tpl = document.createElement("template");
    tpl.innerHTML = html.trim();
    return tpl.content.firstElementChild;
  };

  function renderStep(focus = false) {
    view = "step";
    const L = currentLang();
    const Q = QUESTIONS[step];
    const last = step === QUESTIONS.length - 1;
    const node = el(`
      <form class="quiz__step" novalidate>
        <div class="quiz__top"><span>${t("quiz.progress", { n: step + 1, total: QUESTIONS.length })}</span></div>
        <div class="quiz__bar" aria-hidden="true"><span style="transform: scaleX(${(step + 1) / QUESTIONS.length})"></span></div>
        <fieldset>
          <legend>${Q.q[L]}</legend>
          <div class="quiz__options">
            ${Q.options.map((o, i) => `
              <label class="opt">
                <input type="radio" name="q${step}" value="${i}" ${answers[step] === i ? "checked" : ""}>
                <span>${o.t[L]}</span>
              </label>`).join("")}
          </div>
        </fieldset>
        <p class="quiz__error field__error" role="alert"></p>
        <div class="quiz__nav">
          <button type="button" class="linkish" data-back ${step === 0 ? "hidden" : ""}>${t("quiz.back")}</button>
          <button type="submit" class="btn btn--sun">${last ? t("quiz.see") : t("quiz.next")}</button>
        </div>
      </form>`);

    // Guarda la elección al instante (así un cambio de idioma no la pierde)
    node.addEventListener("change", (ev) => { answers[step] = Number(ev.target.value); });
    node.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const checked = node.querySelector("input:checked");
      if (!checked) {
        node.querySelector(".quiz__error").textContent = t("quiz.pick");
        node.querySelector("input").focus();
        return;
      }
      answers[step] = Number(checked.value);
      if (last) finish();
      else { step++; renderStep(true); }
    });
    node.querySelector("[data-back]").addEventListener("click", () => { step--; renderStep(true); });

    root.replaceChildren(node);
    if (focus) (node.querySelector("input:checked") || node.querySelector("input")).focus({ preventScroll: true });
  }

  function finish() {
    result = evaluate(answers);
    save(result);
    renderResult({ focusHeading: true });
    emit();
  }

  function renderResult({ restored = false, focusHeading = false } = {}) {
    view = "result";
    const r = result;
    const L = currentLang();
    const focus = focusOf(r);
    const focusList = focus.length
      ? `<p>${t("quiz.gain")}</p><ul class="result__focus">${focus.map((f) => `<li>${FOCUS[f][L]}</li>`).join("")}</ul>`
      : "";
    const generalHref = GENERAL_PROGRAM_URL || `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("General English program")}`;
    const body = r.tier === "below"
      ? `<p>${t("quiz.p.below")}</p><p>${t("quiz.p2.below")}</p>
         <div class="cta-row"><a class="btn btn--sun" href="${generalHref}">${GENERAL_PROGRAM_URL ? t("quiz.cta.below") : t("quiz.cta.belowMail")}</a></div>
         <p class="result__small">${t("quiz.small.below")}</p>`
      : `<p>${t(`quiz.p.${r.tier}`)}</p>${focusList}
         <div class="cta-row"><a class="btn btn--sun" href="#enroll">${t(`quiz.cta.${r.tier}`)}</a></div>
         ${r.tier === "fit" ? `<p class="result__small">${t("quiz.small.fit")}</p>` : ""}`;

    const node = el(`<div class="result quiz__step">
        <p class="result__tag ${r.tier === "below" ? "result__tag--no" : ""}">${t(`quiz.tag.${r.tier}`)}</p>
        <h3 tabindex="-1">${t(`quiz.h.${r.tier}`)}</h3>
        ${body}
        <p class="result__small">${restored ? `${t("quiz.before")} ` : ""}<button type="button" class="linkish" data-retake>${t("quiz.retake")}</button></p>
      </div>`);
    node.querySelector("[data-retake]").addEventListener("click", () => {
      clear();
      result = null;
      answers = [];
      step = 0;
      emit();
      renderStep(true);
    });
    root.replaceChildren(node);
    if (focusHeading) node.querySelector("h3").focus();
  }

  // Al cambiar de idioma se vuelve a pintar el paso actual, sin mover el foco
  document.addEventListener("langchange", () => {
    if (view === "result" && result) renderResult({ restored: true });
    else renderStep(false);
    emit();
  });

  if (result) renderResult({ restored: true });
  else renderStep(false);

  return { get: () => result, onChange: (fn) => listeners.add(fn) };
}
