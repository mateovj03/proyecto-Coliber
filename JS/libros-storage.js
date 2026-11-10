// Local estorage compartido
(function () {
    const CLAVE_LIBROS = "coliber-libros-v1";

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

    window.ColiberLibros = { clave: CLAVE_LIBROS, leer, guardar };
})();
