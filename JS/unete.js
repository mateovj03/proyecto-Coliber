//NAVEGACIÓN ENTRE PANELES MODAL ÚNETE
document.addEventListener("DOMContentLoaded", () => {
    const botonRegistro = document.getElementById("register-btn");
    const botonLogin = document.getElementById("login-btn");
    const backButtons = document.querySelectorAll(".back-to-main-btn");
    
    const panelPrincipal = document.getElementById("panel-principal");
    const panelRegistro = document.getElementById("panel-registro");
    const panelLogin = document.getElementById("panel-login");
    const offcanvasUnete = document.getElementById("offcanvasUnete");

    function cambiarPanel(panelDestino) {
        if (panelPrincipal) panelPrincipal.classList.add("d-none");
        if (panelRegistro) panelRegistro.classList.add("d-none");
        if (panelLogin) panelLogin.classList.add("d-none");
        
        if (panelDestino) panelDestino.classList.remove("d-none");
    }

    if (botonRegistro && panelRegistro) {
        botonRegistro.addEventListener("click", () => {
            cambiarPanel(panelRegistro);
        });
    }

    if (botonLogin && panelLogin) {
        botonLogin.addEventListener("click", () => {
            cambiarPanel(panelLogin);
        });
    }

    backButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            cambiarPanel(panelPrincipal);
        });
    });

    if (offcanvasUnete) {
        offcanvasUnete.addEventListener("hidden.bs.offcanvas", () => {
            cambiarPanel(panelPrincipal);
        });
    }
});