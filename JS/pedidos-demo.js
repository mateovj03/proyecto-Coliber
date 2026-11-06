// Pedidos ficticios para mostrar la tabla y probar el filtro de estado.
const pedidosDemo = [
    { fecha: "2026-11-06", referencia: "COL-1001", producto: "Cien años de soledad", cantidad: 2, precio: 58000, promo: 10000, cliente: "Laura Gómez", estado: "Pagada" },
    { fecha: "2026-11-05", referencia: "COL-1002", producto: "El principito", cantidad: 1, precio: 32000, promo: 0, cliente: "Andrés Rojas", estado: "Espera" },
    { fecha: "2026-11-05", referencia: "COL-1003", producto: "Hábitos atómicos", cantidad: 1, precio: 69000, promo: 5000, cliente: "Camila Torres", estado: "Facturada" },
    { fecha: "2026-11-04", referencia: "COL-1004", producto: "La sombra del viento", cantidad: 1, precio: 52000, promo: 0, cliente: "Juan Pérez", estado: "Cancelada" },
    { fecha: "2026-11-04", referencia: "COL-1005", producto: "Sapiens", cantidad: 2, precio: 74000, promo: 0, cliente: "Sofía Ramírez", estado: "Interno" },
    { fecha: "2026-11-03", referencia: "COL-1006", producto: "Orgullo y prejuicio", cantidad: 1, precio: 45000, promo: 45000, cliente: "Mateo Díaz", estado: "Cortesía" },
    { fecha: "2026-11-03", referencia: "COL-1007", producto: "Los juegos del hambre", cantidad: 3, precio: 50000, promo: 15000, cliente: "Valentina Ruiz", estado: "Pagada" },
    { fecha: "2026-11-02", referencia: "COL-1008", producto: "El poder del ahora", cantidad: 1, precio: 62000, promo: 0, cliente: "Daniel Castro", estado: "Anulada" }
];

const tablaPedidos = document.querySelector(".vista-pedidos .productos-tabla tbody");
const buscarPedido = document.querySelector("#buscar-pedido");
const filtroEstado = document.querySelector("#filtro-estado");
const resumenPedidos = document.querySelector(".vista-pedidos .productos-resumen");
const [anteriorPedido, siguientePedido] = document.querySelectorAll(".vista-pedidos .productos-pagina");
const formatoPesos = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
});

const pedidosPorPagina = 5;
let paginaPedidos = 1;

function celdaPedido(fila, texto, clase = "") {
    const celda = document.createElement("td");
    celda.textContent = texto;
    if (clase) celda.className = clase;
    fila.append(celda);
    return celda;
}

function mostrarPedidos() {
    const texto = buscarPedido.value.trim().toLocaleLowerCase("es");
    const encontrados = pedidosDemo.filter((pedido) => {
        const coincideTexto = [pedido.referencia, pedido.producto, pedido.cliente]
            .some((dato) => dato.toLocaleLowerCase("es").includes(texto));
        const coincideEstado = filtroEstado.value === "todos" || pedido.estado === filtroEstado.value;
        return coincideTexto && coincideEstado;
    });

    const totalPaginas = Math.ceil(encontrados.length / pedidosPorPagina);
    paginaPedidos = Math.min(paginaPedidos, Math.max(totalPaginas, 1));
    const inicio = (paginaPedidos - 1) * pedidosPorPagina;
    const visibles = encontrados.slice(inicio, inicio + pedidosPorPagina);
    tablaPedidos.replaceChildren();

    if (visibles.length === 0) {
        const fila = document.createElement("tr");
        const mensaje = pedidosDemo.length === 0
            ? "Aún no hay pedidos para mostrar."
            : "No hay pedidos que coincidan con los filtros.";
        const celda = celdaPedido(fila, mensaje, "productos-vacio");
        celda.colSpan = 9;
        tablaPedidos.append(fila);
    }

    visibles.forEach((pedido) => {
        const fila = document.createElement("tr");
        const [anio, mes, dia] = pedido.fecha.split("-");
        celdaPedido(fila, `${dia}/${mes}/${anio}`);
        celdaPedido(fila, pedido.referencia, "pedido-referencia");
        celdaPedido(fila, pedido.producto);
        celdaPedido(fila, pedido.cantidad);
        celdaPedido(fila, formatoPesos.format(pedido.precio));
        celdaPedido(fila, formatoPesos.format(pedido.promo));
        celdaPedido(fila, formatoPesos.format(pedido.cantidad * pedido.precio - pedido.promo), "pedido-total");
        celdaPedido(fila, pedido.cliente);

        const estado = celdaPedido(fila, "");
        const etiqueta = document.createElement("span");
        const claseEstado = pedido.estado.toLocaleLowerCase("es")
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        etiqueta.className = `pedido-estado ${claseEstado}`;
        etiqueta.textContent = pedido.estado;
        estado.append(etiqueta);
        tablaPedidos.append(fila);
    });

    const primero = encontrados.length === 0 ? 0 : inicio + 1;
    const ultimo = Math.min(inicio + pedidosPorPagina, encontrados.length);
    resumenPedidos.textContent = `Mostrando ${primero}–${ultimo} de ${encontrados.length} pedidos`;
    anteriorPedido.disabled = paginaPedidos === 1;
    siguientePedido.disabled = paginaPedidos >= totalPaginas;
}

buscarPedido.addEventListener("input", () => {
    paginaPedidos = 1;
    mostrarPedidos();
});

filtroEstado.addEventListener("change", () => {
    paginaPedidos = 1;
    mostrarPedidos();
});

anteriorPedido.addEventListener("click", () => {
    paginaPedidos--;
    mostrarPedidos();
});

siguientePedido.addEventListener("click", () => {
    paginaPedidos++;
    mostrarPedidos();
});

mostrarPedidos();
