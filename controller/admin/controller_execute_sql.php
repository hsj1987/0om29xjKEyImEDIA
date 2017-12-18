<?php
namespace app\controller\admin;

use app\common\admin_controller_base;
use common\db\db;
use common\helper\file;
use common\helper\output;

class controller_execute_sql extends admin_controller_base
{
    
    public function action_index()
    {
    }

    public function action_execute()
    {
        $sql = $_POST['sql'];
        $db = db::main_db();
        $sql = trim($sql);
        $sql_arr = explode(' ', $sql);
        if (strtolower($sql_arr[0]) == 'select') {
            $result = $db->all($sql);
        } else {
            $result = $db->exec($sql);
        }
        $data = [
            'result' => $result,
        ];
        return output::ok($data);
    }
}