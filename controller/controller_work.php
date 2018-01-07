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
        
        $other_ids = $this->_get_other_id($data['id'], $data['category_id']);
        $this->assign('prev_id', $other_ids['prev_id']);
        $this->assign('next_id', $other_ids['next_id']);
        
    }

    public function _get_other_id($id, $category_id)
    {
        $db = db::main_db();
        $ids = $db->select('work', 'id', [
            'AND' => [
                'is_display' => 1,
                'deleted' => 0,
                'category_id' => $category_id
            ],
            'ORDER' => 'sort_num, create_time desc'
        ]);
        $index = array_search($id, $ids);
        $last_index = count($ids)-1;
        $prev_id = $index === 0 ? $ids[$last_index] : $ids[$index-1];
        $next_id = $index === $last_index ? $ids[0]: $ids[$index+1];
        return [
            'prev_id' => $prev_id,
            'next_id' => $next_id
        ];
    }

    public function get_data()
    {
        $id = $_GET['id'];
        $cid = $_GET['cid'];

        if (!$id && !$cid) {
             return output::err(1, '参数不完整');
        }

        $db = db::main_db();
        $columns = ['id', 'title', 'category_id', 'img', 'contents', 'sort_num', 'create_time'];
        $where = [
            'AND' => [
                'is_display' => 1,
                'deleted' => 0
            ],
            'ORDER' => 'sort_num, create_time desc'
        ];
        if (!$id) { 
            $where['AND']['category_id'] = $cid;
            $data = $db->get('work', $columns, $where);
            if (!$data) {
                return output::err(2, '该WORK分类下还没有WORK信息');
            }
        } else {
            $where['AND']['id'] = $id;
            $data = $db->get('work', $columns, $where);
            if (!$data) {
                return output::err(2, '数据不存在或不可见');
            }
        }

        return output::ok($data);
    }
}