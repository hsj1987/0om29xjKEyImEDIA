<?php
namespace app\controller\admin;

use app\common\admin_controller_base;
use app\common\common;
use common\helper\output;

class controller_logout extends admin_controller_base
{
    public $need_valid_auth = false;
    public $need_load_nav = false;

    public function action_index()
    {
        user::logout();
        return output::redirect('/admin/login.html');
    }
}