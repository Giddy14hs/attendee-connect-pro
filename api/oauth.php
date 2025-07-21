<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$CLIENT_ID = 'UTLU7YCIGFXD4L64FE';
$CLIENT_SECRET = 'V45ZWUIX3APUXJAYREWVF3TUWSUWD3MGM7HKTYEDJBQSJ7AJQG';
$REDIRECT_URI = 'http://localhost:8000/api/oauth.php?action=callback'; // Backend endpoint
$FRONTEND_REDIRECT = 'http://localhost:8080/oauth-callback';

$action = $_GET['action'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

function redirectWithError($message) {
    global $FRONTEND_REDIRECT;
    header('Location: ' . $FRONTEND_REDIRECT . '?error=' . urlencode($message));
    exit();
}

switch ($action) {
    case 'authorize':
        $state = bin2hex(random_bytes(16));
        $_SESSION['oauth_state'] = $state;
        $authUrl = 'https://www.eventbrite.com/oauth/authorize?' . http_build_query([
            'response_type' => 'code',
            'client_id' => $CLIENT_ID,
            'redirect_uri' => $REDIRECT_URI,
            'state' => $state,
            'scope' => 'events_read users_read'
        ]);
        header('Location: ' . $authUrl);
        exit();

    case 'callback':
        $code = $_GET['code'] ?? '';
        $state = $_GET['state'] ?? '';
        if (!$code || !$state) {
            redirectWithError('Missing authorization code or state parameter');
        }
        if ($state !== ($_SESSION['oauth_state'] ?? '')) {
            redirectWithError('Invalid state parameter. Please try logging in again.');
        }
        $tokenUrl = 'https://www.eventbrite.com/oauth/token';
        $postData = [
            'code' => $code,
            'client_id' => $CLIENT_ID,
            'client_secret' => $CLIENT_SECRET,
            'redirect_uri' => $REDIRECT_URI,
            'grant_type' => 'authorization_code'
        ];
        $ch = curl_init($tokenUrl);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/x-www-form-urlencoded']);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        $tokenData = json_decode($response, true);
        if ($httpCode === 200 && isset($tokenData['access_token'])) {
            $_SESSION['eventbrite_token'] = $tokenData['access_token'];
            $_SESSION['eventbrite_token_expires'] = time() + (isset($tokenData['expires_in']) ? $tokenData['expires_in'] : 3600);
            // Redirect to frontend after successful token exchange
            header('Location: ' . $FRONTEND_REDIRECT . '?success=1');
            exit();
        } else {
            $errorMsg = isset($tokenData['error_description']) ? $tokenData['error_description'] : 'Failed to exchange code for token';
            redirectWithError($errorMsg);
        }

    case 'get_token':
        if (isset($_SESSION['eventbrite_token']) && time() < ($_SESSION['eventbrite_token_expires'] ?? 0)) {
            echo json_encode([
                'access_token' => $_SESSION['eventbrite_token'],
                'expires_in' => $_SESSION['eventbrite_token_expires'] - time()
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'No valid token']);
        }
        exit();

    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action']);
        exit();
}