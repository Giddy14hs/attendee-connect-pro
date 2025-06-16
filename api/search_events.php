<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Get the search query from the request
$searchQuery = isset($_GET['q']) ? $_GET['q'] : '';
$location = isset($_GET['location']) ? $_GET['location'] : '';

// Eventbrite API configuration
$eventbriteToken = getenv('EVENTBRITE_TOKEN');
$apiUrl = 'https://www.eventbriteapi.com/v3/events/search/';

// Prepare the API request
$params = [
    'q' => $searchQuery,
    'expand' => 'venue',
    'sort_by' => 'date',
];

if (!empty($location)) {
    $params['location.address'] = $location;
}

// Add the token to the URL
$apiUrl .= '?' . http_build_query($params);

// Initialize cURL session
$ch = curl_init();

// Set cURL options
curl_setopt($ch, CURLOPT_URL, $apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $eventbriteToken,
    'Content-Type: application/json'
]);

// Execute the request
$response = curl_exec($ch);

// Check for errors
if (curl_errno($ch)) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch events: ' . curl_error($ch)]);
    exit;
}

// Close cURL session
curl_close($ch);

// Return the response
echo $response; 