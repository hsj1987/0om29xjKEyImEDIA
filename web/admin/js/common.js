var Common = {
    loadForm : function(form, id, parse_data) {
        if (id == '') {
                Utils.clearForm(form);
        } else {
            Utils.ajax({
                action: 'get',
                data : {
                    id : id
                },
                success : function(result) {
                    if ($.isFunction(parse_data)) {
                        result.data = parse_data(result.data);
                    }
                    Utils.loadForm(form, result.data);
                }
            });
        }
    },

    initSummernote : function(control) {
        control.summernote({
            height: 500, 
            lang: 'zh-CN',
            toolbar: [
                ['color', ['color']],
                ['style', ['style']],
                ['font', ['bold', 'italic', 'underline', 'clear']],
                // ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
                ['fontname', ['fontname']],
                ['fontsize', ['fontsize']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']],
                ['table', ['table']],
                ['insert', ['link', 'picture', 'hr']],
                ['view', ['fullscreen', 'codeview']],
                ['help', ['help']]
            ],
            fontNames: [
                '黑体', '楷体', '宋体', '新宋体', '仿宋', '微软雅黑',
                "Open Sans", "sans-serif", 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New',
                'Helvetica Neue', 'Helvetica', 'Impact', 'Lucida Grande',
                'Tahoma', 'Times New Roman', 'Verdana' 
            ],
            fontSizes: ['8', '9', '10', '11', '12', '14', '16', '18', '20', '22', '24', '26', '28', '30', '32', '36', '40', '44', '48', '52'],
        });
    }
};