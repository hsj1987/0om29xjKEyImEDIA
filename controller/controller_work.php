<?php
namespace app\controller;

use common\frame\web\controller_base;
use app\common\model;
use common\db\db;
use app\common\common;
use common\helper\output;

class controller_work extends controller_base
{
    
    public function action_index()
    {
        $this->assign('page_name', 'OUR WORK');

        $res = $this->get_data();
        if ($res['stat'] !== 0) {
            return $res;
        }
        $data = $res['data'];
        $this->assign('data', $data);
        
        $db = db::main_db();
        $next_id = $db->get('work', 'id', [
            'AND' => [
                'is_display' => 1,
                'deleted' => 0,
                'id[!]' => $data['id'],
                'sort_num[>=]' => $data['sort_num'],
                'create_time[<=]' => $data['create_time'] 
            ]
        ]);
        $this->assign('next_id', $next_id);

        $prev_id = $db->get('work', 'id', [
            'AND' => [
                'is_display' => 1,
                'deleted' => 0,
                'id[!]' => $data['id'],
                'sort_num[<=]' => $data['sort_num'],
                'create_time[>=]' => $data['create_time'] 
            ]
        ]);
        $this->assign('prev_id', $prev_id);
    }

    public function get_data()
    {
        $id = $_GET['id'];
        $cid = $_GET['cid'];

        if (!$id && !$cid) {
             return output::err(1, '参数不完整');
        }

        $db = db::main_db();
        $columns = ['id', 'title', 'img', 'contents', 'sort_num', 'create_time'];
        $where = [
            'AND' => [
                'is_display' => 1,
                'deleted' => 0
            ],
            'ORDER' => 'sort_num, create_time desc'
        ];
        if (!$id) { 
            $where['AND']['category_id'] = $cid;
            $where['LIMIT'] = [0, 1];
            $data = $db->get('work', $columns, $where);
        } else {
            $where['AND']['id'] = $id;
            $data = $db->get('work', $columns, $where);
        }

        if (!$data) {
            return output::err(2, '数据不存在或不可见');
        }

        return output::ok($data);
    }
}