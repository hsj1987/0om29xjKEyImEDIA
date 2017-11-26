<?php

define('CURR_ENV_NAME', 'test');

// WEB LOG配置
$WEB_LOG_CONFIG = [
    'outputs' => [
        'logagent' => [
            'class' => 'common\log\output_file' // output类
        ]
    ]
];