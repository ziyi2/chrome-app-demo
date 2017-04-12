
var TIME = {
    INTERVAL: 2000  //2s进行一次监控
};


$(function() {


    //内存饼状图初始化
    var MemoryDoughnutChart = drawDoughnutCharts('memoryDoughnut',['已用内存'],[0,100]);
    //内存曲线图初始化
    var MemoryLineChart = drawLineCharts('memoryLine',"memory");
    //CPU饼状图初始化
    var CpuDoughnutChart = drawDoughnutCharts('cpuDoughnut',['CPU占用率'],[0,100]);
    //CPU曲线图初始化
    var CpuLineChart = drawLineCharts('cpuLine',"cpu");





    setInterval(function() {
        updateStorageInfo(MemoryDoughnutChart,MemoryLineChart);
        updateCpuInfo(CpuDoughnutChart,CpuLineChart);

    },TIME.INTERVAL)


});


/**
 * 作用: 更新系统内存信息
 * 时间: 2017-04-12
 * 作者: ziyi2
 * 参数: DoughnutChart -> 饼状图图例对象
 *      LineChart      -> 曲线图图例
 */
function updateStorageInfo(DoughnutChart,LineChart) {
    getStorageInfo(function(info) {

        var usedCapacity =  (info.capacity - info.availableCapacity)/info.capacity
            , availableCapacity = (info.availableCapacity/info.capacity);

        //更新饼状图数据
        DoughnutChart.data.datasets[0].data =  [
            usedCapacity.toFixed(2),
            availableCapacity.toFixed(2)
        ];
        //更新饼状图图例
        DoughnutChart.update();


        //更新柱状图数据集
        LineChart.data.datasets[0].data.shift();    //移除前一个数据
        LineChart.data.datasets[0].data.push(usedCapacity.toFixed(4));

        LineChart.data.labels.shift();
        LineChart.data.labels.push(new Date().toTimeString().split("GMT")[0]);

        //更新柱状图图例
        LineChart.update();

    })
}


/**
 * 作用: 更新系统CPU信息
 * 时间: 2017-04-12
 * 作者: ziyi2
 * 参数: DoughnutChart -> 饼状图图例对象
 *      LineChart      -> 曲线图图例
 */

var last_kernel = [];
var last_user = [];
var last_total = [];


function updateCpuInfo(DoughnutChart,LineChart) {
    getCpuInfo(function(info) {
        if(last_kernel.length && last_user.length && last_total.length) {

            var total = 0
                , user = 0
                , kernel = 0;

            for(var i=0,len=info.processors.length; i<len; i++) {

                var usage = info.processors[i].usage;

                total += usage.total - last_total[i];
                user += usage.user - last_user[i];
                kernel += usage.kernel - last_kernel[i];

                last_kernel[i] = usage.kernel;
                last_user[i] = usage.user;
                last_total[i] = usage.total;
            }


            //DoughnutChart.data.datasets[0].data =  [
            //    usedCapacity.toFixed(2),
            //    availableCapacity.toFixed(2)
            //];


            user = (user/total).toFixed(2);
            kernel = (kernel/total).toFixed(2);
            total = parseFloat(user) + parseFloat(kernel);


            //更新饼状图数据
            DoughnutChart.data.datasets[0].data =  [
                total,
                1-total
            ];
            //更新饼状图图例
            DoughnutChart.update();


            //更新柱状图数据集
            LineChart.data.datasets[2].data.shift();    //移除前一个数据
            LineChart.data.datasets[2].data.push(total.toFixed(2));

            LineChart.data.datasets[1].data.shift();    //移除前一个数据
            LineChart.data.datasets[1].data.push(parseFloat(user));

            LineChart.data.datasets[0].data.shift();    //移除前一个数据
            LineChart.data.datasets[0].data.push(parseFloat(kernel));

            //for(var i= 0,len=LineChart.data.datasets[1].data.length - 1; i<len; i++) {
            //    LineChart.data.datasets[0].data[i] = LineChart.data.datasets[0].data[i+1];
            //}
            //
            //LineChart.data.datasets[0].data[LineChart.data.datasets[1].data.length -1] = total;


            LineChart.data.labels.shift();
            LineChart.data.labels.push(new Date().toTimeString().split("GMT")[0]);

            //更新柱状图图例
            LineChart.update();





        //第一次获取基础值
        } else {
            for(var i=0,len=info.processors.length; i<len; i++) {
                var usage = info.processors[i].usage;
                last_kernel[i] = usage.kernel;
                last_user[i] = usage.user;
                last_total[i] = usage.total;
            }
        }
    })
}







