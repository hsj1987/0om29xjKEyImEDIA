<?php
namespace app\controller\admin;

use app\common\admin_controller_base;
use common\db\db;
use common\helper\file;
use common\helper\output;

class controller_big_img_config extends admin_controller_base
{
    
    public function action_index()
    {
        $db = db::main_db();
        $data = $db->select('big_img_config', '*');
        $this->assign('data', $data);
    }

    public function action_save()
    {
        $id = $_POST['id'];
        $text1 = $_POST['text1'];
        $text2 = $_POST['text2'];
        $img = $_POST['img'];

        // 上传图片
        $path = APP_ROOT . '/web/upload/big_img';
        $imgname = $id . '_' . time();
        if(!file::upload_img_by_base64($img, $path, $imgname)) {
            return output::err(1, '图片上传失败');
        }

        // 保存数据
        $db = db::main_db();
        $db->update('big_img_config', [
            'text1' => $text1,
            'text2' => $text2,
            'img' => $imgname
        ], [
            'id' => $id
        ]);

        return output::ok();
    }
}