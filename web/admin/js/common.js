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
                showLoading : false,
                success : function(result) {
                    if ($.isFunction(parse_data)) {
                        result.data = parse_data(result.data);
                    }
                    Utils.loadForm(form, result.data);
                }
            });
        }
    }
};