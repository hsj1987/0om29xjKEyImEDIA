<?php

namespace app\common;

use common\helper\output;
use app\common\common;

class admin_controller_base extends \common\frame\web\controller_base
{
    public $assign_page_route = true;
    public $need_valid_auth = true;
    public $need_load_nav = true;

    public function on_init($action_type)
    {
        // 验证是否登录
        if($this->need_valid_auth && !common::islogin()) {
            if ($action_type == 'render') {
                return output::redirect('/admin/login.html');
            } else {
                return output::err_token();
            }
        }

        // 加载导航栏
        if ($this->need_load_nav && $action_type == 'render') {
            $pages = [
                '页面配置' => [
                    [
                        'name' => '大图配置',
                        'url' => 'big_img_config'
                    ],
                    [
                        'name' => '富文本配置',
                        'url' => 'rtf_config'
                    ],
                    [
                        'name' => '首页配置',
                        'url' => 'index_config'
                    ],
                    [
                        'name' => 'work主页配置',
                        'url' => 'work_config'
                    ],
                ],
                '数据管理' => [
                    [
                        'name' => 'work管理',
                        'url' => 'work_manage'
                    ],
                    [
                        'name' => '新闻管理',
                        'url' => 'news_manage'
                    ],
                    [
                        'name' => '招聘管理',
                        'url' => 'recruit_manage'
                    ],
                    [
                        'name' => '客户管理',
                        'url' => 'client_manage'
                    ],
                    [
                        'name' => '奖项管理',
                        'url' => 'award_manage'
                    ],
                ]
            ];
            $this->assign('nav_pages', $pages);

            // 加载当前用户信息
            $curr_username = common::curr_username();
            $this->assign('curr_username', $curr_username);
        }
        return output::ok();
    }
}