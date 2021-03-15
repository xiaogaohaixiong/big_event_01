// 入口函数
$(function () {
    // 1.自定义验证规则
    let form = layui.form;
    form.verify({
        nickname: function (value) {
            if (value.length < 2 || value.length > 6) {
                return "昵称长度为2~6位之间"
            }
        }
    });

    // 用户渲染
    initUserInfo();
    // 导出layer
    let layer = layui.layer;
    // 封装函数
    function initUserInfo() {
        $.ajax({
            type: 'get',
            url: '/my/userinfo',
            data: {},
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message, { icon: 5 });
                }
                // 成功后渲染
                form.val('formUserInfo', res.data)
            }
        })
    };

    // 重置
    $('#btnReset').on('click', function (e) {
        e.preventDefault();
        // 用上面的用户渲染方法实现
        initUserInfo();
    })

    // 修改用户信息
    $('.layui-form').on('submit', function (e) {
        // 阻止浏览器默认行为，form表单的提交
        e.preventDefault();
        // 方送ajax，修改用户信息
        $.ajax({
            type: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 });
                }
                layer.msg('恭喜您，用户信息修改成功！', { icon: 6 })
                // 调用父页面中的更新用户信息和头像的方法
                window.parent.getUserInfo();
            }
        })
    })
})