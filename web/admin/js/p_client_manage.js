$(function() {
    Page.init();
});

var Page = {
    currAction : 'list',

    init : function() {
        Page.list.init();
        Page.detail.init();
    },

    list : {
        view : null,
        datatbl : null,
        init : function() {
            var $this = this;
            $this.view = $('#data_list');
            
            // 表格初始化
            $this.datatbl = $('#tbl_data_list').datatbl({
                action : 'get_list',
                params : {
                    category_id : $('#data_filter button.green').attr('cid')
                },
                columns : [
                {
                    column : 'logo',
                    label : 'LOGO',
                    width: '10%',
                    class: 'text-center',
                    content : function(v) {
                        return '<img src="' + Page.detail.getImgPath(v.logo)  +'"/>';
                    }
                },{
                    column : 'id',
                    label : 'ID',
                    width: '5%'
                }, {
                    column : 'name',
                    label : '名称',
                    width: '44%'
                }, {
                    column : 'is_display',
                    label : '是否显示',
                    width: '5%'
                }, {
                    column : 'create_time',
                    label : '创建时间',
                    width: '18%'
                }, {
                    column : 'update_time',
                    label : '更新时间',
                    width: '18%'
                }]
            });
            
            // 切换分类
            var category_btns = $('#data_filter button');
            category_btns.click(function() {
                var params = {
                    category_id : $(this).attr('cid')
                };
                $this.datatbl.setParams(params);
                $this.datatbl.load(1);
                category_btns.removeClass('green').removeClass('default');
                $(this).addClass('green');
            });

            //编辑
            $('#tbl_data_list').find('tbody').on('click', 'tr[class!="c_tbl_nodata"]', function() {
                var tr = $(this);
                var data = tr.data('data');
                Page.detail.load('edit', data.id);
            });

            // 新增
            $('#btn_add').click(function() {
                Page.detail.load('add');
            });
        },

        load : function(pageNo) {
            this.datatbl.load(pageNo);
        }
    },

    detail : {
        view : null,
        id : null,

        init : function() {
            this.view = $('#data_detail');

            // 取消
            $('#btn_cancel,.c_detail_close').click(function(){
                Page.toggleView('list');
            });

            // 保存
            $('#btn_submit').click(function(){
                Page.detail.save();
            });

            // 删除
            $('#btn_delete').click(function(){
                Page.detail.delete();
            });
        },

        getChecked : function(name) {
            return this.view.find('[name=' + name + ']').prop('checked') ? 1 : 0;
        },

        getImgPath : function(name) {
            return Utils.isEmpty(name) ? '' : '/upload/client_img/' + name;
        },

        load : function(action, id) {
            Utils.clearForm(Page.detail.view);
            if (action == 'add') {
                Utils.loadForm(Page.detail.view, {
                    category_id : $('#data_filter button.green').attr('cid'),
                    is_display : 1,
                    sort_num : 100000
                });
                Page.toggleView('add');
            } else {
                this.id = id;
                Utils.ajax({
                    action : 'get',
                    data : {id : id},
                    success : function(result) {
                        result.data.logo = Page.detail.getImgPath(result.data.logo);
                        Utils.loadForm(Page.detail.view, result.data);
                        Page.toggleView('edit');
                    }
                });
            }
        },

        save : function() {
            var inputs = [
                {
                    name : 'category_id',
                    method : 'required'
                },
                {
                    name : 'name',
                    method : [{
                        method : 'maxLength',
                        param : 64
                    }]
                },
                {
                    name : 'logo',
                    method : ['required', 'img']
                },
                {
                    name : 'sort_num',
                    medhod : 'int1'
                }
            ];
            var res = this.view.validate({
                inputs: inputs
            });
            if (!res.suc) {
                return false;
            }
            
            if (Page.currAction == 'edit') {
                res.data.id = this.id;
            }
            res.data.is_display = this.getChecked('is_display');

            Utils.ajax({
                action: 'save',
                data : res.data,
                tip : '保存成功！',
                success : function(result) {
                    Page.list.load();
                    Page.toggleView('list');
                }
            });
        },

        delete : function() {
            Utils.showConfirm('您确认要删除吗？', function() {
                Utils.ajax({
                    action : 'delete',
                    tip : '删除成功！',
                    data : {
                        id : Page.detail.id
                    },
                    success : function(result) {
                        Page.toggleView('list');
                        Page.list.load(1);
                    }
                });
            });
            return false;
        }
    },

    // 切换新增页面
    toggleView : function(action) {
        this.currAction = action;
        if (action == 'add' || action == 'edit') {
            var title = action == 'edit' ? '详情' : '新增';
            Page.detail.view.find('.caption-subject').text(title);
            Page.detail.view.find('#btn_delete').toggle(action == 'edit');
            Page.list.view.addClass('hide');
            Page.detail.view.removeClass('hide');
        } else {
            Page.list.view.removeClass('hide');
            Page.detail.view.addClass('hide');
        }
    }
};