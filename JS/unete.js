//NAVEGACIÓN ENTRE PANELES MODAL ÚNETE
document.addEventListener("DOMContentLoaded", () => {
    const botonRegistro = document.getElementById("register-btn");
    const botonLogin = document.getElementById("login-btn");
    const backButtons = document.querySelectorAll(".back-to-main-btn");
    
    const panelPrincipal = document.getElementById("panel-principal");
    const panelRegistro = document.getElementById("panel-registro");
    const panelLogin = document.getElementById("panel-login");
    const offcanvasUnete = document.getElementById("offcanvasUnete");

    function cambiarPanel(panelDestino) {
        if (panelPrincipal) panelPrincipal.classList.add("d-none");
        if (panelRegistro) panelRegistro.classList.add("d-none");
        if (panelLogin) panelLogin.classList.add("d-none");
        
        if (panelDestino) panelDestino.classList.remove("d-none");
    }

    if (botonRegistro && panelRegistro) {
        botonRegistro.addEventListener("click", () => {
            cambiarPanel(panelRegistro);
        });
    }

    if (botonLogin && panelLogin) {
        botonLogin.addEventListener("click", () => {
            cambiarPanel(panelLogin);
        });
    }

    backButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            cambiarPanel(panelPrincipal);
        });
    });

    if (offcanvasUnete) {
        offcanvasUnete.addEventListener("hidden.bs.offcanvas", () => {
            cambiarPanel(panelPrincipal);
        });
    }

    const formularioRegistro = document.getElementById("form-registro");
    if (formularioRegistro) {
        const nombre = document.getElementById("reg-nombre");
        const correo = document.getElementById("reg-email");
        const telefono = document.getElementById("reg-telefono");
        const password = document.getElementById("reg-password");
        const mensajeRegistro = document.getElementById("mensajeRegistro");
        const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const claveRegistros = "coliber-registros-v1";

        formularioRegistro.addEventListener("submit", (event) => {
            event.preventDefault();

            const digitosTelefono = telefono.value.replace(/\s/g, "");
            const nombreValido = nombre.value.trim() !== "";
            const correoValido = formatoCorreo.test(correo.value.trim()) && correo.validity.valid;
            const telefonoValido = digitosTelefono !== "" && /^\d+$/.test(digitosTelefono);
            const passwordValido = password.value.trim() !== "" && password.validity.valid;

            nombre.classList.toggle("is-invalid", !nombreValido);
            correo.classList.toggle("is-invalid", !correoValido);
            telefono.classList.toggle("is-invalid", !telefonoValido);
            password.classList.toggle("is-invalid", !passwordValido);

            mensajeRegistro.classList.remove("text-success", "text-danger");
            if (!nombreValido || !correoValido || !telefonoValido || !passwordValido
                || !formularioRegistro.checkValidity()) {
                mensajeRegistro.classList.add("text-danger");
                mensajeRegistro.textContent = "Revisa los campos marcados e intenta nuevamente.";
                return;
            }

            const registro = {
                nombre: nombre.value.trim(),
                correo: correo.value.trim(),
                telefono: telefono.value.trim(),
                contrasena: password.value
            };

            try {
                const guardados = localStorage.getItem(claveRegistros);
                const registros = guardados ? JSON.parse(guardados) : [];
                if (!Array.isArray(registros)) {
                    throw new Error("El almacenamiento de registros tiene un formato inválido.");
                }

                registros.push(registro);
                localStorage.setItem(claveRegistros, JSON.stringify(registros));
            } catch (error) {
                mensajeRegistro.classList.add("text-danger");
                if (error.name === "QuotaExceededError") {
                    mensajeRegistro.textContent = "No hay espacio disponible para guardar el registro.";
                } else if (error instanceof SyntaxError) {
                    mensajeRegistro.textContent = "No se pudieron leer los registros guardados.";
                } else {
                    mensajeRegistro.textContent = error.message || "No se pudo guardar el registro.";
                }
                return;
            }

            formularioRegistro.reset();
            [nombre, correo, telefono, password].forEach((campo) => {
                campo.classList.remove("is-invalid");
            });
            mensajeRegistro.classList.remove("text-success", "text-danger");
            mensajeRegistro.textContent = "";
            if (offcanvasUnete && window.bootstrap) {
                window.bootstrap.Offcanvas.getOrCreateInstance(offcanvasUnete).hide();
            }
        });
    }
});

//REGISTRATE
