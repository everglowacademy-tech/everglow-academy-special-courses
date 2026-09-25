// =========================================================================
// form.js — inscripción: validación en vivo, antispam, envío al Apps Script
// y respaldo por correo. La URL, el token y la versión de términos están en config.js.
// =========================================================================
import { FORM_ENDPOINT, FORM_TOKEN, TERMS_VERSION, CONTACT_EMAIL } from "./config.js";
import { summarize, labelOf } from "./quiz.js";
import { t } from "./i18n.js";
import { currentLang } from "./lang.js";

// Envío al Apps Script. Content-Type text/plain a propósito: con application/json
// el navegador hace una petición OPTIONS previa que Apps Script no responde (CORS).
async function sendEnrollment(payload) {
  const res = await fetch(FORM_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(Object.assign({ token: FORM_TOKEN }, payload)),
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || "error");
  return data;
}

// Origen de la visita: utm_source (y utm_campaign) si vienen en la URL; si no, "landing"
function sourceFromUrl() {
  try {
    const p = new URLSearchParams(location.search);
    const src = p.get("utm_source");
    if (!src) return "landing";
    return [src, p.get("utm_medium"), p.get("utm_campaign")].filter(Boolean).join(" / ");
  } catch { return "landing"; }
}

// Reglas de validación: devuelven la clave del error o "" si está bien
const RULES = {
  name: (v) => (!v.trim() ? "form.err.name" : v.trim().split(/\s+/).length < 2 ? "form.err.name2" : ""),
  email: (v) => (!v.trim() ? "form.err.email" : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "form.err.email2" : ""),
  phone: (v) => {
    if (!v.trim()) return "form.err.phone";
    const digits = v.replace(/\D/g, "");
    return !/^\+?[\d\s().-]+$/.test(v.trim()) || digits.length < 8 || digits.length > 15 ? "form.err.phone2" : "";
  },
  country: (v) => (v.trim().length < 2 ? "form.err.country" : ""),
  payment: (_, form) => (form.querySelector('input[name="payment"]:checked') ? "" : "form.err.payment"),
  terms: (_, form) => (form.querySelector("#f-terms").checked ? "" : "form.err.terms"),
};

