// 入口函数
$(function () {
    // 需求1：ajax 获取用户信息，渲染到页面
    // 这个功能，后面其他的页面/模块还要用，所以必须设置为全局函数
    getUserInfo();

    // 退出
    let layer = layui.layer;
    $('#btnLogout').on('click', function () {
        // 框架提供的询问框
        layer.confirm('是否确认退出?', { icon: 3, title: '提示' }, function (index) {
            //清空本地token
            localStorage.removeItem('token');
            // 2。页面跳转
            location.href = '/login.html'
            // 关闭询问框
            layer.close(index);
        });
    })
});


// 必须保证这个函数是全局的，后面其他功能还要用到
function getUserInfo() {
    $.ajax({
        type: 'get',
        url: '/my/userinfo',
        data: {},
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: (res) => {
            // console.log(res);
            if (res.status == 0) {
                renderAvatar(res.data);
            }
        }
    })
}


function renderAvatar(user) {
    let name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    if (user.user_pic == null) {
        $('.layui-nav-img').hide();
        $('.text-avatar').show().html(name[0].toUpperCase());

    } else {
        $('.layui-nav-img').show().attr('src', user.user_pic)
        $('.text-avatar').hide();
    }
}