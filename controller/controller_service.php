<?php
namespace app\controller;

use common\frame\web\controller_base;
use app\common\model;
use common\db\db;
use app\common\common;

class controller_service extends controller_base
{
    
    public function action_index()
    {
        $this->assign('page_name', 'SERVICE');

        $rtf3 = model::get_rtf_config(3);
        $this->assign('rtf3', $rtf3);
        $rtf4 = model::get_rtf_config(4);
        $this->assign('rtf4', $rtf4);

        $big_img = model::get_big_img_config(4);
        common::parse_data($big_img, ['text1' => 'nl2br', 'text2' => 'nl2br']);
        $this->assign('big_img', $big_img);
    }
}