<?php
namespace app\controller;

use common\frame\web\controller_base;
use app\common\model;
use common\db\db;
use app\common\common;

class controller_index extends controller_base
{
    
    public function action_index()
    {
        $this->assign('page_name', 'HOME');

        $text = model::get_rtf_config(1);
        $this->assign('text', $text);

        $db = db::main_db();
        $index_configs = $db->select('index_config', '*');

        $index_configs2['1'] = $this->get_by_id($index_configs, 1);
        $index_configs2['1']['size'] = 'size1';

        $index_configs2['4'] = $this->get_by_id($index_configs, 4);
        $index_configs2['4']['size'] = 'size2';
        $index_configs2['4']['only_text'] = 'only_text';

        $index_configs2['3'] = $this->get_by_id($index_configs, 3);
        $index_configs2['3']['size'] = 'size2';
        
        $index_configs2['2'] = $this->get_by_id($index_configs, 2);
        $index_configs2['2']['size'] = 'size2';

        $index_configs2['5'] = $this->get_by_id($index_configs, 5);
        $index_configs2['5']['size'] = 'size2';
        $index_configs2['5']['only_text'] = 'only_text';

        $index_configs2['6'] = $this->get_by_id($index_configs, 6);
        $index_configs2['6']['size'] = 'size3';
        common::parse_data($index_configs2, ['title' => 'nl2br', 'desc' => 'nl2br']);
        $this->assign('index_configs', $index_configs2);
        
    }

    private function get_by_id($configs, $id)
    {
        $result = array_filter($configs, function($item) use($id) {
            return $item['id'] == $id;
        });
        $result = array_values($result);
        $result = $result ? $result[0] : null;
        return $result;
    }
}