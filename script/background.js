/**
 * 作用:启动应用监听
 * 日期:2017-04-11
 * 作者:ziyi2
 * 参数:
 */
chrome.app.runtime.onLaunched.addListener(function() {
    //创建窗口
    chrome.app.window.create('main.html', {
        id: 'main',                 //窗口id
        innerBounds: {              //窗口内嵌入页面的显示尺寸(不包括标题栏等)
            width: 1000,
            height: 550,
            minWidth: 750,
            minHeight:520
        },
        resizable: false,           //不希望用户调整窗口尺寸
        frame: 'none'              //新建的窗口不显示标题栏
        //alwaysOnTop: true           //弹出窗口总是在最前面
    })
});






