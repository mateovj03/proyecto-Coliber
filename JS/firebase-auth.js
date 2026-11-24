import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCdO26UYecjc41AZylP4yIQeOBmPzCebgI",
    authDomain: "coliber-b2231.firebaseapp.com",
    projectId: "coliber-b2231",
    storageBucket: "coliber-b2231.firebasestorage.app",
    messagingSenderId: "950292873584",
    appId: "1:950292873584:web:45cc9d03d06c2e2c4b0fb5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleBtn = document.getElementById("google-login-btn");

if (googleBtn) {

    googleBtn.addEventListener("click", async () => {

        try {

            const provider = new GoogleAuthProvider();

            const result = await signInWithPopup(auth, provider);

            const user = result.user;

            localStorage.setItem("usuarioNombre", user.displayName);
            localStorage.setItem("usuarioCorreo", user.email);
            localStorage.setItem("usuarioFoto", user.photoURL);
            localStorage.setItem("usuarioUID", user.uid);

            alert(`Bienvenido ${user.displayName}`);

        } 
        
        catch (error) {

            console.error("ERROR FIREBASE:", error);

            alert(
                error.code + "\n" +
                error.message
            );

        }

    });

}

// Apartado para que solo salga el primer nombre del usuario y no el nombre completo.

document.addEventListener("DOMContentLoaded", () => {

    const nombreCompleto = localStorage.getItem("usuarioNombre");
    const foto = localStorage.getItem("usuarioFoto");

    if (nombreCompleto) {

        const primerNombre = nombreCompleto.split(" ")[0];

        const textoUsuario = document.querySelector(".usuario span");

        if (textoUsuario) {
            textoUsuario.textContent = primerNombre;
        }

        const fotoUsuario = document.getElementById("foto-usuario");
        const iconoUsuario = document.getElementById("icono-usuario");

        if (fotoUsuario && foto) {

            fotoUsuario.src = foto;

            fotoUsuario.classList.remove("d-none");

            if (iconoUsuario) {
                iconoUsuario.style.display = "none";
            }
        }
    }

});