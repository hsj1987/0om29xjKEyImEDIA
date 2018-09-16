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
        $this->assign('categorys', $categorys);
    }

    public function action_get_list()
    {
        $category_id = $_POST['category_id'];
        $page_no = utils::get($_POST, 'page_no', 1);
        $page_size = utils::get($_POST, 'page_size', 10);
        $db = db::main_db();
        $where = [
            'AND' => [
                'is_display' => 1,
                'deleted' => 0,
                'category_id' => $category_id
            ]
        ];
        $sort = [
            'sort_num',
            'create_time DESC'
        ];
        $data = $db->get_paged('video', ['id', 'category_id', 'title', 'summary', 'video'], $page_no, $page_size, $where, $sort);
        
        if ($_POST['get_total']) {
            $total = $db->count('video', $where);
            $params = ['total' => $total];
        }
        return output::ok($data, $params);


        
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