const productos = [];

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
    if (producto.foto) {
        const imagen = document.createElement("img");
        imagen.className = "productos-portada";
        imagen.src = producto.foto;
        imagen.alt = "Portada de " + producto.nombre;
        celdaFoto.append(imagen);
    } else {
        const portada = document.createElement("span");
        portada.className = "productos-portada productos-portada-sin-imagen";
        portada.textContent = producto.nombre.slice(0, 2).toUpperCase();
        celdaFoto.append(portada);
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

function agregarProducto(event) {
    event.preventDefault();

    const formulario = event.currentTarget;
    const archivoActivo = document.querySelector("#fotoProductoArchivoPane").classList.contains("active");
    const archivo = document.querySelector("#productoFotoArchivo").files[0];
    const url = document.querySelector("#productoFotoUrl").value.trim();
    let foto = "";

    if (archivoActivo) {
        if (archivo) {
            foto = URL.createObjectURL(archivo);
        }
    } else {
        foto = url;
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

    productos.push(producto);
    buscador.value = "";
    filtro.value = "todos";
    paginaActual = Math.ceil(productos.length / productosPorPagina);
    mostrarProductos();
    console.log(JSON.stringify(productos, null, 2));
    formulario.reset();

    bootstrap.Modal.getOrCreateInstance(document.querySelector("#modalNuevoProducto")).hide();
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
mostrarProductos();
