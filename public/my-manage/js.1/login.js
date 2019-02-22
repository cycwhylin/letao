$(function(){
    /*
   * 1. 进行表单校验配置
   *    校验要求:
   *        (1) 用户名不能为空, 长度为2-6位
   *        (2) 密码不能为空, 长度为6-12位
   * */
    $('#form').bootstrapValidator({
        // 配置图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields:{
            username:{
                validators:{
                    notEmpty: {
                        message: '用户名不能为空'
                    },
                    stringLength: {
                        min: 2,
                        max: 6,
                        message: '用户名长度必须在2到6之间'
                    },
                    callback:{
                        message:'用户名不存在'
                    }
                }
            },
            password:{
                validators: {
                    notEmpty: {
                        message: '密码错误'
                    },
                    stringLength: {
                        min: 6,
                        max: 12,
                        message: '用户名长度必须在6到12之间'
                    },
                    callback: {
                        message: '密码错误'
                    }
                }
            }
        }
    });
     /* 
    2. 使用 submit 按钮, 会进行表单提交, 此时表单校验插件会立刻进行校验
       (1) 校验成功, 此时会默认提交, 发生页面跳转,  注册表单校验成功事件, 在事件中阻止默认的跳转提交, 通过ajax提交
       (2) 校验失败, 自动拦截提交
      注册表单校验成功事件, 在事件中阻止默认的提交, 通过ajax提交
  */
        $("#form").on('success.form.bv', function (e) {
            e.preventDefault();
            //使用ajax提交逻辑
            $.ajax({
                type:'post',
                url:'/employee/employeeLogin',
                data: $('#form').serialize(),
                dataType:'json',
                success:function(res){
                    console.log(res);
                    if (res.error === 1000) {
                        $('#form').data("bootstrapValidator").updateStatus("username", "INVALID", "callback");
                        // alert('用户名不存在');
                    }
                    if (res.error === 1001) {
                        $('#form').data("bootstrapValidator").updateStatus("password", "INVALID", "callback");
                        // alert('密码错误');
                    }
                    if (res.success) {
                        // 登录成功, 跳转首页
                        location.href = 'index.html';
                    }
                }
            })
        });

        //重置按钮
    $('[type="reset"]').on('click',function(){
            $("#form").data("bootstrapValidator").resetForm(); 
        })

});