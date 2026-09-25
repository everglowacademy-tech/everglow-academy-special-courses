// =========================================================================
// main.js — movimiento de la página y el hero interactivo.
// Todo respeta prefers-reduced-motion: si está activo, se muestra el estado
// final sin animar.
// =========================================================================
import { initI18n, t } from "./i18n.js";
import { initQuiz } from "./quiz.js";
import { initForm } from "./form.js";
import { initEmailLinks } from "./email.js";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* ---------------------------------------------------------------------------
   1. Hero: el mismo update, reescrito palabra por palabra
   --------------------------------------------------------------------------- */
// Respuestas de la sala para cada versión del mensaje
// [BORRADOR] Solo "Just to confirm — the 4th of June?" viene del curso.
const REPLIES = {
  buried: [
    ["Steering committee", "Sorry — what exactly do you need from us?"],
    ["Community relations", "So… is June still happening or not?"],
  ],
  clear: [
    ["Steering committee", "Clear. Approved — go ahead with the second crew."],
    ["Community relations", "Just to confirm — the 4th of June?"],
  ],
};

function initRewrite() {
  const box = $("#rewrite-text");
  const sw = $("#rewrite-switch");
  const meter = $("#meter-num");
  const replies = $("#call-replies");
  if (!box || !sw) return;

  // Aviso para lectores de pantalla (un solo mensaje por cambio)
  const status = document.createElement("p");
  status.className = "sr-only";
  status.setAttribute("aria-live", "polite");
  sw.closest(".call").append(status);

  const STAGGER = 12; // ms entre palabras

  // Convierte "texto [[punto]] texto" en spans de palabra; el punto va dentro de <mark>
  function build(text) {
    const p = document.createElement("p");
    let wordsBefore = -1;
    let count = 0;
    text.split(/(\[\[.*?\]\])/).forEach((chunk) => {
      if (!chunk) return;
      const isPoint = chunk.startsWith("[[");
      const clean = isPoint ? chunk.slice(2, -2) : chunk;
      const parent = isPoint ? document.createElement("mark") : p;
      if (isPoint) {
        parent.className = "pt";
        if (wordsBefore < 0) wordsBefore = count;
      }
      clean.split(/(\s+)/).forEach((tok) => {
        if (!tok) return;
        if (/^\s+$/.test(tok)) { parent.append(" "); return; }
        const w = document.createElement("span");
        w.className = "w";
        w.textContent = tok;
        parent.append(w);
        count++;
      });
      if (isPoint) p.append(parent);
    });
    return { p, wordsBefore: Math.max(0, wordsBefore) };
  }

  function countTo(target) {
    if (reduceMotion) { meter.textContent = target; return; }
    const from = parseInt(meter.textContent, 10) || 0;
    const t0 = performance.now();
    const dur = 700;
    requestAnimationFrame(function step(now) {
      const k = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      meter.textContent = Math.round(from + (target - from) * e);
      if (k < 1) requestAnimationFrame(step);
    });
  }

  function setReplies(mode) {
    const items = $$(".reply", replies);
    const apply = () => {
      REPLIES[mode].forEach(([who, text], i) => {
        $(".reply__who", items[i]).textContent = who;
        $(".reply__text", items[i]).textContent = text;
      });
      replies.classList.toggle("is-good", mode === "clear");
      items.forEach((el, i) => setTimeout(() => el.classList.remove("is-out"), reduceMotion ? 0 : 350 + i * 250));
    };
    if (reduceMotion) { apply(); return; }
    items.forEach((el) => el.classList.add("is-out"));
    setTimeout(apply, 380);
  }

  function render(mode, animate) {
    const { p, wordsBefore } = build(box.dataset[mode]);
    const swap = () => {
      box.replaceChildren(p);
      if (animate && !reduceMotion) {
        const words = $$(".w", p);
        words.forEach((w) => w.classList.add("is-in"));
        requestAnimationFrame(() => words.forEach((w, i) => setTimeout(() => w.classList.remove("is-in"), i * STAGGER)));
      }
      countTo(wordsBefore);
    };
    const old = $$(".w", box);
    if (animate && !reduceMotion && old.length) {
      // Salida de la última palabra a la primera
      old.forEach((w, i) => setTimeout(() => w.classList.add("is-out"), (old.length - i) * 5));
      setTimeout(swap, old.length * 5 + 240);
    } else {
      swap();
    }
    if (animate) setReplies(mode);
    status.textContent = t("hero.status", {
      mode: t(mode === "clear" ? "hero.clear" : "hero.buried"),
      n: wordsBefore,
      replies: REPLIES[mode].map((r) => r[1]).join(" "),
    });
  }

  // Estado inicial: versión larga ya partida en palabras, sin animar
  render("buried", false);
  status.textContent = "";
  if (!reduceMotion) sw.classList.add("is-nudging");

  sw.addEventListener("click", () => {
    const on = sw.getAttribute("aria-checked") !== "true";
    sw.setAttribute("aria-checked", String(on));
    sw.classList.remove("is-nudging");
    render(on ? "clear" : "buried", true);
  });
}

/* ---------------------------------------------------------------------------
   2. Aparición al hacer scroll + resaltador de titulares
   --------------------------------------------------------------------------- */
