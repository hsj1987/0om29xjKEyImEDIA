<?php

define('CURR_ENV_NAME', 'test');

$VERSION_INFO = [
    'num' => '1.2',
    'make_time' => '2017-12-18'
];

// WEB LOG配置
$WEB_LOG_CONFIG = [
    'outputs' => [
        'logagent' => [
            'class' => 'common\log\output_file', // output类
            'logs' => [] // 只记录错误log
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