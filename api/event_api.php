<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';
require_once 'user_operations.php';

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get the request body
$data = json_decode(file_get_contents('php://input'), true);

// Route the request based on the action
$action = isset($data['action']) ? $data['action'] : '';

switch ($action) {
    case 'create_event':
        if (!isset($data['title']) || !isset($data['date']) || !isset($data['location']) || !isset($data['organizer_id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields']);
            exit();
        }
        
        $success = createEvent($data);
        if ($success) {
            echo json_encode(['message' => 'Event created successfully', 'event_id' => $success]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create event']);
        }
        break;

    case 'update_event':
        if (!isset($data['event_id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Event ID is required']);
            exit();
        }
        
        $success = updateEvent($data);
        if ($success) {
            echo json_encode(['message' => 'Event updated successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update event']);
        }
        break;

    case 'delete_event':
        if (!isset($data['event_id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Event ID is required']);
            exit();
        }
        
        $success = deleteEvent($data['event_id']);
        if ($success) {
            echo json_encode(['message' => 'Event deleted successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete event']);
        }
        break;

    case 'get_organizer_events':
        if (!isset($data['organizer_id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Organizer ID is required']);
            exit();
        }
        
        $events = getOrganizerEvents($data['organizer_id']);
        echo json_encode(['events' => $events]);
        break;

    case 'get_event_details':
        if (!isset($data['event_id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Event ID is required']);
            exit();
        }
        
        $event = getEventDetails($data['event_id']);
        if ($event) {
            echo json_encode(['event' => $event]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Event not found']);
        }
        break;

    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action']);
        break;
}

// Function to create a new event
function createEvent($data) {
    $conn = getDBConnection();
    if ($conn === null) return false;

    try {
        $conn->begin_transaction();

        // Insert event
        $stmt = $conn->prepare("
            INSERT INTO events (title, description, date, time, location, max_attendees, category, organizer_id, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->bind_param("sssssssss", 
            $data['title'], 
            $data['description'], 
            $data['date'], 
            $data['time'], 
            $data['location'], 
            $data['max_attendees'], 
            $data['category'], 
            $data['organizer_id'], 
            $data['status'] ?? 'draft'
        );
        $stmt->execute();
        $eventId = $conn->insert_id;
        $stmt->close();

        // Insert ticket types if provided
        if (isset($data['ticket_types']) && is_array($data['ticket_types'])) {
            foreach ($data['ticket_types'] as $ticket) {
                if (!empty($ticket['name']) && isset($ticket['price'])) {
                    $stmt = $conn->prepare("
                        INSERT INTO ticket_types (event_id, name, price, quantity, description) 
                        VALUES (?, ?, ?, ?, ?)
                    ");
                    $stmt->bind_param("isdis", 
                        $eventId, 
                        $ticket['name'], 
                        $ticket['price'], 
                        $ticket['quantity'] ?? 0, 
                        $ticket['description'] ?? ''
                    );
                    $stmt->execute();
                    $stmt->close();
                }
            }
        }

        $conn->commit();
        $conn->close();
        return $eventId;
    } catch (Exception $e) {
        $conn->rollback();
        error_log("Error creating event: " . $e->getMessage());
        return false;
    }
}

// Function to update an event
function updateEvent($data) {
    $conn = getDBConnection();
    if ($conn === null) return false;

    try {
        $stmt = $conn->prepare("
            UPDATE events 
            SET title = ?, description = ?, date = ?, time = ?, location = ?, 
                max_attendees = ?, category = ?, status = ?
            WHERE id = ?
        ");
        $stmt->bind_param("ssssssssi", 
            $data['title'], 
            $data['description'], 
            $data['date'], 
            $data['time'], 
            $data['location'], 
            $data['max_attendees'], 
            $data['category'], 
            $data['status'], 
            $data['event_id']
        );
        $success = $stmt->execute();
        $stmt->close();
        $conn->close();
        return $success;
    } catch (Exception $e) {
        error_log("Error updating event: " . $e->getMessage());
        return false;
    }
}

// Function to delete an event
function deleteEvent($eventId) {
    $conn = getDBConnection();
    if ($conn === null) return false;

    try {
        $stmt = $conn->prepare("DELETE FROM events WHERE id = ?");
        $stmt->bind_param("i", $eventId);
        $success = $stmt->execute();
        $stmt->close();
        $conn->close();
        return $success;
    } catch (Exception $e) {
        error_log("Error deleting event: " . $e->getMessage());
        return false;
    }
}

// Function to get organizer's events
function getOrganizerEvents($organizerId) {
    $conn = getDBConnection();
    if ($conn === null) return [];

    try {
        $stmt = $conn->prepare("
            SELECT e.*, 
                   COUNT(r.id) as registered_count,
                   COUNT(tt.id) as ticket_types_count
            FROM events e
            LEFT JOIN registrations r ON e.id = r.event_id
            LEFT JOIN ticket_types tt ON e.id = tt.event_id
            WHERE e.organizer_id = ?
            GROUP BY e.id
            ORDER BY e.date DESC
        ");
        $stmt->bind_param("i", $organizerId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $events = [];
        while ($row = $result->fetch_assoc()) {
            $events[] = $row;
        }
        
        $stmt->close();
        $conn->close();
        return $events;
    } catch (Exception $e) {
        error_log("Error getting organizer events: " . $e->getMessage());
        return [];
    }
}

// Function to get event details with ticket types
function getEventDetails($eventId) {
    $conn = getDBConnection();
    if ($conn === null) return null;

    try {
        // Get event details
        $stmt = $conn->prepare("
            SELECT e.*, u.name as organizer_name
            FROM events e
            LEFT JOIN users u ON e.organizer_id = u.id
            WHERE e.id = ?
        ");
        $stmt->bind_param("i", $eventId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            $stmt->close();
            $conn->close();
            return null;
        }

        $event = $result->fetch_assoc();
        $stmt->close();

        // Get ticket types for this event
        $stmt = $conn->prepare("SELECT * FROM ticket_types WHERE event_id = ?");
        $stmt->bind_param("i", $eventId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $ticketTypes = [];
        while ($row = $result->fetch_assoc()) {
            $ticketTypes[] = $row;
        }
        
        $event['ticket_types'] = $ticketTypes;
        $stmt->close();
        $conn->close();
        return $event;
    } catch (Exception $e) {
        error_log("Error getting event details: " . $e->getMessage());
        return null;
    }
}
?> 