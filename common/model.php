<?php
namespace app\common;

use common\helper\utils;
use common\db\db;
use common\helper\file;
use common\helper\output;

class model
{
    public static function get_rtf_config($id)
    {
        $db = db::main_db();
        return $db->get('rtf_config', 'contents', ['id' => $id]);
    }

    public static function get_big_img_config($id)
    {
        $db = db::main_db();
        return $db->get('big_img_config', ['img', 'text1', 'text2'], ['id' => $id]);
    }
}