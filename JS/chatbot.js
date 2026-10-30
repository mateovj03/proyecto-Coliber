import { createChat } from "https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js";

const urlChat = "https://automatizacion.colvatel.com/webhook/41f94be3-5eec-424a-8ab0-651391f72600/chat";

createChat({
    webhookUrl: urlChat,
    target: "#chat-coliber",
    mode: "window",
    loadPreviousSession: true,
    showWelcomeScreen: false,
    defaultLanguage: "en",
    initialMessages: [
        "¡Hola! 👋",
        "Soy el asistente virtual de Coliber. ¿En qué puedo ayudarte?"
    ],
    i18n: {
        en: {
            title: "Asistente Coliber 📚",
            subtitle: "Pregúntame sobre Coliber y nuestros libros.",
            footer: "",
            getStarted: "Nueva conversación",
            inputPlaceholder: "Escribe tu pregunta..."
        }
    }
});