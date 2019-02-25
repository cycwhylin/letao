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
                
                
                var htmlStr = template('secondTpl',res);
                
                $('tbody').html(htmlStr);
                //分页插件zz
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
        console.log($('#dropdownText').text());
        

        //给隐藏域设置id
        var id = $(this).data('id');
        $('[name="categoryId"]').val(id);
        console.log($('[name="categoryId"]').val());
        

         // 只要给隐藏域赋值了, 此时校验状态应该更新成成功
        $('#form').data('bootstrapValidator').updateStatus('categoryId', 'VALID');
    });

    //4,文件上传初始化
    $('#fileupload').fileupload({
        dataType:'json',
        done:function(e,data){
            console.log(data);
            
            //后台返回的数据,result中存有图片地址
            var result = data.result;

            //获取图片地址
            var picUrl = result.picAddr;

            //给img设置图片路径
            $('#imgBox img').attr('src',picUrl);

            //路径设置给隐藏域
            $('[name="brandLogo"]').val(picUrl);

            //
            $('#form').data('bootstrapValidator').updateStatus('brandLogo', 'VALID');

        }
    });


    //5,校验
    $('#form').bootstrapValidator({
        // 配置 excluded 排除项, 对隐藏域完成校验
        excluded: [],

        // 配置图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        // 配置校验字段列表
        fields: {
            // 选择一级分类
            categoryId: {
                validators: {
                    notEmpty: {
                        message: '请选择一级分类'
                    }
                }
            },
            // 输入二级分类名称
            brandName: {
                validators: {
                    notEmpty: {
                        message: '请输入二级分类名称'
                    }
                }
            },
            // 二级分类图片
            brandLogo: {
                validators: {
                    notEmpty: {
                        message: '请选择图片'
                    }
                }
            }
        }
    });

    //6,阻止默认提交,用ajax提交

    $('#form').on('success.form.bv',function(e){
        e.preventDefault();

        $.ajax({
            type:'post',
            url: '/category/addSecondCategory',
            data:$('#form').serialize(),
            dataType:'json',
            success:function(res){
                if(res.success){
                    //关闭模态框
                    $('#addModal').modal('hide');
                    //重新渲染
                    currentPage = 1;
                    render();

                    //表单重置

                    $('#form').data('bootstrapValidator').resetForm(true);

                    $('#dropdownText').text('请选择一级分类');
                    $('#imgBox img').attr('src','./images/none.png');
                }
            }
        })
    })







})