<?php
namespace app\controller\admin;

use app\common\admin_controller_base;
use common\helper\output;
use common\db\db;
use app\common\common;

class controller_login extends admin_controller_base
{
    public $need_valid_auth = false;
    public $need_load_nav = false;

    public function action_login()
    {
        $username = $_POST['username'];
        $password = $_POST['password'];
        if (common::check_pwd($username, $password)) {
            common::login([
                'username' => $username
            ]);
            return output::ok([
                'first_page' => '/admin/big_img_config.html'
            ]);
        } else {
            return output::err(1, '用户名或密码错误');
        }
    }
}