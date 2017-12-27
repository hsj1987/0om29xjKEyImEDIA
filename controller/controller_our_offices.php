<?php
namespace app\controller;

use common\frame\web\controller_base;
use app\common\model;
use common\db\db;
use app\common\common;
use common\helper\output;

class controller_our_offices extends controller_base
{
    
    public function action_index()
    {
        $this->assign('page_name', 'OUR OFFICES');

        $id = $_GET['id'];

        if (!$id) {
             return output::err(1, '参数不完整');
        }

        $data = [
            1 => [
                'curr_city' => '上海',
                'addr' => '上海闵行区沪闵路6088号凯德龙之梦32层',
                'lng' => 121.385192,
                'lat' => 31.114082
            ],
            2 => [
                'curr_city' => '北京',
                'addr' => '北京朝阳区东大桥路8号尚都国际中心A座2612室',
                'lng' => 116.459823,
                'lat' => 39.923568
            ]
        ];
        $data = $data[$id];
        $this->assign('data', $data);
    }
}