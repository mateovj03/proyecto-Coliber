document.addEventListener("DOMContentLoaded", () => {
    const CLAVE_CARRITO = "coliber-carrito-v1";

    const contenedorCarrito = document.getElementById("cart-items");
    const totalCarritoElem = document.getElementById("cart-total");
    const btnVaciarCarrito = document.getElementById("clear-cart-btn");
    const btnCheckout = document.getElementById("checkout-btn");

    const precioColombiano = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    });

    function leerCarrito() {
        try {
            const guardado = localStorage.getItem(CLAVE_CARRITO);
            return guardado ? JSON.parse(guardado) : [];
        } catch {
            return [];
        }
    }

    function guardarCarrito(carrito) {
        localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
    }

    // Dibuja los productos en el offcanvas de Bootstrap
    function renderizarCarrito() {
        if (!contenedorCarrito) return;
        
        const carrito = leerCarrito();
        contenedorCarrito.innerHTML = "";

        if (carrito.length === 0) {
            contenedorCarrito.innerHTML = `
                <div class="text-center text-muted my-5">
                    <i class="bi bi-cart-x fs-1 d-block mb-2"></i>
                    <p>Tu carrito está vacío</p>
                </div>`;
            if (totalCarritoElem) totalCarritoElem.textContent = precioColombiano.format(0);
            return;
        }

        let total = 0;

        carrito.forEach(item => {
            const subtotalItem = item.precio * item.cantidad;
            total += subtotalItem;

            const divItem = document.createElement("div");
            divItem.className = "d-flex align-items-center justify-content-between mb-3 border-bottom border-secondary pb-3";
            divItem.innerHTML = `
                <div class="d-flex align-items-center gap-2">
                    <img src="${item.foto}" alt="${item.nombre}" style="width: 65px; height: 90px; object-fit: cover;" class="rounded bg-light">
                    <div>
                        <h6 class="mb-0 text-white text-truncate" style="max-width: 130px;">${item.nombre}</h6>
                        <small class="text-muted">${precioColombiano.format(item.precio)} c/u</small>
                    </div>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <button class="btn btn-sm btn-outline-light disminuir px-2 py-0" data-id="${item.id}">-</button>
                    <span class="text-white fw-bold">${item.cantidad}</span>
                    <button class="btn btn-sm btn-outline-light aumentar px-2 py-0" data-id="${item.id}">+</button>
                    <button class="btn btn-sm btn-outline-danger eliminar border-0" data-id="${item.id}" title="Eliminar"><i class="bi bi-trash"></i></button>
                </div>
            `;
            contenedorCarrito.appendChild(divItem);
        });

        if (totalCarritoElem) {
            totalCarritoElem.textContent = precioColombiano.format(total);
        }
    }

    window.ColiberCarrito = {
        actualizar: renderizarCarrito
    };

    // Modifica cantidades y sincroniza el stock con el almacenamiento general de Coliber
    function cambiarCantidad(idLibro, operacion) {
        let carrito = leerCarrito();
        let libros = window.ColiberLibros.leer();
        
        const libroInv = libros.find(l => String(l.id) === String(idLibro));
        const indexItem = carrito.findIndex(i => String(i.id) === String(idLibro));

        if (indexItem === -1 || !libroInv) return;

        if (operacion === 'aumentar') {
            if (libroInv.stock > 0) {
                carrito[indexItem].cantidad += 1;
                libroInv.stock -= 1; // Descuenta del stock global 
            } else {
                alert("¡No hay más stock disponible de este libro!");
                return;
            }
        } else if (operacion === 'disminuir') {
            carrito[indexItem].cantidad -= 1;
            libroInv.stock += 1; // Devuelve stock al inventario global

            if (carrito[indexItem].cantidad <= 0) {
                carrito.splice(indexItem, 1);
            }
        }

        guardarCarrito(carrito);
        window.ColiberLibros.guardar(libros);

        renderizarCarrito();
        if (typeof mostrarCatalogo === "function") mostrarCatalogo();
        if (typeof mostrarProductos === "function") mostrarProductos();
    }

    //  Eliminar un producto por completo del carrito
    function eliminarItem(idLibro) {
        let carrito = leerCarrito();
        let libros = window.ColiberLibros.leer();

        const indexItem = carrito.findIndex(i => String(i.id) === String(idLibro));
        const libroInv = libros.find(l => String(l.id) === String(idLibro));

        if (indexItem !== -1 && libroInv) {
            libroInv.stock += carrito[indexItem].cantidad; // Devuelve las unidades al stock
            carrito.splice(indexItem, 1);

            guardarCarrito(carrito);
            window.ColiberLibros.guardar(libros);

            renderizarCarrito();
            if (typeof mostrarCatalogo === "function") mostrarCatalogo();
            if (typeof mostrarProductos === "function") mostrarProductos();
        }
    }

    // Eventos de clic dentro del offcanvas
    if (contenedorCarrito) {
        contenedorCarrito.addEventListener("click", (e) => {
            const boton = e.target.closest("button");
            if (!boton) return;

            const idLibro = boton.getAttribute("data-id");
            if (!idLibro) return;

            if (boton.classList.contains("aumentar")) {
                cambiarCantidad(idLibro, 'aumentar');
            } else if (boton.classList.contains("disminuir")) {
                cambiarCantidad(idLibro, 'disminuir');
            } else if (boton.classList.contains("eliminar")) {
                eliminarItem(idLibro);
            }
        });
    }

    if (btnVaciarCarrito) {
        btnVaciarCarrito.addEventListener("click", () => {
            let carrito = leerCarrito();
            let libros = window.ColiberLibros.leer();

            carrito.forEach(item => {
                const libroInv = libros.find(l => String(l.id) === String(item.id));
                if (libroInv) libroInv.stock += item.cantidad;
            });

            guardarCarrito([]);
            window.ColiberLibros.guardar(libros);

            renderizarCarrito();
            if (typeof mostrarCatalogo === "function") mostrarCatalogo();
            if (typeof mostrarProductos === "function") mostrarProductos();
        });
    }

    if (btnCheckout) {
        btnCheckout.addEventListener("click", () => {
            const carrito = leerCarrito();
            if (carrito.length === 0) {
                alert("Tu carrito está vacío.");
                return;
            }
            alert("¡Compra finalizada con éxito! Gracias por tu pedido en Coliber.");
            guardarCarrito([]);
            renderizarCarrito();
        });
    }

    window.addEventListener("storage", (event) => {
        if (event.key === CLAVE_CARRITO) {
            renderizarCarrito();
        }
    });

    renderizarCarrito();
});