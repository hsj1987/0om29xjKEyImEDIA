<?php
namespace app\controller\admin;

use app\common\admin_controller_base;
use common\db\db;
use common\helper\output;
use app\common\common;
use common\db_model\sys_config;

class controller_video_manage extends admin_controller_base
{
    
    public function action_index()
    {
        $data = sys_config::instance()->get_data_list('enum', 'video_category');
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
            'create_time',
            'update_time'
        ];
        $data = $db->get_paged('video', $columns, $_POST['pageNo'], $_POST['pageSize'], $where, $sort);
        common::parse_data($data, [
            'is_display' => 'bool',
            'create_time' => 'datetime',
            'update_time' => 'datetime',
        ]);
        if ($_POST['getTotal']) {
            $total = $db->count('video', $where);
        }
        return output::ok($data, ['total' => $total]);
    }

    public function action_get()
    {
        $id = $_POST['id'];
        $db = db::main_db();
        $data = $db->get('video', '*', ['id' => $id]);
        return output::ok($data);
    }

    public function action_save()
    {
        $data_cols = ['category_id', 'title', 'summary', 'is_display', 'sort_num'];
        $res = common::save_data('video', $_POST, 'id', $data_cols);
        return $res;
    }

    public function action_delete()
    {
        common::delete('video', $_POST['id']);
        return output::ok();
    }

    public function action_upload_video()
    {
        error_reporting(E_ALL | E_STRICT);
        require APP_ROOT . '/lib/fileupload/UploadHandler.php';
        $options = [
            'upload_dir' => APP_ROOT . '/web/upload/video/',
            'param_name' => 'file_video'
        ];
        $upload_handler = new \UploadHandler($options);
    }

    public function action_set_video_filename()
    {
        $id = $_POST['id'];
        $filename = $_POST['filename'];
        $db = db::main_db();
        $db->update('video', [
            'video' => $filename
        ], ['id' => $id]);
        return output::ok();
    }    
}