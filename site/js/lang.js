// =========================================================================
// lang.js — idioma de la página (inglés / español).
// Lo usan la landing y las páginas legales.
// Prioridad: ?lang=es en la URL → elección guardada → idioma del navegador.
// =========================================================================
const KEY = "eg-lang";
const SUPPORTED = ["en", "es"];

export function getLang() {
  let l = null;
  try { l = new URLSearchParams(location.search).get("lang"); } catch { /* sin URL */ }
  if (!SUPPORTED.includes(l)) {
    try { l = localStorage.getItem(KEY); } catch { l = null; }
  }
  if (!SUPPORTED.includes(l)) l = (navigator.language || "").slice(0, 2) === "es" ? "es" : "en";
  return l;
}

let current = getLang();
export const currentLang = () => current;

export function setLang(l, { save = true } = {}) {
  if (!SUPPORTED.includes(l)) return;
  current = l;
  if (save) { try { localStorage.setItem(KEY, l); } catch { /* sin almacenamiento */ } }
  document.documentElement.lang = l;
  document.querySelectorAll("[data-set-lang]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.setLang === l)));
  document.dispatchEvent(new CustomEvent("langchange", { detail: { lang: l } }));
}

// Conecta los botones EN / ES
export function initLangSwitch() {
  document.querySelectorAll("[data-set-lang]").forEach((b) => {
    b.setAttribute("aria-pressed", String(b.dataset.setLang === current));
    b.addEventListener("click", () => { if (b.dataset.setLang !== current) setLang(b.dataset.setLang); });
  });
}

// Quita el velo que evita ver el inglés un instante antes del español
export function reveal() {
  document.documentElement.classList.remove("i18n-pending");
}
