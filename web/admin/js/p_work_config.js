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
                    data.img = '/upload/work_img/' + data.img;
                }
                return data;
            });
        });

        // 保存
        form.find('#btn_submit').click(function() {
            // 验证
            var id = form.find('[name=id]').val();
            var inputs = [
                {
                    name : 'id',
                    method : 'required'
                }
            ];
            inputs = Utils.pushImgValidateItem(inputs, 'img', true);
            inputs.push({
                name : 'title',
                method : ['required', {
                    method : 'maxLength',
                    param : 32
                }]
            });
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