<?php
/**
 * OPTIONAL HOSTINGER SERVER-SIDE FORM HANDLER
 * -------------------------------------------------------------
 * Upload to Hostinger public_html/php/submit.php
 * -------------------------------------------------------------
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed. Use POST.']);
    exit();
}

$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON payload.']);
    exit();
}

$type = isset($input['type']) ? trim($input['type']) : 'consultation';
$data = isset($input['data']) ? $input['data'] : [];

function sanitize($val) {
    return htmlspecialchars(strip_tags(trim($val ?? '')));
}

$adminEmail = "contact@apexca.in";
$subject = "New Website Lead: " . ucfirst($type);
$messageBody = "New website submission:\n\n";
foreach ($data as $key => $val) {
    $messageBody .= ucfirst(str_replace('_', ' ', $key)) . ": " . sanitize($val) . "\n";
}
$messageBody .= "\nTimestamp: " . date('Y-m-d H:i:s') . "\n";

$headers = "From: no-reply@" . ($_SERVER['SERVER_NAME'] ?? 'hostinger.com') . "\r\n";
$headers .= "Reply-To: " . (isset($data['email']) ? sanitize($data['email']) : $adminEmail) . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

@mail($adminEmail, $subject, $messageBody, $headers);

http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Submission processed successfully.',
    'type' => $type
]);
?>
