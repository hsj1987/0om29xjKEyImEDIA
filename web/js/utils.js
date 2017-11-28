/*
 * 前端公共JS
 * 依赖：jQuery、模式框依赖bootstrap
 */
var Utils = {
    /**
     * 获取值（如果为空则给默认值）
     * 
     * @param val
     *            值
     * @param defaultVal
     *            默认值
     * @returns 处理后的值
     */
    get : function(val, defaultVal) {
        if (defaultVal === undefined)
            defaultVal = '';
        return typeof val === 'undefined' || val === null || val === '' ? defaultVal : val;
    },

    /**
     * ajax提交
     * 
     * @param options
     *            参数选项(action与url必传1个，有url以url为准，否则url=page_route/action)
     */
    ajax : function(options) {
        var url = '';
        if (Utils.isEmpty(options.url)) {
            url = document.location.pathname;
            if (url.substr(-5) == '.html') {
                url = url.substr(0, url.length-5);
            }
            url += '/' + options.action;
        } 
        var defaultOptions = {
            url : url,// URL
            async : true,// 是否异步
            data : {},// JSON参数
            tip : false,// 成功显示‘操作成功’, 或tip参数
            success : null,// 失败处理函数或消息，类型为：function/string
            fail : null,// 失败处理函数或消息，类型为：function/string
            showLoading : Utils.showLoading,// 显示加载效果函数或消息，类型为：function/string/boolean
            hideLoading : Utils.hideLoading,// 显示加载效果函数，类型为：function
            focusInvalid : true,// 聚焦验证失败字段对应的控件
            focusContainer : 'body'// 聚焦控件容器，用于筛选容器内的控件，类型为：jQueryObject/string
        };
        options = $.extend(defaultOptions, options);

        var loadingMsg = '';
        var showLoading = null;
        if (typeof (options.showLoading) == 'string') {
            showLoading = Utils.showLoading;
            loadingMsg = options.showLoading;
        } else {
            showLoading = options.showLoading;
        }
        if (options.async && showLoading)
            showLoading(loadingMsg);

        $.ajax({
            async : options.async,
            url : options.url,
            type : 'POST',
            dataType : 'json',
            data : $.param(options.data),
            success : function(result) {
                if (options.async && options.showLoading)
                    options.hideLoading();
                if (result == null) {
                    Utils.showAlert('操作失败');
                } else if (result.stat !== 0) {
                    var failType = typeof options.fail;
                    if (failType == 'function') { // 错误处理函数
                        options.fail(result);
                        if (options.focusInvalid)
                            Utils.focusControl(result.field, options.focusContainer);
                    } else {
                        if (result.stat == 120) {
                            Utils.showAlert('登陆已过期', function() {
                                Utils.go('/admin/login.html');
                            });
                        } else {
                            // 获取错误消息
                            var msg = '操作失败';
                            if (failType == 'string') {
                                msg = options.fail;
                            } else if (failType == 'object' && options.fail) {
                                var defaultErrKey = 'default';
                                var errorKey = result.stat === '' || result.stat === null || result.stat === undefined || isNaN(result.stat) ? defaultErrKey : result.stat;
                                msg = errorMsg[errorKey] === undefined ? errorMsg[defaultErrKey] : errorMsg[errorKey];
                            } else if (!Utils.isEmpty(result.msg)) {
                                msg = result.msg;
                            }
    
                            // 显示错误消息
                            Utils.showAlert(msg, function() {
                                if (options.focusInvalid) {
                                    Utils.focusControl(result.field, options.focusContainer);
                                }
                            });
                        }
                    }
                } else {
                    if (!!options.tip) {
                        var msg = (typeof (options.tip) == 'string') ? options.tip : '操作成功';
                        var callback = null;
                        if (typeof options.success == 'function') {
                            callback = function() {
                                options.success(result);
                            }
                        }
                        Utils.showAlertTip(msg, callback);
                    } else {
                        if (typeof options.success == 'function') {
                            options.success(result);
                        }
                    }
                }
            },
            error : function(XMLHttpRequest, statusText, errorMsg) {
                if (options.async && options.showLoading)
                    options.hideLoading();
                var status = XMLHttpRequest.status;
                if (status == 500) {
                    Utils.showAlert('服务端出现异常');
                } else if (status == 504) {
                    Utils.showAlert('请求超时');
                }
            }
        });
    },

    /**
     * 聚焦控件
     * 
     * @controlName 控件name
     * @container 控件外部容器
     */
    focusControl : function(controlName, container) {
        Utils.get(container, 'body');
        if (!Utils.isEmpty(container) && !Utils.isEmpty(controlName)) {
            container = typeof container == 'string' ? $(container) : container;
            container.find('[name=' + controlName + ']').focus();
        }
    },

    /**
     * 显示模式背景
     */
    showModalBackdrop : function(onHide) {
        var modal = $('#c_modal_backdrop');
        if (modal.length > 0) {
            modal.show().addClass('in');
        } else {
            modal = $('<div class="modal-backdrop" id="c_modal_backdrop"></div>');
            modal.on('click', function() {
                Utils.hideModalBackdrop(onHide);
            });
            $('body').append(modal);
            modal.show().addClass('in');
        }
    },

    /**
     * 关闭模式背景
     */
    hideModalBackdrop : function(onHide) {
        if ($.isFunction(onHide)) {
            onHide();
        }
        $('#c_modal_backdrop').removeClass('in').hide();
    },
    
    /**
     * 显示等待效果
     */
    showLoading : function(msg) {
        var modal = $('#c_loading');
        var msg = Utils.isEmpty(msg) ? '' : '<div class="msg">' + msg + '</div>';
        var html = '<img src="/img/ico_loading.gif">' + msg;
        if (modal.length > 0) {
            modal.toggleClass('no_msg', msg == '');
            modal.html(html).show();
            $('#c_loading_bg').show();
            if ($('#c_loading_bg').length === 0)
                $('body').append('<div class="modal-backdrop" id="c_loading_bg"></div>');
        } else {
            modal = '<div id="c_loading"' + (msg == '' ? ' class="no_msg"' : '') + '>' + html + '</div>';
            $('body').append('<div class="modal-backdrop" id="c_loading_bg"></div>').append(modal);
        }
    },
    /**
     * 影藏等待效果
     */
    hideLoading : function() {
        $('#c_loading_bg').unbind('click').hide();
        $('#c_loading').hide();
    },

    /**
     * 提示（倒计时关闭）
     * 
     * @param msg
     *            提示信息
     * @param onClosed
     *            关闭完成事件
     * @param closeTime
     *            关闭时间（单位为毫秒，默认1000）
     */
    showAlertTip : function(msg, onClosed, closeTime) {
        closeTime = Utils.get(closeTime, 1500);
        var modal = $('#c_alert_tip');
        var modalBg = $('#c_alert_tip_bg');
        if (modal.length == 0) {
            $('body').append('<div class="modal-backdrop" id="c_alert_tip_bg"></div>').append('<div class="modal" id="c_alert_tip"><table><tr><td>' + msg + '</td></tr></table></div>');
            modal = $('#c_alert_tip');
            modalBg = $('#c_alert_tip_bg');
        }

        // 事件绑定
        modal.one('click', function() {
            closeModal();
        });
        modalBg.one('click', function() {
            closeModal();
        });

        // 显示
        modal.find('td').html(msg);
        modal.fadeIn('fast');
        modalBg.show();

        // 倒计时关闭
        setTimeout(function() {
            closeModal();
        }, closeTime);

        // 关闭
        function closeModal() {
            modalBg.hide();
            modal.fadeOut('fast', function() {
                if (typeof (onClosed) == 'function') {
                    onClosed();
                }
            });
        }
    },

    /**
     * 显示弹出框提示信息并聚焦控件
     * 
     * @param msg
     *            提示信息
     * @param controlName
     *            控件名称
     * @param container
     *            控件外部容器
     */
    showAlertAndFocus : function(msg, controlName, container) {
        Utils.showAlert(msg, function() {
            Utils.focusControl(controlName, container);
        });
    },

    /**
     * 显示弹出框提示信息
     * 
     * @param msg
     *            提示信息
     * @param okFn
     *            确定回调函数
     * @param title
     *            标题
     */
    showAlert : function(msg, okFn, title) {
        Utils.showAlertTip(msg, okFn);
    },

    /**
     * 页面跳转
     * 
     * @param url
     *            跳转页面URL
     */
    go : function(url) {
        Utils.showLoading();
        document.location.href = url;
    },

    /**
     * 数组中模糊查找返回符合条件的字符串（此用于input模糊搜索）
     */
    substringMatcher : function(strs) {
        return function findMatches(q, cb) {
            var matches, substringRegex;
            matches = [];
            substringRegex = new RegExp(q, 'i');
            $.each(strs, function(i, str) {
                if (substringRegex.test(str)) {
                    matches.push(str);
                }
            });
            cb(matches);
        };
    },

    /**
     * 是否为空
     * 
     * @param val
     * @returns 是否为空
     */
    isEmpty : function(val) {
        return typeof (val) === 'undefined' || val === null || val === '' || ($.isArray(val) && val.length === 0);
    },

    /**
     * 数字小数点格式化
     * 
     * @param num
     *            数字
     * @param fixed
     *            小数位数
     * @param enforce
     *            是否强制保留小数位数（如果是false，则表示最大保留fixed小数位）
     * @returns 格式化后的值
     */
    numToFixed : function(num, fixed, enforce) {
        if (fixed == undefined)
            fixed = 2;
        if (enforce == undefined)
            enforce = true;

        if ((num !== 0 && !num) || isNaN(num))
            return num;

        if (enforce)
            return parseFloat(num).toFixed(fixed);

        if ((num + '').indexOf('.') >= 0) {
            num = parseFloat(num).toFixed(fixed);
            num = (num + '').replace(/\.?0+$/, '');
        }

        return num;
    },

    /**
     * 截取字符串(尾部显示‘...’号)
     * 
     * @param string
     *            str 字符串
     * @param int
     *            length 截取长度（从第一位开始）
     * @param boolean
     *            byByte 是否按字节截取（默认为true）
     */
    substring : function(str, length, byByte) {
        if (typeof str != 'string')
            return str;

        byByte = (byByte == undefined ? true : byByte);

        if (!!byByte) {
            // 预期计数：中文2字节，英文1字节
            var a = 0;
            // 循环计数
            var i = 0;
            // 临时字串
            var temp = '';
            for (i = 0; i < str.length; i++) {
                if (str.charCodeAt(i) > 255)
                    a += 2;
                else
                    a++;

                if (a > length)
                    return temp + '...';
                temp += str.charAt(i);
            }
        } else {
            var strLength = str.length;
            if (strLength > length)
                str = str.substr(0, length) + '...';
        }
        return str;
    },

    /**
     * 数字小数点格式化
     * 
     * @param num
     *            数字
     * @param fixed
     *            小数位数
     * @param enforce
     *            是否强制保留小数位数（如果是false，则表示最大保留fixed小数位）
     * @returns
     */
    numFixed : function(num, fixed, enforce) {
        if (fixed == undefined)
            fixed = 2;
        if (enforce == undefined)
            enforce = true;

        if ((num !== 0 && !num) || isNaN(num))
            return num;

        if (enforce)
            return parseFloat(num).toFixed(fixed);

        if ((num + '').indexOf('.') >= 0) {
            num = parseFloat(num).toFixed(fixed);
            num = (num + '').replace(/\.?0+$/, '');
        }

        return num;
    },

    /**
     * 获取字符串或数组长度
     * 
     * @param value
     *            值
     * @param checkByteStr
     *            是否按字节数判断
     */
    getLength : function(value, checkByteStr) {
        checkByteStr = Utils.get(checkByteStr, false);
        var length = 0;
        if ($.isArray(value)) {
            length = value.length;
        } else if (checkByteStr) {
            length = $.trim(value).replace(/[^\x00-\xff]/g, 'xx').length;
        } else {
            length = $.trim(value).length;
        }
        return length;
    },

    /**
     * 获取图片数据
     * @param file 图片文件
     * @param callback 回调函数
     */
    getImgData : function(file, callback) {
        var reader = new FileReader();
        reader.onload = function(re) {
            callback(re.target.result);
        }
        reader.readAsDataURL(file);
    },
    
    /**
     * 清除form表单
     */
    clearForm : function(form) {
        if (typeof(form) == 'string') {
            form = $(form);
        }

        form.find('select,:text,textarea,:file').val('');
        form.find('.fileinput').fileinput('clear');
    },

    /**
     * 加载表单
     */
    loadForm : function(form, data) {
        if (typeof(form) == 'string') {
            form = $(form);
        }

        $.each(data,function(k,v) {
            var control = form.find('[name='+k+']');
            if (control.is(':text,textarea')) {
                control.val(v);
            } else if (control.is(':file')) {
                var fileinput = control.closest('.fileinput');
                if (fileinput.length) {
                     if (Utils.isEmpty(v)) {
                        fileinput.find('.fileinput-preview').html('');
                        fileinput.addClass('fileinput-new').removeClass('fileinput-exists');
                    } else {
                        fileinput.find('.fileinput-preview').html('<img src="' + v + '"/>');
                        fileinput.addClass('fileinput-exists').removeClass('fileinput-new');
                    }
                }
            }
        });
    },

    /**
     * 获取图片上传验证项
     */
    pushImgValidateItem : function(inputs, name, required) {
        control = $(':file[name='+name+']');
        var fileinput = control.closest('.fileinput');
        var method = [];
        if (required && !fileinput.hasClass('fileinput-exists') ) {
            method.push('required');
        }
        if (control.val()) {
            method.push('img');
        }
        if (method.length) {
            inputs.push({
                name : name,
                method : method
            });
        }
        return inputs;
    }
};

