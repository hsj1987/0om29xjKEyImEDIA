$(function() {
    Page.init();
});

var Page = {
    init : function() {
        $('#btn_login').click(function() {
            var res = $('#login_form').validate({
                inputs: [
                    {
                        name : 'username',
                        method : 'required'
                    },
                    {
                        name : 'password',
                        method : ['required', {
                            method : 'minLength',
                            param : 6
                        }]
                    }

                ]
            });
            if (!res.suc)
                return false;

            Utils.ajax({
                action: 'login',
                data : res.data,
                success : function(res) {
                    Utils.go(res.data.first_page);
                }
            });
        });
    }
};