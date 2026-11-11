let productos = window.ColiberLibros.leer();

const cuerpoTabla = document.querySelector(".productos-tabla tbody");
const buscador = document.querySelector("#buscar-producto");
const filtro = document.querySelector("#filtro-productos");
const resumen = document.querySelector(".productos-resumen");
const botonesPaginacion = document.querySelectorAll(".productos-pagina");
const botonAnterior = botonesPaginacion[0];
const botonSiguiente = botonesPaginacion[1];
const precioColombiano = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
});
const productosPorPagina = 5;
let paginaActual = 1;

function agregarCelda(fila, texto, clase) {
    const celda = document.createElement("td");
    celda.textContent = texto;
    if (clase) {
        celda.className = clase;
    }
    fila.append(celda);
    return celda;
}

function crearFilaVacia(mensaje, sinProductos) {
    const fila = document.createElement("tr");
    const celda = agregarCelda(fila, "", "productos-vacio");
    celda.colSpan = 8;

    if (sinProductos) {
        const icono = document.createElement("i");
        icono.className = "bi bi-journal-bookmark";
        icono.setAttribute("aria-hidden", "true");

        const titulo = document.createElement("strong");
        titulo.textContent = "Aún no hay libros para mostrar";

        const descripcion = document.createElement("span");
        descripcion.textContent = "Cuando agregues libros, aparecerán aquí con su precio y stock.";
        celda.append(icono, titulo, descripcion);
    } else {
        celda.textContent = mensaje;
    }

    cuerpoTabla.append(fila);
}

function crearFilaProducto(producto) {
    const fila = document.createElement("tr");
    agregarCelda(fila, String(producto.id));

    const celdaFoto = agregarCelda(fila, "");
    function mostrarPortadaGenerica() {
        const portada = document.createElement("span");
        portada.className = "productos-portada productos-portada-sin-imagen";
        portada.textContent = producto.nombre.slice(0, 2).toUpperCase();
        celdaFoto.append(portada);
    }

    if (producto.foto) {
        const imagen = document.createElement("img");
        imagen.className = "productos-portada";
        imagen.src = producto.foto;
        imagen.alt = "Portada de " + producto.nombre;
        imagen.onerror = function () {
            imagen.remove();
            mostrarPortadaGenerica();
        };
        celdaFoto.append(imagen);
    } else {
        mostrarPortadaGenerica();
    }

    agregarCelda(fila, producto.categoria);
    agregarCelda(fila, producto.nombre, "productos-nombre");
    agregarCelda(fila, producto.autor);
    agregarCelda(fila, precioColombiano.format(producto.precio));

    const celdaStock = agregarCelda(fila, "");
    const etiquetaStock = document.createElement("span");
    etiquetaStock.className = "productos-stock";
    if (producto.stock === 0) {
        etiquetaStock.classList.add("agotado");
        etiquetaStock.textContent = "Agotado";
    } else {
        etiquetaStock.textContent = producto.stock + " disponibles";
    }
    celdaStock.append(etiquetaStock);

    const celdaAcciones = agregarCelda(fila, "");
    const botonEditar = document.createElement("button");
    botonEditar.type = "button";
    botonEditar.className = "productos-accion-demo";
    botonEditar.textContent = "Editar";
    botonEditar.disabled = true;
    botonEditar.title = "Acción de muestra";
    celdaAcciones.append(botonEditar);

    cuerpoTabla.append(fila);
}

function filtrarProductos() {
    const busqueda = buscador.value.trim().toLocaleLowerCase("es");

    return productos.filter(function (producto) {
        const datosProducto = [producto.nombre, producto.autor, producto.categoria];
        const coincideTexto = datosProducto.some(function (dato) {
            return dato.toLocaleLowerCase("es").includes(busqueda);
        });
        let coincideStock = true;

        if (filtro.value === "disponibles") {
            coincideStock = producto.stock > 0;
        } else if (filtro.value === "agotados") {
            coincideStock = producto.stock === 0;
        }

        return coincideTexto && coincideStock;
    });
}

function mostrarProductos() {
    const productosFiltrados = filtrarProductos();
    const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);

    if (totalPaginas === 0) {
        paginaActual = 1;
    } else if (paginaActual > totalPaginas) {
        paginaActual = totalPaginas;
    }

    const inicio = (paginaActual - 1) * productosPorPagina;
    const productosVisibles = productosFiltrados.slice(inicio, inicio + productosPorPagina);
    cuerpoTabla.replaceChildren();

    if (productosVisibles.length === 0) {
        if (productos.length === 0) {
            crearFilaVacia("", true);
        } else {
            crearFilaVacia("No hay libros que coincidan con la búsqueda.", false);
        }
    } else {
        productosVisibles.forEach(crearFilaProducto);
    }

    let primero = 0;
    if (productosFiltrados.length > 0) {
        primero = inicio + 1;
    }
    const ultimo = Math.min(inicio + productosPorPagina, productosFiltrados.length);
    resumen.textContent = "Mostrando " + primero + "–" + ultimo + " de "
        + productosFiltrados.length + " productos";
    botonAnterior.disabled = paginaActual === 1;
    botonSiguiente.disabled = paginaActual >= totalPaginas;
}

