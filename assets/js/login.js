//入口函数
$(function () {
    // 点击去注册账号，隐藏登录区域，显示注册区域
    $('#link_reg').on('click', function () {
        $('.loginBox').hide();
        $('.regBox').show();
    })
    // 点击去登录账号，隐藏注册区域，显示登录区域
    $('#link_login').on('click', function () {
        $('.loginBox').show();
        $('.regBox').hide();
    })

    // 需求2： 自定义layui 校验规则
    // 自定义验证规则
    let form = layui.form;
    // verify（） 的参数是一个对象
    form.verify({
        // 属性是校验规则名称，值是函数或者多个数组
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],

        // 重复密码校验规则
        repwd: function (value) {
            //选择器必须 带空格，选择的是后代中的input，name属性值 
            var pwd = $('.regBox input[name=password]').val()
            //比较
            if (value != pwd) {
                return "两次密码输入不一致！";
            }
        }
    });


    // 4.注册功能
    let layer = layui.layer;
    $('#form_reg').on('submit', function (e) {
        // 阻止默认表单提交
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/api/reguser',
            data: {
                username: $('.regBox [name=username]').val(),
                password: $('.regBox [name=password]').val(),
            },
            success: (res) => {
                // console.log(res)；
                // 返回状态判断
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 });

                }
                // 提交成功后处理代码
                layer.msg('恭喜您，用户名注册成功！', { icon: 6 });
                // 手动切换到登录表单
                $('#link_login').click();
                // 重置form表单
                $('#form_reg')[0].reset();
            }
        })
    });

    // 5.登录功能（给form标签邦定事件，button按钮触发提交事件）
    $('#form_login').on('submit', function (e) {
        // 阻止默认表单提交
        e.preventDefault();
        // 发送ajax
        $.ajax({
            type: 'post',
            url: '/api/login',
            data: $(this).serialize(),
            success: (res) => {
                console.log(res);

                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 });

                }
                // 提交成功后处理代码
                localStorage.setItem('token', res.token);
                location.href = '/index.html';
            }
        })
    })
})