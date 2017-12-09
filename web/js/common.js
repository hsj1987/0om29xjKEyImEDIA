$.fn.init_img_height = function(col_count, img_ratio) {
    var fw = 768;
    var ww = $('#container').width();
    var is_mobile = ww <= fw;
    var w = is_mobile ? ww : ww/col_count;
    var h = w/img_ratio; 
    $(this).css('height', h);
};