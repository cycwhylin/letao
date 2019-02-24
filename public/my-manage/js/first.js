$(function(){
    //1,发送ajax,获取数据,渲染页面
    var currentPage = 1;
    var pageSize = 5;
    render();
    function render(){
        $.ajax({
            type:'get',
            url: '/category/queryTopCategoryPaging',
            data:{
                page:currentPage,
                pageSize:pageSize
            },
            dataType:'json',
            success:function(res){
                console.log(res);
                var htmlStr = template('firstTpl',res);
                $('tbody').html(htmlStr);

                $('#pageinator').bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: res.page,
                    totalPages: Math.ceil(res.total/res.size),
                    onPageClicked:function(a,b,c,page){

                        currentPage = page;
                        render();
                    }
                })
            }
        })
    }

    //点击
    $('#addBtn').click(function(){
        $('#addModal').modal('show');
    })

    //校验
    $('#form').bootstrapValidator({

        // 配置图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        // 配置需要校验的字段列表
        fields: {
            categoryName: {
                // 配置校验规则
                validators: {
                    // 非空校验
                    notEmpty: {
                        message: '请输入一级分类名称'
                    }
                }
            }
        }
    });

    //提交表单

    $('#form').on('success.form.bv',function(e){
        e.preventDefault();//阻止默认提交

        //ajax提交
        $.ajax({
            type:'post',
            url: '/category/addTopCategory',
            data:$('#form').serialize(),//表单序列化
            dataType:'json',
            success:function(res){
                if(res.success){
                    //关闭模态框
                    $('#addModal').modal('hide');


                    //重新渲染
                    currentPage = 1;
                    render();


                    //重置表单
                    $('#form').data('bootstrapValidator').resetForm(true);
                }
            }        
        })
    })

})