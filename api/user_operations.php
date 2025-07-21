<?php
require_once 'config.php';

// Function to register a new user when they buy a ticket
function registerUserFromTicket($email, $name) {
    $conn = getDBConnection();
    if ($conn === null) return false;

    try {
        // Check if user already exists
        $stmt = $conn->prepare("SELECT id, role FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            // User exists, no need to create new one
            $stmt->close();
            $conn->close();
            return true;
        }

        // Create new user
        $stmt = $conn->prepare("INSERT INTO users (email, full_name, role) VALUES (?, ?, 'user')");
        $stmt->bind_param("ss", $email, $name);
        $success = $stmt->execute();
        
        $stmt->close();
        $conn->close();
        return $success;
    } catch (Exception $e) {
        error_log("Error registering user from ticket: " . $e->getMessage());
        return false;
    }
}

// Function to promote user to organizer
function promoteToOrganizer($email, $password) {
    $conn = getDBConnection();
    if ($conn === null) return false;

    try {
        // Hash the password
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        
        // Check if user exists
        $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            // Update existing user
            $stmt = $conn->prepare("UPDATE users SET role = 'organizer', password = ? WHERE email = ?");
            $stmt->bind_param("ss", $hashedPassword, $email);
        } else {
            // Create new organizer
            $stmt = $conn->prepare("INSERT INTO users (email, role, password) VALUES (?, 'organizer', ?)");
            $stmt->bind_param("ss", $email, $hashedPassword);
        }
        
        $success = $stmt->execute();
        $stmt->close();
        $conn->close();
        return $success;
    } catch (Exception $e) {
        error_log("Error promoting user to organizer: " . $e->getMessage());
        return false;
    }
}

// Function to check user role on login
function checkUserRole($email, $password) {
    $conn = getDBConnection();
    if ($conn === null) return null;

    try {
        $stmt = $conn->prepare("SELECT id, role, password FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            $stmt->close();
            $conn->close();
            return null;
        }

        $user = $result->fetch_assoc();
        $stmt->close();
        $conn->close();

        // If user has no password (regular user), return their role
        if (empty($user['password'])) {
            return $user['role'];
        }

        // Verify password for organizers
        if (password_verify($password, $user['password'])) {
            return $user['role'];
        }

        return null;
    } catch (Exception $e) {
        error_log("Error checking user role: " . $e->getMessage());
        return null;
    }
}

// Function to register user for an event
function registerForEvent($userId, $eventId) {
    $conn = getDBConnection();
    if ($conn === null) return false;

    try {
        // Check if user is already registered for this event
        $stmt = $conn->prepare("SELECT id FROM registrations WHERE user_id = ? AND event_id = ?");
        $stmt->bind_param("ii", $userId, $eventId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $stmt->close();
            $conn->close();
            return false; // Already registered
        }

        // Register user for event
        $stmt = $conn->prepare("INSERT INTO registrations (user_id, event_id, status) VALUES (?, ?, 'confirmed')");
        $stmt->bind_param("ii", $userId, $eventId);
        $success = $stmt->execute();
        
        $stmt->close();
        $conn->close();
        return $success;
    } catch (Exception $e) {
        error_log("Error registering for event: " . $e->getMessage());
        return false;
    }
}

// Function to get user by email
function getUserByEmail($email) {
    $conn = getDBConnection();
    if ($conn === null) return null;

    try {
        $stmt = $conn->prepare("SELECT id, email, full_name, role FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            $stmt->close();
            $conn->close();
            return null;
        }

        $user = $result->fetch_assoc();
        $stmt->close();
        $conn->close();
        return $user;
    } catch (Exception $e) {
        error_log("Error getting user by email: " . $e->getMessage());
        return null;
    }
}

// Function to get user's registered events
function getUserRegistrations($userId) {
    $conn = getDBConnection();
    if ($conn === null) return [];

    try {
        $stmt = $conn->prepare("
            SELECT r.*, e.title, e.date, e.time, e.location, tt.name as ticket_name, tt.price
            FROM registrations r
            JOIN events e ON r.event_id = e.id
            LEFT JOIN ticket_types tt ON r.ticket_type_id = tt.id
            WHERE r.user_id = ?
            ORDER BY e.date ASC
        ");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $registrations = [];
        while ($row = $result->fetch_assoc()) {
            $registrations[] = $row;
        }
        
        $stmt->close();
        $conn->close();
        return $registrations;
    } catch (Exception $e) {
        error_log("Error getting user registrations: " . $e->getMessage());
        return [];
    }
}

function registerUser($name, $email, $password) {
    $conn = getDBConnection();
    if ($conn === null) return false;
    try {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $conn->prepare("INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, 'user')");
        $stmt->bind_param("sss", $name, $email, $hashedPassword);
        $success = $stmt->execute();
        $stmt->close();
        $conn->close();
        return $success;
    } catch (Exception $e) {
        error_log("Error registering user: " . $e->getMessage());
        return false;
    }
}

function getOrCreateEventbriteUser($eventbrite_id, $full_name, $email) {
    $conn = getDBConnection();
    if ($conn === null) return null;

    try {
        // Try to find by eventbrite_id first
        $stmt = $conn->prepare("SELECT id, email, full_name, role FROM users WHERE eventbrite_id = ?");
        $stmt->bind_param("s", $eventbrite_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            $stmt->close();
            $conn->close();
            return $user;
        }
        $stmt->close();

        // If not found, try by email (in case user registered before)
        $stmt = $conn->prepare("SELECT id, email, full_name, role FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            // Update this user to have eventbrite_id
            $user = $result->fetch_assoc();
            $update = $conn->prepare("UPDATE users SET eventbrite_id = ? WHERE id = ?");
            $update->bind_param("si", $eventbrite_id, $user['id']);
            $update->execute();
            $update->close();
            $stmt->close();
            $conn->close();
            $user['eventbrite_id'] = $eventbrite_id;
            return $user;
        }
        $stmt->close();

        // Otherwise, create new user
        $role = 'user';
        $stmt = $conn->prepare("INSERT INTO users (eventbrite_id, full_name, email, role, password) VALUES (?, ?, ?, ?, NULL)");
        $stmt->bind_param("ssss", $eventbrite_id, $full_name, $email, $role);
        $stmt->execute();
        $user_id = $stmt->insert_id;
        $stmt->close();
        $conn->close();
        return [
            'id' => $user_id,
            'email' => $email,
            'full_name' => $full_name,
            'role' => $role,
            'eventbrite_id' => $eventbrite_id
        ];
    } catch (Exception $e) {
        error_log("Error in getOrCreateEventbriteUser: " . $e->getMessage());
        return null;
    }
}
?> 