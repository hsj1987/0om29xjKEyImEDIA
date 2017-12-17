<?php
namespace app\controller;

use common\frame\web\controller_base;
use app\common\model;
use common\db\db;
use app\common\common;
use common\helper\output;
use common\db_model\sys_config;

class controller_recruit extends controller_base
{
    
    public function action_index()
    {
        $this->assign('page_name', 'RECRUIT');

        $big_img = model::get_big_img_config(3);
        common::parse_data($big_img, ['text1' => 'nl2br', 'text2' => 'nl2br']);
        $this->assign('big_img', $big_img);

        $areas = sys_config::instance()->get_data_list('enum', 'recruit_area');
        $db = db::main_db();
        $areas2 = [];
        foreach($areas as $area_id => $area_name) {
            $items = $db->select('recruit', ['title', 'desc'], [
                'AND' => [
                    'area_id' => $area_id,
                    'is_display' => 1,
                    'deleted' => 0
                ],
                'SORT' => 'sort_num,create_time DESC'
            ]);
            common::parse_data($items, ['desc' => 'nl2br']);
            $areas2[] = [
                'id' => $area_id,
                'name' => $area_name,
                'items' => $items ? $items : []
            ];
        }
        $this->assign('recruit_areas', $areas2);
    }

    public function action_submit_info()
    {
        $subject = '职位申请（来自官网）';
        $content = '<div style="font-size:14px; color: #555;max-width: 600px">';
        $content .= '<b style="color: #000;">NAME:</b> ' . $_POST['name'] . '<br/><br/>';
        $content .= '<b style="color: #000;">APPLY FOR POSITION:</b> ' . $_POST['position'] . '<br/><br/>';
        $content .= '<b style="color: #000;">SELF INTRODUCTION:</b> ' . nl2br($_POST['introduction']) . '<br/><br/>';
        $content .= '</div>';
        $ok = common::send_email($subject, $content, ['pr@keyimedia.com' => '科翼传媒']);
        if ($ok) {
            return output::ok();
        } else {
            return output::err(1, '提交失败');
        }
    }

    
}