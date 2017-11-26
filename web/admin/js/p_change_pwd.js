$(function() {
    Page.init();
});

var Page = {
    init : function() {
        $('#btn_submit').click(function() {
            var res = $('#form').validate({
                inputs: [
                    {
                        name : 'old_pwd',
                        method : ['required', {
                            method : 'minLength',
                            param : 6
                        }]
                    },
                    {
                        name : 'new_pwd',
                        method : ['required', {
                            method : 'minLength',
                            param : 6
                        }]
                    },
                    {
                        name : 'new_pwd2',
                        method : ['required', {
                            method : 'minLength',
                            param : 6
                        }, {
                            method: function(value){
                                return value==$('#form [name=new_pwd]').val();
                            },
                            error: '两次输入密码不一致'
                        }, {
                            method: function(value){
                                return value!=$('#form [name=old_pwd]').val();
                            },
                            error: '新密码不能与旧密码相同'
                        }]
                    }
                ]
            });
            if (!res.suc)
                return false;

            Utils.ajax({
                action: 'change_pwd',
                data : res.data,
                tip : '密码修改成功！',
                success : function(res) {
                    $('#form input').val('');
                }
            });
        });
    }
};