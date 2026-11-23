/**
 * @file main.js
 * @description Lógica del lado del cliente para GlitchZero:
 *  1. Menú hamburguesa interactivo para dispositivos móviles (evento click).
 *  2. Validación integral del formulario de solicitud de diagnóstico (#diagnostic-form)
 *     con retroalimentación visual por campo, alertas globales y folio de pre-registro.
 * @version 1.0.0
 */

document.addEventListener("DOMContentLoaded", () => {
    initMobileMenu();
    initDiagnosticFormValidation();
});

/**
 * Inicializa el menú hamburguesa desplegable en vista móvil usando el evento 'click'.
 * @returns {void}
 */
function initMobileMenu() {
    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");

    if (!menuToggle || !navMenu) return;

    menuToggle.addEventListener("click", (event) => {
        event.stopPropagation();
        const isOpen = navMenu.classList.toggle("active");
        menuToggle.classList.toggle("active", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Cerrar el menú al seleccionar cualquiera de los enlaces
    navMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("active");
            menuToggle.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });

    // Cerrar el menú al hacer clic fuera de él
    document.addEventListener("click", (event) => {
        if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
            navMenu.classList.remove("active");
            menuToggle.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
        }
    });

    // Cerrar con la tecla Escape para accesibilidad
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && navMenu.classList.contains("active")) {
            navMenu.classList.remove("active");
            menuToggle.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.focus();
        }
    });
}

/**
 * Inicializa la validación completa de los campos del formulario de diagnóstico
 * antes de permitir su envío.
 * @returns {void}
 */
