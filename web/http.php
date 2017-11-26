<?php
// 当前APP根目录
define('APP_ROOT', dirname(__DIR__));

// 公共类库根目录
define('COMMON_APP_ROOT', dirname(APP_ROOT) . '/common/app');

require COMMON_APP_ROOT . '/config/bootstrap.php';
require COMMON_APP_ROOT . '/frame/autoload.php';
require APP_ROOT . '/config/bootstrap.php';
require APP_ROOT . '/autoload.php';

$log = new \common\log\log_request($WEB_LOG_CONFIG);
\common\log\log::$instance = $log;

$app_config = \common\helper\arr::merge(
    require(COMMON_APP_ROOT . '/config/main.php'),
    require(APP_ROOT . '/config/main.php')
);
$app = new \common\frame\web\web_app('keyi', $app_config);
\common\frame\app::$instance = $app;
$app->run();
