const formulario = document.getElementById("formularioContacto");

formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre");
    const correo = document.getElementById("correo");
    const tipoConsulta = document.getElementById("tipoConsulta");
    const mensaje = document.getElementById("mensaje");
    const mensajeFormulario = document.getElementById("mensajeFormulario");

    let formularioValido = true;

    if (nombre.value.trim() === "") {
        nombre.classList.add("is-invalid");
        formularioValido = false;
    } else {
        nombre.classList.remove("is-invalid");
    }

    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoCorreo.test(correo.value.trim())) {
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

    if (mensaje.value.trim() === "") {
        mensaje.classList.add("is-invalid");
        formularioValido = false;
    } else {
        mensaje.classList.remove("is-invalid");
    }

    if (formularioValido) {
        mensajeFormulario.textContent = "Gracias. Todos los campos son válidos.";
        mensajeFormulario.classList.remove("text-danger");
        mensajeFormulario.classList.add("text-success");
        formulario.reset();
    } else {
        mensajeFormulario.textContent = "Revisa los campos marcados e intenta nuevamente.";
        mensajeFormulario.classList.remove("text-success");
        mensajeFormulario.classList.add("text-danger");
    }
});