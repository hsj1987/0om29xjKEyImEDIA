<?php
namespace app\controller\admin;

use app\common\admin_controller_base;
use app\common\user;
use common\helper\output;

class controller_change_pwd extends admin_controller_base
{
    public function action_index()
    {
        $this->assign('curr_pagename', '修改密码');
    }

    public function action_change_pwd()
    {
        $username = user::curr_username();
        $old_pwd = $_POST['old_pwd'];
        $new_pwd = $_POST['new_pwd'];
        if(!user::check_pwd($username, $old_pwd)) {
            return output::err(1, '原密码不正确');
        }

        user::change_pwd($username, $new_pwd);

        return output::ok();
    }
}