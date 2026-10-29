const formularioContacto = document.getElementById("formularioContacto");

if (formularioContacto) {
    const nombre = document.getElementById("nombre");
    const correo = document.getElementById("correo");
    const tipoConsulta = document.getElementById("tipoConsulta");
    const mensaje = document.getElementById("mensaje");
    const mensajeFormulario = document.getElementById("mensajeFormulario");
    const botonEnviar = formularioContacto.querySelector('button[type="submit"]');
    const contenidoOriginalBoton = botonEnviar.innerHTML;
    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    formularioContacto.addEventListener("submit", async function (event) {
        event.preventDefault();

        const nombreValido = nombre.value.trim() !== "";
        const correoValido = formatoCorreo.test(correo.value.trim()) && correo.validity.valid;
        const tipoConsultaValido = tipoConsulta.value !== "";
        const mensajeValido = mensaje.value.trim() !== "";

        nombre.classList.toggle("is-invalid", !nombreValido);
        correo.classList.toggle("is-invalid", !correoValido);
        tipoConsulta.classList.toggle("is-invalid", !tipoConsultaValido);
        mensaje.classList.toggle("is-invalid", !mensajeValido);
        formularioContacto.classList.add("was-validated");

        mensajeFormulario.classList.remove("text-success", "text-danger");
        mensajeFormulario.textContent = "";

        if (
            !nombreValido ||
            !correoValido ||
            !tipoConsultaValido ||
            !mensajeValido ||
            !formularioContacto.checkValidity()
        ) {
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
