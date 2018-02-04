$(function() {
    Page.init();
});

var Page = {
    init : function() {
        var form = $('#form');

        // 切换
        form.find('[name=id]').change(function(){
            var id = $(this).val();
            if ($(this).val() == '') {
                $('#div_img,#div_logo,#div_name,#div_title,#div_link,#div_desc').removeClass('show');
                Utils.clearForm(form);
            } else {
                if ($.inArray(id, ['1','2','3','6']) != -1) {
                    $('#div_img,#div_logo,#div_name,#div_title,#div_link,#div_desc').removeClass('show');
                    $('#div_img,#div_logo,#div_name,#div_title,#div_link').addClass('show');
                    $('#div_img .fileinput-preview').toggleClass('img_h2', id == 1);
                    $('#div_img .img_size').text(id == 1 ? '640*1080' :  id == 6 ? '1920*920' : '640*540');
                } else {
                    $('#div_img,#div_logo,#div_name,#div_title,#div_link,#div_desc').removeClass('show');
                    $('#div_title,#div_link,#div_desc').addClass('show');
                }
                Utils.ajax({
                    action: 'get',
                    data : {
                        id : id
                    },
                    success : function(result) {
                        if (result.data.img) {
                            result.data.img = '/upload/index_img/' + result.data.img;
                        }
                        if (result.data.logo) {
                            result.data.logo = '/upload/index_img/' + result.data.logo;
                        }
                        Utils.loadForm(form, result.data);
                    }
                });
            }
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
            var isImgMode = $.inArray(id, ['1','2','3','6']) != -1;
            if (isImgMode) {
                inputs = Utils.pushImgValidateItem(inputs, 'img', true);
                inputs = Utils.pushImgValidateItem(inputs, 'logo', true);
                inputs.push({
                    name : 'name',
                    method : ['required', {
                        method : 'maxLength',
                        param : 16
                    }]
                });
                inputs.push({
                    name : 'title',
                    method : ['required', {
                        method : 'maxLength',
                        param : 32
                    }]
                });
                inputs.push({
                    name : 'link',
                    method : ['required', {
                        method : 'maxLength',
                        param : 64
                    }]
                });
            } else {
                inputs.push({
                        name : 'title',
                        method : ['required', {
                            method : 'maxLength',
                            param : 32
                        }]
                });
                inputs.push({
                    name : 'link',
                    method : ['required', {
                        method : 'maxLength',
                        param : 64
                    }]
                });
                inputs.push({
                    name : 'desc',
                    method : ['required', {
                        method : 'maxLength',
                        param : 64
                    }]
                });
            }
            var res = form.validate({
                inputs: inputs
            });
            if (!res.suc) {
                return false;
            }
            
            // 保存
            if (isImgMode) {
                if (form.find('#div_img :file').val()) {
                    res.data.img = form.find('#div_img .fileinput-preview img').attr('src');
                }
                if (form.find('#div_logo :file').val()) {
                    res.data.logo = form.find('#div_logo .fileinput-preview img').attr('src');
                }
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