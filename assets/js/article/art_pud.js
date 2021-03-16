// 入口函数
$(function () {
    // 1.初始化分类
    let form = layui.form;
    let layer = layui.layer;
    initCate();

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
    };

    // 2.初始化富文本编辑器
    initEditor();

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 4.点击按钮，选择图片
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    });

    // 5.选择文件，同步修改图片预览区
    $('#coverFile').on('change', function (e) {
        // 1.拿到用户选择的文件
        let file = e.target.files[0]
        // 非空校验
        if (file == undefined) {
            return "您可以选择一张图片作为封面！";
        }
        // 2.根据选择的文件，创建一个对应的 URL 地址：
        let newImgURL = URL.createObjectURL(file)

        // 3.先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    });

    // 6.设置状态
    let state = "";

    $('#btnSave1').on('click', function () {
        state = '已发布';
    })
    $('#btnSave2').on('click', function () {
        state = '草稿';
    })

    // 7.发布文章
    $('#form-pud').on('submit', function (e) {
        e.preventDefault();
        // 创建FormData对象，收集数据
        let fd = new FormData(this);
        // 放入状态
        fd.append('state', state)
        // 放入图片
        // 4. 将裁剪后的图片，输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);
                // 发送ajax
                publishArticle(fd);
            });
    });
    // 封装，添加文章方法
    function publishArticle(fd) {
        $.ajax({
            type: 'post',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: (res) => {
                console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                layer.msg('恭喜您，发布文章成功！');
                // 跳转

                setTimeout(function () {
                    window.parent.document.getElementById('art_list').click();
                }, 1000);

            }
        })
    }
})