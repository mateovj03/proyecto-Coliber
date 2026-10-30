const formularioContacto = document.getElementById("formularioContacto");

if (formularioContacto) {
    const nombre = document.getElementById("nombre");
    const correo = document.getElementById("correo");
    const tipoConsulta = document.getElementById("tipoConsulta");
    const telefono = document.getElementById("telefono");
    const mensaje = document.getElementById("mensaje");
    const mensajeFormulario = document.getElementById("mensajeFormulario");
    const botonEnviar = formularioContacto.querySelector('button[type="submit"]');
    const contenidoOriginalBoton = botonEnviar.innerHTML;
    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    formularioContacto.addEventListener("submit", async function (event) {
        event.preventDefault();

        let formularioValido = true;
        const digitosTelefono = telefono.value.replace(/\s/g, "");

        if (nombre.value.trim() === "") {
            nombre.classList.add("is-invalid");
            formularioValido = false;
        } else {
            nombre.classList.remove("is-invalid");
        }

        if (!formatoCorreo.test(correo.value.trim()) || !correo.validity.valid) {
            correo.classList.add("is-invalid");
            formularioValido = false;
        } else {
            correo.classList.remove("is-invalid");
        }

        if (tipoConsulta.value === "") {
            tipoConsulta.classList.add("is-invalid");
            formularioValido = false;
        } else {
            tipoConsulta.classList.remove("is-invalid");
        }

        if (digitosTelefono !== "" && !/^\d+$/.test(digitosTelefono)) {
            telefono.classList.add("is-invalid");
            formularioValido = false;
        } else {
            telefono.classList.remove("is-invalid");
        }

        if (mensaje.value.trim() === "") {
            mensaje.classList.add("is-invalid");
            formularioValido = false;
        } else {
            mensaje.classList.remove("is-invalid");
        }

        mensajeFormulario.classList.remove("text-success", "text-danger");
        mensajeFormulario.textContent = "";

        if (!formularioValido || !formularioContacto.checkValidity()) {
            mensajeFormulario.classList.add("text-danger");
            mensajeFormulario.textContent = "Revisa los campos marcados e intenta nuevamente.";
            return;
        }

        botonEnviar.disabled = true;
        botonEnviar.textContent = "Enviando...";

        try {
            const datosFormulario = new FormData(formularioContacto);

            const respuesta = await fetch(formularioContacto.action, {
                method: "POST",
                body: datosFormulario,
                headers: {
                    Accept: "application/json"
                }
            });

            if (!respuesta.ok) {
                throw new Error("No se pudo procesar el formulario.");
            }

            mensajeFormulario.classList.remove("text-danger");
            mensajeFormulario.classList.add("text-success");
            mensajeFormulario.textContent = "¡Mensaje enviado correctamente! Pronto nos pondremos en contacto.";

            formularioContacto.reset();
            formularioContacto.classList.remove("was-validated");
        } catch {
            mensajeFormulario.classList.remove("text-success");
            mensajeFormulario.classList.add("text-danger");
            mensajeFormulario.textContent = "No pudimos enviar el mensaje. Inténtalo nuevamente.";
        } finally {
            botonEnviar.disabled = false;
            botonEnviar.innerHTML = contenidoOriginalBoton;
        }
    });
}
