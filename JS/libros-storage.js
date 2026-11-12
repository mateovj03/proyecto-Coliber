// Local storage compartido
(function () {
    const CLAVE_LIBROS = "coliber-libros-v1";
    const CLAVE_CARGA_INICIAL = "coliber-libros-iniciales-v1";
    const LIBROS_INICIALES = [
        {
            id: 1,
            categoria: "Novela",
            nombre: "Cien años de soledad",
            autor: "Gabriel García Márquez",
            precio: 58000,
            stock: 12,
            foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuXbtEFUOUZoIQF5EusFjLySqDOJQOn0UMSI1ABJgXAUy0SPB1n7U3AWg&s=10"
        },
        {
            id: 2,
            categoria: "Novela",
            nombre: "La sombra del viento",
            autor: "Carlos Ruiz Zafón",
            precio: 52000,
            stock: 7,
            foto: "https://www.planetadelibros.com.mx/usuaris/libros/fotos/142/original/portada_la-sombra-del-viento_carlos-ruiz-zafon_201608051859.jpg"
        },
        {
            id: 3,
            categoria: "Desarrollo personal",
            nombre: "Hábitos atómicos",
            autor: "James Clear",
            precio: 69000,
            stock: 0,
            foto: "https://images.cdn3.buscalibre.com/fit-in/360x360/cc/ba/ccba2ff79ff5b56b6ea5fd6ed89ffe1b.jpg"
        },
        {
            id: 4,
            categoria: "Infantil",
            nombre: "El principito",
            autor: "Antoine de Saint-Exupéry",
            precio: 32000,
            stock: 23,
            foto: "https://images.cdn2.buscalibre.com/fit-in/360x360/d9/1f/d91fe3e3e534deec6995a67458a17126.jpg"
        },
        {
            id: 5,
            categoria: "Historia",
            nombre: "Sapiens",
            autor: "Yuval Noah Harari",
            precio: 74000,
            stock: 4,
            foto: "https://images.cdn3.buscalibre.com/fit-in/660x660/6c/02/6c0237449459de3e1be4328378fb2b13.jpg"
        },
        {
            id: 6,
            categoria: "Clásicos",
            nombre: "Orgullo y prejuicio",
            autor: "Jane Austen",
            precio: 45000,
            stock: 0,
            foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSO8Ox8OXrDUhH8q_MdQ0MY_TUstB8PaQpOQxLpxnJsU2Ju-CcYooP9CA&s=10"
        },
        {
            id: 7,
            categoria: "Fantasía",
            nombre: "Los juegos del hambre",
            autor: "Suzanne Collins",
            precio: 50000,
            stock: 9,
            foto: "https://www.exlibris.com.co/imagenes/9786287/978628775012.JPG"
        },
        {
            id: 8,
            categoria: "Desarrollo personal",
            nombre: "El poder del ahora",
            autor: "Eckhart Tolle",
            precio: 62000,
            stock: 3,
            foto: "https://images.cdn3.buscalibre.com/fit-in/660x660/1f/31/1f314eb5b2c37514a3c766f0dc5aa9f5.jpg"
        },
        {
            id: 9,
            categoria: "Terror",
            nombre: "It (Eso)",
            autor: "Stephen King",
            precio: 85000,
            stock: 8,
            foto: "https://images.cdn3.buscalibre.com/fit-in/660x660/df/43/df43923a18c57cfc02206ef54e50f192.jpg"
        },
        {
            id: 10,
            categoria: "Terror",
            nombre: "Drácula",
            autor: "Bram Stoker",
            precio: 42000,
            stock: 15,
            foto: "https://images.cdn2.buscalibre.com/fit-in/360x360/15/e5/15e55a11bf7ab69d43d90567a7b55827.jpg"
        },
        {
            id: 11,
            categoria: "Terror",
            nombre: "Frankenstein",
            autor: "Mary Shelley",
            precio: 39000,
            stock: 10,
            foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkfIXR50HVBVydmKhV3h42S_bs8I1vSXA7IthoBdgfRYyf6ZAON6pCGJKy&s=10"
        },
        {
            id: 12,
            categoria: "Novela",
            nombre: "El amor en los tiempos del cólera",
            autor: "Gabriel García Márquez",
            precio: 55000,
            stock: 6,
            foto: "https://images.cdn1.buscalibre.com/fit-in/660x660/80/74/80749c93eb00161f4f84deb9f48280a4.jpg"
        },
        {
            id: 13,
            categoria: "Fantasía",
            nombre: "Harry Potter y la piedra filosofal",
            autor: "J.K. Rowling",
            precio: 48000,
            stock: 14,
            foto: "https://images.cdn3.buscalibre.com/fit-in/660x660/f5/f2/f5f2e2edd647784f07b709f1fef82d1c.jpg"
        },
        {
            id: 14,
            categoria: "Clásicos",
            nombre: "Don Quijote de la Mancha",
            autor: "Miguel de Cervantes",
            precio: 60000,
            stock: 5,
            foto: "https://www.tornamesa.co/imagenes/9788466/978846623664.webp"
        },
        {
            id: 15,
            categoria: "Historia",
            nombre: "Breve historia del tiempo",
            autor: "Stephen Hawking",
            precio: 53000,
            stock: 7,
            foto: "https://images.cdn3.buscalibre.com/fit-in/360x360/c1/d5/c1d562eb8d27c7af22c9f981f4de04f1.jpg"
        },
        {
            id: 16,
            categoria: "Infantil",
            nombre: "Matilda",
            autor: "Roald Dahl",
            precio: 35000,
            stock: 18,
            foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSv2LxZw_Nhe5BryIlJ_YR5zdUf1qH3zkGovL9_ZXlXReNw8-xAE_WhzwW-&s=10"
        },
        {
            id: 17,
            categoria: "Desarrollo personal",
            nombre: "Cómo ganar amigos e influir sobre las personas",
            autor: "Dale Carnegie",
            precio: 47000,
            stock: 11,
            foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIPMqyvI1gRsvRGW0hJBZjsgYyVzx4LM4ZYh7SZpQeiE58UBh4VLix1XPH&s=10"
        },
        {
            id: 18,
            categoria: "Terror",
            nombre: "El resplandor",
            autor: "Stephen King",
            precio: 68000,
            stock: 9,
            foto: "https://images.cdn3.buscalibre.com/fit-in/360x360/df/f6/dff6e1ce324ef328e378029002402afa.jpg"
        },
        {
            id: 19,
            categoria: "Terror",
            nombre: "El gato negro",
            autor: "Edgar Allan Poe",
            precio: 35000,
            stock: 13,
            foto: "https://covers.storytel.com/jpg-640/9783986770853.b5af0d99-8873-4de5-9ec5-2cd2efada3f2?optimize=high&quality=70&width=600"
        },
        {
            id: 20,
            categoria: "Novela",
            nombre: "El alquimista",
            autor: "Paulo Coelho",
            precio: 45000,
            stock: 10,
            foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcobuOQFIGH0fPH7UefzR50ueWlypi-DNIiKnhEcL0smsiXn8340B537Q&s=10"
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
