<?php

define('CURR_ENV_NAME', 'IDC');

// WEB LOG配置
$WEB_LOG_CONFIG = [
    'outputs' => [
        'logagent' => [
            'class' => 'common\log\output_file' // output类
        ]
    ]
];

if (CURR_ENV_NAME == 'test') {
    $MAIN_DB_DSN = [
        'db_name' => 'keyi',
        'db_host' => '127.0.0.1',
        'db_port' => 3306,
        'db_user' => 'root',
        'db_pass' => '123456'
    ];
} else {
    $MAIN_DB_DSN = [
        'db_name' => 'keyi',
        'db_host' => '127.0.0.1',
        'db_port' => 3306,
        'db_user' => 'root',
        'db_pass' => 'pr>(mzpe86CSmvus'
    ];
}