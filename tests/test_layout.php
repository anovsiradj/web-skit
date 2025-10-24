<!DOCTYPE html>
<html lang="id">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">

	<title><?= $title ?></title>
	<link rel="icon" href="../images/logo.ico">

	<link rel="stylesheet" href="../vendor/twbs/bootstrap/dist/css/bootstrap.min.css">
	<link rel="stylesheet" href="../vendor/twbs/bootstrap-icons/font/bootstrap-icons.min.css">

	<link rel="stylesheet" href="../main.css?<?= $count ?>">
	<link rel="stylesheet" href="../widgets/twbs/v5_sceme.css?<?= $count ?>">
	<script src="../widgets/twbs/v5_sceme.js?<?= $count ?>"></script>

	<?php $cutter->section('style') ?>
</head>

<body class="container py-5">
	<?php $cutter->section('content') ?>
</body>

<script src="../vendor/npm-asset/jquery/dist/jquery.min.js"></script>
<script src="../vendor/npm-asset/jquery-ui/dist/jquery-ui.min.js"></script>
<script src="../vendor/twbs/bootstrap/dist/js/bootstrap.bundle.min.js"></script>

<script src="../main.js?<?= $count ?>"></script>

<?php $cutter->section('script') ?>

</html>