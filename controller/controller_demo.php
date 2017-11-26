<?php
namespace app\controller;

use common\frame\web\controller_base;

class controller_demo extends controller_base
{

    public $assign_url_params = true;

    public $assign_version = true;
    
    public function action_index()
    {
        $this->assign('title', '这是一个demo页面');
    }

    public function action_get_data()
    {
        return [
            'stat' => 0,
            'data' => [
                'input' => $_POST['input'],
                'output' => [
                    [
                        'id' => 'md5',
                        'name' => md5('keyi888')
                    ],
                    [
                        'id' => 'sha1',
                        'name' => sha1('keyi888')
                    ]
                ]
            ]
        ];
    }
}