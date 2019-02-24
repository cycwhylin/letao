$(function(){
    //进入页面发送ajax请求数据,

    //当前页
    var currentPage = 1;
    //每页条数
    var pageSize = 5;

    var currentId;
    var isDelete;
    render();

    function render(){
        $.ajax({
            type:'get',
            url:'/user/queryUser',
            data:{
                page:currentPage,
                pageSize:pageSize,
            },
            dataType:'json',
            success:function(res){
                console.log(res);
                var htmlStr = template('tpl',res);

                //渲染
                $('tbody').html(htmlStr);


                //分页
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: res.page,
                    totalPages: Math.ceil(res.total / res.size),
                    onPageClicked:function(a,b,c,page){
                        console.log(page);
                        currentPage = page;
                        render();
                        
                    }
                })
            }
        })
    }


    //点击按钮,禁用启用
    $('tbody').on('click','.btn',function(){
        $('#userModal').modal('show');

        currentId = $(this).parent().data('id');
        console.log(currentId);
        isDelete = $(this).hasClass('btn-danger') ? 0 : 1;
    });

    //
    $('#confirmBtn').click(function(){
        $.ajax({
            type:'post',
            url: '/user/updateUser',
            data:{
                id:currentId,
                isDelete:isDelete
            },
            dataType:'json',
            success:function(res){
                if(res.success){
                    $('#userModal').modal('hide');
                    render();
                }
            }

        })
    })
})