export function initForm(quiz) {
  const form = document.getElementById("enroll-form");
  if (!form) return;
  const status = document.getElementById("form-status");
  const submit = document.getElementById("f-submit");
  const success = document.getElementById("form-success");
  const selfNote = document.getElementById("form-selfcheck");
  const fallback = document.querySelector(".form__fallback");

  // ---- Autodiagnóstico adjunto ----
  let includeSelfCheck = true;
  function syncSelfCheck() {
    const r = quiz?.get?.();
    if (!r || !includeSelfCheck) { selfNote.hidden = true; return; }
    selfNote.hidden = false;
    selfNote.textContent = `${t("form.selfcheck", { label: labelOf(r) })} `;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = t("form.selfcheckRemove");
    btn.addEventListener("click", () => { includeSelfCheck = false; syncSelfCheck(); });
    selfNote.append(btn);
  }
  quiz?.onChange?.(() => { includeSelfCheck = true; syncSelfCheck(); });
  syncSelfCheck();

  // ---- Validación por campo ----
  const fieldEls = {
    name: form.elements.name,
    email: form.elements.email,
    phone: form.elements.phone,
    country: form.elements.country,
    payment: form.querySelector(".field--radios"),
    terms: form.querySelector("#f-terms"),
  };
  const errEl = (key) => document.getElementById(`f-${key}-err`);
  const errors = {}; // clave del error mostrado por campo (para re-traducirlo)

  function validate(key) {
    const el = fieldEls[key];
    const errKey = RULES[key](el.value ?? "", form);
    errors[key] = errKey;
    errEl(key).textContent = errKey ? t(errKey) : "";
    if (key === "payment") {
      el.classList.toggle("is-invalid", !!errKey);
      form.querySelectorAll('input[name="payment"]').forEach((r) => r.setAttribute("aria-invalid", String(!!errKey)));
    } else {
      el.setAttribute("aria-invalid", String(!!errKey));
    }
    return !errKey;
  }

  // Valida al salir del campo; después, en cada cambio
  ["name", "email", "phone", "country"].forEach((key) => {
    const el = fieldEls[key];
    el.addEventListener("blur", () => { if (el.value || el.classList.contains("is-touched")) { el.classList.add("is-touched"); validate(key); } });
    el.addEventListener("input", () => { if (el.classList.contains("is-touched")) validate(key); updateMailto(); });
  });
  form.querySelectorAll('input[name="payment"]').forEach((r) => r.addEventListener("change", () => { validate("payment"); updateMailto(); }));
  fieldEls.terms.addEventListener("change", () => validate("terms"));

  // ---- Datos ----
  function data() {
    const fd = new FormData(form);
    const get = (k) => (fd.get(k) || "").toString().trim();
    const r = quiz?.get?.();
    return {
      name: get("name"),
      email: get("email"),
      phone: get("phone"),
      country: get("country"),
      payment: get("payment"),                 // siempre en inglés: "One payment — $500 USD" o "3 installments — $175 USD each"
      selfCheck: includeSelfCheck ? summarize(r) : "",
      website: get("website"),                 // honeypot
      source: sourceFromUrl(),
      lang: currentLang(),                     // idioma en que se llenó el formulario
      termsVersion: TERMS_VERSION,             // versión de los términos aceptados
      termsAcceptedAt: new Date().toISOString(),
    };
  }

  // ---- Respaldo sin backend: mailto prellenado ----
  function mailtoHref() {
    const d = data();
    const body = [
      t("mail.intro"),
      "",
      `${t("mail.name")}: ${d.name}`,
      `${t("mail.email")}: ${d.email}`,
      `${t("mail.phone")}: ${d.phone}`,
      `${t("mail.country")}: ${d.country}`,
      `${t("mail.payment")}: ${d.payment}`,
      d.selfCheck ? `\n${d.selfCheck}` : "",
    ].join("\n");
    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t("mail.subject"))}&body=${encodeURIComponent(body)}`;
  }
  // El enlace se vuelve a crear al cambiar de idioma, por eso se busca cada vez
  function updateMailto() { document.querySelectorAll(".js-mailto").forEach((a) => (a.href = mailtoHref())); }
  updateMailto();

  // ---- Estados ----
  let loading = false;
  function setLoading(on) {
    loading = on;
    submit.disabled = on;
    submit.classList.toggle("is-loading", on);
    submit.querySelector(".btn__label").textContent = on ? t("form.sending") : t("form.submit");
    form.setAttribute("aria-busy", String(on));
  }

  let statusKey = null; // para re-traducir el mensaje de estado
  function showStatus(key, vars) {
    statusKey = key ? [key, vars] : null;
    status.innerHTML = key ? t(key, vars) : "";
  }

  function showSuccess(d) {
    const first = d.name.split(/\s+/)[0];
    document.getElementById("success-name").textContent = first ? `, ${first}` : "";
    form.hidden = true;
    fallback.hidden = true;
    success.hidden = false;
    success.focus();
    success.scrollIntoView({ block: "center", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }

  // ---- Cambio de idioma: re-traduce errores y estados visibles ----
  document.addEventListener("langchange", () => {
    Object.entries(errors).forEach(([k, errKey]) => { errEl(k).textContent = errKey ? t(errKey) : ""; });
    if (statusKey) showStatus(statusKey[0], { ...statusKey[1], mailto: mailtoHref() });
    if (!loading) submit.querySelector(".btn__label").textContent = t("form.submit");
    syncSelfCheck();
    updateMailto();
  });

  // ---- Envío ----
  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    if (loading) return;
    showStatus(null);

    const bad = Object.keys(RULES).filter((k) => !validate(k));
    ["name", "email", "phone", "country"].forEach((k) => fieldEls[k].classList.add("is-touched"));
    if (bad.length) {
      showStatus(bad.length === 1 ? "form.fix1" : "form.fixN", { n: bad.length });
      const first = fieldEls[bad[0]];
      (first.matches("fieldset") ? first.querySelector("input") : first).focus();
      return;
    }

    const d = data();

    // Honeypot relleno: fingimos éxito y no enviamos nada
    if (d.website) { showSuccess(d); return; }

    if (!FORM_ENDPOINT) {
      showStatus("form.noEndpoint", { mailto: mailtoHref() });
      status.querySelector("a")?.focus();
      return;
    }

    setLoading(true);
    try {
      await sendEnrollment(d);
      showSuccess(d);
    } catch (err) {
      console.error("Registration failed:", err);
      showStatus("form.failed", { mailto: mailtoHref() });
      status.querySelector("a")?.focus();
    } finally {
      setLoading(false);
    }
  });
}
