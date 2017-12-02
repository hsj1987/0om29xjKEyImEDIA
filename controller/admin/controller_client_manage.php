<?php
namespace app\controller\admin;

use app\common\admin_controller_base;
use common\db\db;
use common\helper\output;
use app\common\common;
use common\db_model\sys_config;

class controller_client_manage extends admin_controller_base
{
    
    public function action_index()
    {
        $data = sys_config::instance()->get_data_list('enum', 'client_category');
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
            'name',
            'is_display',
            'logo',
            'create_time',
            'update_time'
        ];
        $data = $db->get_paged('client', $columns, $_POST['pageNo'], $_POST['pageSize'], $where, $sort);
        common::parse_data($data, [
            'is_display' => 'bool',
            'create_time' => 'datetime',
            'update_time' => 'datetime',
        ]);
        if ($_POST['getTotal']) {
            $total = $db->count('client', $where);
        }
        return output::ok($data, ['total' => $total]);
    }

    public function action_get()
    {
        $id = $_POST['id'];
        $db = db::main_db();
        $data = $db->get('client', '*', ['id' => $id]);
        return output::ok($data);
    }

    public function action_save()
    {
        $img_path = APP_ROOT . '/web/upload/client_img';
        $data_cols = ['category_id', 'name', 'is_display', 'sort_num'];
        $img_cols = ['logo'];
        $res = common::save_data('client', $_POST, 'id', $data_cols, $img_cols, $img_path);
        return $res;
    }

    public function action_delete()
    {
        common::delete('client', $_POST['id']);
        return output::ok();
    }
}