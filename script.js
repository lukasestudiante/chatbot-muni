document.addEventListener("DOMContentLoaded", function() {   
    const chatBody = document.querySelector(".chat-body");
    const messageInput = document.querySelector(".message-input");
    const sendMessageButton = document.querySelector("#send-message");
    const chatForm = document.querySelector(".chat-form");
    const chatbotToggler = document.querySelector("#chatbot-toggler");
    const chatbotPopup = document.querySelector(".chatbot-popup");
    const closeChatbotButton = document.querySelector("#close-chatbot"); // Obtener el botón de cierre
    const logoutPopup = document.querySelector("#logout-popup");
    const logoutYesButton = document.querySelector("#logout-yes");
    const logoutNoButton = document.querySelector("#logout-no");


    const nombres = ["Francisco", "Rino", "Jorge", "Andrea", "Anita", "Lorena", "Richard", "Jonathan", "Ana", "Antonio", "Roberto", "Rodrigo", "Carlos", "Arturo", "Jose", "Fernando", "Victor", "Waldo", "Yusara", "Loretto", "Leonardo", "Veronica", "Lucía", "Boris", "Paulo", "Cristian", "Constanza", "Johanna", "Karen"];

    const getRandomName = () => {
        return nombres[Math.floor(Math.random() * nombres.length)];
    };

    const welcomeMessageDiv = document.querySelector("#welcome-message .message-text");
    if (welcomeMessageDiv) {
        const randomName = getRandomName();
        if (!randomName) {
            console.error("Error: No se pudo seleccionar un nombre aleatorio.");
            return;
        }
        chatBody.innerHTML = "";
        const welcomeMessage = document.createElement("div");
        welcomeMessage.classList.add("message", "bot-message");
        welcomeMessage.innerHTML = `Hola👋, soy ${randomName} y soy tu Asistente Virtual entrenado por Inteligencia Artificial 🤖 para orientarte con los trámites que se pueden realizar en la Municipalidad de Hualañe🏦, ¿Con qué trámite te puedo ayudar? Actualmente los trámites que te puedo orientar ✍️:<br><br>👉 Patente de Alcoholes🍻<br>👉 Patente de Comercial💸<br>👉 Patente Industrial💰<br>👉 Patente Profesional💼<br>👉 Permiso de Circulación🚗`;
        
        chatBody.appendChild(welcomeMessage); // Insertar mensaje en el chat
    }

    if (!chatbotToggler || !chatbotPopup || !closeChatbotButton) {
        console.error("No se encontró el botón o la ventana del chatbot.");
        return;
    }

    // Manejador para abrir/cerrar el chatbot con el toggle
    chatbotToggler.addEventListener("click", () => {
        chatbotPopup.classList.toggle("active"); // Mostrar u ocultar el chatbot
    });

    // Manejador para cerrar el chatbot al hacer clic en el botón de cierre
    closeChatbotButton.addEventListener("click", () => {
        chatbotPopup.classList.remove("active"); // Cerrar el chatbot
    });

    // Ajustar la altura del textarea dinámicamente
    const adjustTextAreaHeight = () => {
        messageInput.style.height = "auto";
        messageInput.style.height = messageInput.scrollHeight + "px";
    };

    messageInput.addEventListener("input", adjustTextAreaHeight);

    const createMessageElement = (content, ...classes) => {
        const div = document.createElement("div");
        div.classList.add("message", ...classes);
        div.innerHTML = content;
        return div;
    };

    const createThinkingIndicator = () => {
        const thinkingDiv = document.createElement("div");
        thinkingDiv.classList.add("message", "bot-message");

        const thinkingIndicator = document.createElement("div");
        thinkingIndicator.classList.add("thinking-indicator");

        for (let i = 0; i < 3; i++) {
            const dot = document.createElement("div");
            dot.classList.add("dot");
            thinkingIndicator.appendChild(dot);
        }

        thinkingDiv.appendChild(thinkingIndicator);
        chatBody.appendChild(thinkingDiv);
    };

    const generateBotResponse = async (userMessage) => {
        try {
            const response = await fetch("api.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    question: userMessage
                })
            });
    
            const data = await response.json();
            return data.response || "Hubo un error al obtener la respuesta";
        } catch (error) {
            console.error("Error al conectar con la IA:", error);
            return "Hubo un error al conectar con el servidor.";
        }
    };

    const saveMessages = () => {
        sessionStorage.setItem("chatMessages", chatBody.innerHTML);
    };
    
    const loadMessages = () => {
        const savedMessages = sessionStorage.getItem("chatMessages");
        if (savedMessages) {
            chatBody.innerHTML = savedMessages;
            //chatBody.scrollTop = chatBody.scrollHeight; // Auto scroll al final
        }
    };

