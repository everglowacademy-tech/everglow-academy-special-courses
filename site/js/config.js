// =========================================================================
// config.js — lo que se cambia sin tocar el resto del código.
// =========================================================================

// Google Apps Script que guarda la inscripción en la hoja y envía el aviso.
// Si publicas una nueva versión del script con otra URL, cámbiala aquí.
export const FORM_ENDPOINT = "https://script.google.com/macros/s/AKfycbyuH-Lq-faXVelThc0ouWbTUsxd38CPKE8hbNTMTOPMkiVpx92-I8RmQDmAOBhZ1j6h/exec";

// [PENDIENTE] Debe ser EXACTAMENTE el mismo texto que el TOKEN del Apps Script.
// Ojo: este valor es visible para cualquiera que mire el código de la página.
// No es una contraseña: solo filtra envíos automáticos que no vengan de la landing.
export const FORM_TOKEN = "everglow-2026-CAMBIA-ESTO";

// Versión de los Términos que la persona acepta (se guarda con cada inscripción).
// Cámbiala cada vez que modifiques terms.html o privacy.html.
export const TERMS_VERSION = "2026-09-25";

// Correo de contacto y de pago por Zelle
export const CONTACT_EMAIL = "everglowacademy@gmail.com";

// [PENDIENTE] Página del programa general de inglés, para quien sale por debajo de B2
export const GENERAL_PROGRAM_URL = "";

// Clave con la que se guarda el autodiagnóstico en el navegador
export const SELF_CHECK_KEY = "eg-lie-self-check";
