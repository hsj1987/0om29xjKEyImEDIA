(function($) {
	function isArray(value) {
		if (typeof value == "undefined")
			return false;

		if (value instanceof Array
				|| (!(value instanceof Object) && (Object.prototype.toString.call((value)) == '[object Array]') || typeof value.length == 'number' && typeof value.splice != 'undefined'
						&& typeof value.propertyIsEnumerable != 'undefined' && !value.propertyIsEnumerable('splice'))) {
			return true;
		}

	}

	$.pager = function(node, settings, pagers) {
		var jNode = $(node);
		if (!jNode.data("pager"))
			jNode.data("pager", new pager(node, settings, pagers));

		return jNode.data("pager");
	};
	
	$.pager.createHtml = function(options) {
		options = $.extend(true, {
			showPageSize: true
		}, options ? options : {});
		var html='';
		html+='<span class="c_pager">';
		html+='第 <a href="javascript:void(0);" class="btn btn-sm default prev c_page_prev"><i class="fa fa-angle-left"></i></a>';
		html+='<span class="c_page_page_no"><input type="text" name="number" class="pagination-panel-input form-control input-sm input-inline input-mini" maxlenght="5" style="text-align: center; margin: 0 5px;" /></span>';
		html+='<a href="javascript:void(0);" class="btn btn-sm default next c_page_next"><i class="fa fa-angle-right"></i></a> 页';
		html+='<span class="seperator"> | </span>共 <span class="pagination-panel-total c_page_page_count">0</span> 页';
		html+='<span class="seperator"> | </span>共 <span class="pagination-panel-total c_page_record_count btn_margin_dist" style="display: inline-block;">0</span> 条';
		if (options.showPageSize) {
			html+='&nbsp;&nbsp;<span style="display: inline-block;">每页显示 <select name="page_size" class="pagination-panel-input form-control input-sm input-inline select-mini"><option>10</option><option>25</option><option>50</option><option>100</option></select> 条</span>';
		}
		html+='</span>';
		return html;
	}
	
	$.fn.pager = function(action, data) {
		var returnValue, args = arguments;
		$this = this;
		this.each(function() {
			var self = $.pager(this, action, $this);
			if (typeof action == "string") {
				switch (action) {
					case "initPages":
						self.initPages(data);
						break;
					case "changeCurrPageNo":
						self.changeCurrPageNo(data);
						break;
					case "getCurrPageNo":
						returnValue= self.getCurrPageNo();
						return;
				}
			} else if (!action && !data) {
				if (!isArray(returnValue))
					returnValue = [];
				returnValue.push(self);
			}
		});

		if (isArray(returnValue) && returnValue.length == 1)
			returnValue = returnValue[0];

		return returnValue || this;
	};

	var OPTIONS = {
		settings : {
			//allowGoTo : true,// 允许跳转到某页
			onePageShow: true,
			perCount : 20,//每页多少行
			onPageChange : null//切换页码
		}
	};

	function pager() {
		return this.init.apply(this, arguments);
	}

	pager.prototype.init = function(node, settings, pagers) {
		this.settings = $.extend(true, {}, OPTIONS.settings, settings ? settings : {});
		this.domNode = $(node);
		this.pagers = pagers;// 相同选择器选中的多个分页控件，用于同步同个数据表上下两个分页控件
		this.o = {};
		this.create();
	};

	pager.prototype.create = function() {
		var $this = this;
		$.extend(this.o, {
			pager_bar  : $this.domNode.parents(".c_pager_bar"),
			btnFirst : $this.domNode.find(".c_page_first>a"),
			btnLast : $this.domNode.find(".c_page_last>a"),
			btnPrev : $this.domNode.find(".c_page_prev"),
			btnNext : $this.domNode.find(".c_page_next"),
			txtGo : $this.domNode.find(".c_page_page_no>input[name='number']"),
			spanRecordCount : $this.domNode.find(".c_page_record_count"),
			mypagePageCount : $this.domNode.find(".c_page_page_count"),
			selSize : $this.domNode.find("[name='page_size']")
		});
		
		$this.o.btnFirst.click(function() {
			var pageNo = $this.domNode.data("pageNo");
			if(pageNo==1)
				return false;
			$this.pageChange(1);
		});

		$this.o.btnLast.click(function() {
			var pageNo = $this.domNode.data("pageNo");
			var pageCount = $this.domNode.data("pageCount");
			if(pageNo==pageCount)
				return false;
			$this.pageChange(pageCount);
		});

		$this.o.btnPrev.click(function() {
			var pageNo = $this.domNode.data("pageNo");
			if (pageNo <= 1)
				return false;
			$this.pageChange(pageNo - 1);
		});

		$this.o.btnNext.click(function() {
			var pageNo = $this.domNode.data("pageNo");
			var pageCount = $this.domNode.data("pageCount");
			if (pageNo >= pageCount)
				return false;
			$this.pageChange(pageNo + 1);
		});

        $this.o.selSize.change(function() {
            var preCount = $(this).val();
            $this.preCountChange(preCount);
        });
		
		var goPage = function() {
                    var pageCount = $this.domNode.data("pageCount");
                    var pageNo = $this.domNode.data("pageNo");
                    var goToPageNo = $.trim($this.o.txtGo.val());
                    if(pageNo==goToPageNo)
                            return false;
                    if (isNaN(goToPageNo) || goToPageNo > pageCount || goToPageNo < 1) {
                            //utils.show_alert("请输入有效页号");
                            $this.o.txtGo.val(pageNo);
                            return false;
                    }
                    $this.pageChange(parseInt(goToPageNo));
                };

		$this.o.txtGo.blur(goPage);
		$this.o.txtGo.keydown(function(e) {
            var e = e || event;
            var keycode = e['switch'] || e.keyCode;
            if (keycode == 13) {
                goPage();
                $this.o.txtGo.blur();
            }
        });
	};

	// 初始化
	pager.prototype.initPages = function(totalCount) {
		$this = this;
		var pageCount = Math.ceil(totalCount / $this.settings.perCount);
		$this.o.pager_bar.toggle(($this.settings.onePageShow && pageCount == 1) || (pageCount > 1));
		if(totalCount > 0 ) {
			var pageNo = 1;
		    $this.o.txtGo.val(pageNo);
			$this.o.spanRecordCount.text(totalCount);
		    $this.o.mypagePageCount.text(pageCount);
			$this.domNode.data("pageCount", pageCount);
			$this.domNode.data("pageNo", pageNo);
            $this.domNode.data("preCount", $this.settings.perCount);
		}
	}

	// 更变页码
	pager.prototype.pageChange = function(goPageNo) {
		$this = this;
		if (typeof $this.settings.onPageChange == 'function') {
			var result = $this.settings.onPageChange($this, goPageNo, $this.settings.perCount);
			if (result == false)
				return false;
		}
	}
	
	// 更新当前页码
	pager.prototype.changeCurrPageNo = function(goPageNo) {
	        $this = this;
	        var pageCount = $this.domNode.data("pageCount");
                var pageNo = $this.domNode.data("pageNo");
                
                if (goPageNo == 1)
                    $this.o.btnPrev.addClass('disabled');
                else
                    $this.o.btnPrev.removeClass('disabled');
                
                if (goPageNo == pageCount)
                    $this.o.btnNext.addClass('disabled');
                else
                    $this.o.btnNext.removeClass('disabled');
                    
		$this.pagers.data("pageNo",goPageNo);
		$this.pagers.each(function(){
			var pager=$(this).data("pager");
			pager.o.txtGo.val(goPageNo);
		});
	}

    // 更变每页条数
    pager.prototype.preCountChange = function(preCount) {
        $this = this;
        $this.domNode.data("preCount", preCount);
        $this.settings.perCount = preCount;
        if (typeof $this.settings.onPerCountChange == 'function') {
            var result = $this.settings.onPerCountChange($this, preCount);
        }
    }
	
	pager.prototype.getCurrPageNo=function(){
		$this = this;
		var pageNo = $this.pagers.data("pageNo");
		return pageNo == undefined ? 1 : pageNo;
	}
	
})(jQuery);
