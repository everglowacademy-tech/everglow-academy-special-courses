// =========================================================================
// legal.js — páginas de Privacy y Terms: muestra el bloque del idioma elegido,
// traduce los textos cortos (data-lang-text) y resalta la sección del índice
// que se está leyendo.
// =========================================================================
import { currentLang, setLang, initLangSwitch, reveal } from "./lang.js";

function apply(lang) {
  document.querySelectorAll("[data-lang-block]").forEach((b) => (b.hidden = b.dataset.langBlock !== lang));
  document.querySelectorAll("[data-lang-text]").forEach((el) => {
    try { el.textContent = JSON.parse(el.dataset.langText)[lang]; } catch { /* JSON mal formado: se deja el inglés */ }
  });
  const h1 = document.querySelector(`[data-lang-block="${lang}"] h1`);
  if (h1) document.title = `${h1.textContent} — Everglow Academy`;
  watchSections();
}

// Los enlaces desde la landing apuntan a #refunds, #price…; en español los ids llevan "es-"
function scrollToHash() {
  const id = location.hash.slice(1);
  if (!id) return;
  const target = document.getElementById(currentLang() === "es" && !id.startsWith("es-") ? `es-${id}` : id);
  target?.scrollIntoView();
}

// Índice: marca la sección visible
let io;
function watchSections() {
  io?.disconnect();
  const block = document.querySelector("[data-lang-block]:not([hidden])");
  if (!block || !("IntersectionObserver" in window)) return;
  const links = new Map([...block.querySelectorAll(".legal__toc a")].map((a) => [a.getAttribute("href").slice(1), a]));
  io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => a.removeAttribute("aria-current"));
      links.get(e.target.id)?.setAttribute("aria-current", "true");
    });
  }, { rootMargin: "0px 0px -70% 0px" });
  block.querySelectorAll("h2[id]").forEach((h) => io.observe(h));
}

initLangSwitch();
document.addEventListener("langchange", (e) => apply(e.detail.lang));
setLang(currentLang(), { save: false });
reveal();
scrollToHash();
