<?php

require __DIR__ . '/test_config.php';

$faker = \Faker\Factory::create('id-ID');

$kolomCount = 19;
$kolomItems = [];
for ($i = 0; $i < $kolomCount; $i++) {
	$kolomItems[] = $faker->country;
}

$barisCount = 59;
$barisItems = [];
for ($i = 0; $i < $barisCount; $i++) {
	$item = ['nama' => $faker->company, 'kode' => strtoupper($faker->bothify('##??'))];
	for ($j = 0; $j < $kolomCount; $j++) {
		$item[$j] = $faker->numberBetween(0, 99);
	}
	$barisItems[] = $item;
}

// dd($barisItems, $barisCount);

$cutter('script', function () use ($count, $kolomItems) { ?>
	<script src="../plugins/jquery/table-stuck.js?<?= $count ?>"></script>

	<script>
		$('#data1').tableStuck({
			thead: {
				stuck: 'top',
				cols: {
					0: 'left',
					1: 'left',
					<?= (count($kolomItems) + 2) ?>: 'right',
				},
			},
			tbody: {
				cols: {
					0: 'left',
					1: 'left',
					<?= (count($kolomItems) + 2) ?>: 'right',
				},
			},
			tfoot: {
				stuck: 'bottom',
				cols: {
					0: 'left',
					1: 'right',
				},
			},
		})
	</script>
<?php });

$cutter('content', function () use ($barisItems, $kolomItems) { ?>
	<div class="table-responsive" style="max-height: 81vh;">
		<table id="data1" class="table table-hover table-bordered">
			<thead>
				<th>Kode</th>
				<th>Nama</th>
				<?php foreach ($kolomItems as $kolomItem) { ?>
					<th><?= $kolomItem ?></th>
				<?php } ?>
				<th>Total</th>
			</thead>
			<tbody>
				<?php
				$kolomTotal = 0;
				foreach ($barisItems as $barisItem) { ?>
					<tr>
						<td class="text-nowrap"><?= $barisItem['kode'] ?></td>
						<td class="text-nowrap"><?= $barisItem['nama'] ?></td>

						<?php
						$barisTotal = 0;
						foreach (array_keys($kolomItems) as $index) {
							$barisTotal += $barisItem[$index];
							$kolomTotal += $barisItem[$index];
						?>
							<td class="text-end"><?= $barisItem[$index] ?></td>
						<?php } ?>

						<td class="text-end"><?= $barisTotal ?></td>
					</tr>
				<?php } ?>
			</tbody>
			<tfoot>
				<tr>
					<td colspan="<?= (count($kolomItems) + 2) ?>" style="background: red;">Total</td>
					<td><?= $kolomTotal ?></td>
				</tr>
			</tfoot>
		</table>
	</div>
<?php });

$cutter('style', function () use ($count) { ?>
	<link rel="stylesheet" href="../plugins/jquery/table-stuck.css?<?= $count ?>">
<?php });

$cutter->render();
