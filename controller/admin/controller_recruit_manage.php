<?php
namespace app\controller\admin;

use app\common\admin_controller_base;
use common\db\db;
use common\helper\output;
use app\common\common;
use common\db_model\sys_config;

class controller_recruit_manage extends admin_controller_base
{
    
    public function action_index()
    {
        $data = sys_config::instance()->get_data_list('enum', 'recruit_area');
        $this->assign('areas', $data);
    }

    public function action_get_list()
    {   
        $db = db::main_db();
        $where = [
            'AND' => [
                'area_id' => $_POST['area_id'],
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
            'create_time',
            'update_time'
        ];
        $data = $db->get_paged('recruit', $columns, $_POST['pageNo'], $_POST['pageSize'], $where, $sort);
        common::parse_data($data, [
            'is_display' => 'bool',
            'create_time' => 'datetime',
            'update_time' => 'datetime',
        ]);
        if ($_POST['getTotal']) {
            $total = $db->count('recruit', $where);
        }
        return output::ok($data, ['total' => $total]);
    }

    public function action_get()
    {
        $id = $_POST['id'];
        $db = db::main_db();
        $data = $db->get('recruit', '*', ['id' => $id]);
        return output::ok($data);
    }

    public function action_save()
    {
        $data_cols = ['area_id', 'title', 'desc', 'is_display', 'sort_num'];
        $res = common::save_data('recruit', $_POST, 'id', $data_cols);
        return $res;
    }

    public function action_delete()
    {
        common::delete('recruit', $_POST['id']);
        return output::ok();
    }
}