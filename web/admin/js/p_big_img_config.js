$(function() {
    Page.init();
});

var Page = {
    init : function() {
        var form = $('#form');

        // 切换
        form.find('[name=id]').change(function() {
            Common.loadForm(form, $(this).val(), function(data) {
                if (data.img) {
                    data.img = '/upload/big_img/' + data.img;
                }
                return data;
            });
        });

        // 保存
        form.find('#btn_submit').click(function() {
            var inputs = [
                {
                    name : 'id',
                    method : 'required'
                },
                {
                    name : 'text1',
                    method : [{
                        method : 'maxLength',
                        param : 256
                    }]
                },
                {
                    name : 'text2',
                    method : [{
                        method : 'maxLength',
                        param : 256
                    }]
                }
            ];
            inputs = Utils.pushImgValidateItem(inputs, 'img', true);
            var res = form.validate({
                inputs: inputs
            });
            if (!res.suc) {
                return false;
            }
            
            // 保存
            if (form.find(':file').val()) {
                res.data.img = form.find('.fileinput-preview img').attr('src');
            }
            Utils.ajax({
                action: 'save',
                data : res.data,
                tip : '保存成功！',
                success : function(result) {
                    form.find(':file').val('');
                }
            });
        });
    }
};