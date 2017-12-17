$(function() {
    Page.init();
});

var Page = {
    pageSize: 3,
    pager : null,
    init: function() {
        $('.c_pager').replaceWith($.pager.createHtml({
            showPageSize: false
        }));
        this.pager = $('.c_pager');
        this.pager.pager({
            perCount: Page.pageSize,
            onPageChange: function (source, pageNo, pageSize) {
                Page.load(pageNo, pageSize);
            }
        });

        Page.load(1, Page.pageSize, true);
    },
    load: function(pageNo, pageSize, getTotal) {
        Utils.ajax({
            action: 'get_list',
            data: {
                page_no: pageNo,
                page_size: pageSize,
                get_total: getTotal
            },
            success: function(result) {
                var html = '';
                $.each(result.data, function(i, item) {
                    var color_num = (i+1)%5;
                    if (color_num == 0) {
                        color_num = 5;
                    }
                    html += '<a class="news_item c_zoom_full color'+ color_num +'" href="news.html?id='+item.id+'">';
                    html += '<div class="date">' + item.create_time + '</div>';
                    html += '<div class="title">' + item.title + '</div>';
                    html += '<div class="summary">' + item.summary + '</div>';
                    html += '</a>'
                });
                $('#news_list').html(html);

                if (getTotal) {
                    Page.pager.pager('initPages', result.total);
                }
                Page.pager.pager('changeCurrPageNo', parseInt(pageNo));
            }
        });
    }
};