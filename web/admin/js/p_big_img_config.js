$(function() {
    Page.init();
});

var Page = {
    init : function() {
        var form = $('#form');

        // 切换
        form.find('[name=id]').change(function(){
            if ($(this).val() == '') {
                Utils.clearForm(form);
            } else {
                var id = $(this).val();
                var option = $(this).find('option[value='+id+']');
                Utils.loadForm(form, {
                    text1 : option.attr('data-text1'),
                    text2 : option.attr('data-text2'),
                    img : option.attr('data-img') ? '/upload/big_img/' + option.attr('data-img') : ''
                });
            }
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
                    method : ['required', {
                        method : 'maxLength',
                        param : 256
                    }]
                },
                {
                    name : 'text2',
                    method : ['required', {
                        method : 'maxLength',
                        param : 256
                    }]
                }
            ];
            var needUpload = !form.find('.fileinput').hasClass('fileinput-exists') || form.find(':file').val();
            if (needUpload) {
                inputs.push({
                    name : 'img',
                    method : ['required', 'img']
                });
            }
            var res = form.validate({
                inputs: inputs
            });
            if (!res.suc) {
                return false;
            }
            
            if (needUpload) {
                var img_data = form.find('.fileinput .fileinput-preview img').attr('src');
                res.data.img = img_data;
                res.data.need_upload = 1;
            } else {
                res.data.need_upload = 0;
            }
            Utils.ajax({
                action: 'save',
                data : res.data,
                tip : '保存成功！',
                success : function(result) {
                    var option = form.find('[name=id] option[value='+res.data.id+']');
                    option.attr('data-text1', res.data.text1);
                    option.attr('data-text2', res.data.text2);
                    if (needUpload) {
                        form.find(':file').val('');
                        option.attr('data-img', result.data.img_name);
                    }
                }
            });
        });
    }
};