// Libros de ejemplo: estos datos se reinician al recargar la página.
const librosDemo = [
    { id: 101, categoria: "Novela", nombre: "Cien años de soledad", autor: "Gabriel García Márquez", precio: 58000, stock: 12, portada: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuXbtEFUOUZoIQF5EusFjLySqDOJQOn0UMSI1ABJgXAUy0SPB1n7U3AWg&s=10" },
    { id: 102, categoria: "Novela", nombre: "La sombra del viento", autor: "Carlos Ruiz Zafón", precio: 52000, stock: 7, portada: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlCe9qFm4-fqfE8rhmmlW7yVRfTCqC9QN-0Pwj2uzRDysQjaKvD7LlxiY&s=10" },
    { id: 103, categoria: "Desarrollo personal", nombre: "Hábitos atómicos", autor: "James Clear", precio: 69000, stock: 0, portada: "https://images.cdn3.buscalibre.com/fit-in/360x360/cc/ba/ccba2ff79ff5b56b6ea5fd6ed89ffe1b.jpg" },
    { id: 104, categoria: "Infantil", nombre: "El principito", autor: "Antoine de Saint-Exupéry", precio: 32000, stock: 23, portada: "https://images.cdn2.buscalibre.com/fit-in/360x360/d9/1f/d91fe3e3e534deec6995a67458a17126.jpg" },
    { id: 105, categoria: "Historia", nombre: "Sapiens", autor: "Yuval Noah Harari", precio: 74000, stock: 4 },
    { id: 106, categoria: "Clásicos", nombre: "Orgullo y prejuicio", autor: "Jane Austen", precio: 45000, stock: 0 },
    { id: 107, categoria: "Fantasía", nombre: "Los juegos del hambre", autor: "Suzanne Collins", precio: 50000, stock: 9 },
    { id: 108, categoria: "Desarrollo personal", nombre: "El poder del ahora", autor: "Eckhart Tolle", precio: 62000, stock: 3 }
];

const cuerpoTabla = document.querySelector(".productos-tabla tbody");
const buscador = document.querySelector("#buscar-producto");
const filtro = document.querySelector("#filtro-productos");
const resumen = document.querySelector(".productos-resumen");
const [botonAnterior, botonSiguiente] = document.querySelectorAll(".productos-pagina");
const precioColombiano = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
});

const librosPorPagina = 5;
let paginaActual = 1;

function agregarCelda(fila, texto, clase = "") {
    const celda = document.createElement("td");
    celda.textContent = texto;
    if (clase) celda.className = clase;
    fila.append(celda);
    return celda;
}

function mostrarLibros() {
    const busqueda = buscador.value.trim().toLocaleLowerCase("es");
    const librosFiltrados = librosDemo.filter((libro) => {
        const coincideTexto = [libro.nombre, libro.autor, libro.categoria]
            .some((dato) => dato.toLocaleLowerCase("es").includes(busqueda));
        const coincideStock = filtro.value === "todos"
            || (filtro.value === "disponibles" && libro.stock > 0)
            || (filtro.value === "agotados" && libro.stock === 0);
        return coincideTexto && coincideStock;
    });

    const totalPaginas = Math.ceil(librosFiltrados.length / librosPorPagina);
    paginaActual = Math.min(paginaActual, Math.max(totalPaginas, 1));
    const inicio = (paginaActual - 1) * librosPorPagina;
    const librosVisibles = librosFiltrados.slice(inicio, inicio + librosPorPagina);
    cuerpoTabla.replaceChildren();

    if (librosVisibles.length === 0) {
        const fila = document.createElement("tr");
        const celda = agregarCelda(fila, "", "productos-vacio");
        celda.colSpan = 8;

        if (librosDemo.length === 0) {
            const icono = document.createElement("i");
            icono.className = "bi bi-journal-bookmark";
            icono.setAttribute("aria-hidden", "true");

            const titulo = document.createElement("strong");
            titulo.textContent = "Aún no hay libros para mostrar";

            const descripcion = document.createElement("span");
            descripcion.textContent = "Cuando agregues libros, aparecerán aquí con su precio y stock.";
            celda.append(icono, titulo, descripcion);
        } else {
            celda.textContent = "No hay libros que coincidan con la búsqueda.";
        }

        cuerpoTabla.append(fila);
    }

    librosVisibles.forEach((libro) => {
        const fila = document.createElement("tr");
        agregarCelda(fila, libro.id);

        const foto = agregarCelda(fila, "");

        if (libro.portada) {
            const portada = document.createElement("img");
            portada.className = "productos-portada";
            portada.src = libro.portada;
            portada.alt = `Portada de ${libro.nombre}`;
            foto.append(portada);
        } else {
            const portada = document.createElement("span");
            portada.className = "productos-portada productos-portada-sin-imagen";
            portada.textContent = libro.nombre.slice(0, 2).toUpperCase();
            foto.append(portada);
        }

        agregarCelda(fila, libro.categoria);
        agregarCelda(fila, libro.nombre, "productos-nombre");
        agregarCelda(fila, libro.autor);
        agregarCelda(fila, precioColombiano.format(libro.precio));

        const stock = agregarCelda(fila, "");
        const etiquetaStock = document.createElement("span");
        etiquetaStock.className = libro.stock > 0 ? "productos-stock" : "productos-stock agotado";
        etiquetaStock.textContent = libro.stock > 0 ? `${libro.stock} disponibles` : "Agotado";
        stock.append(etiquetaStock);

        const acciones = agregarCelda(fila, "");
        const editar = document.createElement("button");
        editar.type = "button";
        editar.className = "productos-accion-demo";
        editar.textContent = "Editar";
        editar.disabled = true;
        editar.title = "Acción de muestra";
        acciones.append(editar);
        cuerpoTabla.append(fila);
    });

    const primero = librosFiltrados.length === 0 ? 0 : inicio + 1;
    const ultimo = Math.min(inicio + librosPorPagina, librosFiltrados.length);
    resumen.textContent = `Mostrando ${primero}–${ultimo} de ${librosFiltrados.length} libros`;
    botonAnterior.disabled = paginaActual === 1;
    botonSiguiente.disabled = paginaActual >= totalPaginas;
}

buscador.addEventListener("input", () => {
    paginaActual = 1;
    mostrarLibros();
});

filtro.addEventListener("change", () => {
    paginaActual = 1;
    mostrarLibros();
});

botonAnterior.addEventListener("click", () => {
    paginaActual--;
    mostrarLibros();
});

botonSiguiente.addEventListener("click", () => {
    paginaActual++;
    mostrarLibros();
});

mostrarLibros();
