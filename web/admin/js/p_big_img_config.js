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
                form.find('[name=text1]').val($(this).find('option[value='+id+']').attr('data-text1'));
                form.find('[name=text2]').val($(this).find('option[value='+id+']').attr('data-text2'));
            }
        });

        // 保存
        form.find('#btn_submit').click(function() {
            var res = form.validate({
                inputs: [
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
                    },
                    {
                        name : 'img',
                        method : ['required', 'img']
                    }
                ]
            });
            if (!res.suc)
                return false;
            Utils.getImgData(form.find(':file')[0].files[0], function(img_data){
                res.data.img = img_data;
                Utils.ajax({
                    action: 'save',
                    data : res.data,
                    tip : '保存成功！',
                    success : function(res) {
                       Utils.clearForm(form);
                    }
                });
            });
        });
    }
};