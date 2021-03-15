// 1.开发环境服务器地址
let baseURL = 'http://api-breakingnews-web.itheima.net';

$.ajaxPrefilter(function (options) {
    options.url = baseURL + options.url;
    // 验证身份证
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }

        options.complete = function (res) {
            console.log(res.responseJSON);

            let obj = res.responseJSON;
            if (obj.status == 1 && obj.message == '身份认证失败！') {
                // 跳转到登录页面，清空token
                localStorage.removeItem('token');
                location.href = '/login.html';
            }
        }


    }
})