function initDiagnosticFormValidation() {
    const form = document.getElementById("diagnostic-form");
    if (!form) return;

    const nombreInput = document.getElementById("nombre");
    const telefonoInput = document.getElementById("telefono");
    const equipoSelect = document.getElementById("equipo");
    const servicioSelect = document.getElementById("servicio");
    const descripcionTextarea = document.getElementById("descripcion");
    const politicasCheckbox = document.getElementById("politicas");
    const formAlert = document.getElementById("form-alert");
    const resultadoOutput = document.getElementById("resultado-solicitud");

    const regexNombre = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]{3,80}$/;

    const setFieldError = (field, errorId, message) => {
        const errorEl = document.getElementById(errorId);
        field.classList.remove("input-success");
        field.classList.add("input-error");
        field.setAttribute("aria-invalid", "true");
        if (errorEl) errorEl.textContent = message;
    };

    const setFieldSuccess = (field, errorId) => {
        const errorEl = document.getElementById(errorId);
        field.classList.remove("input-error");
        field.classList.add("input-success");
        field.setAttribute("aria-invalid", "false");
        if (errorEl) errorEl.textContent = "";
    };

    const showGlobalAlert = (type, message) => {
        if (!formAlert) return;
        formAlert.className = "form-alert";
        formAlert.classList.add(type === "success" ? "alert-success" : "alert-error");
        formAlert.textContent = message;
    };

    const validateNombre = () => {
        const value = nombreInput.value.trim();
        if (!value) {
            setFieldError(nombreInput, "error-nombre", "El nombre completo es obligatorio.");
            return false;
        }
        if (!regexNombre.test(value)) {
            setFieldError(
                nombreInput,
                "error-nombre",
                "Ingresa un nombre válido (entre 3 y 80 letras, sin números ni símbolos)."
            );
            return false;
        }
        setFieldSuccess(nombreInput, "error-nombre");
        return true;
    };

    const validateTelefono = () => {
        const rawValue = telefonoInput.value.trim();
        const digitsOnly = rawValue.replace(/^\+52/, "").replace(/[\s\-()]/g, "");

        if (!rawValue) {
            setFieldError(telefonoInput, "error-telefono", "El teléfono / WhatsApp es obligatorio.");
            return false;
        }
        if (!/^\d{10}$/.test(digitsOnly)) {
            setFieldError(
                telefonoInput,
                "error-telefono",
                "El teléfono debe tener exactamente 10 dígitos numéricos (ej. 4771234567)."
            );
            return false;
        }
        setFieldSuccess(telefonoInput, "error-telefono");
        return true;
    };

    const validateEquipo = () => {
        if (!equipoSelect.value) {
            setFieldError(equipoSelect, "error-equipo", "Selecciona la consola o dispositivo a revisar.");
            return false;
        }
        setFieldSuccess(equipoSelect, "error-equipo");
        return true;
    };

    const validateServicio = () => {
        if (!servicioSelect.value) {
            setFieldError(servicioSelect, "error-servicio", "Selecciona el tipo de servicio requerido.");
            return false;
        }
        setFieldSuccess(servicioSelect, "error-servicio");
        return true;
    };

    const validateDescripcion = () => {
        const value = descripcionTextarea.value.trim();
        if (!value) {
            setFieldError(
                descripcionTextarea,
                "error-descripcion",
                "La descripción de la falla y accesorios es obligatoria."
            );
            return false;
        }
        if (value.length < 15) {
            setFieldError(
                descripcionTextarea,
                "error-descripcion",
                `Describe con mayor detalle la falla (mínimo 15 caracteres; llevas ${value.length}).`
            );
            return false;
        }
        if (value.length > 500) {
            setFieldError(
                descripcionTextarea,
                "error-descripcion",
                "La descripción no debe exceder los 500 caracteres."
            );
            return false;
        }
        setFieldSuccess(descripcionTextarea, "error-descripcion");
        return true;
    };

    const validatePoliticas = () => {
        const errorEl = document.getElementById("error-politicas");
        if (!politicasCheckbox.checked) {
            politicasCheckbox.setAttribute("aria-invalid", "true");
            if (errorEl) {
                errorEl.textContent =
                    "Debes aceptar las políticas del taller y la cláusula de resguardo de 30 días.";
            }
            return false;
        }
        politicasCheckbox.setAttribute("aria-invalid", "false");
        if (errorEl) errorEl.textContent = "";
        return true;
    };

    // Validación en tiempo real al interactuar con cada campo
    nombreInput.addEventListener("blur", validateNombre);
    telefonoInput.addEventListener("blur", validateTelefono);
    equipoSelect.addEventListener("change", validateEquipo);
    servicioSelect.addEventListener("change", validateServicio);
    descripcionTextarea.addEventListener("blur", validateDescripcion);
    politicasCheckbox.addEventListener("change", validatePoliticas);

    // Validación completa al enviar el formulario
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const isNombreOk = validateNombre();
        const isTelefonoOk = validateTelefono();
        const isEquipoOk = validateEquipo();
        const isServicioOk = validateServicio();
        const isDescripcionOk = validateDescripcion();
        const isPoliticasOk = validatePoliticas();

        const isFormValid =
            isNombreOk &&
            isTelefonoOk &&
            isEquipoOk &&
            isServicioOk &&
            isDescripcionOk &&
            isPoliticasOk;

        if (!isFormValid) {
            showGlobalAlert(
                "error",
                "No se pudo enviar la solicitud. Revisa y corrige los campos marcados en rojo."
            );
            if (resultadoOutput) resultadoOutput.innerHTML = "";

            const firstInvalid = form.querySelector(".input-error, [aria-invalid='true']");
            if (firstInvalid) firstInvalid.focus();
            return;
        }

        // Capturar datos limpios antes de reiniciar el formulario
        const cliente = nombreInput.value.trim();
        const telefono = telefonoInput.value.trim();
        const equipo = equipoSelect.value;
        const servicio = servicioSelect.value;
        const folio = `GZ-2026-${Math.floor(1000 + Math.random() * 9000)}`;

        showGlobalAlert(
            "success",
            `¡Solicitud registrada con éxito, ${cliente}! Tu folio de pre-registro es ${folio}.`
        );

        if (resultadoOutput) {
            resultadoOutput.innerHTML = `
                <div class="receipt-card">
                    <h3>Comprobante de Pre-registro: ${folio}</h3>
                    <p><strong>Cliente:</strong> ${cliente} (${telefono})</p>
                    <p><strong>Equipo registrado:</strong> ${equipo}</p>
                    <p><strong>Servicio solicitado:</strong> ${servicio}</p>
                    <p><strong>Modalidad:</strong> Pago 100% contra entrega tras prueba en mostrador (Av. Tecnológico #415, Local 4).</p>
                </div>
            `;
        }

        form.reset();
        form.querySelectorAll(".input-success").forEach((el) => el.classList.remove("input-success"));
    });
}
