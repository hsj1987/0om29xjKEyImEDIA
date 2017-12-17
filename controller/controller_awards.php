<?php
namespace app\controller;

use common\frame\web\controller_base;
use app\common\model;
use common\db\db;
use app\common\common;
use common\helper\output;
use common\db_model\sys_config;

class controller_awards extends controller_base
{
    
    public function action_index()
    {
        $this->assign('page_name', 'AWARDS');

        $big_img = model::get_big_img_config(6);
        common::parse_data($big_img, ['text1' => 'nl2br', 'text2' => 'nl2br']);
        $this->assign('big_img', $big_img);

        $categorys = sys_config::instance()->get_data_list('enum', 'award_category');
        $db = db::main_db();
        $categorys2 = [];
        foreach($categorys as $category_id => $category_name) {
            $items = $db->select('award', ['name', 'logo'], [
                'AND' => [
                    'category_id' => $category_id,
                    'is_display' => 1,
                    'deleted' => 0
                ],
                'SORT' => 'sort_num,create_time DESC'
            ]);
            if ($items) {
                $categorys2[] = [
                    'name' => $category_name,
                    'items' => $items
                ];
            }
        }
        $this->assign('categorys', $categorys2);
    }
}