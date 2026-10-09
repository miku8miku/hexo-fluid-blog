(function(){
    var bp = document.createElement('script');
    var curProtocol = window.location.protocol.split(':')[0];
    if (curProtocol === 'https') {
        bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
    }
    else {
        bp.src = 'http://push.zhanzhang.baidu.com/push.js';
    }
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(bp, s);
})();


// hexo-blog-encrypt 解密后自动重新初始化 Fluid 主题组件（目录 TOC、代码高亮复制、图片放大等）
window.addEventListener('hexo-blog-decrypt', function () {
    var container = document.getElementById('hexo-blog-encrypt');
    if (container && !container.classList.contains('markdown-body')) {
        container.classList.add('markdown-body');
    }
    if (window.Fluid && Fluid.boot && Fluid.boot.refresh) {
        Fluid.boot.refresh();
    }
});
