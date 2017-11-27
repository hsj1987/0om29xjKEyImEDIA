<?php
namespace app\controller\admin;

use app\common\admin_controller_base;
use common\db\db;
use common\helper\file;
use common\helper\output;

class controller_rtf_config extends admin_controller_base
{
    
    public function action_index()
    {
        $db = db::main_db();
        $data = $db->select('rtf_config', ['id', 'name']);
        $this->assign('data', $data);
    }

    public function action_get_contents()
    {
        $id = $_POST['id'];
        $db = db::main_db();
        $contents = $db->get('rtf_config', 'contents', ['id' => $id]);
        return output::ok($contents);
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