<?php
namespace app\controller\admin;

use app\common\admin_controller_base;
use common\db\db;
use common\helper\file;
use common\helper\output;
use common\helper\utils;
use app\common\common;

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
        $raw_post_data = file_get_contents('php://input', 'r');
        $post = utils::url_params_to_json($raw_post_data);
        $id = $post['id'];
        $contents = $post['contents'];

        // 保存数据
        $res = common::save_data('rtf_config', $post, 'id', ['contents'], null, null, ['contents']);
        if ($res['stat'] !== 0) {
            return $res;
        }
        return output::ok();
    }
}