(function($) {
    $.sort = function(node, settings) {
        var jNode = $(node);
        if (!jNode.data("sort"))
            jNode.data("sort", new sort(node, settings));

        return jNode.data("sort");
    };

    $.fn.sort = function(settings) {
        return this.length > 0 ? $.sort(this[0], settings) : this;
    };

    var OPTIONS = {
        settings : {
            sortParse : 'api',// api或sql
            onSortChange : null
        // 排序方式改变事件
        }
    };

    function sort() {
        return this.init.apply(this, arguments);
    }

    sort.prototype.init = function(node, settings) {
        var $this = this;
        $this.settings = $.extend(true, {}, OPTIONS.settings, settings ? settings : {});
        $this.tbl = $(node);
        $this.o = {
            sortTds : $this.tbl.find(">thead>tr>td.c_tbl_sort")
        };
        $this.o.sortTds.click(function() {
            $this.changeSort($(this));
        });
    };

    // 变更排序
    sort.prototype.changeSort = function(sortTd) {
        var $this = this;
        var sort = $this.getSortByTd(sortTd, true);
        $this.setSort(sort);

        if (typeof $this.settings.onSortChange == 'function') {
            $this.settings.onSortChange($this, sort);
        }
    };

    // 设置排序
    sort.prototype.setSort = function(sort) {
        var $this = this;
        $this.o.sortTds.removeClass("c_tbl_sort_asc c_tbl_sort_desc");
        var cname = '';
        var sortDir = 0;
        if ($this.settings.sortParse == 'api') {
            var sortArr = null;
            for ( var jk in sort) {
                sortArr = sort[jk];
            }
            cname = sortArr[0];
            sortDir = sortArr[1];
        } else {
            // var sortArr=sort.split(' ');
            var sortArr = sort;
            cname = sortArr[0];
            sortDir = sortArr[1];
            sortDir = sortDir == 'ASC' ? 1 : 0;
        }
        $this.o.sortTds.filter("[cname='" + cname + "']").addClass(sortDir == 1 ? "c_tbl_sort_asc" : "c_tbl_sort_desc");
    };

    // 获取排序
    sort.prototype.getSort = function() {
        var $this = this;
        var sortTd = $this.o.sortTds.filter(".c_tbl_sort_asc,.c_tbl_sort_desc");
        if (sortTd.length == 0)
            return null;
        return $this.getSortByTd(sortTd);
    };

    sort.prototype.getSortByTd = function(sortTd, sorting) {
        var $this = this;
        var cname = sortTd.attr("cname");
        var asc = sortTd.hasClass("c_tbl_sort_asc");
        var sortDir = sorting ? (asc ? 0 : 1) : (asc ? 1 : 0);
        if ($this.settings.sortParse == 'api') {
            var dtype = sortTd.attr("dtype");
            return eval('({"' + dtype + '":["' + cname + '",' + sortDir + ']})');
        } else {
            var sortDir = sortDir == 1 ? 'ASC' : 'DESC';
            return [cname, sortDir];
        }
    };
})(jQuery);
