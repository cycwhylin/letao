$(function () {
    var currentPage = 1;
    var pageSize = 3;

    //存放提交的图片
    var picArr = [];
    render();
    function render() {
        $.ajax({
            type: 'get',
            url: '/product/queryProductDetailList',
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: 'json',
            success: function (res) {
                // console.log(res);
                var htmlStr = template('productTpl', res);
                $('tbody').html(htmlStr);

                // 完成分页初始化
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
                        // 重新渲染
                        render();
                    }
                })
            }
        })
    }

    //显示模态框
    $('#addBtn').click(function () {
        $('#addModal').modal('show');

        $.ajax({
            type: 'get',
            url: '/category/querySecondCategoryPaging',
            data: {
                page: 1,
                pageSize: 100
            },
            dataType: 'json',
            success: function (res) {
                var htmlStr = template('dropdownTpl', res);
                $('.dropdown-menu').html(htmlStr);
            }
        })
    });

    //下拉菜单的a注册点击事件
    $('.dropdown-menu').on('click', 'a', function () {
        //给按钮设置文本
        var txt = $(this).text();
        $('#dropdownText').text(txt);

        //给隐藏域设置id
        var id = $(this).data('id');
        $('[name="brandId]').val(id);

        $('#form').data('bootstrapValidator').updateStatus('brandId', 'VALID');

    });

    //文件上传初始化
    $('#fileupload').fileupload({
        dataType: 'json',
        done: function (e, data) {
            console.log(data);
            var picObj = data.result;
            var picUrl = picObj.picAddr;
            picArr.unshift(picObj);

            $('#imgBox').prepend('<img style = "height: 100px;" src = "' + picUrl + '" alt = "" >');

            //图片多余三张,删除第三张,包括样式
            if (picArr.length > 3) {
                //删除最后一张
                picArr.pop();

                //删除样式结构
                $('#imgBox img:last-of-type').remove();
            }

            if (picArr.length === 3) {
                $('#form').data('bootstrapValidator').updateStatus('picStatus', 'VALID');
            }
        }
    });

    //表单校验
    $('#form').bootstrapValidator({
        // 配置 excluded 排除项, 对隐藏域完成校验
        excluded: [],

        // 配置图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        // 配置字段列表
        fields: {
            brandId: {
                validators: {
                    notEmpty: {
                        message: '请选择二级分类'
                    }
                }
            },
            proName: {
                validators: {
                    notEmpty: {
                        message: '请输入商品名称'
                    }
                }
            },
            proDesc: {
                validators: {
                    notEmpty: {
                        message: '请输入商品描述'
                    }
                }
            },
            num: {
                validators: {
                    notEmpty: {
                        message: '请输入商品库存'
                    },
                    // 1  10  111  1111
                    // 正则校验, 必须非零开头的数字
                    // \d  0-9 数字
                    // ?   表示 0 次 或 1 次
                    // +   表示 1 次 或 多次
                    // *   表示 0 次 或 多次
                    // {n} 表示 出现 n 次
                    // {n, m}  表示 出现 n ~ m 次
                    regexp: {
                        regexp: /^[1-9]\d*$/,
                        message: '商品库存必须是非零开头的数字'
                    }
                }
            },
            size: {
                validators: {
                    notEmpty: {
                        message: '请输入商品尺码'
                    },
                    // 尺码格式, 必须是 xx-xx 格式,  xx 是两位的数字
                    regexp: {
                        regexp: /^\d{2}-\d{2}$/,
                        message: '尺码格式, 必须是 xx-xx 格式,  xx 是两位数字, 例如: 32-40 '
                    }
                }
            },
            oldPrice: {
                validators: {
                    notEmpty: {
                        message: '请输入商品原价'
                    }
                }
            },
            price: {
                validators: {
                    notEmpty: {
                        message: '请输入商品现价'
                    }
                }
            },
            // 标记图片是否上传满三张的
            picStatus: {
                validators: {
                    notEmpty: {
                        message: '请上传三张图片'
                    }
                }
            }
        }
    });

    //阻止默认提交,用ajax提交

    $('#form').on('success.form.bv',function(e){

        //阻止默认
        e.preventDefault();

        //获取表单数据
        var paramsStr = $('#form').serialize();
        paramsStr += '&picArr=' + JSON.stringify(picArr);
        // console.log(paramsStr);
        

        //拼接图片
        // paramsStr += '&picArr=' + JSON.stringify(picArr);


        $.ajax({
            type:'post',
            url: '/product/addProduct',
            data: paramsStr,
            dataType:"json",
            success:function(res){
                if(res.success){
                    //关闭模态
                    $('#addModal').modal('hide');

                    //重渲染
                    currentPage = 1;
                    render();

                    //重置表单
                    $('#form').data('bootstrapValidator').resetForm(true);

                    //重置按钮图片
                    $('#dropdownText').text('请选择第二分类');
                    $('#imgBox img').remove();
                    picArr = [];
                }
            }
        })

    })




})