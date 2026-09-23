// =========================================================================
// quiz.js — autodiagnóstico "Is this course for you?"
// Funciona sin backend: el resultado se guarda en localStorage y el
// formulario lo adjunta a la inscripción.
// =========================================================================
import { CONTACT_EMAIL, GENERAL_PROGRAM_URL, SELF_CHECK_KEY } from "./config.js";

// Cada opción suma puntos de nivel (lvl, 0–3). "lead: false" marca que la persona
// aún no lidera. "focus" es el área donde más ganaría, si la elige.
// [BORRADOR] Preguntas y umbrales: validar con el equipo académico.
const QUESTIONS = [
  {
    q: "What best describes your role today?",
    options: [
      { t: "I manage a team, a project or a business area.", lead: true },
      { t: "I’m a director or an executive.", lead: true },
      { t: "I’m not in a leadership role yet.", lead: false },
    ],
  },
  {
    q: "In a video call with native English speakers, you…",
    options: [
      { t: "Follow almost everything, including side comments and jokes.", lvl: 3 },
      { t: "Get the main points, but miss some details.", lvl: 2, focus: "Catching and confirming details — numbers, dates, names." },
      { t: "Often lose the thread and need to check afterwards.", lvl: 0 },
    ],
  },
  {
    q: "You have two minutes to give a status update in English. You…",
    options: [
      { t: "Do it well; I want it sharper under pressure.", lvl: 3 },
      { t: "Can do it, but it runs longer than I’d like.", lvl: 2, focus: "Opening with the point: status, cause, request." },
      { t: "Write it out first and read it.", lvl: 1, focus: "Speaking without a script when the moment comes." },
      { t: "Avoid it, or ask someone else to do it.", lvl: 0 },
    ],
  },
  {
    q: "Someone asks you a question in a meeting and you didn’t fully catch it. You…",
    options: [
      { t: "Ask them to rephrase, then confirm what they meant.", lvl: 3 },
      { t: "Nod and hope it becomes clear.", lvl: 2, focus: "Asking for clarification without feeling exposed." },
      { t: "Give a general answer; I’m not sure how to ask.", lvl: 1, focus: "Asking for clarification without feeling exposed." },
    ],
  },
  {
    q: "You need to tell a client the project is delayed. In English, you…",
    options: [
      { t: "Could do it on a call or by email.", lvl: 3 },
      { t: "Can write it, but I worry about how the tone lands.", lvl: 2, focus: "Delivering bad news with the right tone." },
      { t: "Would write it in my language and translate it.", lvl: 0 },
    ],
  },
];

// Umbrales: por debajo de esto sugerimos el programa general
const MIN_LEVEL_SCORE = 6; // de 12 posibles (preguntas 2–5)

function evaluate(answers) {
  const picked = answers.map((a, i) => QUESTIONS[i].options[a]);
  const level = picked.slice(1).reduce((s, o) => s + (o.lvl ?? 0), 0);
  const cantFollow = picked[1].lvl === 0; // si no sigue una llamada, no está en B2
  const leads = picked[0].lead;
  const focus = [...new Set(picked.map((o) => o.focus).filter(Boolean))];

  let tier;
  if (cantFollow || level < MIN_LEVEL_SCORE) tier = "below";
  else if (!leads) tier = "not-leading";
  else tier = "fit";

  const LABELS = { fit: "Good fit", "not-leading": "English fits — check the role", below: "Below B2 for now" };
  return {
    tier,
    label: LABELS[tier],
    focus,
    answers: picked.map((o, i) => ({ q: QUESTIONS[i].q, a: o.t })),
    date: new Date().toISOString(),
  };
}

// localStorage puede fallar (modo privado, bloqueado): siempre con try/catch
function load() {
  try { return JSON.parse(localStorage.getItem(SELF_CHECK_KEY)) || null; } catch { return null; }
}
function save(result) {
  try { localStorage.setItem(SELF_CHECK_KEY, JSON.stringify(result)); } catch { /* sin almacenamiento: seguimos igual */ }
}
function clear() {
  try { localStorage.removeItem(SELF_CHECK_KEY); } catch { /* nada */ }
}

// Texto que viaja con el formulario
export function summarize(r) {
  if (!r) return "";
  const focus = r.focus.length ? ` | Focus: ${r.focus.join(" / ")}` : "";
  const answers = r.answers.map((x, i) => `Q${i + 1}: ${x.a}`).join(" | ");
  return `Self-check: ${r.label}${focus} | ${answers}`;
}

