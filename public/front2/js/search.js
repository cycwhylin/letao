$(function () {

  // 功能使用 localStorage 完成, 使用数组存储
  // localStorage( key, value ); 约定 key 键名: search_list

  /* 
    以下3行代码, 在控制台执行, 可以添加假数据
    var arr = [ '耐克', '阿迪', '老北京', '耐克王' ];
    var jsonStr = JSON.stringify(arr);
    localStorage.setItem('search_list', jsonStr);
  */



  // 分析功能:
  // 功能1: 历史记录渲染功能
  // 功能2: 清空全部的历史记录
  // 功能3: 删除单个历史记录
  // 功能4: 添加单个历史记录




  // 功能1: 历史记录渲染功能
  // 思路:
  // (1) 获取本地历史
  // (2) 获取得到的是 jsonStr, 需要转成数组
  // (3) 渲染搜索历史列表  (模板引擎: template(模板id, 数据对象) )
  render();


  // 读取本地存储, 并返回历史记录数组
  function getHistory() {
    var jsonStr = localStorage.getItem('search_list') || '[]';
    var arr = JSON.parse( jsonStr );
    return arr;
  }

  // 读取本地存储, 获取数组, 根据数组完成渲染
  function render() {
    var arr = getHistory();
    // 通过模板引擎渲染
    var htmlStr = template('searchTpl', { arr: arr });
    $('.lt_history').html( htmlStr );
  }



  // 功能2: 清空历史记录功能
  // 思路:
  // (1) 点击清空按钮 (事件委托绑定)
  // (2) 移除本地历史的数据 使用 removeItem
  // (3) 页面重新渲染
  $('.lt_history').on('click', '.btn_empty', function() {

    // 参数1: message 内容
    // 参数2: title   标题
    // 参数3: btnArr  按钮文本数组
    // 参数4: callback 按钮点击的回调函数
    mui.confirm('你确认要清空历史记录吗?', '温馨提示', ['取消', '确认'], function( e ) {
      // 可以通过 e.index 确定用户的选择, 就是点击的按钮在数组中的下标

      if (e.index === 1) {
        // 确认, 完成清空
        localStorage.removeItem('search_list');
        render();
      }

    })
  });



  // 功能3: 删除单个历史记录
  // 思路:
  // (1) 给删除按钮添加点击事件 (事件委托)
  // (2) 从本地获取对应的数组
  // (3) 将该条数据 根据下标 从数组中删除
  // (4) 将已经修改后的数组, 存回本地
  // (5) 页面重新渲染
  $('.lt_history').on('click', '.btn_delete', function() {

    // 获取本地数组
    var arr = getHistory();

    // 获取 index, 根据 index 在数组中删除对应项
    var index = $(this).data('index');

    // 从数组中删除对应下标的项, 
    // arr.splice(start, deleteCount, item1, item2, item3, ..... );
    // arr.splice(从哪开始删, 删几个, 替换的项1, 替换的项2, 替换的项3, ...);
    arr.splice(index, 1);

    // 将修改后的数组, 存回本地
    localStorage.setItem('search_list', JSON.stringify(arr) );

    // 重新渲染
    render();

  });


  // 功能4: 添加单个历史记录功能
  // 思路:
  // (1) 给搜索按钮, 添加点击事件
  // (2) 获取输入框的值, 往数组的最前面加 unshift
  // (3) 转成 jsonStr, 存到本地
  // (4) 重新渲染
  $('.search_btn').click(function() {

    // 获取搜索关键字
    var key = $('.search_input').val().trim();

    if (key === '') {
      // mui的提示框
      mui.toast('请输入搜索关键字');
      return;
    }
    // 获取数组
    var arr = getHistory();

    // 1. 去除重复项, 如果有重复的需要删除
    var index = arr.indexOf(key);

    if (index != -1) {
      // 说明找到了重复项, 有下标了, 可以删除
      arr.splice(index, 1);
    }

    // 2. 如果长度超过 10, 删除最早搜索的, 删除数组的最后一项
    if (arr.length >= 10) {
      arr.pop();
    }

    // 往数组的最前面加
    arr.unshift(key);

    // 存到本地
    localStorage.setItem( 'search_list', JSON.stringify(arr) );

    // 重新渲染
    render();

    // 清空内容
    $('.search_input').val("");
  })




})