// Reduce la imagen antes de guardarla. Las URLs temporales de archivo no sobreviven a una recarga.
function prepararImagen(archivo) {
    return new Promise(function (resolver, rechazar) {
        if (!["image/png", "image/jpeg", "image/webp"].includes(archivo.type)) {
            rechazar(new Error("Selecciona una imagen PNG, JPG o WebP."));
            return;
        }

        const lector = new FileReader();
        lector.onerror = function () { rechazar(new Error("No se pudo leer la imagen.")); };
        lector.onload = function () {
            const imagen = new Image();
            imagen.onerror = function () { rechazar(new Error("No se pudo abrir la imagen.")); };
            imagen.onload = function () {
                try {
                    const escala = Math.min(1, 600 / imagen.width, 800 / imagen.height);
                    const lienzo = document.createElement("canvas");
                    lienzo.width = Math.max(1, Math.round(imagen.width * escala));
                    lienzo.height = Math.max(1, Math.round(imagen.height * escala));
                    const dibujo = lienzo.getContext("2d");
                    dibujo.fillStyle = "#ffffff";
                    dibujo.fillRect(0, 0, lienzo.width, lienzo.height);
                    dibujo.drawImage(imagen, 0, 0, lienzo.width, lienzo.height);
                    resolver(lienzo.toDataURL("image/jpeg", 0.78));
                } catch {
                    rechazar(new Error("No se pudo preparar la imagen. Prueba con otro archivo."));
                }
            };
            imagen.src = lector.result;
        };
        lector.readAsDataURL(archivo);
    });
}

async function agregarProducto(event) {
    event.preventDefault();

    const formulario = event.currentTarget;
    const mensajeError = document.querySelector("#producto-error");
    mensajeError.hidden = true;
    const archivoActivo = document.querySelector("#fotoProductoArchivoPane").classList.contains("active");
    const archivo = document.querySelector("#productoFotoArchivo").files[0];
    const url = document.querySelector("#productoFotoUrl").value.trim();

    try {
        let foto = "";
        if (archivoActivo && archivo) {
            foto = await prepararImagen(archivo);
        } else if (!archivoActivo && url) {
            const direccion = new URL(url);
            if (!["http:", "https:"].includes(direccion.protocol)) {
                throw new Error("La URL de la portada debe empezar por http:// o https://.");
            }
            foto = direccion.href;
        }

        const producto = {
            id: document.querySelector("#productoId").value.trim(),
            foto: foto,
            categoria: document.querySelector("#productoCategoria").value.trim(),
            nombre: document.querySelector("#productoNombre").value.trim(),
            autor: document.querySelector("#productoAutor").value.trim(),
            precio: Number(document.querySelector("#productoPrecio").value),
            stock: Number(document.querySelector("#productoStock").value)
        };

        if (!producto.id || !producto.categoria || !producto.nombre || !producto.autor) {
            throw new Error("Completa los datos del libro antes de guardarlo.");
        }

        if (productos.some(function (libro) { return String(libro.id) === producto.id; })) {
            throw new Error("Ya existe un libro con ese ID.");
        }

        const nuevosProductos = [...productos, producto];
        window.ColiberLibros.guardar(nuevosProductos);
        productos = nuevosProductos;
        buscador.value = "";
        filtro.value = "todos";
        paginaActual = Math.ceil(productos.length / productosPorPagina);
        mostrarProductos();
        formulario.reset();
        if (window.bootstrap) {
            window.bootstrap.Modal.getOrCreateInstance(document.querySelector("#modalNuevoProducto")).hide();
        }
    } catch (error) {
        if (error.name === "QuotaExceededError") {
            mensajeError.textContent = "El navegador no tiene espacio para otra portada. Usa una URL o una imagen más pequeña.";
        } else if (error instanceof TypeError) {
            mensajeError.textContent = "La URL de la portada no es válida.";
        } else {
            mensajeError.textContent = error.message || "No se pudo guardar el libro.";
        }
        mensajeError.hidden = false;
    }
}

buscador.addEventListener("input", function () {
    paginaActual = 1;
    mostrarProductos();
});

filtro.addEventListener("change", function () {
    paginaActual = 1;
    mostrarProductos();
});

botonAnterior.addEventListener("click", function () {
    if (paginaActual > 1) {
        paginaActual--;
        mostrarProductos();
    }
});

botonSiguiente.addEventListener("click", function () {
    const totalPaginas = Math.ceil(filtrarProductos().length / productosPorPagina);
    if (paginaActual < totalPaginas) {
        paginaActual++;
        mostrarProductos();
    }
});

document.querySelector("#formNuevoProducto").addEventListener("submit", agregarProducto);
window.addEventListener("storage", function (event) {
    if (event.key === window.ColiberLibros.clave) {
        productos = window.ColiberLibros.leer();
        mostrarProductos();
    }
});
mostrarProductos();
