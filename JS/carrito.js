document.addEventListener("DOMContentLoaded", () => {
    const CLAVE_CARRITO = "coliber-carrito-v1";

    const contenedorCarrito = document.getElementById("cart-items");
    const contadorCarrito = document.getElementById("cart-counter"); // Elemento para cantidad de productos
    const totalCarritoElem = document.getElementById("cart-total");
    const btnVaciarCarrito = document.getElementById("clear-cart-btn");
    const btnCheckout = document.getElementById("checkout-btn");
    const panelCarrito = document.getElementById("offcanvasWithBothOptions");

    if (panelCarrito) {
        panelCarrito.addEventListener("show.bs.offcanvas", () => {
            document.body.classList.add("carrito-abierto");
        });
        panelCarrito.addEventListener("hidden.bs.offcanvas", () => {
            document.body.classList.remove("carrito-abierto");
        });
    }

    const precioColombiano = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    });

    function leerCarrito() {
        try {
            const guardado = localStorage.getItem(CLAVE_CARRITO);
            const carrito = guardado ? JSON.parse(guardado) : []; // Devuelve un array vacío si no hay datos
            return Array.isArray(carrito) ? carrito : []; // Asegura que siempre se devuelva un array
        } catch {
            return [];
        }
    }

    function guardarCarrito(carrito) {
        localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
    }

    // Dibuja los productos en el offcanvas de Bootstrap
    function renderizarCarrito() {
        
        const carrito = leerCarrito();
        const cantidadTotal = carrito.reduce((total, item) => total + (Number(item.cantidad) || 0), 0); // Suma la cantidad de cada item, asegurando que sea un número
        if (contadorCarrito) { // Actualiza el contador de productos en el carrito
            contadorCarrito.textContent = cantidadTotal; // Actualiza el número visible en el icono del carrito
            contadorCarrito.setAttribute("aria-label", `${cantidadTotal} productos en el carrito`); // Mejora de accesibilidad para lectores de pantalla
        }

        if (!contenedorCarrito) return; // Si no existe el contenedor, no hace nada
        contenedorCarrito.innerHTML = "";

        if (carrito.length === 0) {  // Si el carrito está vacío, muestra un mensaje
            contenedorCarrito.innerHTML = `
                <div class="cart-empty"> 
                    <i class="bi bi-cart-x" aria-hidden="true"></i>
                    <p>Tu carrito está vacío</p>
                </div>`;
            if (totalCarritoElem) totalCarritoElem.textContent = precioColombiano.format(0);
            return;
        }

        let total = 0;

        carrito.forEach(item => {
            const subtotalItem = item.precio * item.cantidad;
            total += subtotalItem;

            const portada = item.foto // Si hay foto, la muestra; si no, muestra un placeholder
                ? `<img src="${item.foto}" alt="Portada de ${item.nombre}" class="cart-item-image">` // Si hay foto, la muestra
                : '<div class="cart-item-image cart-item-placeholder" aria-hidden="true"><i class="bi bi-book"></i></div>'; // Si no hay foto, muestra un placeholder

            const divItem = document.createElement("div");
            divItem.className = "cart-item"; // Clase para cada item del carrito
            divItem.innerHTML = `
                <div class="cart-item-producto">
                    ${portada}
                    <div class="cart-item-info">
                        <h3 class="cart-item-name">${item.nombre}</h3>
                        <small class="cart-item-price">${precioColombiano.format(item.precio)} c/u</small>
                    </div>
                </div>
                <div class="cart-item-controls">
                    <button class="cart-quantity-button disminuir" type="button" data-id="${item.id}" aria-label="Disminuir cantidad">−</button>
                    <span class="cart-quantity">${item.cantidad}</span>
                    <button class="cart-quantity-button aumentar" type="button" data-id="${item.id}" aria-label="Aumentar cantidad">+</button>
                    <button class="cart-remove-button eliminar" type="button" data-id="${item.id}" aria-label="Eliminar del carrito"><i class="bi bi-trash" aria-hidden="true"></i></button>
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