<?php

function ajaxSelect2() {}

$action = $_GET['action'] ?? '';
$action = ucfirst($action);
$action = "ajax{$action}";
if (function_exists($action)) {
	$data = $action();
	if (isset($data)) {
		echo json_encode($data);
	}
	die;
}

http_response_code(404);
echo 'Not Found';
die;
