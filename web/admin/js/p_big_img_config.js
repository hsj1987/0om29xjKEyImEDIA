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
                form.find('[name=text1]').val(option.attr('data-text1'));
                form.find('[name=text2]').val(option.attr('data-text2'));
                var img_url = option.attr('data-img');
                if (Utils.isEmpty(img_url)) {
                    form.find(':hidden[name="exists_img"]').val(0);
                    form.find('.fileinput-preview').html('');
                    form.find('.fileinput').addClass('fileinput-new').removeClass('fileinput-exists');
                } else {
                    form.find(':hidden[name="exists_img"]').val(1);
                    form.find('.fileinput-preview').html('<img src="/upload/big_img/' + img_url + '"/>');
                    form.find('.fileinput').addClass('fileinput-exists').removeClass('fileinput-new');
                }
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
            var needUpload = form.find(':hidden[name="exists_img"]').val() != 1 || !form.find('.fileinput').hasClass('fileinput-exists') || form.find(':file').val();
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
                Utils.getImgData(form.find(':file')[0].files[0], function(img_data) {
                    res.data.img = img_data;
                    res.data.need_upload = 1;
                    Utils.ajax({
                        action: 'save',
                        data : res.data,
                        tip : '保存成功！',
                        success : function(result) {
                            form.find(':hidden[name="exists_img"]').val(1);
                            form.find(':file').val('');
                            var option = form.find('[name=id] option[value='+res.data.id+']');
                            option.attr('data-text1', res.data.text1);
                            option.attr('data-text2', res.data.text2);
                            option.attr('data-img', result.data.imgname);
                        }
                    });
                });
            } else {
                res.data.need_upload = 0;
                Utils.ajax({
                    action: 'save',
                    data : res.data,
                    tip : '保存成功！',
                    success : function(result) {
                        var option = form.find('[name=id] option[value='+res.data.id+']');
                        option.attr('data-text1', res.data.text1);
                        option.attr('data-text2', res.data.text2);
                    }
                });
            }
        });
    }
};