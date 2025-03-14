<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chatbot de la Ilustre Municipalidad de Hualañe</title>
    <!-- Cargar los iconos de Google Fonts en un solo enlace -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&display=swap" />
    <link rel="stylesheet" href="style.css">

</head>
<body>

    <button id="chatbot-toggler">
        <span class="material-symbols-outlined">mode_comment</span>
    </button>
    <div class="chatbot-popup">
        <div class="chat-header">
            <div class="header-info">
                <div class="header-logo">
                    <span class="material-symbols-outlined">smart_toy</span>
                </div>
                <h3 class="logo-text">Chatbot Tramites Municipales</h3>
            </div>
            <!-- Botón con icono -->
            <button id="close-chatbot" class="material-symbols-outlined">keyboard_arrow_down</button>
        </div>

        <div class="chat-body">
            <div id="welcome-message" class="message bot-message">
                <div class="message-text"></div>
            </div>

            <div id="logout-popup" class="logout-popup">
            <div class="popup-content">
                <p>¿Deseas cerrar sesión?</p>
                <button id="logout-yes">Sí</button>
                <button id="logout-no">No</button>
            </div>
            </div>
        </div>

        <div class="chat-footer">
            <form action="#" class="chat-form">
                <textarea placeholder="Escribe tu consulta..." class="message-input" required></textarea>
                <div class="chat-controls">
                    <!-- Botón con icono -->
                    <button type="submit" id="send-message" class="material-symbols-outlined">
                        arrow_upward
                    </button>
                </div>
            </form>
        </div>
    </div>
</body>
    <script src="script.js"></script>
</html>
