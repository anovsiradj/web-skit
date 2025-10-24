<?php

use Yiisoft\Strings\Inflector;

require __DIR__ . '/../vendor/autoload.php';

$title = basename($_SERVER['REQUEST_URI'], '.php');
$title = (new Inflector)->toPascalCase($title);

$_COOKIE['count'] ??= 0;
$count = intval($_COOKIE['count']);
$count++;
$_COOKIE['count'] = $count;
setcookie('count', $count);
// dd($count);

$cutter = new anovsiradj\Cutter;
$cutter->data(compact('title', 'count'));
$cutter->set('layout', '/test_layout.php');
