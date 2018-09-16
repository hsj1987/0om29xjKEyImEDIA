$(function() {
    Page.init();
});

var Page = {
    pageSize: 8,
    currCategoryId: null,
    cacheSize: null,

    init: function() {
        $(window).scroll(function() {
            Page.initTabFixed();
        });
        Page.initTabFixed();

        $(window).resize(function() {
            var tab_content = $('#video_list .tab_content[category_id=' + Page.currCategoryId + ']');
            Page.setVideoSize(tab_content, true);
        });

        Page.initTabChange();

        Page.currCategoryId = $('#video_list .tabs .curr').attr('category_id');

        Page.initPager();

        Page.load(1, true);
    },

    initTabFixed: function() {
        var wt = $(window).scrollTop();
        var ot = $('#p_vedios').offset().top;
        var hh = $('#header').height();
        $('#video_list .tabs').toggleClass('fixed', wt + hh >= ot);
    },

    initTabChange: function() {
        var tab_items = $('#video_list .tabs .tab_item');
        var tab_content_items = $('#video_list .tab_contents .tab_content')
        tab_items.click(function() {
            tab_items.removeClass('curr');
            $(this).addClass('curr');
            var category_id = $(this).attr('category_id');
            tab_content_items.removeClass('curr');
            tab_content_items.filter('[category_id=' + category_id + ']').addClass('curr');
            Page.currCategoryId = category_id;
            Page.load(1, true);
        });
    },

    initPager: function() {
        $('.c_pager').replaceWith($.pager.createHtml({
            showPageSize: false
        }));
        $('.c_pager').pager({
            onePageShow: false,
            perCount: Page.pageSize,
            onPageChange: function (source, pageNo, pageSize) {
                Page.load(pageNo, false);
            }
        });
    },

    setVideoSize: function(tab_content, isSetSize) {
        if (Page.cacheSize == null  || isSetSize) {
            var ww = $(window).width();
            var is_mobile = ww <= 768;
            var w = tab_content.find('.video').width();
            var radio = 1.777777777777778;
            var h = w / radio;
            Page.cacheSize = {
                video_width: w,
                video_height: h
            };
        }
        tab_content.find('.video').css('height', Page.cacheSize.video_height + 'px');
        tab_content.find('video').attr('width', Page.cacheSize.video_width).attr('height', Page.cacheSize.video_height);
        
        if (Page.cacheSize.content_height == undefined || isSetSize) {
            var video_item_height = tab_content.find('.video_item').outerHeight();
            Page.cacheSize.content_height = is_mobile ? 'auto' : ((video_item_height * 2) + 40) + 'px';
        }
        tab_content.css('height', Page.cacheSize.content_height);
    },

    load: function(pageNo, getTotal) {
        Utils.ajax({
            action: 'get_list',
            data: {
                page_no: pageNo,
                page_size: Page.pageSize,
                get_total: getTotal,
                category_id: Page.currCategoryId
            },
            success: function(result) {
                var tab_content = $('#video_list .tab_content[category_id=' + Page.currCategoryId + ']');
                var html = '';
                if (result.data.length > 0) {
                    $.each(result.data, function(i, item) {
                        html += '<div class="video_item">';
                        html += '<div class="video">';
                        html += '<video src="/upload/video/' + item.video + '" preload="false"  controls="controls" preload="metadata"></video>';
                        html += '</div>';
                        html += '<div class="ico"><img src="/img/ico9.png"/></div>';
                        html += '<div class="title">' + item.title + '</div>';
                        html += '<div class="summary">' + item.summary + '</div>';
                        html += '</div>';
                    });
                } else {
                    html += '<div class="no_videos">暂无视频</div>';
                }
                tab_content.find('.video_items').html(html);
                tab_content.find('.c_pager').pager('initPages', result.total);
                tab_content.find('.c_pager').pager('changeCurrPageNo', parseInt(pageNo));
                
                Page.setVideoSize(tab_content);
            }
        });
    }
};