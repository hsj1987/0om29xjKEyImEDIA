$(function() {
    Page.init();
});

var Page = {
    init : function() {
        $('#btn_ajax').click(function() {
            Utils.ajax({
                url : '/demo/get_data',
                data : {
                    'input' : {
                        'param1' : 1,
                        'param2' : 'test'
                    }
                },
                success : function(res) {
                    alert(JSON.stringify(res));
                }
            });
        });
    }
};