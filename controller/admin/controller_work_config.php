<?php
namespace app\controller\admin;

use app\common\admin_controller_base;
use common\db\db;
use common\helper\output;
use app\common\common;

class controller_work_config extends admin_controller_base
{
    
    public function action_index()
    {
        $db = db::main_db();
        $data = $db->select('work_category', ['id', 'name']);
        $this->assign('data', $data);
    }

    public function action_get()
    {
        $id = $_POST['id'];
        $db = db::main_db();
        $data = $db->get('work_category', '*', ['id' => $id]);
        return output::ok($data);
    }

    public function action_save()
    {
        $img_path = APP_ROOT . '/web/upload/work_img';
        $res = common::save_data('work_category', $_POST, 'id', ['title'], ['img'], $img_path);
        return $res;
    }
}