// 页面跳转处理
var HistoryUtils = {
    initBack : false,
    defaultOptions : {
        allPage: '',
        indexPage: '',
        currPage: ''
    },
    pushState : function(state) {
        var depth = history.state ? history.state.depth + 1 : 1;
        var defaultState = {
            depth : depth
        };
        if (state) {
            state = $.extend(defaultState, state);
        }
        history.pushState(state, '1', window.location.search);
    },
    setDefaultOptions : function(defaultOptions) {
        this.defaultOptions = defaultOptions;
    },
    backIndexPage : function() {
        if (history.state) {
            history.go(-history.state.depth);
        }
    },
    showChildPage : function(options) {
        options = $.extend(this.defaultOptions, options);
        $(options.allPage).hide();
        $(options.currPage).show();
        this.pushState({
            page : options.currPage
        });
        if (!this.initBack) {
            this.onBack(function(e) {
                var expr = e.state ? e.state.page : options.indexPage;
                $(options.allPage).hide();
                $(expr).show();
            });
            this.initBack = true;
        }
    },
    onBack : function(onBack) {
        if (typeof window.addEventListener != 'undefined') {
            window.addEventListener('popstate', function(e) {
                if ($.isFunction(onBack)) {
                    onBack(e);
                }
            }, false);
        } else {
            window.attachEvent('popstate', function(e) {
                if ($.isFunction(onBack)) {
                    onBack(e);
                }
            });
        }
    }
};

