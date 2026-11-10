// Local storage compartido
(function () {
    const CLAVE_LIBROS = "coliber-libros-v1";
    const CLAVE_CARGA_INICIAL = "coliber-libros-iniciales-v1";
    const LIBROS_INICIALES = [
        {
            id: 01,
            categoria: "Novela",
            nombre: "Cien años de soledad",
            autor: "Gabriel García Márquez",
            precio: 58000,
            stock: 12,
            foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuXbtEFUOUZoIQF5EusFjLySqDOJQOn0UMSI1ABJgXAUy0SPB1n7U3AWg&s=10"
        },
        {
            id: 02,
            categoria: "Novela",
            nombre: "La sombra del viento",
            autor: "Carlos Ruiz Zafón",
            precio: 52000,
            stock: 7,
            foto: "https://www.planetadelibros.com.mx/usuaris/libros/fotos/142/original/portada_la-sombra-del-viento_carlos-ruiz-zafon_201608051859.jpg"
        },
        {
            id: 03,
            categoria: "Desarrollo personal",
            nombre: "Hábitos atómicos",
            autor: "James Clear",
            precio: 69000,
            stock: 0,
            foto: "https://images.cdn3.buscalibre.com/fit-in/360x360/cc/ba/ccba2ff79ff5b56b6ea5fd6ed89ffe1b.jpg"
        },
        {
            id: 04,
            categoria: "Infantil",
            nombre: "El principito",
            autor: "Antoine de Saint-Exupéry",
            precio: 32000,
            stock: 23,
            foto: "https://images.cdn2.buscalibre.com/fit-in/360x360/d9/1f/d91fe3e3e534deec6995a67458a17126.jpg"
        },
        {
            id: 05,
            categoria: "Historia",
            nombre: "Sapiens",
            autor: "Yuval Noah Harari",
            precio: 74000,
            stock: 4,
            foto: "https://images.cdn3.buscalibre.com/fit-in/660x660/6c/02/6c0237449459de3e1be4328378fb2b13.jpg"
        },
        {
            id: 06,
            categoria: "Clásicos",
            nombre: "Orgullo y prejuicio",
            autor: "Jane Austen",
            precio: 45000,
            stock: 0,
            foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSO8Ox8OXrDUhH8q_MdQ0MY_TUstB8PaQpOQxLpxnJsU2Ju-CcYooP9CA&s=10"
        },
        {
            id: 07,
            categoria: "Fantasía",
            nombre: "Los juegos del hambre",
            autor: "Suzanne Collins",
            precio: 50000,
            stock: 9,
            foto: "https://www.exlibris.com.co/imagenes/9786287/978628775012.JPG"
        },
        {
            id: 08,
            categoria: "Desarrollo personal",
            nombre: "El poder del ahora",
            autor: "Eckhart Tolle",
            precio: 62000,
            stock: 3,
            foto: "https://images.cdn3.buscalibre.com/fit-in/660x660/1f/31/1f314eb5b2c37514a3c766f0dc5aa9f5.jpg"
        }
    ];
    
    function leer() {
        try {
            const guardado = localStorage.getItem(CLAVE_LIBROS);

            if (!guardado) {
                return [];
            }

            const libros = JSON.parse(guardado);

            if (Array.isArray(libros)) {
                return libros;
            }

            return [];
        } catch {
            return [];
        }
    }

    function guardar(libros) {
        localStorage.setItem(CLAVE_LIBROS, JSON.stringify(libros));
    }

    function cargarLibrosIniciales() {
        try {
            const guardado = localStorage.getItem(CLAVE_LIBROS);
            if (guardado !== null && localStorage.getItem(CLAVE_CARGA_INICIAL) === "1") {
                return;
            }

            const libros = leer();
            const idsGuardados = new Set(libros.map((libro) => String(libro.id)));
            const faltantes = LIBROS_INICIALES.filter((libro) => !idsGuardados.has(String(libro.id)));
            guardar([...faltantes, ...libros]);
            localStorage.setItem(CLAVE_CARGA_INICIAL, "1");
        } catch {
        }
    }
    cargarLibrosIniciales();
    window.ColiberLibros = { clave: CLAVE_LIBROS, leer, guardar };
})();
