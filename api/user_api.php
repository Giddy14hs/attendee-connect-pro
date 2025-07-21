<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'user_operations.php';

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Get the request body
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request data']);
    exit();
}

// Route the request based on the action
$action = isset($data['action']) ? $data['action'] : '';

switch ($action) {
    case 'register_from_ticket':
        if (!isset($data['email']) || !isset($data['name'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields']);
            exit();
        }
        
        $success = registerUserFromTicket($data['email'], $data['name']);
        if ($success) {
            echo json_encode(['message' => 'User registered successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to register user']);
        }
        break;

    case 'promote_to_organizer':
        if (!isset($data['email']) || !isset($data['password'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields']);
            exit();
        }
        
        $success = promoteToOrganizer($data['email'], $data['password']);
        if ($success) {
            echo json_encode(['message' => 'User promoted to organizer successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to promote user']);
        }
        break;

    case 'login':
        if (!isset($data['email'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Email is required']);
            exit();
        }
        
        $password = isset($data['password']) ? $data['password'] : '';
        $user = getUserByEmail($data['email']);
        $role = checkUserRole($data['email'], $password);
        
        if ($role && $user) {
            echo json_encode([
                'message' => 'Login successful',
                'role' => $role,
                'full_name' => $user['name'] ?? $user['full_name'] ?? ''
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid credentials']);
        }
        break;

    case 'register_for_event':
        if (!isset($data['userId']) || !isset($data['eventId'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields']);
            exit();
        }
        
        $success = registerForEvent($data['userId'], $data['eventId']);
        if ($success) {
            echo json_encode(['message' => 'Registered for event successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to register for event']);
        }
        break;

    case 'register':
        if (!isset($data['full_name'], $data['email'], $data['password'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields']);
            exit();
        }
        $success = registerUser($data['full_name'], $data['email'], $data['password']);
        if ($success) {
            echo json_encode(['message' => 'User registered successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to register user']);
        }
        break;

    case 'eventbrite_login':
        if (!isset($data['eventbrite_id'], $data['full_name'], $data['email'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields']);
            exit();
        }
        $user = getOrCreateEventbriteUser($data['eventbrite_id'], $data['full_name'], $data['email']);
        if ($user) {
            echo json_encode([
                'user_id' => $user['id'],
                'full_name' => $user['full_name'],
                'email' => $user['email'],
                'role' => $user['role']
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to save Eventbrite user']);
        }
        break;

    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action']);
        break;
}
?> 