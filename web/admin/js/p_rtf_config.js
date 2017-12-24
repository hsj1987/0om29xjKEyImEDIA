$(function() {
    Page.init();
});

var Page = {
    init : function() {
        var form = $('#form');

        var rtf_contents = $('#rtf_contents');
        Common.initSummernote(rtf_contents);

        // 切换
        form.find('[name=id]').change(function() {
            Page.load();
        });

        // 保存
        form.find('#btn_submit').click(function() {
            var res = form.validate({
                inputs: [
                    {
                        name : 'id',
                        method : 'required'
                    }
                ]
            });
            if (!res.suc) {
                return false;
            }

            var contents = rtf_contents.code();
            if (contents == '' || contents == null) {
                Utils.showAlert('“内容”不能为空');
                return;
            }

            Utils.ajax({
                action: 'save',
                data : {
                    id : res.data.id,
                    contents : contents
                },
                tip : '保存成功！',
                success : function(result) {
                    Page.load();
                }
            });
        });
    },

    // 加载数据
    load: function() {
        var id = $('#form').find('[name=id]').val();
        if (id == '') {
            $('#rtf_contents').code('');
        } else {
            Utils.ajax({
                action: 'get_contents',
                data : {
                    id : id
                },
                success : function(result) {
                    $('#rtf_contents').code(result.data);
                }
            });
        }
    }
};