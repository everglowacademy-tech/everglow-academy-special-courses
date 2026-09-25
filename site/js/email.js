// =========================================================================
// email.js — que los enlaces de correo siempre hagan algo.
// En celular, un mailto: abre la app de correo (Gmail, Mail…).
// En computadora, muchas veces no hay programa de correo configurado y el clic
// no hace nada; ahí abrimos Gmail web en una pestaña nueva, con destinatario,
// asunto y texto ya escritos.
// =========================================================================
const isDesktop = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

function gmailUrl(mailto) {
  const [to, query = ""] = mailto.replace(/^mailto:/i, "").split("?");
  const q = new URLSearchParams(query);
  const url = new URLSearchParams({ view: "cm", fs: "1", to: decodeURIComponent(to) });
  if (q.get("subject")) url.set("su", q.get("subject"));
  if (q.get("body")) url.set("body", q.get("body"));
  return `https://mail.google.com/mail/?${url}`;
}

export function initEmailLinks() {
  // Delegación: funciona también con enlaces que se crean después (cambio de idioma, mensajes del formulario)
  document.addEventListener("click", (e) => {
    const a = e.target.closest?.('a[href^="mailto:"]');
    if (!a || !isDesktop() || e.ctrlKey || e.metaKey || e.shiftKey) return;
    e.preventDefault();
    // Sin "noopener" en window.open porque entonces siempre devuelve null; se corta el vínculo a mano
    const win = window.open(gmailUrl(a.getAttribute("href")), "_blank");
    if (win) win.opener = null;
    else location.href = a.getAttribute("href"); // pestaña bloqueada: intenta el mailto normal
  });
}
