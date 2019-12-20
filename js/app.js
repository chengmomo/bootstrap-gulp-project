$(function () {
    var age = new Date().getFullYear() - 1993;
    $("#age").html(age + '岁');

    // bootstrap scrollspy: Activate scrollspy to add active class to navbar items on scroll
    // 搭配css的.active
    $('body').scrollspy({
        target: '#navbar-collapse', //data-target
        offset: 71
    })

    // Collapse Navbar
    var navbarCollapse = function () {
        if ($("#mainNav").offset().top > 100) {
            $("#mainNav").addClass("navbar-scrolled");
        } else {
            $("#mainNav").removeClass("navbar-scrolled");
        }
    };
    // Collapse now if page is not at top
    navbarCollapse();
    // Collapse the navbar when page is scrolled
    $(window).scroll(navbarCollapse);

    // Closes responsive menu when a scroll trigger link is clicked
    $('.nav-link').click(function () {
        $('.navbar-collapse').collapse('hide');
    })
})

function onDownFile(filename) {
    // const downUrl = `http://10.1.109.123:19092/down/to?url=${encodeURIComponent(url)}`;
    var downUrl = './../resource/me.pdf';
    // 创建隐藏的可下载链接
    var eleLink = document.createElement('a');
	eleLink.download = filename ? filename : "翟呈娟-前端开发";
    eleLink.style.display = 'none';
    // 本地文件
	eleLink.href = downUrl;
    // 字符内容转变成blob地址
    // var blob = new window.Blob([downUrl]);
    // eleLink.href = URL.createObjectURL(blob);
    // 触发点击
    document.body.appendChild(eleLink);
    eleLink.click();
    // 移除
    document.body.removeChild(eleLink);
}