export function initQuiz() {
  const root = document.getElementById("quiz");
  let result = load();
  if (!root) return { get: () => result, clear: () => {} };

  const listeners = new Set();
  const emit = () => listeners.forEach((fn) => fn(result));

  let step = 0;
  let answers = [];

  function el(html) {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  function renderStep() {
    const Q = QUESTIONS[step];
    const last = step === QUESTIONS.length - 1;
    const node = el(`
      <form class="quiz__step" novalidate>
        <div class="quiz__top"><span>Question ${step + 1} of ${QUESTIONS.length}</span></div>
        <div class="quiz__bar" aria-hidden="true"><span style="transform: scaleX(${(step + 1) / QUESTIONS.length})"></span></div>
        <fieldset>
          <legend>${Q.q}</legend>
          <div class="quiz__options">
            ${Q.options.map((o, i) => `
              <label class="opt">
                <input type="radio" name="q${step}" value="${i}" ${answers[step] === i ? "checked" : ""}>
                <span>${o.t}</span>
              </label>`).join("")}
          </div>
        </fieldset>
        <p class="quiz__error field__error" role="alert"></p>
        <div class="quiz__nav">
          <button type="button" class="linkish" data-back ${step === 0 ? "hidden" : ""}>← Back</button>
          <button type="submit" class="btn btn--sun">${last ? "See my result" : "Next"}</button>
        </div>
      </form>`);

    node.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const checked = node.querySelector("input:checked");
      if (!checked) {
        node.querySelector(".quiz__error").textContent = "Choose the option closest to you.";
        node.querySelector("input").focus();
        return;
      }
      answers[step] = Number(checked.value);
      if (last) finish();
      else { step++; renderStep(); }
    });
    node.querySelector("[data-back]").addEventListener("click", () => { step--; renderStep(); });

    root.replaceChildren(node);
    // Foco en la primera opción (o la marcada) para seguir con teclado sin perderse
    if (document.activeElement !== document.body || step > 0) {
      (node.querySelector("input:checked") || node.querySelector("input")).focus({ preventScroll: true });
    }
  }

  function finish() {
    result = evaluate(answers);
    save(result);
    renderResult();
    emit();
  }

  function renderResult(restored = false) {
    const r = result;
    const focusList = r.focus.length
      ? `<p>Where you’d likely gain the most:</p><ul class="result__focus">${r.focus.map((f) => `<li>${f}</li>`).join("")}</ul>`
      : "";
    const generalHref = GENERAL_PROGRAM_URL || `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("General English program")}`;
    const generalLabel = GENERAL_PROGRAM_URL ? "See the general program" : "Ask us about the general program";

    const BODY = {
      fit: `
        <p class="result__tag">Good fit</p>
        <h3 tabindex="-1">This course was built for people like you.</h3>
        <p>You already lead, and your English is in the range the course works with. What’s left is exactly what we practice: order, timing and tone under pressure.</p>
        ${focusList}
        <div class="cta-row"><a class="btn btn--sun" href="#enroll">Enroll now</a></div>
        <p class="result__small">Your result will be attached to your registration. The individual diagnostic call looks at your English in more detail.</p>`,
      "not-leading": `
        <p class="result__tag">Check the role</p>
        <h3 tabindex="-1">Your English fits. The context may not — yet.</h3>
        <p>The course is built around situations leaders face: giving updates, disagreeing with stakeholders, delivering bad news. If you’re about to step into a leadership role, it can still be a good fit — mention it when you register and we’ll look at it on your diagnostic call.</p>
        ${focusList}
        <div class="cta-row"><a class="btn btn--sun" href="#enroll">Register and tell us more</a></div>`,
      below: `
        <p class="result__tag result__tag--no">Not this course — yet</p>
        <h3 tabindex="-1">We’d rather tell you now.</h3>
        <p>Your answers suggest your English is below B2 right now. This course assumes you can already follow a fast meeting; without that, you’d spend the sessions translating instead of practicing — and you’d be paying for the wrong course.</p>
        <p>Our general English program is built for this step. When you’re at B2, this course will be here.</p>
        <div class="cta-row"><a class="btn btn--sun" href="${generalHref}">${generalLabel}</a></div>
        <p class="result__small">This is a self-check, not a level test. If you think it got you wrong, register anyway — the diagnostic call will tell us both.</p>`,
    };

    const node = el(`<div class="result quiz__step">${BODY[r.tier]}
      <p class="result__small">${restored ? "You took this self-check before. " : ""}<button type="button" class="linkish" data-retake>Retake the self-check</button></p></div>`);
    node.querySelector("[data-retake]").addEventListener("click", () => {
      clear();
      result = null;
      answers = [];
      step = 0;
      emit();
      renderStep();
      root.querySelector("input").focus({ preventScroll: true });
    });
    root.replaceChildren(node);
    if (!restored) node.querySelector("h3").focus({ preventScroll: false });
  }

  if (result) renderResult(true);
  else renderStep();

  return {
    get: () => result,
    clear: () => { clear(); result = null; answers = []; step = 0; renderStep(); emit(); },
    onChange: (fn) => listeners.add(fn),
  };
}
