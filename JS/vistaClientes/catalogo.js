const listaCatalogo = document.querySelector("#catalogo-lista");
const mensajeVacio = document.querySelector("#catalogo-vacio");
const contadorCatalogo = document.querySelector("#catalogo-contador");
const buscarCatalogo = document.querySelector("#catalogo-buscar");
const filtroGenero = document.querySelector("#catalogo-genero");
const precioCatalogo = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
});

function crearTexto(etiqueta, clase, contenido) {
    const elemento = document.createElement(etiqueta);
    elemento.className = clase;
    elemento.textContent = contenido;
    return elemento;
}

function crearTarjeta(libro) {
    const tarjeta = document.createElement("article");
    tarjeta.className = "catalogo-tarjeta";
    const portada = document.createElement("div");
    portada.className = "catalogo-portada";

    function mostrarIniciales() {
        portada.replaceChildren(crearTexto("span", "", libro.nombre.slice(0, 2).toUpperCase()));
    }

    if (libro.foto) {
        const imagen = document.createElement("img");
        imagen.src = libro.foto;
        imagen.alt = "Portada de " + libro.nombre;
        imagen.loading = "lazy";
        imagen.onerror = mostrarIniciales;
        portada.append(imagen);
    } else {
        mostrarIniciales();
    }

    const categoria = crearTexto("p", "catalogo-categoria", libro.categoria);
    const nombre = crearTexto("h2", "", libro.nombre);
    const autor = crearTexto("p", "catalogo-autor", libro.autor);
    const datos = document.createElement("div");
    datos.className = "catalogo-datos";
    const stock = Number(libro.stock);
    const disponibilidad = crearTexto("span", "catalogo-stock", stock > 0 ? stock + " disponibles" : "Agotado");
    if (stock === 0) disponibilidad.classList.add("agotado");
    datos.append(disponibilidad);
    const precio = crearTexto("strong", "catalogo-precio", precioCatalogo.format(Number(libro.precio)));

    tarjeta.append(portada, categoria, nombre, autor, datos, precio);
    return tarjeta;
}

function actualizarGeneros(libros) {
    const seleccionado = filtroGenero.value;
    const generos = [...new Set(libros.map((libro) => String(libro.categoria || "").trim()).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b, "es"));
    const opciones = [new Option("Todos los géneros", "todos")];
    generos.forEach((genero) => opciones.push(new Option(genero, genero)));
    filtroGenero.replaceChildren(...opciones);
    filtroGenero.value = generos.includes(seleccionado) ? seleccionado : "todos";
}

function mostrarCatalogo() {
    const libros = window.ColiberLibros.leer()
        .filter((libro) => libro && typeof libro.nombre === "string")
        .reverse();
    actualizarGeneros(libros);
    const busqueda = buscarCatalogo.value.trim().toLocaleLowerCase("es");
    const visibles = libros.filter((libro) => {
        const coincideGenero = filtroGenero.value === "todos" || String(libro.categoria || "").trim() === filtroGenero.value;
        const coincideTexto = [libro.nombre, libro.autor, libro.categoria]
            .some((dato) => String(dato || "").toLocaleLowerCase("es").includes(busqueda));
        return coincideGenero && coincideTexto;
    });

    listaCatalogo.replaceChildren();
    const tarjetas = document.createDocumentFragment();
    visibles.forEach((libro) => tarjetas.append(crearTarjeta(libro)));
    listaCatalogo.append(tarjetas);
    contadorCatalogo.textContent = visibles.length + (visibles.length === 1 ? " libro" : " libros");

    mensajeVacio.hidden = visibles.length > 0;
    if (visibles.length === 0) {
        mensajeVacio.querySelector("h2").textContent = libros.length === 0
            ? "Aún no hay libros para mostrar"
            : "No encontramos libros con esos filtros";
        mensajeVacio.querySelector("p").textContent = libros.length === 0
            ? "Vuelve pronto para descubrir nuevas lecturas."
            : "Prueba otra búsqueda o cambia el género.";
    }
}

document.querySelector("#catalogo-buscar-form").addEventListener("submit", (evento) => {
    evento.preventDefault();
    mostrarCatalogo();
});
buscarCatalogo.addEventListener("input", mostrarCatalogo);

filtroGenero.addEventListener("change", mostrarCatalogo);

window.addEventListener("storage", (evento) => {
    if (evento.key === window.ColiberLibros.clave) mostrarCatalogo();
});
mostrarCatalogo();
