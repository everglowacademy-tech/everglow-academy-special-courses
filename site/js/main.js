// =========================================================================
// main.js — movimiento de la página y el hero interactivo.
// Todo respeta prefers-reduced-motion: si está activo, se muestra el estado
// final sin animar.
// =========================================================================
import { initQuiz } from "./quiz.js";
import { initForm } from "./form.js";

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
    status.textContent = mode === "clear"
      ? `Point-first version. ${wordsBefore} words before the point. The room replies: ${REPLIES.clear.map((r) => r[1]).join(" ")}`
      : `Buried version. ${wordsBefore} words before the point. The room replies: ${REPLIES.buried.map((r) => r[1]).join(" ")}`;
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
   4. Línea de tiempo + barra de lectura (un solo manejador de scroll)
   --------------------------------------------------------------------------- */
function initScrollEffects() {
  const bar = $(".read-progress span");
  const timeline = $("#timeline");
  const items = timeline ? $$(".timeline__item", timeline) : [];
  let now = null;

  if (timeline) {
    const line = document.createElement("span");
    line.className = "timeline__progress";
    line.setAttribute("aria-hidden", "true");
    timeline.prepend(line);

    // Indicador grande del módulo activo, junto al título (solo escritorio)
    now = document.createElement("p");
    now.className = "program__now";
    now.setAttribute("aria-hidden", "true");
    now.innerHTML = "<b>00</b><span></span>";
    $("#program .section__head")?.append(now);
  }

  let active = -1;
  let ticking = false;

  function update() {
    ticking = false;
    const doc = document.documentElement;
    const max = doc.scrollHeight - innerHeight;
    if (bar) bar.style.setProperty("--progress", max > 0 ? (scrollY / max).toFixed(4) : 0);

    if (!timeline) return;
    const r = timeline.getBoundingClientRect();
    const focus = innerHeight * 0.55;
    const p = Math.min(1, Math.max(0, (focus - r.top) / r.height));
    timeline.style.setProperty("--timeline", p.toFixed(4));

    let idx = -1;
    items.forEach((it, i) => { if (it.getBoundingClientRect().top < focus) idx = i; });
    if (idx !== active) {
      active = idx;
      items.forEach((it, i) => {
        it.classList.toggle("is-active", i === idx);
        it.classList.toggle("is-passed", i < idx);
      });
      if (now && idx >= 0) {
        $("b", now).textContent = $(".timeline__num", items[idx]).textContent;
        $("span", now).textContent = $("h3", items[idx]).textContent;
      }
    }
  }

  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll, { passive: true });
  update();
}

/* ---------------------------------------------------------------------------
   5. Barra de inscripción pegajosa: visible después del hero y
      oculta cuando el formulario ya está en pantalla
   --------------------------------------------------------------------------- */
function initEnrollBar() {
  const barEl = $("#enroll-bar");
  const hero = $(".hero");
  const form = $("#enroll");
  if (!barEl || !hero || !("IntersectionObserver" in window)) return;
  const link = $("a", barEl);
  let heroVisible = true;
  let formVisible = false;

  const sync = () => {
    const show = !heroVisible && !formVisible;
    barEl.classList.toggle("is-visible", show);
    barEl.setAttribute("aria-hidden", String(!show));
    link.tabIndex = show ? 0 : -1;
  };
  new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; sync(); }, { threshold: 0 }).observe(hero);
  if (form) new IntersectionObserver(([e]) => { formVisible = e.isIntersecting; sync(); }, { threshold: 0.05 }).observe(form);
}

/* ---------------------------------------------------------------------------
   6. Logos institucionales: en pantallas táctiles (sin hover) se encienden
      al entrar en pantalla
   --------------------------------------------------------------------------- */
function initPartners() {
  if (!window.matchMedia("(hover: none)").matches || !("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => e.target.classList.toggle("is-lit", e.isIntersecting));
  }, { threshold: 1, rootMargin: "-25% 0px -25% 0px" });
  $$(".partner").forEach((el) => io.observe(el));
}

// Módulo type="module": se ejecuta con el DOM ya listo
initRewrite();
initReveal();
initCounters();
initScrollEffects();
initEnrollBar();
initPartners();
const quiz = initQuiz();
initForm(quiz);
