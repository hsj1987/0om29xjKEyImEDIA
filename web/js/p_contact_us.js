$(function() {
    Page.init();
});

var Page = {
    init: function() {
        $('#btn_submit').click(function() {
            var res = $('.submit_bar').validate({
                inputs: [
                    {
                        name : 'name',
                        method : ['required', {
                            method : 'minLength',
                            param : 2
                        }, {
                            method : 'maxLength',
                            param : 32
                        }]
                    },{
                        name : 'email',
                        method : ['required', 'email']
                    },{
                        name : 'telephone',
                        method : ['required', 'telephone']
                    },{
                        name : 'company',
                        method : ['required', {
                            method : 'minLength',
                            param : 2
                        }, {
                            method : 'maxLength',
                            param : 32
                        }]
                    },{
                        name : 'message',
                        method : ['required', {
                            method : 'minLength',
                            param : 10
                        }, {
                            method : 'maxLength',
                            param : 1024
                        }]
                    }
                ]
            });
            if (!res.suc) {
                return false;
            }

            Utils.ajax({
                action: 'submit_info',
                data : res.data,
                tip : '提交成功！',
                success : function() {
                    Utils.clearForm('.submit_bar');
                }
            });
        });
    }
};