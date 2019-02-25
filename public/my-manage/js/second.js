$(function(){

    //1,
    var currentPage = 1;
    var pageSize = 5;
    render();
    function render(){
        $.ajax({
            type:'get',
            url: "/category/querySecondCategoryPaging",
            data:{
                page: currentPage,
                pageSize:pageSize
            },
            dataType:'json',
            success:function(res){
                var htmlStr = template('secondTpl',res)
                $('tbody').html(htmlStr);
                //分页插件
                $('#paginator').bootstrapPaginator({
                    // 版本号
                    bootstrapMajorVersion: 3,
                    // 当前页
                    currentPage: res.page,
                    // 总页数
                    totalPages: Math.ceil(res.total / res.size),
                    // 给页码添加点击事件
                    onPageClicked: function (a, b, c, page) {
                        // 更新当前页
                        currentPage = page;
                        // 并且重新渲染
                        render();
                    }
                })
            }
        })
    }

    //2,点击添加分类
    $('#addBtn').click(function(){
        $('#addModal').modal('show');

        $.ajax({
            type: 'get',
            url: '/category/queryTopCategoryPaging',
            data:{
                page:1,
                pageSize: 100
            },
            dataType:'json',
            success:function(res){
                var htmlStr = template('dropdownTpl',res)
                $('.dropdown-menu').html(htmlStr);
            }
        })
    });


    //3,下拉菜单
    
    $('.dropdown-menu').on('click','a',function(){
        
        var txt = $(this).text();
        console.log(txt);
        
        
        $('#dropdownText').text(txt);
    })
})