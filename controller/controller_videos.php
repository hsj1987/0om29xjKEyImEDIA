<?php
namespace app\controller;

use common\frame\web\controller_base;
use app\common\model;
use common\db\db;
use app\common\common;
use common\helper\utils;
use common\helper\output;
use common\db_model\sys_config;

class controller_videos extends controller_base
{
    
    public function action_index()
    {
        $this->assign('page_name', 'VIDEOS');

        $big_img = model::get_big_img_config(8);
        common::parse_data($big_img, ['text1' => 'nl2br', 'text2' => 'nl2br']);
        $this->assign('big_img', $big_img);

        $categorys = sys_config::instance()->get_data_list('enum', 'video_category');
        $db = db::main_db();
        $data = $db->select('video', ['id', 'category_id', 'title', 'summary', 'video'], ['AND' => [
            'is_display' => 1,
            'deleted' => 0
        ], 'ORDER' => [
            'sort_num',
            'create_time DESC'
        ]]);
        $categorys2 = [];
        foreach ($categorys as $category_id => $category_name) {
            $category_videos = array_filter($data, function($video) use($category_id) {
                return $video['category_id'] == $category_id;
            });
            $categorys2[] = [
                'id' => $category_id,
                'name' => $category_name,
                'videos' => $category_videos
            ];
        }
        $this->assign('categorys', $categorys2);
    }
}