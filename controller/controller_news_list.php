<?php
namespace app\controller;

use common\frame\web\controller_base;
use app\common\model;
use common\db\db;
use app\common\common;
use common\helper\utils;
use common\helper\output;

class controller_news_list extends controller_base
{
    
    public function action_index()
    {
        $this->assign('page_name', 'NEWS');

        $big_img = model::get_big_img_config(2);
        common::parse_data($big_img, ['text1' => 'nl2br', 'text2' => 'nl2br']);
        $this->assign('big_img', $big_img);
    }

    public function action_get_list()
    {
        $page_no = utils::get($_POST, 'page_no', 1);
        $page_size = utils::get($_POST, 'page_size', 10);
        $db = db::main_db();
        $where = [
            'AND' => [
                'is_display' => 1,
                'deleted' => 0
            ]
        ];
        $news_list = $db->get_paged('news', ['id', 'title', 'summary', 'create_time'], $page_no, $page_size, $where, 'sort_num, create_time desc');
        common::parse_data($news_list, ['create_time' => 'date_cn']);
        
        if ($_POST['get_total']) {
            $total = $db->count('news', $where);
            $params = ['total' => $total];
        }
        return output::ok($news_list, $params);
    }
}