<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Check for OAuth token in session
if (!isset($_SESSION['eventbrite_token'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Not authenticated']);
    exit();
}
$eventbriteToken = $_SESSION['eventbrite_token'];

// Fetch events for the authenticated user
$eventsUrl = 'https://www.eventbriteapi.com/v3/users/me/events/?expand=venue';
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $eventsUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $eventbriteToken
]);
$eventsResponse = curl_exec($ch);
$eventsCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($eventsCode === 200) {
    echo $eventsResponse;
} else {
    http_response_code($eventsCode);
    echo json_encode([
        'error' => 'Failed to fetch user events',
        'status' => $eventsCode,
        'response' => $eventsResponse
    ]);
} 