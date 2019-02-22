//进度条
// 在第一个ajax开始发送时, 开启进度条
$(document).ajaxStart(function () {
    // 开启进度条
    NProgress.start();
})

// 在全部的ajax完成时, 关闭进度条
$(document).ajaxStop(function () {
    // 模拟网络延迟
    setTimeout(function () {
        // 结束进度条
        NProgress.done();
    }, 500);
});

$(function(){
    //二级菜单切换
    $('.lt_aside .category').click(function(){
        $(this).next().stop().slideToggle();
    });

    //左侧菜单切换
    $('.lt_topbar .icon_menu').click(function(){
        $('.lt_aside').toggleClass('hidemenu');
        $('.lt_main').toggleClass('hidemenu');
        $('.lt_topbar').toggleClass('hidemenu');
    });

    //退出
    //点击显示模态框
    $('.lt_topbar .icon_logout').click(function () {
        // 让模态框显示, modal('show')
        $('#logoutModal').modal('show');
    });
    //
    $('#logoutBtn').click(function(){
        $.ajax({
            type:'get',
            url:'/employee/employeeLogout',
            dataType:'json',
            success:function(res){
                console.log(res);
                if(res.success){
                    location.href = 'login.html'
                }
            }
        })
    })
})