// 结合boostrap-datepicker的日期选择控件
$.fn.likeDatepicker = function(options) {
    var $this = this;
    var control = $('#c_date');
    if (control.length == 0) {
        control = $('<div id="c_date" class="c_date"></div>');
        $('body').append(control);
    }

    $defaultOptions = {
        format : 'yyyy-mm-dd',
        language : 'zh-CN',
        autoclose : true,
        maxViewMode : 2,
        templates : {
            leftArrow : '<i class="left_arrow"></i>',
            rightArrow : '<i class="right_arrow"></i>'
        }
    };
    options = $.extend($defaultOptions, options);
    control.data('date', options.date ? options.date : $this.val());
    control.datepicker(options).on('changeDate', function(e) {
        if ($.isFunction(options.changeDate)) {
            options.changeDate.call($this, e);
        }
        Utils.hideModalBackdrop(function() {
            control.removeClass('show');
        });
    });
    $(this).click(function() {
        control.toggleClass('show');
        Utils.showModalBackdrop(function() {
            control.removeClass('show');
        });
    });
};

/**
 * 根据索引替换字符串
 * 
 * @param startIndex
 *            开始索引
 * @param endIndex
 *            结束索引
 * @param replaceStr
 *            须要替换的字符串
 */
String.prototype.replaceFromIndex = function(startIndex, endIndex, replaceStr) {
    var part1 = this.substring(0, startIndex);
    var part2 = this.substring(endIndex);
    return part1 + replaceStr + part2;
}

/**
 * 字符串格式化
 * 
 * @param paramVal
 *            参数值，匹配字符串里的“{i}”，其中i表示参数下标（即“第几个参数-1”）
 */
String.prototype.format = function() {
    if (arguments.length == 0)
        return this;
    var str = this;
    for (var i = 0; i < arguments.length; i++) {
        var re = new RegExp('\\{' + (i) + '\\}', 'g');
        str = str.replace(re, arguments[i]);
    }
    return str;
}

// 超链接跳转
$('.c_link[href]').click(function() {
    Utils.go($(this).attr('href'));
});
