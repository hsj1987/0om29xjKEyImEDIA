<?php
namespace app\controller\admin;

use app\common\admin_controller_base;
use common\db\db;
use common\helper\output;
use app\common\common;

class controller_big_img_config extends admin_controller_base
{
    
    public function action_index()
    {
        $db = db::main_db();
        $data = $db->select('big_img_config', ['id', 'name']);
        $this->assign('data', $data);
    }

    public function action_get()
    {
        $id = $_POST['id'];
        $db = db::main_db();
        $data = $db->get('big_img_config', '*', ['id' => $id]);
        return output::ok($data);
    }

    public function action_save()
    {
        $img_path = APP_ROOT . '/web/upload/big_img';
        $res = common::save_data('big_img_config', $_POST, 'id', ['text1', 'text2'], ['img'], $img_path);
        return $res;
    }
}