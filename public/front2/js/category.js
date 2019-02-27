$(function() {

  // 1. 一进入页面, 发送 ajax, 获取左侧一级分类的全部数据, 完成渲染
  $.ajax({
    type: 'get',
    url: '/category/queryTopCategory',
    dataType: 'json',
    success: function( info ) {
      console.log( info );
      var htmlStr = template('leftTpl', info);
      $('.lt_category_left ul').html( htmlStr );

      // 默认一进入页面, 渲染第一个一级分类对应的二级分类
      renderById( info.rows[0].id );
    }
  });



  // 实现左侧菜单切换功能
  $('.lt_category_left').on('click', 'a', function() {
    // 移除所有 a 的current 类 
    $('.lt_category_left a').removeClass('current');
    // 给当前 a 加上 current 类
    $(this).addClass('current');

    // 获取 id, 调用方法, 完成二级分类渲染
    var id = $(this).data('id');
    renderById( id );
  })



  // 根据一级分类的 id, 请求二级分类数据, 并且完成渲染
  function renderById( id ) {

    $.ajax({
      type: 'get',
      url: '/category/querySecondCategory',
      data: {
        id: id
      },
      dataType: 'json',
      success: function( info ) {
        console.log( info );
        var htmlStr = template('rightTpl', info);
        $('.lt_category_right ul').html( htmlStr );
      }
    })

  }

})