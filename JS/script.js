// Envio formulario a Formspree
const formularioContacto = document.getElementById("formularioContacto");

if (formularioContacto) {
    const mensajeFormulario = document.getElementById("mensajeFormulario");
    const botonEnviar = formularioContacto.querySelector('button[type="submit"]');
    const contenidoOriginalBoton = botonEnviar.innerHTML;

    formularioContacto.addEventListener("submit", async function (evento) {
        evento.preventDefault();

        if (!formularioContacto.checkValidity()) {
            formularioContacto.classList.add("was-validated");
            return;
        }

        botonEnviar.disabled = true;
        botonEnviar.textContent = "Enviando...";
        mensajeFormulario.textContent = "";

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
                throw new Error("Formspree no pudo procesar el formulario.");
            }

            mensajeFormulario.classList.remove("text-danger");
            mensajeFormulario.classList.add("text-success");
            mensajeFormulario.textContent = "¡Mensaje enviado correctamente! Pronto nos pondremos en contacto.";

            formularioContacto.reset();
            formularioContacto.classList.remove("was-validated");
        } catch (error) {
            mensajeFormulario.classList.remove("text-success");
            mensajeFormulario.classList.add("text-danger");
            mensajeFormulario.textContent = "No pudimos enviar el mensaje. Inténtalo nuevamente.";
        } finally {
            botonEnviar.disabled = false;
            botonEnviar.innerHTML = contenidoOriginalBoton;
        }
    });
}