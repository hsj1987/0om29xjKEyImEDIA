<?php
namespace app\common;

use common\helper\utils;
use common\db\db;
use common\helper\file;
use common\helper\output;
use common\log\log;

require APP_ROOT . '/mail/Exception.php';
require APP_ROOT . '/mail/PHPMailer.php';
require APP_ROOT . '/mail/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class common
{
    /**
     * 保存数据
     */
    public static function save_data($table, $data_source, $id_col, $data_cols = null, $img_cols = null, $img_path = null, $rtf_cols = null)
    {
        $id = $data_source[$id_col];

        $db = db::main_db();
        $db->begintran();

        try {
            // 从富文本中抽出图片上传并替换
            if ($rtf_cols) {
                $rtf_img_web_path = '/upload/rtf_img';
                $rtf_img_path = APP_ROOT . '/web' . $rtf_img_web_path;
                foreach ($rtf_cols as $rtf_col) {
                    if (preg_match_all('/data:\s*image\/\w+;base64,[^"]+/', $data_source[$rtf_col], $matches, PREG_OFFSET_CAPTURE)) {
                        $prev_match_length = 0;
                        $prev_web_uri_length = 0;
                        $matches = $matches[0];
                        foreach ($matches as $match) {
                            $base64_data = $match[0];
                            $match_length = strlen($base64_data);
                            $match_pos = $match[1] - ($prev_match_length - $prev_web_uri_length);
                            $img_name = utils::uuid();
                            $img_name = file::upload_img_by_base64($base64_data, $rtf_img_path, $img_name);
                            if (!$img_name) {
                                $db->rollback();
                                return output::err(1, '富文本里的图片上传失败');
                            }
                            $rtf_img_web_uri = $rtf_img_web_path . '/' . $img_name;
                            $data_source[$rtf_col] = substr_replace($data_source[$rtf_col], $rtf_img_web_uri, $match_pos, $match_length);
                            $prev_match_length = $match_length;
                            $prev_web_uri_length = strlen($rtf_img_web_uri);
                        }
                    }
                }
            }

            // 设置数据
            $data = [];
            if (is_array($data_cols) && $data_cols) {
                foreach ($data_cols as $data_col) {
                    $data[$data_col] = $data_source[$data_col];
                }
            }

            // 保存数据
            if ($data) {
                if ($id) {
                    $db->update($table, $data , [
                        'id' => $id
                    ]);
                } else {
                    $id = $db->insert($table, $data);
                }
            }

            // 上传图片
            $img_data = [];
            if (is_array($img_cols) && $img_cols) {
                $old_imgs = $db->get($table, $img_cols, ['id' => $id]);
                foreach ($img_cols as $img_col) {
                    // 无新图
                    if (!$data_source[$img_col]) {
                        continue;
                    }
                    // 上传新图
                    $img_name = $id . '_' . $img_col . '_' . time();
                    $img_name = file::upload_img_by_base64($data_source[$img_col], $img_path, $img_name);
                    if (!$img_name) {
                        $db->rollback();
                        return output::err(1, '图片上传失败');
                    }

                    // 删除原图
                    if ($old_imgs[$img_col]) {
                        @unlink($path . '/' . $old_imgs[$img_col]);
                    }
                    $img_data[$img_col] = $img_name;
                }
            }

            // 保存图片
            if ($img_data) {
                $db->update($table, $img_data , [
                    'id' => $id
                ]);
            }

            $db->commit();
            return output::ok($img_data);
        } catch (\Exception $e) {
            $db->rollback();
            log::error($e);
            return output::err(1, '保存失败');
        }
    }

    /**
     * 格式化数据
     */
    public static function parse_data(&$data, $parse_rules)
    {
        if (!is_array($data) || !$data || !is_array($parse_rules) || !$parse_rules ) {
            return $data;
        }

        $keys = array_keys($data);
        $is_list = is_int($keys[0]) ? true : false;
        if (!$is_list) {
            $data = [$data];
        }
        foreach ($data as $k => $data_item) {
            foreach ($parse_rules as $col => $rule) {
                $value = $data_item[$col];
                switch ($rule) {
                    case 'bool' :
                        $value = $value == 1 ? '是' : '否';
                        break ;
                    case 'datetime' :
                        $value = $value ? date('Y-m-d H:i:s', strtotime($value)) : $value;
                        break;
                    case 'date' :
                        $value = $value ? date('Y-m-d', strtotime($value)) : $value;
                        break;
                    case 'date_cn' :
                        $value = $value ? date('Y年m月d日', strtotime($value)) : $value;
                        break;
                    case 'nl2br' :
                        $value = $value ? nl2br($value) : $value;
                        break;
                }
                $data[$k][$col] = $value;
            }
        }
        if (!$is_list) {
            $data = $data[0];
        }
    }

    /**
     * 删除
     */
    public static function delete($table, $id)
    {
        $db = db::main_db();
        $db->update($table, ['deleted' => 1], ['id' => $id]);
    }

    /**
     * 发送E-mail
     */
    public static function send_email($subject, $content, $address_list)
    {
        $mail = new PHPMailer(true);                              // Passing `true` enables exceptions
        try {
            //Server settings
            $mail->SMTPDebug = 0;                                 // Enable verbose debug output
            $mail->isSMTP();                                      // Set mailer to use SMTP
            $mail->Host = 'smtp.qq.com';  // Specify main and backup SMTP servers
            $mail->SMTPAuth = true;                               // Enable SMTP authentication
            $mail->Username = 'k.k.k@qq.com';                 // SMTP username
            $mail->Password = 'msdmgsscjdatcbdi';                 // SMTP password
            $mail->SMTPSecure = 'ssl';                            // Enable TLS encryption, `ssl` also accepted
            $mail->Port = 465;                             // TCP port to connect to
            $mail->CharSet = 'UTF-8';

            $mail->setFrom('k.k.k@qq.com', '官网访问用户');
            //Recipients
            foreach($address_list as $address => $name) {
                $mail->addAddress($address, $name);     // Add a recipient
            }

            //Content
            $mail->isHTML(true);                                  // Set email format to HTML
            $mail->Subject = $subject;
            $mail->Body    = $content;

            $mail->send();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }
}