/**
 * 分页加排序组件(依赖like.datatbl.js、like.pager.js、like.utils.js)
 * @params table string
 * @params object setting
 *      自动加载数据 autoLoad : true
 *      load回调函数 callBack ：null
 *      纵向合并单元格 rowspan : false (默认为不合并如果要合并，以字符串或数组形式传入要合并的字段，如：['id', 'name'])
 *      第一次加载时无数据显示列数 defaultShowColumnsNum : false (取值正整数，用于动态列，第一次加加载且无数据时，显示列数，默认为false)
 *      td手型样式 cursorDefault : false（是否去掉tbody的td鼠标移上去的手型样式）
 *      请求链接 url: null
 *      请求 action: null
 *      用icheck插件初始化表单选框 initIcheck:false(默认为false, 可设为function)
 *      表头字段 columns:[
 *       {column:字段名,
 *        label:表头名称,
 *        sort:是否排序（默认为false,可选true、false、desc、asc）,
 *        tdAttr:td属性,
 *        noHtmlEncode:false,不HTML转义
 *        content:算定义内容处理函数
 *       },
 *       ...
 *      ]
 *      每页条数pageSize : 10 如25
 *      生成tr数据函数 trCreateFn : function(data){}
 *      没有数据时td显示信息 noDataMessage：'暂无数据'
 */
