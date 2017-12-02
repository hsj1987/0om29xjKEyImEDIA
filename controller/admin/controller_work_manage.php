<?php
namespace app\controller\admin;

use app\common\admin_controller_base;
use common\db\db;
use common\helper\output;
use app\common\common;

class controller_work_manage extends admin_controller_base
{
    
    public function action_index()
    {
        $db = db::main_db();
        $data = $db->select('work_category', ['id', 'name']);
        $this->assign('categorys', $data);
    }

    public function action_get_list()
    {   
        $db = db::main_db();
        $where = [
            'AND' => [
                'category_id' => $_POST['category_id'],
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
            'is_display',
            'is_in_index',
            'create_time',
            'update_time'
        ];
        $data = $db->get_paged('work', $columns, $_POST['pageNo'], $_POST['pageSize'], $where, $sort);
        common::parse_data($data, [
            'is_display' => 'bool',
            'is_in_index' => 'bool',
            'create_time' => 'datetime',
            'update_time' => 'datetime',
        ]);
        if ($_POST['getTotal']) {
            $total = $db->count('work', $where);
        }
        return output::ok($data, ['total' => $total]);
    }

    public function action_get()
    {
        $id = $_POST['id'];
        $db = db::main_db();
        $data = $db->get('work', '*', ['id' => $id]);
        return output::ok($data);
    }

    public function action_save()
    {
        $img_path = APP_ROOT . '/web/upload/work_img';
        $is_in_index = $_POST['is_in_index'];
        $data_cols = ['category_id', 'title', 'contents', 'is_display', 'sort_num', 'is_in_index'];
        $img_cols = ['img'];
        if ($is_in_index) {
            $data_cols = array_merge($data_cols, ['index_name', 'index_title']);
            $img_cols = array_merge($img_cols, ['index_img', 'index_logo']);
        }
        $res = common::save_data('work', $_POST, 'id', $data_cols, $img_cols, $img_path);
        return $res;
    }

    public function action_delete()
    {
        common::delete('work', $_POST['id']);
        return output::ok();
    }
}