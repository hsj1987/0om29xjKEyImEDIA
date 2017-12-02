<?php
namespace app\controller\admin;

use app\common\admin_controller_base;
use common\db\db;
use common\helper\output;
use app\common\common;
use common\db_model\sys_config;

class controller_award_manage extends admin_controller_base
{
    
    public function action_index()
    {
        $data = sys_config::instance()->get_data_list('enum', 'award_category');
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
        $data = $db->get_paged('award', $columns, $_POST['pageNo'], $_POST['pageSize'], $where, $sort);
        common::parse_data($data, [
            'is_display' => 'bool',
            'create_time' => 'datetime',
            'update_time' => 'datetime',
        ]);
        if ($_POST['getTotal']) {
            $total = $db->count('award', $where);
        }
        return output::ok($data, ['total' => $total]);
    }

    public function action_get()
    {
        $id = $_POST['id'];
        $db = db::main_db();
        $data = $db->get('award', '*', ['id' => $id]);
        return output::ok($data);
    }

    public function action_save()
    {
        $img_path = APP_ROOT . '/web/upload/award_img';
        $data_cols = ['category_id', 'name', 'is_display', 'sort_num'];
        $img_cols = ['logo'];
        $res = common::save_data('award', $_POST, 'id', $data_cols, $img_cols, $img_path);
        return $res;
    }

    public function action_delete()
    {
        common::delete('award', $_POST['id']);
        return output::ok();
    }
}