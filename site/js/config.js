// =========================================================================
// config.js — lo que se cambia sin tocar el resto del código.
// =========================================================================

// URL del Google Apps Script que guarda la inscripción en la hoja de cálculo
// y envía el correo de aviso. Pégala entre las comillas.
// Cómo obtenerla: en Apps Script → Implementar → Gestionar implementaciones →
// copia la "URL de la aplicación web" (termina en /exec).
//
// Para usar otro servicio en su lugar:
//   · Formspree: "https://formspree.io/f/TU_ID" y pon FORM_MODE = "cors".
//   · Webhook (Make, Zapier, n8n…): la URL del webhook y FORM_MODE = "cors".
// Si la dejas vacía, el formulario ofrece enviar la inscripción por correo (mailto).
export const FORM_ENDPOINT = "";

// "no-cors" para Google Apps Script (no devuelve cabeceras CORS: no podemos leer
// la respuesta, así que damos el envío por bueno si la red no falla).
// "cors" para Formspree o webhooks que sí responden con CORS.
export const FORM_MODE = "no-cors";

// Correo de contacto y de pago por Zelle
export const CONTACT_EMAIL = "everglowacademy@gmail.com";

// [PENDIENTE] Página del programa general de inglés, para quien sale por debajo de B2
export const GENERAL_PROGRAM_URL = "";

// Montos que aparecen en el mensaje de éxito según la opción de pago
export const PAYMENT_AMOUNTS = {
  "One payment — $500 USD": "$500 USD",
  "3 installments — $175 USD each": "your first installment of $175 USD",
};

// Clave con la que se guarda el autodiagnóstico en el navegador
export const SELF_CHECK_KEY = "eg-lie-self-check";
