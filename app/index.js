
$(function() {

    var data = [28,48,40,19,96,27,100];


    //chartJs("#cpuTotal",)
    setInterval(function(){

        data.push(data.shift());

        chartJs("#cpuHistory",
                ["January","February","March","April","May","June","July"],
                data,
                "line",
                "cpu历史曲线");
    },1000);

    //chartJs("#cpuHistory",
    //        ["January","February","March","April","May","June","July"],
    //        [28,48,40,19,96,27,100],
    //        "line",
    //        "cpu历史曲线");
});


/**
 * 作用:Chart.js画图
 * 日期:2017-04-11
 * 作者:ziyi2
 * id -> 元素id
 * labels -> 图表的横坐标
 * data -> 图表的数据
 * chartType -> 图表的类型
 * chartTitle -> 图表的标题
 */

function chartJs(id,labels,data,chartType,chartTitle) {
    //var ctx =$(id).get(0).getContext("2d");
    var ctx = $(id);

    var chartData = {
        labels:labels,
        datasets: [
            {
                label: "布吉岛",
                fillColor : "rgba(151,187,205,0.5)",
                strokeColor : "rgba(151,187,205,1)",
                pointColor : "rgba(151,187,205,1)",
                pointStrokeColor : "#fff",
                data : data
            }
        ]
    };

    new Chart(ctx,{
        type:chartType,
        data:chartData,
        options:{
            title:{
                display:true,
                text:chartTitle
            }
        }
    })

}