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

        // 设置数据
        $data = [];
        if (is_array($data_cols) && $data_cols) {
            foreach ($data_cols as $data_col) {
                $data[$data_col] = $data_source[$data_col];
            }
        }

        $db = db::main_db();
        $db->begintran();

        try {
            // 保存数据
            if ($data) {
                if ($id) {
                    $db->update($table, $data , [
                        'id' => $id
                    ]);
                } else {
                    $id = $db->insert($table, $data);
                }
            }

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
                        $db->rollback();
                        return output::err(1, '图片上传失败');
                    }

                    // 删除原图
                    if ($old_imgs[$img_col]) {
                        @unlink($path . '/' . $old_imgs[$img_col]);
                    }
                    $img_data[$img_col] = $img_name;
                }
            }

            // 保存图片
            if ($img_data) {
                $db->update($table, $img_data , [
                    'id' => $id
                ]);
            }

            $db->commit();
            return output::ok($img_data);
        } catch (\Exception $e) {
            $db->rollback();
            return output::err(1, '保存失败');
        }
    }

    /**
     * 格式化数据
     */
    public static function parse_data(&$data_list, $parse_rules)
    {
        if (!is_array($data_list) || !$data_list || !is_array($parse_rules) || !$parse_rules ) {
            return $data_list;
        }

        foreach ($data_list as $k => $data_item) {
            foreach ($parse_rules as $col => $rule) {
                $value = $data_item[$col];
                switch ($rule) {
                    case 'bool' :
                        $value = $value == 1 ? '是' : '否';
                        break ;
                    case 'datetime' :
                        $value = $value ? date('Y-m-d H:i:s', strtotime($value)) : $value;
                        break;
                    case 'date' :
                        $value = $value ? date('Y-m-d', strtotime($value)) : $value;
                        break;
                    case 'nl2br' :
                        $value = $value ? nl2br($value) : $value;
                        break;
                }
                $data_list[$k][$col] = $value;
            }
        }
    }

    /**
     * 删除
     */
    public static function delete($table, $id)
    {
        $db = db::main_db();
        $db->update($table, ['deleted' => 1], ['id' => $id]);
    }
}