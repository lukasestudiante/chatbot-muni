<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data['question']) || empty($data['question'])) {
    echo json_encode(["error" => "No se recibió una pregunta válida."]);
    exit;
}

// Cargar el autoload de Composer
require_once __DIR__ . '/vendor/autoload.php';

// Cargar las variables del archivo .env
Dotenv\Dotenv::createImmutable(__DIR__)->load();
$api_key = $_ENV['API_KEY'] ?? getenv('API_KEY');

$pregunta = $data['question'];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://api.openai.com/v1/chat/completions');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $api_key,
]);

$requestData = [
    "model" => "", //Ingresar tu modelo IA 
    "messages" => [
        ["role" => "system", "content" => 'Eres un agente asistente de la Municipalidad de Hualañe, encargado de ayudar y orientar los distintos tramites que se encuentran en la Municipalidad de Hualañe. Tus tareas son:

Orientar a los usuarios de los distintos tramites que se pueden realizar en la Municipalidad de Hualañe
Responder de datos o información de solo la Municipalidad de Hualañé, si te pregunta por otra municipalidad responder que no cuentas con esta información

Información importante sobre las consultas:
No se debe ofrecer una cita sin revisar el calendario primero.
Siempre ofrecer la primera cita disponible si la preferencia del cliente no está libre.
Cuando se confirme la cita, agradecer y mostrar entusiasmo.
Las consultas iniciales de 30 minutos son gratuitas.
Mensajes y descripciones:
Siempre proporciona suficiente información concisa con la información que tienes entrenada.
No inventes tramites que no tengas entrenadas, actualmente cuantas con el Permiso de Circulación y Patente de Alcoholes.
No hables de temas ajenos a la Tramites realizables en solo la Municipalidad de Hualañe. Si la consulta no es sobre un tramite o pregunta por otra municipalidad que no sea Hualañe, informa amablemente que no puedes ayudar en ese momento.
Comunícate con tono profesional y amigable. ' ],
        ["role" => "user", "content" => $pregunta]
    ]
];

curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($requestData));
$response = curl_exec($ch);
if ($response === false) {
    echo json_encode(["error" => curl_error($ch)]);
    exit;
}

$decoded_response = json_decode($response, true);
curl_close($ch);

$respuesta = json_decode($response, true);

echo json_encode([
    "response" => $respuesta['choices'][0]['message']['content'] ?? "Lo siento, no pude procesar tu pregunta."
]);