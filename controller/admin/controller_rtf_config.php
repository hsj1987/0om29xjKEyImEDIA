<?php
namespace app\controller\admin;

use app\common\admin_controller_base;

class controller_rtf_config extends admin_controller_base
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
                        'id' => 1,
                        'name' => 'justin1'
                    ],
                    [
                        'id' => 2,
                        'name' => 'justin2'
                    ]
                ]
            ]
        ];
    }
}