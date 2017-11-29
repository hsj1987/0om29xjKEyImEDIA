<?php
namespace app\controller\admin;

use app\common\admin_controller_base;
use common\db\db;
use common\helper\output;
use app\common\common;

class controller_work_manage extends admin_controller_base
{
    
    public function action_index()
    {
        $db = db::main_db();
        $data = $db->select('index_config', ['id']);
        $this->assign('data', $data);
    }

    public function action_get()
    {
        $id = $_POST['id'];
        $db = db::main_db();
        $data = $db->get('index_config', '*', ['id' => $id]);
        return output::ok($data);
    }

    public function action_save()
    {
        $img_path = APP_ROOT . '/web/upload/index_img';
        $res = common::save_data('index_config', $_POST, 'id', ['name', 'title', 'link', 'desc'], ['img', 'logo'], $img_path);
        return $res;
    }
}