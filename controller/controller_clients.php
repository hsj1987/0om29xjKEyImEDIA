<?php
namespace app\controller;

use common\frame\web\controller_base;
use app\common\model;
use common\db\db;
use app\common\common;
use common\helper\output;
use common\db_model\sys_config;

class controller_clients extends controller_base
{
    
    public function action_index()
    {
        $this->assign('page_name', 'OUT CLIENTS');

        $categorys = sys_config::instance()->get_data_list('enum', 'client_category');
        $db = db::main_db();
        $categorys2 = [];
        foreach($categorys as $category_id => $category_name) {
            $items = $db->select('client', ['name', 'logo'], [
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