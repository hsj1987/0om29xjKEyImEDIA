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

        $db = db::main_db();

        // 上传图片
        if ($img) {
            $path = APP_ROOT . '/web/upload/big_img';

            // 删除原图
            $old_img = $db->get('big_img_config', 'img', ['id' => $id]);
            if ($old_img) {
                @unlink($path . '/' . $old_img);
            }
            
            // 上传新图
            $img_name = $id . '_' . time();
            $img_name = file::upload_img_by_base64($img, $path, $img_name);
            if(!$img_name) {
                return output::err(1, '图片上传失败');
            }
        }

        // 保存数据
        $data = [
            'text1' => $text1,
            'text2' => $text2
        ];
        if ($img) {
            $data['img'] = $img_name;
        }
        $db->update('big_img_config', $data , [
            'id' => $id
        ]);

        return output::ok(['img_name' => $img_name]);
    }
}