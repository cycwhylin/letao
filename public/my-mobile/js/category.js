$(function(){
    //1,发送ajax,渲染页面

    $.ajax({
        type:'get',
        url: '/category/queryTopCategory',
        dataType: 'json',
        success: function(res){
            console.log(res);
            var htmlStr = template('leftTpl',res);
            // console.log(htmlStr);
            $('.lt_category_left ul').html(htmlStr);
            //进页面渲染第一页内容
            renderById(res.rows[0].id);
        }

    });

    //左侧菜单,点击切换二级菜单功能

    $('.lt_category_left').on('click','a',function(){
        //移除全部a的current类
        $('.lt_category_left a').removeClass('current');
        //给当前a添加current
        $(this).addClass('current');

        //获取id,发送ajax,完成页面渲染
        var id = $(this).data('id');
        console.log(id);
        renderById(id)
    });

    //根据一级列表渲染二级菜单(通过一级列表id)

    function renderById(id){
        $.ajax({
            type: 'get',
            url: '/category/querySecondCategory',
            dataType: 'json',
            data: {
                id : id
            },
            success: function(res){
                // console.log(res);
                var htmlStr = template('rightTpl',res);
                $('.lt_category_right ul').html(htmlStr)
                
            }
        })
    }


})