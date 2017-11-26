   /*
 * JS验证插件
 * 依赖：jQuery、like.utils.js
 */
(function($) {
    $.validate = function(options) {
        return new LikeValidate(options);
    };

    $.fn.validate = function(options) {
        options.container = $(this);
        return new LikeValidate(options);
    };

    // 验证表单默认配置
    var validMultiDefault = {
        container : '#c_data_info',// 验证容器（jQuery表达式，jQuery对象）
        showError : 'alert',// 是否显示错误（false：不显示，'alert'：弹出框显示，function：显示错误函数，否则为错误容器jQuery表达式）
        errorTemplate : '<div class="c_err_item">{0}</div>',// 错误信息模板
        inputs : []// 验证输入项
    };

    // 验证输入默认配置
    var validItemDefault = {
        container : '',//验证容器（如果为空则采用validMultiDefault.container）
        showError : 'alert',// 是否显示错误（如果为空则采用validMultiDefault.showError）
        errorTemplate : '<div class="c_err_item">{0}</div>',// 错误信息模板（如果为空则采用validMultiDefault.errorTemplate）
        id : null,// 控件id（用于取数据）
        name : null,// 控件name（用于取数据）
        field : null,// 字段名称（用于定义输出数据属性名）
        value : null,// 属性值（如果value!=null，则取value的值，否则取控件的值）
        label : '',// 字段名称（用于显示错误消息）,不传则默认区上级最近的form-group下的label的文本
        isChecked : false,// 是否是单选或复选列表
        focusInvalid : true,// 聚焦验证失败的第一个控件
        outValue : true,// 是否输出值
        method : 'required',// 验证方法（字符串表示验证一个函数，数组表示单个值多种验证，按数组顺序依次验证，如：['required',{method:'rangeLength',error:'工号长度为6-16个字符',param:[6,16]},{method:function(){... ...},error:'自定义验证错误'}]）
        param : null,// 验证参数
        error : ''// 错误信息
    };

    $.validate.validateMsg = {
        required : function(label, param, input){
            var msg = '“{0}”不能为空';
            if(input.length > 0) {
                if(input.is(':text,:password')) {
                    msg = '请输入“{0}”';
                } else if(input.is('select,:radio,:checkbox,:file')) {
                    msg = '请选择“{0}”';
                }
            }
            return msg;
        },
        str : '“{0}”只能包括数字和字母',
        str1 : '“{0}”只能包括数字、字母、减号‘-’ 、下划线 ‘_’',
        str2 : '“{0}”只能包括数字、字母、空格和特殊字符：+ - * / % $ . _',
        float : '“{0}”必须为有效数值',
        float1 : '“{0}”必须为有效数值',
        float2 : '“{0}”必须为有效数值',
        float3 : '“{0}”必须为有效数值',
        float4 : '“{0}”必须为有效数值',
        int : '“{0}”必须为有效数值',
        int1 : '“{0}”必须为有效数值',
        int2 : '“{0}”必须为有效数值',
        isLength : '“{0}”长度必须为{1}个字符',
        isBytes : '“{0}”长度必须为{1}个字节',
        minLength : '“{0}”长度不能小于{1}个字符',
        minBytes : '“{0}”长度不能小于{1}个字节',
        maxLength : '“{0}”长度不能大于{1}个字符',
        maxBytes : '“{0}”长度不能大于{1}个字节',
        rangeLength : '“{0}”长度必须是{1}-{2}个字符',
        rangeBytes : '“{0}”长度必须是{1}-{2}个字节',
        min : '“{0}”最小值为{1}',
        max : '“{0}”最大值为{1}',
        range : '“{0}”的范围必须是{1}-{2}',
        mobile : '“{0}”必须是有效的11位手机号码',
        tel : '请输入有效的“{0}”',
        telOrMobile : '请输入有效的“{0}”',
        email : '请输入有效的“{0}”',
        url : '请输入有效的“{0}”',
        zipcode : '请输入有效的“{0}”',
        date : '请输入有效的“{0}”',
        date1 : '请输入有效的“{0}”',
        cardNo : '请输入有效的“{0}”',
        noRepeat : '“{0}”不能包括重复数据',
        telephone : '请输入有效的“{0}”',
        address: '请输入有效的“{0}”',
        img: '图片格式不正确'
    };

    function LikeValidate(options) {
        return $.validate.validMulti(options);
    }

    // 验证多项
    $.validate.validMulti = function(options) {
        options = $.extend(true, {}, validMultiDefault, options ? options : {});
        var data = {};
        var validResult = true;
        var msg = '';
        $.each(options.inputs, function(i, o) {
            if(Utils.isEmpty(o.container))
                o.container = options.container;
            if(Utils.isEmpty(o.showError))
                o.showError = options.showError;
            if(Utils.isEmpty(o.errorTemplate))
                o.errorTemplate = options.errorTemplate;

            var res = $.validate.validItem(o);

            // 设置输出值
            o = res.options;
            if (o.outValue) {
                var field = o.field != null ? o.field : o.name;
                data[field] = res.data;
            }

            // 验证失败则返回
            if (!res.suc) {
                msg = res.msg;
                validResult = false;
                return false;
            }
        });

        if (validResult) {
            return {
                suc : true,
                data : data
            };
        }
        return {
            suc : false,
            data : data,
            msg : msg
        };
    };

    /**
    * 验证一项
    *
    * @param options
    *           选项，格式参考validItemDefault
    */
    $.validate.validItem = function(options) {
        options = $.extend(true, {}, validItemDefault, options ? options : {});
        var container = (typeof options.container == 'string') ? $(options.container) : options.container;

        // 获取值
        var value = null;
        var input = null;
        if (options.value != null) {
            value = options.value;
        } else {
            input = options.id ? $('#' + options.id) : container.find('[name="' + options.name + '"]' + (options.isChecked ? ':checked' : ''));
            if (input.length == 1) {
                if(input.is(':text')) {
                    input.val($.trim(input.val()));
                    value = input.val();
                } else {
                    value = input.val();
                }
            } else if(input.length > 1) {
                value = [];
                $.each(input, function(i, ipt){
                    value.push($(ipt).val());
                });
            }
        }

        // 获取label
        if (options.label == '') {
            options.label = input.closest('.form-group').find('label').text().replace('* ','')
        }

        // 验证
        var validResult = false;
        var error = '';
        var isEmptyValue = Utils.isEmpty(value);
        var methodType = typeof options.method;
        if (methodType == 'string') {
            var allowEmpty = options.method != 'required';
            validResult = (allowEmpty && isEmptyValue) || $.validate[options.method](value, options.param);
            if (!validResult)
                error = options.error ? options.error : $.validate.getMethodError(options.method, options.label, options.param, input);
        } else if (methodType == 'function') {
            validResult = isEmptyValue || options.method(value);
            if (!validResult)
                error = m.error;
        } else if ($.isArray(options.method)) {
            var allowEmpty = false;
            $.each(options.method, function(i, m) {
                if (i == 0 && m !== 'required') {
                    allowEmpty = true;
                }
                var methodType2 = typeof m;
                if (methodType2 == 'string') {
                    validResult = (allowEmpty && isEmptyValue) || $.validate[m](value);
                    if (!validResult)
                        error = $.validate.getMethodError(m, options.label, null, input);
                } else if (methodType2 == 'object') {
                    var methodType3 = typeof m.method;
                    if (methodType3 == 'string') {
                        validResult = (allowEmpty && isEmptyValue) || $.validate[m.method](value, m.param);
                        if (!validResult)
                            error = m.error ? m.error : $.validate.getMethodError(m.method, options.label, m.param, input);
                    } else if(methodType3 == 'function') {
                        validResult = isEmptyValue || m.method(value);
                        if (!validResult)
                            error = m.error;
                    }
                    
                }
                if (!validResult) {
                    return false;
                }
            });
        }

        // 输出
        if(validResult) {
            return {
                suc : true,
                data : value,
                options : options
            };
        } else {
            $.validate.showError(error, options, input);
            return {
                suc : false,
                data : value,
                msg : error,
                options : options
            };
        }
    };


    // 显示错误信息并聚焦控件
    $.validate.showError = function(error, options, input) {
        if (options.showError !== false) {
            if (options.showError === 'alert') {
                Utils.showAlert(error, function() {
                    if(options.focusInvalid)
                        input.focus();
                });
            } else {
                var showErrorType = typeof options.showError;
                if (showErrorType == 'string') {
                    $(options.showError).html(options.errorTemplate.format(error));
                    if(options.focusInvalid)
                        input.focus();
                } else if (showErrorType == 'function') {
                    options.showError(error);
                } else {
                    options.showError.html(options.errorTemplate.format(error));
                }
                if(options.focusInvalid)
                    input.focus();
            }
        }
    };

    // 获取验证函数对应错误信息
    $.validate.getMethodError = function(method, label, param, input) {
        var msg = $.validate.validateMsg[method];
        if (typeof msg == 'function') {
            msg = msg(label, param, input);
        }
        if ($.isArray(param) && param.length > 0) {
            switch (param.length) {
                case 1 :
                    return msg.format(label, param[0]);
                case 2 :
                    return msg.format(label, param[0], param[1]);
                default :
                    return msg.format(label, param[0], param[1], param[2]);
            }
        } else if(!Utils.isEmpty(param)) {
            return msg.format(label, param);
        } else {
            return msg.format(label);
        }
    },

    // 不能为空
    $.validate.required = function(value) {
        return $.trim(value).length > 0;
    };
    
    // 字符串格式
    $.validate.str = function(value) {
        return /^([0-9A-Za-z]+)$/.test(value);
    };

    // 字符串格式1
    $.validate.str1 = function(value) {
        return /^([\-\w]+)$/.test(value);
    };

    // 字符串格式2
    $.validate.str2 = function(value) {
        return /^([A-Z0-9\+\-\*\/\%\$\.\_\s]+)$/.test(value);
    };

    /**
    * float类型
    *
    * @param value
    *           值
    * @param param
    *           参数[precisior,onInput]或precisior；precisior：int,最大小数位数；onInput：boolean,是否是正在输入时验证
    */
    $.validate.float = function(value, param) {
        var precisior = 2;// 最大小数位数
        var onInput = false;// 是否正在输入时验证
        if ($.isArray(param)) {
            var precisior = param[0];
            var onInput = param[1];
        } else if (param != null && param != undefined) {
            precisior = param;
        }
        precisior = "{0," + precisior + "}";
        var reg = new RegExp("^(\\-?(0|[1-9]\\d*)(\\.\\d" + precisior + ")?)$");
        return (onInput && /^(\-|(\-?(0|[1-9]\d*)\.?))$/.test(value)) || reg.test(value);
    };

    /**
    * float4类型
    *
    * @param value
    *           值
    * @param param
    *           参数[precisior,onInput]或precisior；precisior：int,最大小数位数；onInput：boolean,是否是正在输入时验证
    */
    $.validate.float4 = function(value, param) {
        var precisior = 2;// 最大小数位数
        var onInput = false;// 是否正在输入时验证
        if (value < -999999.99 || value > 999999.99) {
            return false;
        }
        if ($.isArray(param)) {
            var precisior = param[0];
            var onInput = param[1];
        } else if (param != null && param != undefined) {
            precisior = param;
        }
        precisior = "{0," + precisior + "}";
        var reg = new RegExp("^(\\-?(0|[1-9]\\d*)(\\.\\d" + precisior + ")?)$");
        return (onInput && /^(\-|(\-?(0|[1-9]\d*)\.?))$/.test(value)) || reg.test(value);
    };

    /**
    * 非负float
    *
    * @param value
    *           值
    * @param param
    *           参数[precisior,onInput]或precisior；precisior：int,最大小数位数；onInput：boolean,是否是正在输入时验证
    */
    $.validate.float1 = function(value, param) {
        var precisior = 2;// 最大小数位数
        var onInput = false;// 是否正在输入时验证
        if ($.isArray(param)) {
            precisior = param[0];
            onInput = param[1];
        } else if (param != null && param != undefined) {
            precisior = param;
        }
        precisior = "{0," + precisior + "}";
        var reg = new RegExp("^((0|[1-9]\\d*)(\\.\\d" + precisior + ")?)$");
        return (onInput && /^((0|[1-9]\d*)\.?)$/.test(value)) || reg.test(value);
    };


    /**
    * 非负float
    *
    * @param value
    *           值
    * @param param
    *           参数[precisior,onInput]或precisior；precisior：int,最大小数位数；onInput：boolean,是否是正在输入时验证
    */
    $.validate.float3 = function(value, param) {
        var precisior = 3;// 最大小数位数
        var onInput = false;// 是否正在输入时验证
        if ($.isArray(param)) {
            precisior = param[0];
            onInput = param[1];
        } else if (param != null && param != undefined) {
            precisior = param;
        }
        precisior = "{0," + precisior + "}";
        var reg = new RegExp("^((0|[1-9]\\d*)(\\.\\d" + precisior + ")?)$");
        return (onInput && /^((0|[1-9]\d*)\.?)$/.test(value)) || reg.test(value);
    };
    /**
    * 正float
    *
    * @param value
    *           值
    * @param param
    *           参数[precisior,onInput]或precisior；precisior：int,最大小数位数；onInput：boolean,是否是正在输入时验证
    */
    $.validate.float2 = function(value, param) {
        var onInput = false;// 是否正在输入时验证
        if ($.isArray(param)) {
            onInput = param[1];
        }
        return this.float1(value, param) && (onInput || parseFloat(value) != 0);
    };

    /**
    * 整数
    *
    * @param value
    *           值
    * @param param
    *           是否是正在输入时验证    
    */
    $.validate.int = function(value, param) {
        var onInput = param;
        return (onInput && value == '-') || /^(\-?(0|[1-9]\d*))$/.test(value);
    };

    // 非负整数
    $.validate.int1 = function(value) {
        return /^(0|[1-9]\d*)$/.test(value);
    };

    // 正整数
    $.validate.int2 = function(value) {
        return /^([1-9]\d*)$/.test(value);
    };

    /**
    * 字符或数组长度
    *
    * @param value
    *           值
    * @param lengthLimit
    *           长度限制值 
    */
    $.validate.isLength = function(value, lengthLimit) {
        return Utils.getLength(value) == lengthLimit;
    };

    /**
    * 字节长度
    *
    * @param value
    *           值
    * @param lengthLimit
    *           长度限制值 
    */
    $.validate.isBytes = function(value, lengthLimit) {
        return Utils.getLength(value, true) == lengthLimit;
    };

    /**
    * 最小字符长度
    *
    * @param value
    *           值
    * @param lengthLimit
    *           长度限制值 
    */
    $.validate.minLength = function(value, lengthLimit) {
        return Utils.getLength(value) >= lengthLimit;
    };

    /**
    * 最小字节数
    *
    * @param value
    *           值
    * @param lengthLimit
    *           长度限制值 
    */
    $.validate.minBytes = function(value, lengthLimit) {
        return Utils.getLength(value, true) >= lengthLimit;
    };

    /**
    * 最大字符长度
    *
    * @param value
    *           值
    * @param lengthLimit
    *           长度限制值 
    */
    $.validate.maxLength = function(value, lengthLimit) {
        return Utils.getLength(value) <= lengthLimit;
    };

    /**
    * 最大字节数
    *
    * @param value
    *           值
    * @param lengthLimit
    *           长度限制值 
    */
    $.validate.maxBytes = function(value, lengthLimit) {
        return Utils.getLength(value, true) <= lengthLimit;
    };

    /**
    * 字符或数组长度范围
    *
    * @param value
    *           值
    * @param param
    *           参数[lengthMinLimit,lengthMaxLimit]
    */
    $.validate.rangeLength = function(value, param) {
        var length = Utils.getLength(value);
        return (length >= param[0] && length <= param[1]);
    };

    /**
    * 字节长度范围
    *
    * @param value
    *           值
    * @param param
    *           参数[lengthMinLimit,lengthMaxLimit]
    */
    $.validate.rangeBytes = function(value, param) {
        var length = Utils.getLength(value, true);
        return (length >= param[0] && length <= param[1]);
    };

    /**
    * 最小值
    *
    * @param value
    *           值
    * @param limit
    *           限制值 
    */
    $.validate.min = function(value, limit) {
        return value >= limit;
    };

    /**
    * 最大值
    *
    * @param value
    *           值
    * @param limit
    *           限制值 
    */
    $.validate.max = function(value, limit) {
        return value <= limit;
    };

    /**
    * 取值范围
    *
    * @param value
    *           值
    * @param param
    *           参数[minLimit,maxLimit] 
    */
    $.validate.range = function(value, param) {
        return (value >= param[0] && value <= param[1]);
    };

    // 手机
    $.validate.mobile = function(value) {
        return /^(1[34578]\d{9})$/.test(value);
    };

    // 电话
    $.validate.tel = function(value) {
        return /^((\d{3,4}\-?)?(\d\-?){6,7}\d?(\-?\d{1,4})?)$/.test(value);
    };

    // 电话或手机
    $.validate.telOrMobile = function(value) {
        return this.tel(value) || this.mobile(value);
    };

    // Email
    $.validate.email = function(value) {
        return /^(\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*)$/.test(value);
    };

    // URL
    $.validate.url = function(value) {
        return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
                .test(value);
    };

    // 邮编
    $.validate.zipcode = function(value) {
        return /^([1-9]\d{5})$/.test(value);
    };

    // 日期（格式为：yyyy-mm-dd或yyyy/mm/dd）
    $.validate.date = function(value) {
        return /^\d{4}[\/\-]((0[1-9])|(1[0-2]))[\/\-]((0[1-9])|([1-2][0-9])|(3[0-1]))$/.test(value);
    };

    // 日期（格式为：yyyy-mm-dd hh:ii）
    $.validate.date1 = function(value) {
        return /^\d{4}[\/\-]((0[1-9])|(1[0-2]))[\/\-]((0[1-9])|([1-2][0-9])|(3[0-1])) (([0-1][0-9])|([2][0-4]))[\:]([0-5][0-9])$/.test(value);
    };

    // 身份证号验证：15位数字、18位数字、17位数字+X
    $.validate.cardNo = function(value) {
        return /^[1-9]((\d{7}((0[1-9])|(1[0-2]))((0[1-9])|([1-2]\d)|(3[0-1]))\d{3})|(\d{5}([1-2]\d{3})((0[1-9])|(1[0-2]))((0[1-9])|([1-2]\d)|(3[0-1]))\d{4})|(\d{5}([1-2]\d{3})((0[1-9])|(1[0-2]))((0[1-9])|([1-2]\d)|(3[0-1]))\d{3})(\d|X|x))$/.test(value);
    };

    // 数组没有重复值
    $.validate.noRepeat = function(value) {
        for (var i = 0; i < value.length; i++) {
            for (var j = 0; j < value.length; j++) {
                if (i != j && value[i] == value[j])
                    return false;
            }
        }
        return true;
    };

    //手机号或固定电话
    $.validate.telephone = function (value) {
        return /(^1[34578]\d{9}$)|(^[1-9]\d{4}(\d{2})?$)|(^(\d{3,4}\-?)?\d{7,8}(\-?\d{1,4})?$)/.test(value);
    };

    //地址
    $.validate.address = function (value) {
        return /^[\da-zA-Z\u4E00-\u9FA5]+$/.test(value);
    }

    // 图片
    $.validate.img = function (value) {
        return /\.(jpg|bmp|gif|png|jpeg)$/gi.test(value);
    }
})(jQuery);