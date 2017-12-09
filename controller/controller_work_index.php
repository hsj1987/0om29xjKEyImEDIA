<?php
namespace app\controller;

use common\frame\web\controller_base;
use app\common\model;
use common\db\db;
use app\common\common;

class controller_work_index extends controller_base
{
    
    public function action_index()
    {
        $this->assign('page_name', 'OUR WORK');

        $text = model::get_rtf_config(2);
        $this->assign('text', $text);

        $db = db::main_db();
        $categorys = $db->select('work_category', '*');
        common::parse_data($categorys, ['title' => 'nl2br']);
        $this->assign('categorys', $categorys);

        $where = [
            'AND' => [
                'is_in_index' => 1,
                'is_display' => 1,
                'deleted' => 0
            ],
            'ORDER' => 'sort_num, create_time desc'
        ];
        $works = $db->select('work', ['id', 'index_img', 'index_logo', 'index_name', 'index_title'], $where);
        common::parse_data($works, ['index_title' => 'nl2br']);
        $this->assign('works', $works);
    }
}