function initReveal() {
  const items = $$(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-in"));
    return;
  }
  // Pequeño escalonado entre hermanos de una misma cuadrícula
  items.forEach((el) => {
    const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
    const i = siblings.indexOf(el);
    if (i > 0) el.style.transitionDelay = `${Math.min(i, 5) * 70}ms`;
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
  items.forEach((el) => io.observe(el));
}

/* ---------------------------------------------------------------------------
   3. Contadores de la franja de datos
   --------------------------------------------------------------------------- */
function initCounters() {
  const els = $$("[data-count]");
  if (reduceMotion || !("IntersectionObserver" in window)) return; // el HTML ya trae el número final
  const run = (el) => {
    const a = Number(el.dataset.count);
    const b = el.dataset.countTo ? Number(el.dataset.countTo) : null;
    const t0 = performance.now();
    const dur = 1100;
    requestAnimationFrame(function step(now) {
      const k = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      el.textContent = b === null ? Math.round(a * e) : `${Math.round(a * e)}–${Math.round(b * e)}`;
      if (k < 1) requestAnimationFrame(step);
    });
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.6 });
  els.forEach((el) => {
    el.setAttribute("aria-label", el.textContent); // el lector oye el valor final, no la cuenta
    io.observe(el);
  });
}

/* ---------------------------------------------------------------------------
   4. Programa: acordeón de módulos (uno abierto a la vez) + línea que se
      dibuja con el scroll + barra de lectura. Un solo manejador de scroll.
   --------------------------------------------------------------------------- */
function initProgram() {
  const timeline = $("#timeline");
  if (!timeline) return;
  const items = $$(".timeline__item", timeline);
  const buttons = $$(".timeline__btn", timeline);

  const open = (idx, focus = false) => {
    items.forEach((it, i) => {
      const on = i === idx;
      it.classList.toggle("is-open", on);
      $(".timeline__btn", it).setAttribute("aria-expanded", String(on));
    });
    if (focus) buttons[idx].focus();
  };
  buttons.forEach((b, i) => {
    b.addEventListener("click", () => open(b.getAttribute("aria-expanded") === "true" ? -1 : i));
    // Flechas arriba/abajo para moverse entre módulos
    b.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const next = (i + (e.key === "ArrowDown" ? 1 : -1) + buttons.length) % buttons.length;
        buttons[next].focus();
      }
    });
  });
  open(0);

  const line = document.createElement("span");
  line.className = "timeline__progress";
  line.setAttribute("aria-hidden", "true");
  timeline.prepend(line);
}

function initScrollEffects() {
  const bar = $(".read-progress span");
  const timeline = $("#timeline");
  const items = timeline ? $$(".timeline__item", timeline) : [];
  let ticking = false;
  let passed = -1;

  function update() {
    ticking = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.setProperty("--progress", max > 0 ? (scrollY / max).toFixed(4) : 0);
    if (!timeline) return;
    // La línea avanza con el scroll y va "encendiendo" los números que deja atrás
    const r = timeline.getBoundingClientRect();
    const focus = innerHeight * 0.6;
    const p = Math.min(1, Math.max(0, (focus - r.top) / r.height));
    timeline.style.setProperty("--timeline", p.toFixed(4));
    let idx = -1;
    items.forEach((it, i) => { if (it.getBoundingClientRect().top < focus) idx = i; });
    if (idx !== passed) {
      passed = idx;
      items.forEach((it, i) => it.classList.toggle("is-passed", i <= idx));
    }
  }
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll, { passive: true });
  update();
}

/* ---------------------------------------------------------------------------
   4b. Precio: selector "un pago / 3 cuotas". Al elegir, también marca la
       opción en el formulario.
   --------------------------------------------------------------------------- */
function initPricing() {
  const buttons = $$("[data-plan]");
  const views = $$("[data-plan-view]");
  const cta = $("#plan-cta");
  if (!buttons.length) return;
  let plan = "full";
  const show = (p) => {
    plan = p;
    buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.plan === p)));
    views.forEach((v) => v.classList.toggle("is-active", v.dataset.planView === p));
  };
  buttons.forEach((b) => b.addEventListener("click", () => show(b.dataset.plan)));
  cta?.addEventListener("click", () => {
    const radio = document.getElementById(plan === "full" ? "f-pay-full" : "f-pay-split");
    if (radio) { radio.checked = true; radio.dispatchEvent(new Event("change", { bubbles: true })); }
  });
  show("full");
}

/* ---------------------------------------------------------------------------
   4c. Sesión: los cinco pasos se encienden en orden al entrar en pantalla
   --------------------------------------------------------------------------- */
function initLoop() {
  const loop = $("#loop");
  if (!loop) return;
  const steps = $$(".loop__step", loop);
  if (reduceMotion || !("IntersectionObserver" in window)) { steps.forEach((s) => s.classList.add("is-lit")); return; }
  const io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    steps.forEach((s, i) => setTimeout(() => s.classList.add("is-lit"), 200 + i * 320));
    io.disconnect();
  }, { threshold: 0.4 });
  io.observe(loop);
}

// Módulo type="module": se ejecuta con el DOM ya listo
initEmailLinks();
initI18n(); // primero: el resto pinta textos con el idioma ya decidido
initRewrite();
initReveal();
initCounters();
initProgram();
initScrollEffects();
initPricing();
initLoop();
const quiz = initQuiz();
initForm(quiz);
