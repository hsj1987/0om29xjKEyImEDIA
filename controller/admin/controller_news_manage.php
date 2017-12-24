<?php
namespace app\controller\admin;

use app\common\admin_controller_base;
use common\db\db;
use common\helper\output;
use app\common\common;
use common\helper\utils;

class controller_news_manage extends admin_controller_base
{
    
    public function action_index()
    {
        
    }

    public function action_get_list()
    {   
        $db = db::main_db();
        $where = [
            'AND' => [
                'deleted' => 0
            ]
        ];
        $sort = [
            'sort_num',
            'create_time DESC'
        ];
        $columns = [
            'id',
            'title',
            'date',
            'summary',
            'is_display',
            'create_time',
            'update_time'
        ];
        $data = $db->get_paged('news', $columns, $_POST['pageNo'], $_POST['pageSize'], $where, $sort);
        common::parse_data($data, [
            'is_display' => 'bool',
            'create_time' => 'datetime',
            'update_time' => 'datetime',
        ]);
        if ($_POST['getTotal']) {
            $total = $db->count('news', $where);
        }
        return output::ok($data, ['total' => $total]);
    }

    public function action_get()
    {
        $id = $_POST['id'];
        $db = db::main_db();
        $data = $db->get('news', '*', ['id' => $id]);
        return output::ok($data);
    }

    public function action_save()
    {
        $raw_post_data = file_get_contents('php://input', 'r');
        $post = utils::url_params_to_json($raw_post_data);
        $data_cols = ['summary', 'title', 'date', 'contents', 'is_display', 'sort_num'];
        $res = common::save_data('news', $post, 'id', $data_cols);
        return $res;
    }

    public function action_delete()
    {
        common::delete('news', $_POST['id']);
        return output::ok();
    }
}