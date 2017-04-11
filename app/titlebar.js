
$(function() {

    //获取当前窗口
    var currentWindow = chrome.app.window.current();

    //关闭窗口
    $('#close').click(function() {
       currentWindow.close();
    });

    //最小化窗口
    $('#minimize').click(function() {
        currentWindow.minimize();
    });

    //最大化窗口和还原窗口
    $('#maximize').click(function() {
       currentWindow.isMaximized() ?
           currentWindow.restore() :
           currentWindow.maximize();
    });

});