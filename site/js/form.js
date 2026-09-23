// =========================================================================
// form.js — inscripción: validación en vivo, antispam, envío y respaldo mailto.
// El endpoint y el modo de envío se configuran en config.js.
// =========================================================================
import { FORM_ENDPOINT, FORM_MODE, CONTACT_EMAIL, PAYMENT_AMOUNTS } from "./config.js";
import { summarize } from "./quiz.js";

// Reglas de validación: devuelven el mensaje de error o "" si está bien
const RULES = {
  name: (v) => {
    if (!v.trim()) return "Please enter your full name.";
    if (v.trim().split(/\s+/).length < 2) return "Please enter your first and last name.";
    return "";
  },
  email: (v) => {
    if (!v.trim()) return "Please enter your email.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return "That email doesn’t look right. Check for typos, e.g. name@company.com.";
    return "";
  },
  phone: (v) => {
    if (!v.trim()) return "Please enter a phone or WhatsApp number.";
    const digits = v.replace(/\D/g, "");
    if (!/^\+?[\d\s().-]+$/.test(v.trim()) || digits.length < 8 || digits.length > 15) return "Include your country code, e.g. +58 412 555 0100.";
    return "";
  },
  country: (v) => (v.trim().length < 2 ? "Please enter your country." : ""),
  payment: (_, form) => (form.querySelector('input[name="payment"]:checked') ? "" : "Choose how you’d like to pay."),
  terms: (_, form) => (form.querySelector("#f-terms").checked ? "" : "Please accept the Terms of Use and the Privacy Policy to continue."),
};

export function initForm(quiz) {
  const form = document.getElementById("enroll-form");
  if (!form) return;
  const status = document.getElementById("form-status");
  const submit = document.getElementById("f-submit");
  const success = document.getElementById("form-success");
  const selfField = document.getElementById("f-selfcheck");
  const selfNote = document.getElementById("form-selfcheck");
  const mailtoLink = document.getElementById("mailto-fallback");

  // ---- Autodiagnóstico adjunto ----
  function syncSelfCheck(result) {
    selfField.value = summarize(result);
    if (!result) { selfNote.hidden = true; return; }
    selfNote.hidden = false;
    selfNote.innerHTML = "";
    selfNote.append(`Your self-check result (“${result.label}”) will be sent with your registration. `);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "Don’t include it";
    btn.addEventListener("click", () => { selfField.value = ""; selfNote.hidden = true; });
    selfNote.append(btn);
  }
  syncSelfCheck(quiz?.get?.());
  quiz?.onChange?.(syncSelfCheck);

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

  function validate(key) {
    const el = fieldEls[key];
    const msg = RULES[key](el.value ?? "", form);
    errEl(key).textContent = msg;
    if (key === "payment") {
      el.classList.toggle("is-invalid", !!msg);
      form.querySelectorAll('input[name="payment"]').forEach((r) => r.setAttribute("aria-invalid", String(!!msg)));
    } else {
      el.setAttribute("aria-invalid", String(!!msg));
    }
    return !msg;
  }

  // Valida al salir del campo; después, en cada cambio (sin molestar mientras se escribe la primera vez)
  ["name", "email", "phone", "country"].forEach((key) => {
    const el = fieldEls[key];
    el.addEventListener("blur", () => { if (el.value || el.classList.contains("is-touched")) { el.classList.add("is-touched"); validate(key); } });
    el.addEventListener("input", () => { if (el.classList.contains("is-touched")) validate(key); updateMailto(); });
  });
  form.querySelectorAll('input[name="payment"]').forEach((r) => r.addEventListener("change", () => { validate("payment"); updateMailto(); }));
  fieldEls.terms.addEventListener("change", () => validate("terms"));

  // ---- Respaldo sin backend: mailto prellenado con lo que haya escrito ----
  function data() {
    const fd = new FormData(form);
    return {
      name: (fd.get("name") || "").toString().trim(),
      email: (fd.get("email") || "").toString().trim(),
      phone: (fd.get("phone") || "").toString().trim(),
      country: (fd.get("country") || "").toString().trim(),
      payment: (fd.get("payment") || "").toString(),
      terms: fd.get("terms") ? "accepted" : "",
      self_check: (fd.get("self_check") || "").toString(),
      company_website: (fd.get("company_website") || "").toString(),
    };
  }
  function mailtoHref() {
    const d = data();
    const body = [
      "Hello Everglow Academy,",
      "",
      "I’d like to register for Leading in English: Communication Tools for Global Energy Leaders.",
      "",
      `Full name: ${d.name}`,
      `Email: ${d.email}`,
      `Phone / WhatsApp: ${d.phone}`,
      `Country: ${d.country}`,
      `Payment option: ${d.payment}`,
      d.self_check ? `\n${d.self_check}` : "",
    ].join("\n");
    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Registration — Leading in English")}&body=${encodeURIComponent(body)}`;
  }
  function updateMailto() { mailtoLink.href = mailtoHref(); }
  updateMailto();

  // ---- Estados ----
  function setLoading(on) {
    submit.disabled = on;
    submit.classList.toggle("is-loading", on);
    submit.querySelector(".btn__label").textContent = on ? "Sending…" : "Register";
    form.setAttribute("aria-busy", String(on));
  }

  function showSuccess(d) {
    const first = d.name.split(/\s+/)[0];
    document.getElementById("success-name").textContent = first ? `, ${first}` : "";
    document.getElementById("success-amount").textContent = PAYMENT_AMOUNTS[d.payment] || "your payment";
    form.hidden = true;
    mailtoLink.parentElement.hidden = true;
    success.hidden = false;
    success.focus();
    success.scrollIntoView({ block: "center", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }

  function showError(html) {
    status.innerHTML = html;
  }

  // ---- Envío ----
  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    status.textContent = "";

    const keys = Object.keys(RULES);
    const bad = keys.filter((k) => !validate(k));
    ["name", "email", "phone", "country"].forEach((k) => fieldEls[k].classList.add("is-touched"));
    if (bad.length) {
      status.textContent = bad.length === 1 ? "Please fix 1 field below." : `Please fix ${bad.length} fields below.`;
      const first = fieldEls[bad[0]];
      (first.matches("fieldset") ? first.querySelector("input") : first).focus();
      return;
    }

    const d = data();

    // Honeypot relleno: fingimos éxito y no enviamos nada
    if (d.company_website) { showSuccess(d); return; }

    // Sin endpoint configurado: el respaldo es el correo
    if (!FORM_ENDPOINT) {
      showError(`Online registration isn’t connected yet. <a href="${mailtoHref()}">Send your registration by email</a> — it’s already filled in.`);
      status.querySelector("a").focus();
      return;
    }

    setLoading(true);
    const payload = new URLSearchParams({
      name: d.name, email: d.email, phone: d.phone, country: d.country,
      payment: d.payment, terms: d.terms, self_check: d.self_check,
      course: "Leading in English", submitted_at: new Date().toISOString(),
      page: location.href,
    });

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        mode: FORM_MODE,
        body: payload,
        headers: FORM_MODE === "cors" ? { Accept: "application/json" } : undefined,
      });
      // En "no-cors" la respuesta es opaca: si la red no falló, la damos por buena
      if (FORM_MODE === "cors" && !res.ok) throw new Error(`HTTP ${res.status}`);
      showSuccess(d);
    } catch (err) {
      console.error("Registration failed:", err);
      showError(`We couldn’t send your registration. Check your connection and try again, or <a href="${mailtoHref()}">send it by email</a> — it’s already filled in.`);
      status.querySelector("a").focus();
    } finally {
      setLoading(false);
    }
  });
}
