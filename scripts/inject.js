// hexo.extend.filter.register('theme_inject', function(injects) {
// 	injects.bodyEnd.raw('adsense', '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2938778520580915" crossorigin="anonymous"></script>');

// 	injects.head.raw('adsense', '<style>ins.adsbygoogle[data-ad-status="unfilled"] { display: none !important; }</style>');

// 	injects.postLeft.raw('adsense', '<aside class="sidebar d-none d-xl-block" style="margin-right:-1rem;z-index:-1"><ins class="adsbygoogle" style="display:flex;justify-content:center;min-width:160px;max-width:300px;width:100%;height:600px;position:sticky;top:2rem" data-ad-client="ca-pub-2938778520580915" data-ad-slot="5354067759"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({}); </script></aside>');

// 	injects.postCopyright.raw('adsense', '<div style="width:100%;display:flex;justify-content:center;margin-bottom:1.5rem"><ins class="adsbygoogle" style="display:flex;justify-content:center;max-width:845px;width:100%;height:90px" data-ad-client="ca-pub-2938778520580915" data-ad-slot="5354067759"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({}); </script></div>');

// 	// injects.footer.raw('adsense', '<div style="z-index:-1;width:100%;display:flex;justify-content:center"><ins class="adsbygoogle col-lg-8" style="display:flex;justify-content:center;width:100%;height:60px" data-ad-client="ca-pub-2938778520580915" data-ad-slot="5354067759"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({}); </script></div>')
// });


// 添加背景图片使背景全屏
const { root: siteRoot = "/" } = hexo.config;
hexo.extend.injector.register("body_begin", `<div id="web_bg"></div>`);
hexo.extend.injector.register("body_end",`<script src="${siteRoot}js/backgroundize.js"></script>`);


//鼠标右键
hexo.extend.filter.register('theme_inject', function(injects) {
    injects.bodyEnd.file('default', "source/_inject/bodyEnd.ejs");
  });


//加载页面
hexo.extend.injector.register("body_begin", `<!-- loading开始 -->
<style>#loading-animation{background-color:#fff;height:100%;width:100%;position:fixed;z-index:99999999999999999999999999999999999999999999999;margin-top:0px;top:0px;}#loading-animation-center{width:100%;height:100%;position:relative;}#loading-animation-center-absolute{position:absolute;left:50%;top:50%;height:200px;width:200px;margin-top:-100px;margin-left:-100px;}.loading_object{-moz-border-radius:50% 50% 50% 50%;-webkit-border-radius:50% 50% 50% 50%;border-radius:50% 50% 50% 50%;position:absolute;border-left:5px solid #87CEFA;border-right:5px solid #FFC0CB;border-top:5px solid transparent;border-bottom:5px solid transparent;-webkit-animation:animate 2.5s infinite;animation:animate 2.5s infinite;}#loading_one{left:75px;top:75px;width:50px;height:50px;}#loading_two{left:65px;top:65px;width:70px;height:70px;-webkit-animation-delay:0.1s;animation-delay:0.1s;}#loading_three{left:55px;top:55px;width:90px;height:90px;-webkit-animation-delay:0.2s;animation-delay:0.2s;}#loading_four{left:45px;top:45px;width:110px;height:110px;-webkit-animation-delay:0.3s;animation-delay:0.3s;}@-webkit-keyframes animate{50%{-ms-transform:rotate(180deg);-webkit-transform:rotate(180deg);transform:rotate(180deg);}100%{-ms-transform:rotate(0deg);-webkit-transform:rotate(0deg);transform:rotate(0deg);}}@keyframes animate{50%{-ms-transform:rotate(180deg);-webkit-transform:rotate(180deg);transform:rotate(180deg);}100%{-ms-transform:rotate(0deg);-webkit-transform:rotate(0deg);transform:rotate(0deg);}}</style><div id="loading-animation"><div id="loading-animation-center"><div id="loading-animation-center-absolute"><div class="loading_object" id="loading_four"></div><div class="loading_object" id="loading_three"></div><div class="loading_object" id="loading_two"></div><div class="loading_object" id="loading_one"></div></div></div></div><script>!function(){function e(){setTimeout(()=>{$("#loading-animation").fadeOut(540)},500)}window.jQuery?$(document).ready(()=>{e()}):document.onreadystatechange=(()=>{"interactive"===document.readyState&&e()})}();</script>
<!-- loading 结束 -->`);