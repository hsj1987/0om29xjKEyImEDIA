$(function() {
    Page.init();
});

var Page = {
    pageSize: 15,
    pager : null,
    init: function() {
        $(window).scroll(function() {
            Page.initTabScroll();
        });
        Page.initTabScroll();

        $(window).resize(function() {
            setVideoSize();
        });
        
        var tab_items = $('.video_list .tabs .tab_item');
        var tab_content_items = $('.video_list .tab_contents .tab_content')
        tab_items.click(function() {
            tab_items.removeClass('curr');
            $(this).addClass('curr');
            var category_id = $(this).attr('category_id');
            tab_content_items.removeClass('curr');
            tab_content_items.filter('[category_id=' + category_id + ']').addClass('curr');
        });
        
    },

    initTabScroll: function() {
        var wt = $(window).scrollTop();
        var ot = $('#p_vedios').offset().top;
        var hh = $('#header').height();
        $('#video_list .tabs').toggleClass('fixed', wt + hh >= ot);
    }
};