/**
 * 作用: 获取系统内存信息
 * 时间: 2017-04-12
 * 作者: ziyi2
 * 参数: cb -> 回调函数
 */
function getStorageInfo(cb) {
    chrome.system.memory.getInfo(function(info){
        cb(info);
    });
}

/**
 * 作用: 获取系统CPU信息
 * 时间: 2017-04-12
 * 作者: ziyi2
 * 参数: cb -> 回调函数
 */
function getCpuInfo(cb) {
    chrome.system.cpu.getInfo(function(info) {
        cb(info);
    })
}




/**
 * 作用: 画一个饼状图
 * 时间: 2017-04-12
 * 作者: ziyi2
 * 参数:
 *       canvasId -> canvas的id参数
 *       label    -> 字段
 *       data     -> 数据
 */

function drawDoughnutCharts(canvasId,label,data) {
    var canvas = $('#' + canvasId).get(0)
        , ctx = canvas.getContext('2d');

    var chartData = {
        labels: label,
        datasets: [
            {
                data: data,
                backgroundColor: [
                    "#FF6384",
                    "#36A2EB"
                ],
                hoverBackgroundColor: [
                    "#FF6384",
                    "#36A2EB"
                ]
            }]
    };

    return new Chart(ctx,{
        type:"doughnut",
        data: chartData,
        options: {
            animation:{
                animateScale:false
            }
        }
    });

}


/**
 * 作用: 画一个曲线图
 * 时间: 2017-04-12
 * 作者: ziyi2
 * 参数:
 *       canvasId   -> canvas的id参数
 *       label      -> Y轴坐标
 *       chartType  -> 图类型
 */

function drawLineCharts(canvasId,chartType) {
    var canvas = $('#' + canvasId).get(0)
        , ctx = canvas.getContext('2d');

    var data = [0,0,0,0,0,0,0,0,0,0];
    var data1 = [0,0,0,0,0,0,0,0,0,0];
    var data2 = [0,0,0,0,0,0,0,0,0,0];
    var label = [0,0,0,0,0,0,0,0,0,0];

    if(chartType == "memory") {
        chartType = {
            labels: label,
            datasets: [
                {
                    label: "已用内存",
                    //fillColor: "rgba(220,220,220,0.2)",
                    //strokeColor: "rgba(220,220,220,1)",
                    //pointColor: "rgba(220,220,220,1)",
                    //pointStrokeColor: "#fff",
                    data: data,
                    //steppedLine: true
                    //spanGaps:true
                    //lineTension:5
                    //lineTension: 0.1
                    backgroundColor:"rgba(255,99,132,0.2)"
                }

            ]
        };
    } else if(chartType == "cpu") {
        chartType = {
            labels: label,
            datasets: [
                {
                    label: "Kernel",
                    //fillColor: "rgba(220,220,220,0.2)",
                    //strokeColor: "rgba(220,220,220,1)",
                    //pointColor: "rgba(220,220,220,1)",
                    //pointStrokeColor: "#fff",
                    data: data2,
                    //steppedLine: true
                    //spanGaps:true
                    //lineTension:5
                    //lineTension: 0.1
                    backgroundColor:"rgba(205,198,115,0.2)"
                },

                {
                    label: "User",
                    //fillColor: "rgba(220,220,220,0.2)",
                    //strokeColor: "rgba(220,220,220,1)",
                    //pointColor: "rgba(220,220,220,1)",
                    //pointStrokeColor: "#fff",
                    data: data1,
                    //steppedLine: true
                    //spanGaps:true
                    //lineTension:5
                    //lineTension: 0.1
                    backgroundColor:"rgba(118,238,198,0.2)"
                },
                {
                    label: "Total",
                    //fillColor: "rgba(220,220,220,0.2)",
                    //strokeColor: "rgba(220,220,220,1)",
                    //pointColor: "rgba(220,220,220,1)",
                    //pointStrokeColor: "#fff",
                    data: data,
                    //steppedLine: true
                    //spanGaps:true
                    //lineTension:5
                    //lineTension: 0.1
                    backgroundColor:"rgba(255,99,132,0.2)"
                }


            ]
        };
    }


    return  new Chart(ctx,{
        type:"line",
        data: chartType,
        options: {

            //禁止动画
            animation : false,
            //设置y轴坐标
            scales:{
                yAxes:[
                    {
                        ticks:{
                            max:0.4,
                            min:0.0,
                            stepSize:0.05
                        },
                        stacked:true
                    }
                ]
            }
        }
    });

}
