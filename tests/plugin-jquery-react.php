<?php

require __DIR__ . '/test_config.php';

$cutter('script', function () use ($count) { ?>
	<script src="../plugins/jquery/react.js?<?= $count ?>"></script>

	<script>
		$('.react').react()
	</script>
<?php });

$cutter('content', function () { ?>
	<ul class="react">
		<li>Coffee</li>
		<li>Tea</li>
		<li>Milk</li>
	</ul>

	<ol class="react">
		<li>Coffee</li>
		<li>Tea</li>
		<li>Milk</li>
	</ol>

	<dl class="react">
		<dt>Coffee</dt>
		<dd>- black hot drink</dd>
		<dt>Milk</dt>
		<dd>- white cold drink</dd>
	</dl>
<?php });

$cutter->render();
