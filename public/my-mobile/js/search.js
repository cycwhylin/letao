$(function (){
    //历史记录渲染页面
    render();


    //读取本地存储,获取历史记录数组
    function getHistory() {
        var jsonStr = localStorage.getItem('search_list') || '[]'
        // console.log(jsonStr);
        var arr = JSON.parse(jsonStr);
        // console.log(arr);
        return arr;
    };

    //读取本地存储,获取数组,渲染页面
    function render() {
        var arr = getHistory();
        var htmlStr = template('searchTpl', { arr: arr });
        $('.lt_history').html(htmlStr);
    };

    // 功能2: 清空历史记录功能
    // 思路:
    // (1) 点击清空按钮 (事件委托绑定)
    // (2) 移除本地历史的数据 使用 removeItem
    // (3) 页面重新渲染
    $('.lt_history').on('click','.btn_empty',function(){
        mui.confirm('你确定要清空历史吗','温馨提示',['取消','确认'],function(e){
            // console.log(e);
            if(e.index == 1){
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
    $('.lt_history').on('click','.btn_delete',function(){
        var arr = getHistory();
        //data-index与数组中的id相对应
        var index = $(this).data('index');
        //从数组中删除该条数据
        arr.splice(index,1);
        //重新存储数据到本地存储数组中
        localStorage.setItem('search_list', JSON.stringify(arr));
        //重新渲染
        render();
    });


    // 功能4: 添加单个历史记录功能
    // 思路:
    // (1) 给搜索按钮, 添加点击事件
    // (2) 获取输入框的值, 往数组的最前面加 unshift
    // (3) 转成 jsonStr, 存到本地
    // (4) 重新渲染
    $('.search_btn').click(function(){
        //获取搜索框中的内容
        var txt = $('.search_input').val().trim();
        //判断如果内容为空,提示用户输入内容
        if(txt === ''){
            mui.toast('请输入搜索内容');
            return; 
        }

        //获取数组
        var arr = getHistory();

        //功能去重
        //判断本地存储数组中有没有输入的内容
        var index = arr.indexOf(txt);
        console.log(index);
        //如果index为 -1,表示本地存储数组中没有
        //如果本地数组数组中已经存在,则删除之前的重复数据
        if(index != -1){
            arr.splice(index,1);
            // console.log('shanchu');
            
        }

        //功能搜索记录长度不超过10条
        //超出10条,则删除搜索记录的最后一条
        if(arr.length >=10){
            arr.pop();
        }

        //把获取的输入内容,添加到数组最前面
        arr.unshift(txt);

        //存储到本地
        localStorage.setItem('search_list',JSON.stringify(arr));

        //重新渲染
        render();
        
        //清空输入框的内容
        $('.search_input').val('');
    })

})

