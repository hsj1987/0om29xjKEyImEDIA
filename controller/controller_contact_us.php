<?php
namespace app\controller;

use common\frame\web\controller_base;
use app\common\model;
use common\db\db;
use app\common\common;
use common\helper\output;

class controller_contact_us extends controller_base
{
    
    public function action_index()
    {
        $this->assign('page_name', 'CONTACT US');

        $big_img = model::get_big_img_config(7);
        common::parse_data($big_img, ['text1' => 'nl2br', 'text2' => 'nl2br']);
        $this->assign('big_img', $big_img);

        $rtf = model::get_rtf_config(5);
        $this->assign('rtf', $rtf);
    }

    public function action_submit_info()
    {
        $subject = '联系我们（来自官网）';
        $content = '<div style="font-size:14px; color: #555;">';
        $content .= '<b style="color: #000;">NAME:</b> ' . $_POST['name'] . '<br/><br/>';
        $content .= '<b style="color: #000;">EMAIL:</b> ' . $_POST['email'] . '<br/><br/>';
        $content .= '<b style="color: #000;">TELEPHONE:</b> ' . $_POST['telephone'] . '<br/><br/>';
        $content .= '<b style="color: #000;">COMPANY:</b> ' . $_POST['company'] . '<br/><br/>';
        $content .= '<b style="color: #000;">MESSAGE:</b> ' . $_POST['message'] . '<br/><br/>';
        $content .= '</div>';
        $ok = common::send_email($subject, $content, ['84305578@qq.com' => '科翼传媒']);
        if ($ok) {
            return output::ok();
        } else {
            return output::err(1, '提交失败');
        }
    }
}