// Llamar a la función para cargar mensajes al inicio
loadMessages();

const handleOutgoingMessage = async (e) => {
    e.preventDefault();

    const userMessage = messageInput.value.trim();
    if (userMessage === "") return;

    const outgoingMessageDiv = createMessageElement(userMessage, "user-message");
    chatBody.appendChild(outgoingMessageDiv);
    saveMessages();  // Guardar mensajes

    messageInput.value = "";
    adjustTextAreaHeight(); 

    chatBody.scrollTop = chatBody.scrollHeight;
    createThinkingIndicator();

    const botResponse = await generateBotResponse(userMessage);

    const extractLinks = (text) => {
        const urlRegex = /(https?:\/\/[^\s]+)/gi;
        return text.match(urlRegex) || [];
    };

    const links = extractLinks(botResponse);
    const formattedBotResponse = botResponse.replace(/\n/g, "<br>").replace(/(https?:\/\/[^\s]+)/gi, "").trim();

    const thinkingIndicator = document.querySelector(".thinking-indicator");
    if (thinkingIndicator) thinkingIndicator.parentElement.remove();

    if (formattedBotResponse) {
        const botMessageDiv = createMessageElement(formattedBotResponse, "bot-message");
        chatBody.appendChild(botMessageDiv);
    }

    links.forEach(link => {
        const linkMessageDiv = createMessageElement(`<a href="${link}" target="_blank">${link}</a>`, "bot-message");
        chatBody.appendChild(linkMessageDiv);
    });

    saveMessages();
    chatBody.scrollTop = chatBody.scrollHeight;
};

    chatForm.addEventListener("submit", handleOutgoingMessage);

    messageInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleOutgoingMessage(e);
        }
    });

    sendMessageButton.addEventListener("click", handleOutgoingMessage);

    let inactivityTimer;

    const disableChatInput = (disable) => {
        messageInput.disabled = disable;
        sendMessageButton.disabled = disable;
    }

    const startInactivityTimer = () => {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => {
            const existingPopup = document.querySelector(".chat-body .logout-popup");
            if (!existingPopup) {
                chatBody.appendChild(logoutPopup);
                chatBody.scrollTop = chatBody.scrollHeight;
            }
            
    
            // Ahora, mostramos el popup
            logoutPopup.style.display = "block";
            disableChatInput(true);
            // Reseteamos scrollTop antes de agregar el popup
            chatBody.scrollTop = chatBody.scrollHeight;
        }, 12000); // 2 minutos
    };

    const resetInactivityTimer = () => {
        clearTimeout(inactivityTimer);
        startInactivityTimer();
    };
    

    logoutYesButton.addEventListener("click", () => {
        sessionStorage.clear();
        chatBody.innerHTML = ""; // Borra los mensajes del chatbot inmediatamente
        // Agregar mensaje de bienvenida nuevamente

        const randomName = getRandomName();

        const welcomeMessage = document.createElement("div");
        welcomeMessage.classList.add("message", "bot-message");
        welcomeMessage.innerHTML = `Hola👋, soy ${randomName} y soy tu Asistente Virtual entrenado por Inteligencia Artificial 🤖 para orientarte con los trámites que se pueden realizar en la Municipalidad de Hualañe🏦, ¿Con qué trámite te puedo ayudar? Actualmente los trámites que te puedo orientar ✍️:<br><br>👉 Patente de Alcoholes🍻<br>👉 Patente de Comercial💸<br>👉 Patente Industrial💰<br>👉 Patente Profesional💼<br>👉 Permiso de Circulación🚗`;
        disableChatInput(false)
        chatBody.appendChild(welcomeMessage); // Insertar mensaje en el chat
        logoutMessage.remove(); // Eliminar el popup del chat
        chatbotPopup.classList.remove("active"); // Cerrar el chatbot
        logoutPopup.style.display = "none";
        
    });

    logoutNoButton.addEventListener("click", () => {
        disableChatInput(false);
        logoutPopup.style.display = "none";
        logoutPopup.remove();
    });

    // Agregar eventos de actividad del usuario
    document.addEventListener("mousemove", resetInactivityTimer);
    document.addEventListener("keydown", resetInactivityTimer);
    document.addEventListener("click", resetInactivityTimer);

    // Iniciar el temporizador al cargar la página
    startInactivityTimer();
});

