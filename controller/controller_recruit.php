<?php
namespace app\controller;

use common\frame\web\controller_base;
use app\common\model;
use common\db\db;
use app\common\common;
use common\helper\output;

class controller_recruit extends controller_base
{
    
    public function action_index()
    {
        $this->assign('page_name', 'RECRUIT');
    }
}