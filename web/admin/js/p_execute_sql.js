$(function() {
    Page.init();
});

var Page = {
    init : function() {
        var form = $('#form');
        form.find('#btn_submit').click(function() {
            var res = form.validate({
                inputs: [
                    {
                        name : 'sql',
                        method : 'required'
                    }
                ]
            });
            if (!res.suc) {
                return false;
            }

            Utils.ajax({
                action: 'execute',
                data : res.data,
                tip : '执行成功！'
            });
        });
    }
};