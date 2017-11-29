<?php
namespace app\common;

use common\helper\utils;
use common\db\db;
use common\helper\file;
use common\helper\output;

class common
{
    /**
     * 保存数据
     */
    public static function save_data($table, $data_source, $id_col, $data_cols = null, $img_cols = null, $img_path = null)
    {
        $id = $data_source[$id_col];
        $db = db::main_db();

        // 上传图片
        $img_data = [];
        if (is_array($img_cols) && $img_cols) {
            $old_imgs = $db->get($table, $img_cols, ['id' => $id]);
            foreach ($img_cols as $img_col) {
                // 无新图
                if (!$data_source[$img_col]) {
                    continue;
                }
                // 上传新图
                $img_name = $id . '_' . $img_col . '_' . time();
                $img_name = file::upload_img_by_base64($data_source[$img_col], $img_path, $img_name);
                if (!$img_name) {
                    return output::err(1, '图片上传失败');
                }

                // 删除原图
                if ($old_imgs[$img_col]) {
                    @unlink($path . '/' . $old_imgs[$img_col]);
                }
                $img_data[$img_col] = $img_name;
            }
        }

        // 设置数据
        $data = [];
        if (is_array($data_cols) && $data_cols) {
            foreach ($data_cols as $data_col) {
                $data[$data_col] = $data_source[$data_col];
            }
        }
        $data = array_merge($img_data, $data);

        if ($data) {
            $db->update($table, $data , [
                'id' => $id
            ]);
        }
        
        return output::ok($img_data);
    }
}