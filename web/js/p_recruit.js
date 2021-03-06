$(function() {
    Page.init();
});

var Page = {
    init: function() {
        var tab_items = $('.tabs_bar li');
        tab_items.hover(function() {
            var aid = $(this).attr('aid');
            if (aid != tab_items.filter('.curr').attr('aid')) {
                tab_items.removeClass('curr');
                $(this).addClass('curr');
                var content_items = $('.content_bar .content');
                content_items.hide();
                content_items.filter('[aid='+aid+']').fadeIn();
            }
        });

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
                        name : 'telephone',
                        method : ['required', 'telephone']
                    },{
                        name : 'position',
                        method : ['required', {
                            method : 'minLength',
                            param : 2
                        }, {
                            method : 'maxLength',
                            param : 32
                        }]
                    },
                    {
                        name : 'introduction',
                        method : ['required', {
                            method : 'minLength',
                            param : 200
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
                success: function() {
                    Utils.clearForm('.submit_bar');
                }
            });
        });
    }
};