(function ($) {
    $.datatbl = function (table, settings) {
        var jNode = $(table);
        if (!jNode.data("datatbl"))
            jNode.data("datatbl", new datatbl(table, settings));
        return jNode.data("datatbl");
    };

    $.fn.datatbl = function (settings) {
        return this.length > 0 ? $.datatbl(this[0], settings) : this;
    };

    var OPTIONS = {
        settings: {
            columns: [],
            pageSize: 10,
            autoLoad: true,
            rowspan : false,
            defaultShowColumnsNum : false,
            cursorDefault: false,
            callBack: null,
            initIcheck: false,
            params: {},
            noDataMessage: '暂无数据'
        }
    };

    function datatbl() {
        return this.init.apply(this, arguments);
    }

    datatbl.prototype.init = function (table, settings) {
        var $this = this;

        $this.settings = $.extend(true, {}, OPTIONS.settings, settings ? settings : {});
        if ($this.settings.columns.length == 0) {
            console.log('没有设置字段');
            return;
        }

        var columnDefault = {
            sort: false,
            content: null,
            tdAttr: null,
            noHtmlEncode: false
        };
        var needSort = false;
        $.each($this.settings.columns, function (i, v) {
            var columnOption = $.extend(true, {}, columnDefault, v);
            $this.settings.columns[i] = columnOption;
            if (columnOption.sort) {
                needSort = true;
            }
        });
        $this.settings.needSort = needSort;

        $this.tbl = $(table);
        $this.dataTotal = 0;// 列表总条数
        $this.params = $.extend(true, {}, $this.settings.params ? $this.settings.params : {});
        if (!$this.tbl) {
            console.log('没有找到table对象');
            return;
        }
        $this.myHtml = $this.tbl.closest('.c_tbl_html');

        // 表头
        $this.createThead();
        $this.myTheadTable = this.myHtml.find('.c_tbl_thead>table');

        // 排序
        if (needSort) {
            $this.myTheadTable.sort({
                sortParse: 'sql',
                onSortChange: function (tbl, sort) {
                    if ($this.dataTotal > 1) {
                        $this.load(0, sort, 0);
                    }
                }
            });
        }

        // 分页
        $this.isFindPager = $this.myHtml.find('.c_pager').length;
        if (!!$this.isFindPager) {
            $this.myHtml.find('.c_pager').replaceWith($.pager.createHtml());
            $this.page = $this.myHtml.find('.c_pager');
            $this.page.pager({
                perCount: $this.settings.pageSize,
                onPageChange: function (source, goPageNo, perCount) {
                    $this.load(goPageNo, null, 0);
                },
                onPerCountChange: function (source, perCount) {
                    $this.settings.pageSize = perCount;
                    $this.load(1, null, 0);
                }
            });
        }

        if ($this.settings.autoLoad === true)
            $this.load(0);// 加载数据
        $this.tableScroll();// 绑定滚动事件
        $(window).resize(function () {// 窗口大小重设事件
            $this.loadTheadWidth();
        });
        $this.loadTheadWidth();
    };

    /**
     * 创建表对排序功能
     */
    datatbl.prototype.createThead = function () {
        $this = this;
        var columnsSort = [];// 需要排序 字段集合
        var sortByNum = -1;// 需要加asc/desc的字段编号
        $.each($this.settings.columns, function (i, v) {
            if (v.sort) {
                columnsSort.push(v.column);
                if (typeof (v.sort) == 'string' && $.inArray(v.sort, ['asc', 'desc']) >= 0)
                    sortByNum = i;
            }
        });

        var tr = '<tr>';
        $.each($this.settings.columns, function (i, v) {
            tr += '<td';
            if ($.inArray(v.column, columnsSort) >= 0) {
                var tdClass = 'c_tbl_sort';
                if (i == sortByNum) {
                    var classSort = (/^asc$/i.test(v.sort)) ? 'asc' : 'desc';
                    tdClass += ' c_tbl_sort_' + classSort;
                }
                tr += ' cname="' + v.column + '" class="' + tdClass + '"';
            }
            tr += '>';
            tr += v.label;
            tr += '</td>';
        });
        tr += '</tr>';
        var myThead = '<div class="c_tbl_thead">';
        myThead += '<table class="table c_tbl c_tbl_margin_0">';
        myThead += '<thead class="c_tbl_head">';
        myThead += tr;
        myThead += '</thead></table></div>';
        $this.tbl.closest('.c_tbl_html .c_tbl_body').prepend(myThead);
        $this.tbl.closest('.c_tbl_html').find('.c_tbl_cont table').prepend('<thead>'+ tr +'</thead>');
        if (!!$this.settings.defaultShowColumnsNum) {
            $this.tbl.closest('.c_tbl_html .c_tbl_body').find('.c_tbl_thead thead td:not(:lt('+ $this.settings.defaultShowColumnsNum +'))').hide();
            $this.tbl.find('thead td:not(:lt('+ $this.settings.defaultShowColumnsNum +'))').hide();
        }
    };

    // 载入宽度
    datatbl.prototype.loadTheadWidth = function () {
        var $this = this;
        if ($this.myHtml.find('.c_tbl_cont>table').outerWidth() < 300)
            return;
        var td_cont = $this.tbl.find('.c_tbl_cont thead:eq(0)>tr>td');
        var td_thead = $this.tbl.find('thead:eq(0)>tr>td');
        var td = $this.tbl.find('.c_tbl_cont').length ? td_cont : td_thead ;
        if (td.length > 1) {
            $this.myHtml.find('.c_tbl_thead>table>thead>tr>td').each(function (index) {
                var tdWidth = td.eq(index).is(':hidden') ? 0 : td.eq(index).outerWidth();
                if (tdWidth === 0) {
                    $(this).css('display', 'none');
                } else {
                    $(this).css({'display' : 'table-cell', 'width' : tdWidth + 'px'});
                }
            });
        }

        $this.myHtml.find('.c_tbl_thead>table').css('width', $this.myHtml.find('.c_tbl_cont>table').outerWidth() + 'px');
        $this.myHtml.find('.c_tbl').css('width', $this.myHtml.find('.c_tbl').outerWidth() + 'px');
        $this.myHtml.find('.c_tbl_thead').css({
            'height': $this.myHtml.find('.c_tbl_thead td:eq(0)').outerHeight() + 'px',
            'width': $this.myHtml.find('.c_tbl_cont').outerWidth() + 'px'
        });
        $this.myHtml.find('.c_tbl_cont table').css({'margin-top' : '-' + $this.myHtml.find('.c_tbl_thead td:eq(0)').outerHeight() + 'px'})
    },

        // 添加滚动表事件
        datatbl.prototype.tableScroll = function () {
            var $this = this;
            $this.myHtml.find('.c_tbl_cont').scroll(function () {
                $this.myHtml.find('.c_tbl_thead>table').css('left', -$(this).scrollLeft());
            });
        };

    /**
     * 请求数据
     * @param pageNo 页码
     * @param sort 排序
     * @param getTotal 是否获取总条数（默认为true）
     * @param callBack 回调函数
     */
    datatbl.prototype.load = function (pageNo, sort, getTotal, callBack) {
        var $this = this;
        var params = $this.params;
        if (!!$this.isFindPager) {
            var myPager = $this.page;
            var myPagerObj = myPager.pager();
            if (myPagerObj.length > 1)
                myPagerObj = myPagerObj[0];
            params.pageNo = !!pageNo ? pageNo : myPagerObj.getCurrPageNo();
            params.pageSize = $this.settings.pageSize;

        }
        if (getTotal === undefined)
            getTotal = true;
        params.getTotal = getTotal ? 1 : 0;
        if ($this.settings.needSort) {
            params.sort = !!sort ? sort : $this.myTheadTable.sort().getSort();
        }

        var options = {
            url: $this.settings.url,
            action: $this.settings.action,
            data: params,
            success: function (result) {
                if (!$this.isFindPager || getTotal)
                    $this.dataTotal = !$this.isFindPager || !getTotal ? result.data.length : result.total;
                if (!!$this.isFindPager) {
                    myPager.pager('initPages', $this.dataTotal);
                    myPager.pager('changeCurrPageNo', parseInt(params.pageNo));
                }
                if (typeof ($this.settings.trCreateFn) == 'function') {
                    $this.settings.trCreateFn(result.data);
                } else {
                    var hideColumns = (typeof(result.hideColumns) == 'object' && result.hideColumns.length) ? result.hideColumns : null;
                    $this.createHtml(result.data, hideColumns);
                }
                

                
                if (typeof(callBack) == 'function') {
                    callBack(result);
                } else {
                    if (typeof($this.settings.callBack) == 'function')
                        $this.settings.callBack(result);
                }
                $this.loadTheadWidth();
            }
        };
        Utils.ajax(options);
    };
    datatbl.prototype.initIcheckControl = function () {
        var $this = this;
        if ($this.settings.initIcheck) {
            $this.myHtml.find('.icheck').iCheck({checkboxClass:'icheckbox_minimal-grey', radioClass:'iradio_minimal-grey'});
            $this.myHtml.find('thead .icheck').on('ifClicked', function(e){
                var $this0 = $(this);
                setTimeout(function(){
                    var stat = $this0.is(':checked') ? 'check' : 'uncheck';
                    $this.myHtml.find('tbody .icheck').iCheck(stat);
                }, 100);
            });

            $this.myHtml.find('tbody .icheck').on('ifChanged', function(e){
                if ($this.myHtml.find('tbody .icheck').length === $this.myHtml.find('tbody :checked').length) {
                    $this.myHtml.find('thead .icheck').iCheck('check');
                } else {
                    $this.myHtml.find('thead .icheck').iCheck('uncheck');
                }
                if (typeof($this.settings.initIcheck) == 'function')
                    $this.settings.initIcheck($(this));
            });
            $this.myHtml.find('thead .icheck').iCheck('uncheck');
        }
    };
    datatbl.prototype.createHtml = function (data, hideColumns) {
        var $this = this;
        if (data.length > 0) {
            var rowspan = [];
            var rowspanStringArr = {};
            if (!!$this.settings.rowspan) {// 合并单元格需求
                if (typeof($this.settings.rowspan) == 'string') {
                    rowspan.push($this.settings.rowspan);
                } else if (typeof($this.settings.rowspan) == 'object') {
                    rowspan = $this.settings.rowspan;
                }
                if (rowspan.length > 0) {
                    var oldKey = '';
                    $.each(data, function (k, v) {
                        var aKey = '';
                        $.each(rowspan, function (i, w) {
                            aKey += (i == 0 ? v[w] : ('_' + v[w]));
                        });
                        if (oldKey == aKey) {
                            rowspanStringArr[aKey]++;
                            if ((k + 1) === data.length) {
                                if (rowspanStringArr[oldKey] > 1) {
                                    for(var j=rowspanStringArr[oldKey]; j>0; j--){
                                        if (j==rowspanStringArr[oldKey]) {
                                            data[(k+1-j)].rowspan = j;
                                        } else {
                                            data[(k+1-j)].rowspan = 1;
                                        }
                                    }
                                }
                            }
                        } else {
                            rowspanStringArr[aKey] = 1;
                            if (rowspanStringArr[oldKey] > 1) {
                                for(var j=rowspanStringArr[oldKey]; j>0; j--){
                                    if (j==rowspanStringArr[oldKey]) {
                                        data[(k-j)].rowspan = j;
                                    } else {
                                        data[(k-j)].rowspan = 1;
                                    }
                                }
                            }
                            if (oldKey != '')
                                delete rowspanStringArr[oldKey];
                        }
                        oldKey = aKey;
                    });
                }
            }

            $this.tbl.find('tbody').html('');
            if (!!hideColumns) {// 动态列需求
                $.each($this.settings.columns, function (ck, cv) {
                    if ($.inArray(cv.column, hideColumns) >= 0) {
                        $this.tbl.find('thead tr td').eq(ck).hide();
                        $this.myHtml.find('.c_tbl_head tr td').eq(ck).hide();
                    } else {
                        $this.tbl.find('thead tr td').eq(ck).show();
                        $this.myHtml.find('.c_tbl_head tr td').eq(ck).show();
                    }
                });
            }
            $.each(data, function (k, v) {
                var trAttrStr = k % 2 ? 'odd' : 'even';
                if (!Utils.isEmpty($this.settings.trAttr)) {// tr属性
                    var trClassArr = [];
                    $.each($this.settings.trAttr, function (i, v) {
                        if (i == 'class')
                            v += ' ' + trAttrStr;
                        trClassArr.push(i + '="' + v + '"');
                    });
                    trAttrStr = ' ' + trClassArr.join(' ');
                } else {
                    trAttrStr = ' class="' + trAttrStr + '"';
                }
                var html = '<tr role="row"' + trAttrStr + '>';
                $.each($this.settings.columns, function (ck, cv) {
                    var tdClass = '';
                    var tdAttrs = $.extend({},cv.tdAttr);
                    if (typeof(cv.width) != "undefined" && cv.width != null) {
                        tdAttrs.width = cv.width;
                    }
                    if ($this.settings.cursorDefault) {// 去掉td的手型
                        var curDef = 'cursor: default;';
                        tdAttrs.style = !!tdAttrs.style ? (curDef + tdAttrs.style) : curDef;
                    }
                    if (!!cv.sort) {
                        var clas = 'class';
                        tdAttrs[clas] = !!tdAttrs[clas] ? tdAttrs[clas] : 'c_tbl_td_padding_sort';
                        tdAttrs[clas] += /^c_tbl_td_padding_sort$/.test(tdAttrs[clas]) != true ? ' c_tbl_td_padding_sort' : '';
                    }
                    if (!!hideColumns) {// 动态列需求
                        if ($.inArray(cv.column, hideColumns) >= 0) {
                            var clas = 'class';
                            tdAttrs[clas] = !!tdAttrs[clas] ? (tdAttrs[clas] + ' hide') : 'hide';
                        }
                    }
                    if (!!$this.settings.rowspan) {// 合并单元格需求
                        if (rowspan.length > 0) {
                            if ($.inArray(cv.column, rowspan) >= 0 && v.rowspan > 1) {
                                tdAttrs.rowspan = v.rowspan;
                            }
                        }
                    }
                    if (!Utils.isEmpty(tdAttrs)) {// td属性
                        var tdClassArr = [];
                        $.each(tdAttrs, function (tdi, tdv) {
                            tdClassArr.push(tdi + '="' + tdv + '"');
                        });
                        tdClass = ' ' + tdClassArr.join(' ');
                    }
                    var value = Utils.get(v[cv.column], '');
                    if (!cv.noHtmlEncode) {
                    	var tdHtml = Utils.htmlEncode(value)
                    } else {
                    	var tdHtml = value
                    }
                    if (typeof (cv.content) == 'function') {
                        tdHtml = cv.content(v);
                    }
                    if ($.inArray(cv.column, rowspan) >= 0) {
                        if (v.rowspan > 1 || !v.rowspan) {
                            html += '<td' + tdClass + '>' + tdHtml + '</td>';
                        }
                    } else {
                        html += '<td' + tdClass + '>' + tdHtml + '</td>';
                    }
                });
                html += '</tr>';
                $this.tbl.find('tbody').append($(html).data('data', v));
            });
        } else {
            $this.tbl.find('tbody').html('<tr class="c_tbl_nodata"><td colspan="100">' + $this.settings.noDataMessage + '</td></tr>');
        }
        $this.initIcheckControl();
    };

    // 清除列表对象及表头
    datatbl.prototype.clear = function() {
        var $this = this;
        $this.tbl.data('datatbl', '');
        $this.myHtml.find('.c_tbl_thead, table thead').remove();
        $this.myHtml.find('tbody').html('');
        $this.myHtml.find('.c_pager_bar').hide();
    };

    // 设置传级服务端的请求参数
    datatbl.prototype.setParams = function (params) {
        this.params = (typeof (params) == 'object') ? params : {};
    };
})(jQuery);
