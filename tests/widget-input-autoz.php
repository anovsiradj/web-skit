<?php
require __DIR__ . '/test_config.php';
?>

<!DOCTYPE html>
<html lang="id">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">

	<title><?= $title ?></title>
	<link rel="icon" href="../images/logo.ico">

	<link rel="stylesheet" href="../vendor/twbs/bootstrap/dist/css/bootstrap.min.css">
	<link rel="stylesheet" href="../vendor/twbs/bootstrap-icons/font/bootstrap-icons.min.css">

	<link rel="stylesheet" href="../vendor/npm-asset/select2/dist/css/select2.min.css">
	<link rel="stylesheet" href="../vendor/npm-asset/select2-bootstrap-5-theme/dist/select2-bootstrap-5-theme.min.css">

	<link rel="stylesheet" href="../vendor/npm-asset/jquery-ui/themes/base/all.css">

	<link rel="stylesheet" href="../main.css?<?= $count ?>">
	<link rel="stylesheet" href="../widgets/twbs/v5_sceme.css?<?= $count ?>">
	<script src="../widgets/twbs/v5_sceme.js?<?= $count ?>"></script>

	<style>
		.ui-autocomplete.ui-front {
			max-height: 50vh;
			overflow-y: auto;
			overflow-x: hidden;
		}
	</style>

	<!-- <script>globalThis.dumpType = 'trace'</script> -->
</head>

<body class="container py-5">
	<form>
		<input
			id="input"
			type="text"
			name="input"
			data-ajax-req-href="./wilayah/index.php">

		<div class="py-1"></div>

		<select
			id="selek"
			name="selek"
			data-ajax-req-href="./wilayah/index.php">
		</select>

		<div class="py-1"></div>

		<textarea id="output" style="resize: both; width: 50vw; height: 70vh;"></textarea>
	</form>

	<?php include __DIR__ . '/../widgets/twbs/v5_sceme.html' ?>
</body>

<script src="../vendor/npm-asset/jquery/dist/jquery.min.js"></script>
<script src="../vendor/npm-asset/jquery-ui/dist/jquery-ui.min.js"></script>
<script src="../vendor/twbs/bootstrap/dist/js/bootstrap.bundle.min.js"></script>

<script src="../vendor/npm-asset/select2/dist/js/select2.min.js"></script>
<script src="../vendor/npm-asset/select2/dist/js/i18n/id.js"></script>

<script src="../main.js?<?= $count ?>"></script>
<script src="../widgets/input-autoz.js?<?= $count ?>"></script>

<script>
	let selekElemen = document.querySelector('#selek')
	let inputElemen = document.querySelector('#input')

	$('#input').inputAutoz({
		ajaxReqParams: function(search) {
			return {
				kode: search,
			}
		},
		ajaxResConvert: function(result) {
			return result.data.map(function(item) {
				item.value = item.kode
				item.label = `${item.kode} — ${item.nama}`
				return item
			})
		},

		select(result) {
			$('#output').val(JSON.stringify(result, null, '\t'))
		},
	})

	$('#selek').inputAutoz({
		select2Config: {
			width: '33vw',
		},
		ajaxReqParams: function(search) {
			return {
				nama: search,
			}
		},
		ajaxResConvert: function(result) {
			return {
				results: result.data.map(function(item) {
					item.id = item.kode
					item.text = `${item.kode} — ${item.nama}`
					return item
				}),
			}
		},
		select(result) {
			$('#output').val(JSON.stringify(result, null, '\t'))
		},
	})
</script>

</html>