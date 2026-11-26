document.addEventListener("DOMContentLoaded", () => {
    const formularioLogin = document.getElementById("form-login");

    if (!formularioLogin) {
        return;
    }

    const correo = document.getElementById("login-email");
    const contrasena = document.getElementById("login-password");
    const errorCorreo = document.getElementById("login-email-error");
    const errorContrasena = document.getElementById("login-password-error");
    const mensajeLogin = document.getElementById("mensajeLogin");
    const claveRegistros = "coliber-registros-v1";
    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    formularioLogin.addEventListener("submit", (event) => {
        event.preventDefault();

        const correoIngresado = correo.value.trim().toLowerCase();
        const contrasenaIngresada = contrasena.value;
        const correoValido = formatoCorreo.test(correoIngresado) && correo.validity.valid;
        const contrasenaValida = contrasenaIngresada !== "";

        correo.classList.toggle("is-invalid", !correoValido);
        contrasena.classList.toggle("is-invalid", !contrasenaValida);
        correo.setAttribute("aria-invalid", String(!correoValido));
        contrasena.setAttribute("aria-invalid", String(!contrasenaValida));
        errorCorreo.textContent = correoIngresado === ""
            ? "Ingresa tu correo electronico."
            : "Ingresa un correo electronico valido.";
        errorContrasena.textContent = "Ingresa tu contrasena.";
        mensajeLogin.classList.remove("text-success", "text-danger");

        if (!correoValido || !contrasenaValida || !formularioLogin.checkValidity()) {
            mensajeLogin.classList.add("text-danger");
            mensajeLogin.textContent = "Revisa los campos marcados e intenta nuevamente.";
            return;
        }

        let registros;

        try {
            const guardados = localStorage.getItem(claveRegistros);
            registros = guardados ? JSON.parse(guardados) : [];
        } catch (error) {
            console.error("No se pudieron leer los registros:", error);
            mensajeLogin.classList.add("text-danger");
            mensajeLogin.textContent = "No se pudieron validar tus datos. Intenta nuevamente.";
            return;
        }

        const usuarioEncontrado = Array.isArray(registros)
            && registros.find((registro) =>
                registro.correo
                && registro.correo.toLowerCase() === correoIngresado
                && registro.contrasena === contrasenaIngresada
            );

        if (!usuarioEncontrado) {
            correo.classList.add("is-invalid");
            contrasena.classList.add("is-invalid");
            mensajeLogin.classList.add("text-danger");
            mensajeLogin.textContent = "El correo o la contrasena no son validos.";
            return;
        }

        correo.classList.remove("is-invalid");
        contrasena.classList.remove("is-invalid");
        correo.removeAttribute("aria-invalid");
        contrasena.removeAttribute("aria-invalid");
        localStorage.setItem("usuarioNombre", usuarioEncontrado.nombre);
        localStorage.setItem("usuarioCorreo", usuarioEncontrado.correo);
        mensajeLogin.textContent = "";
        formularioLogin.reset();
        alert("Inicio de sesión exitoso.");

        const offcanvasUnete = document.getElementById("offcanvasUnete");
        if (offcanvasUnete && window.bootstrap) {
            window.bootstrap.Offcanvas.getOrCreateInstance(offcanvasUnete).hide();
        }
    });
});
