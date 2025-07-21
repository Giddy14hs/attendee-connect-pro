<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

// Get the search query from the request
$searchQuery = isset($_GET['q']) ? $_GET['q'] : '';
$location = isset($_GET['location']) ? $_GET['location'] : '';

// Get database connection
$conn = getDBConnection();

if ($conn === null) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

// Prepare the SQL query
$sql = "SELECT * FROM events WHERE 1=1";
$params = [];
$types = "";

if (!empty($searchQuery)) {
    $sql .= " AND (title LIKE ? OR description LIKE ?)";
    $searchParam = "%$searchQuery%";
    $params[] = $searchParam;
    $params[] = $searchParam;
    $types .= "ss";
}

if (!empty($location)) {
    $sql .= " AND location LIKE ?";
    $params[] = "%$location%";
    $types .= "s";
}

// Prepare and execute the statement
$stmt = $conn->prepare($sql);

if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}

$stmt->execute();
$result = $stmt->get_result();

// Fetch all results
$events = [];
while ($row = $result->fetch_assoc()) {
    $events[] = $row;
}

// Close the statement and connection
$stmt->close();
$conn->close();

// Return the results
echo json_encode(['events' => $events]);
?> 