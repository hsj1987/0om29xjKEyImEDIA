<?php
namespace app\controller;

use common\frame\web\controller_base;
use app\common\model;
use common\db\db;
use app\common\common;
use common\helper\output;

class controller_news extends controller_base
{
    
    public function action_index()
    {
        $this->assign('page_name', 'NEWS');

        $id = $_GET['id'];

        if (!$id) {
             return output::err(1, '参数不完整');
        }

        $db = db::main_db();
        $data = $db->get('news', ['title', 'contents'], ['id' => $id]);
        $this->assign('data', $data);
    }
}