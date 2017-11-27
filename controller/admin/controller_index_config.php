<?php
namespace app\controller\admin;

use app\common\admin_controller_base;
use common\db\db;
use common\helper\file;
use common\helper\output;

class controller_index_config extends admin_controller_base
{
    
    public function action_index()
    {
        $db = db::main_db();
        $data = $db->select('index_config', ['id']);
        $this->assign('data', $data);
    }

    public function action_get_contents()
    {
        $id = $_POST['id'];
        $db = db::main_db();
        $data = $db->get('index_config', '*', ['id' => $id]);
        return output::ok($data);
    }

    public function action_save()
    {
        $id = $_POST['id'];
        $contents = $_POST['contents'];

        // 保存数据
        $db = db::main_db();
        $data = [
            'contents' => $contents,
        ];
        $db->update('rtf_config', $data , [
            'id' => $id
        ]);
        return output::ok();
    }
}