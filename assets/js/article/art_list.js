// 入口函数
$(function () {
    // 为art-template 定义时间过滤器
    template.defaults.imports.dateFormat = function (dtStr) {
        let dt = new Date(dtStr);
        let y = dt.getFullYear();
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())

        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    // 在个位数的左侧填充0
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    // 1.定义查询参数
    let q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: "",
        state: ""
    }
    //2.渲染文章分类列表（后面添加，删除，修改还要使用它
    let layer = layui.layer;
    initTable();

    // 函数封装
    function initTable() {
        $.ajax({
            type: 'get',
            url: '/my/article/list',
            data: q,
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                // 获取不用弹窗，直接展示
                // 传递的是对象，遍历的对象上面的属性
                let htmlStr = template('tpl-table', { data: res.data });
                $('tbody').html(htmlStr);

                // 调用分页
                renderPage(res.total);
            }
        })
    };

    // 初始化文章分类
    let form = layui.form;
    initCate();
    // 封装
    function initCate() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: (res) => {
                // console.log(res);
                // 校验
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                // 赋值渲染form
                let htmlStr = template('tpl-cate', { data: res.data });
                $('[name=cate_id]').html(htmlStr);
                layui.form.render();
            }
        })
    }

    // 4.筛选功能
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取
        var state = $('[name=state]').val();
        var cate_id = $('[name=cate_id]').val();
        // 赋值
        q.state = state;
        q.cate_id = cate_id;

        // 初始化文章列表
        initTable();
    })

    // 分页
    let laypage = layui.laypage;
    function renderPage(total) {
        // alert(total);
        // 执行一个laypage实例
        laypage.render({
            elem: 'pageBox', //注意，这里的 pageBox 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页几条
            curr: q.pagenum,  //第几页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数

                //首次不执行
                if (!first) {
                    //do something
                    q.pagenum = obj.curr //页码值赋值给q中的pagenum

                    q.pagesize = obj.limit;
                    // 重新渲染页面
                    initTable();
                }
            }
        });
    };

    // 6.删除
    $('tbody').on('click', '.btn-delete', function () {
        let Id = $(this).attr('data-id');
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                type: 'get',
                url: '/my/article/delete/' + Id,
                success: (res) => {
                    // console.log(res);
                    if (res.status != 0) {
                        return layer.msg(res.message)
                    }
                    // 因为我们删除成功了，所以要重新渲染页面中的数据
                    if ($('.btn-delete').length == 1 && q.pagenum > 1) q.pagenum--;
                    // 因为我们更新成功了，所以要重新渲染页面中的数据
                    layer.msg('恭喜您，文章类别删除成功！');
                    initTable();
                    layer.close(index);
                }
            })
        });
    })

})