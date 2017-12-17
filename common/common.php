<?php
namespace app\common;

use common\helper\utils;
use common\db\db;
use common\helper\file;
use common\helper\output;

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
    public static function save_data($table, $data_source, $id_col, $data_cols = null, $img_cols = null, $img_path = null)
    {
        $id = $data_source[$id_col];

        // 设置数据
        $data = [];
        if (is_array($data_cols) && $data_cols) {
            foreach ($data_cols as $data_col) {
                $data[$data_col] = $data_source[$data_col];
            }
        }

        $db = db::main_db();
        $db->begintran();

        try {
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