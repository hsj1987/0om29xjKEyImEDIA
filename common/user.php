<?php
namespace app\common;

use common\helper\utils;
use common\db\db;

class user
{
    public static function check_pwd($username, $password)
    {
        $db = db::main_db();
        $exists = $db->has('user', [
            'AND' => [
                'username' => $username,
                'password' => sha1($password),
            ]
        ]);
        return $exists;
    }

    public static function change_pwd($username, $new_pwd)
    {
        $db = db::main_db();
        $db->update('user', [
            'password' => sha1($new_pwd)
        ], [
            'username' => $username
        ]);
    }

    public static function login($curr_userinfo)
    {
        $_SESSION['curr_userinfo'] = $curr_userinfo;
    }

    public static function logout()
    {
        session_unset();
    }

    public static function islogin()
    {
        return isset($_SESSION['curr_userinfo']) && !utils::is_empty($_SESSION['curr_userinfo']);
    }

    public static function curr_username()
    {
        return isset($_SESSION['curr_userinfo']) ? $_SESSION['curr_userinfo']['username'] : null;
    }
}