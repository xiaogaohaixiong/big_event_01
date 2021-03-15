// 入口函数
$(function () {
    // 定义校验规则
    let form = layui.form;
    form.verify({
        // 密码校验
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],

        // 新密码校验
        samePwd: function (value) {
            // value是新密码 ,旧密码需要获取
            if (value == $('[name=oldPwd]').val()) {
                // return layui.layer.msg('新密码和原密码不能重复！', { icon: 5 })
                return '新密码和原密码不能重复！'
            }
        },

        rePwd: function (value) {
            // value是再次输入的密码，新密码需要重新获取
            if (value !== $('[name=newPwd]').val()) {
                // return layui.layer.msg('新密码和确认新密码不能一致！', { icon: 5 })
                return '新密码和确认新密码必须一致！'
            }
        }
    });

    // 表单提交
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layui.layer.msg(res.message);
                }
                layui.layer.msg('恭喜您，修改密码成功！', { icon: 6 })
                // 重置表单
                $('.layui-form')[0].reset();
            }
        })
    })
})