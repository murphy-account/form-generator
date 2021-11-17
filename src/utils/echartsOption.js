import common from "@/utils/common.js";
import {
    getEcharts,
    setTheme
} from '@/utils/echarts'
// 统计插件
import ecStat from 'echarts-stat';
var url_theme = common.getUrlKey("theme");
var theme = setTheme(url_theme);
var theme_color = theme.theme_json;
// import echarts from 'echarts'
var echarts = require('echarts')
// 各图数据格式说明：
// multipleBarEchart---多柱图---参数(X,Y,extraOp)
// X: [x1,x2,x3,x4,x5]
// Y: [{name:'123',type:'bar',data:[ 'y1','y2','y3']},{name:'123',type:'bar',data:[ 'y1','y2','y3']},{name:'123',type:'bar',data:[ 'y1','y2','y3']}]
// extraOp : {
//   YLeftName: '', // 左Y轴名称
//   YRightName: '', // 右Y轴名称   
// }
//
// multipleLineEchart --多折线图 -- 参数(X,Y,extraOp)
// X: [x1,x2,x3,x4,x5]
// Y: [{name:'123',data:[ 'y1','y2','y3']},{name:'123',data:[ 'y1','y2','y3']},{name:'123',data:[ 'y1','y2','y3']}]
// extraOp : {
//     stackLine: true // 堆叠折线面积图 --- 默认为false
// }
/**
 * extraOp 配置
 * {
 *  tooltipName:'成交额' // 悬浮时tooltip名称
 * }
 */

export default {
    /**
     * 上清所估值
     *  data: {
    //     X: [],
    //     Y1: [],
    //     Y2: [],
    //     Y3: []
    // }
     */
    generateOp: function (data) {
        return {
            color: ['#cd4c40', '#2582c9', '#e6a23c'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    animation: false
                },
                formatter: function (params) {
                    var dateStr = '<span>' + params[0].name + '</span><br/>'
                    var relVal = dateStr
                    var format = 4
                    for (var i = 0; i < params.length; i++) {
                        if (params[i].data !== null) {
                            relVal += '<div class="chart-tooltip-circle" ><span style="background:' + params[i].color + '"></span>' + params[i].seriesName + ' : '
                            if (i === 1) {
                                format = 2
                            }
                            relVal += common.fomatFloatandThousandFilter(params[i].data, format) + ' </div>'
                        }
                    }
                    return relVal
                }
            },
            dataZoom: [{
                type: 'inside',
                height: 20,
                realtime: true
            }, {
                type: 'slider',
                height: 25,
                realtime: true
            }],
            grid: [{
                right: 50,
                left: 50,
                top: 50,
                bottom: 100,
                containLabel: true
            }],
            legend: { // 每条折线代表的title
                data: ['估价收益率%', '估价净价', '估价全价'],
                x: 'center',
                y: 'bottom',
                top: '80%',
                icon: 'circle',
                textStyle: {
                    // fontSize: 18,//字体大小
                    color: '#ffffff' //字体颜色
                },
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                inverse: true,
                axisLabel: {
                    show: true,
                    interval: 100,
                    // rotate:"45",
                    textStyle: {
                        color: theme_color.title.subtextStyle.color,
                    }
                },
                axisLine: {
                    onZero: true
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: ['#363a45'],
                    }
                },
                data: data.X // X轴坐标数组
            },
            yAxis: [{
                name: '估价收益率%',
                type: 'value',
                nameTextStyle: {
                    color: theme_color.title.subtextStyle.color,
                    // color: '#fff',
                    align: 'left'
                },
                axisLabel: {
                    show: true,
                    interval: 100,
                    // rotate:"45",
                    textStyle: {
                        color: theme_color.title.subtextStyle.color,
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: ['#363a45'],
                    }
                },
                scale: true
            }, {
                name: '估价净价/估价全价',
                type: 'value',
                nameTextStyle: {
                    color: theme_color.title.subtextStyle.color,
                    // color: '#fff',
                    align: 'right'
                },
                axisLabel: {
                    show: true,
                    interval: 100,
                    // rotate:"45",
                    textStyle: {
                        color: theme_color.title.subtextStyle.color,
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: ['#363a45'],
                    }
                },
                scale: true
            }, {
                // name: '估价全价',
                type: 'value',
                // nameTextStyle: {
                //     color: theme_color.title.subtextStyle.color,
                //     align: 'right'
                // },
                axisLabel: {
                    show: true,
                    interval: 100,
                    // rotate:"45",
                    textStyle: {
                        color: theme_color.title.subtextStyle.color,
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: ['#363a45'],
                    }
                },
                scale: true
            }],
            series: [{
                name: '估价收益率%',
                data: data.Y1, // Y轴数据
                type: 'line',
                itemStyle: {
                    normal: {
                        // color:'#00FF00',
                        lineStyle: {
                            // color:'#00FF00' // 折线颜色
                        }
                    }
                },
            }, {
                name: '估价净价',
                data: data.Y2, // Y轴数据
                yAxisIndex: 1,
                type: 'line'
                // connectNulls: true,
            }, {
                name: '估价全价',
                data: data.Y3, // Y轴数据
                yAxisIndex: 1,
                type: 'line'
                // connectNulls: true,
            }]
        }
    }
    /**
     * 股本结构(饼图)
     * @parms data : [
                        {value: 1048, name: '搜索引擎'},
                        {value: 735, name: '直接访问'},
                        
                     ],
     */
    ,
    stockStructureOp_pie: function (data) {
        return {
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    return `${params.seriesName}<br/>${params.marker}${params.name}: ${common.toThousandFilter(params.value)}<br/>${params.marker}占比: ${params.percent}%`
                },
                // formatter: '{b}: {c}<br />占比: {d}%'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                textStyle: {
                    color: theme_color.title.subtextStyle.color, // 设置图例文本颜色
                },
                inactiveColor: '#333' // 图例关闭时候的颜色
            },
            series: [{
                name: '股本信息',
                type: 'pie',
                radius: '50%',
                data: data,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                label: {
                    color: '#fff'
                }
            }]
        }
    },
    /**
     * 
     * @param {Array} data [{X:1,Y:2},{X:3,Y:4}]
     * @returns 
     */
    barEchart: function (data, extraOp) { // 单柱图
        let X = [];
        let Y = [];
        let result
        let rotate = null;
        let interval = null;
        data.forEach(item => {
            X.push(item['X'])
            Y.push(item['Y'])
        })
        // 如果X值少于4个，则不旋转x坐标
        X.length <= 4 ? rotate = 0 : rotate = 40;
        X.length < 30 ? interval = 0 : interval = 5;

        result = {
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                // top: '4%',
                // left: '3%',
                // right: '4%',
                // bottom: '3%',
                containLabel: true // 防止标签溢出
            },
            xAxis: {
                type: 'category',
                data: X,
                axisLabel: {
                    interval: interval,
                    rotate: rotate, // 旋转x坐标以防止重叠
                    textStyle: { // 高亮当天年年份/月份
                        color:



                            theme_color.title.subtextStyle.color,
                    }
                },
                // splitLine:{show: false,lineStyle:{
                //     color:['#363a45'],
                // }},
            },
            yAxis: {
                type: 'value',
                nameTextStyle: {
                    color: theme_color.title.subtextStyle.color,
                },
                axisLabel: {
                    // interval: 0,
                    textStyle: {
                        color: theme_color.title.subtextStyle.color,
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: ['#363a45'],
                    }
                },
            },
            series: [{
                data: Y,
                type: 'bar',
                itemStyle: {
                    //通常情况下：
                    normal: {
                        borderRadius: [0, 4, 4, 0],
                        color: function (data) { //设置正负颜色值
                            return data.value >= 0 ? "#c23531" : "green";
                        }
                    }
                }
            }]
        }
        if (extraOp.tooltipName) { // 额外配置项，tooltip的name
            result.series[0].name = extraOp.tooltipName
            if (extraOp.tooltipUnit) {
                result.tooltip.formatter = function (params) {
                    return `${params[0].name}<br/>${params[0].marker}${params[0].seriesName}: ${common.toThousandFilter(params[0].value)}${extraOp.tooltipUnit}`
                }
            }
        }
        if (extraOp.yAxisName) { // 设置Y轴坐标名称
            result.yAxis.name = extraOp.yAxisName
        }
        if (extraOp.ifHighLight == true) {
            let currYear = new Date().getFullYear()
            result.xAxis.axisLabel.textStyle.color = function (value, index) {
                return value == currYear ? 'yellow' : theme_color.title.subtextStyle.color;
            }
        }
        return result
    },
    horizontalBarEchart: function (data) { // 横板单柱图
        let X = [];
        let Y = [];
        let rotate = null;
        data.forEach(item => {
            X.push(item['X'])
            Y.push(item['Y'])
        })
        // 如果X值少于4个，则不旋转x坐标
        X.length <= 4 ? rotate = 0 : rotate = 40
        return {
            tooltip: {
                trigger: 'item'
            },
            grid: {
                // top: '4%',
                // left: '3%',
                // right: '4%',
                // bottom: '3%',
                containLabel: true // 防止标签溢出
            },
            xAxis: {
                type: 'value',
                data: X,
                axisLabel: {
                    interval: 0,
                    rotate: rotate, // 旋转x坐标以防止重叠
                    textStyle: {
                        color: theme_color.title.subtextStyle.color,
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: theme_color.title.subtextStyle.color,
                    }
                },
            },
            yAxis: {
                type: 'category',
                data: Y,
                axisLabel: {
                    // interval: 0,
                    textStyle: {
                        color: theme_color.title.subtextStyle.color,
                    }
                },
                // splitLine: {
                //     show: true,
                //     lineStyle: {
                //         color: theme_color.title.subtextStyle.color,
                //     }
                // },
            },
            series: [{
                data: X,
                type: 'bar',
                itemStyle: {
                    //通常情况下：
                    normal: {
                        borderRadius: [0, 4, 4, 0],
                        color: function (data) { //设置正负颜色值
                            return data.value >= 0 ? "#c23531" : "green";
                        }
                    }
                }
            }]
        }
    },
    multipleBarEchart: function (X, Y, extraOp) { // 多柱图
        let legendData = [];
        let result = {}
        if (Array.isArray(Y)) {
            Y.forEach(item => {
                legendData.push(item.name)
                if (item.type === 'line') {
                    item.yAxisIndex = 1 // 以右Y轴为基准
                }
            })
        }
        result = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    }
                }
            },
            color: ['#c23531', '#33eeff', '#f7ef1d'],
            grid: {
                // top: '4%',
                // left: '3%',
                // right: '4%',
                // bottom: '3%',
                containLabel: true // 防止标签溢出
            },
            legend: {
                data: legendData,
                textStyle: {
                    color: theme_color.title.subtextStyle.color, // 设置图例文本颜色
                },
                inactiveColor: '#333' // 图例关闭时候的颜色
            },
            // color:['#cd4c40','#2582c9','#e6a23c'],
            xAxis: [{
                type: 'category',
                data: X,
                axisPointer: {
                    type: 'shadow'
                },
                axisLabel: {
                    interval: 5, // 设置X轴名称间隔
                    rotate: 40, // 旋转x坐标以防止重叠
                    textStyle: {
                        color: theme_color.title.subtextStyle.color,
                    }
                },
            }],
            yAxis: [{
                type: 'value',
                // name:  '' , //                    '总市值（万亿）',
                nameTextStyle: {
                    color: theme_color.title.subtextStyle.color,
                },
                // min: 0,
                // max: 100,
                // interval: 50,
                axisLabel: {
                    show: true,
                    // interval: 100,
                    // rotate:"45",
                    textStyle: {
                        color: theme_color.title.subtextStyle.color,
                    }
                },
                axisLine: {
                    onZero: true
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: ['#363a45'],
                    }
                },
                data: X // X轴坐标数组
            },
            {
                name: '变动后股本',
                type: 'value',
                // name:  '' ,// '总市值占比',
                nameTextStyle: {
                    color: theme_color.title.subtextStyle.color,
                },
                axisLabel: {
                    show: true,
                    interval: 100,
                    // rotate:"45",
                    textStyle: {
                        color: theme_color.title.subtextStyle.color,
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: ['#363a45'],
                    }
                },
            }
            ],
            series: Y
        }
        if (typeof (extraOp) === 'object') {
            result.yAxis[0].name = extraOp.YLeftName || ''
            result.yAxis[1].name = extraOp.YRightName || ''
            if (typeof (extraOp.tooltipUnit) === 'object') { // 给数字加单位
                result.tooltip.formatter = function (params) {
                    let str = `${params[0].name}<br/>`
                    params.forEach((i, index) => {
                        str += `${i.marker}${i.seriesName}: ${common.toThousandFilter(i.value)}${extraOp.tooltipUnit[index]}<br/>`
                    })
                    return str
                }
            }
        }
        return result
    },
    stackBarEchart: function (X, Y, extraOp) { // 堆叠柱状图
        let Y1 = [];
        let Y2 = [];
        let Y3 = [];
        if (Array.isArray(Y)) {
            Y1 = Y[0]
            Y2 = Y[1]
            Y3 = Y[2]
        }
        let result = {
            tooltip: {
                trigger: 'axis',
                axisPointer: { // Use axis to trigger tooltip
                    type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
                }
            },
            color: ['#c23531', '#33eeff', '#f7ef1d'],
            legend: {
                data: ['经营活动产生的现金流量净额', '投资活动产生的现金流量净额', '筹资活动产生的现金流量净额'],
                textStyle: {
                    color: theme_color.title.subtextStyle.color, // 设置图例文本颜色
                },
                inactiveColor: '#333' // 图例关闭时候的颜色
            },
            grid: {
                // top: '4%',
                // left: '3%',
                // right: '4%',
                // bottom: '3%',
                containLabel: true // 防止标签溢出
            },
            xAxis: {
                type: 'category',
                data: X,
                axisLabel: {
                    interval: 5,
                    rotate: 40, // 旋转x坐标以防止重叠
                    textStyle: {
                        color: theme_color.title.subtextStyle.color,
                    }
                },
                // splitLine:{show: false,lineStyle:{
                //     color:['#363a45'],
                // }},
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    // interval: 0,
                    textStyle: {
                        color: theme_color.title.subtextStyle.color,
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: ['#363a45'],
                    }
                },
            },
            series: [{
                name: '经营活动产生的现金流量净额',
                data: Y1,
                type: 'bar',
                stack: 'total', // 堆叠的关键
                label: {
                    // show: true
                },
                emphasis: {
                    focus: 'series'
                },
                // itemStyle: {
                //     //通常情况下：
                //     normal: {
                //         borderRadius: [0, 4, 4, 0],
                //         color: function (data) { //设置正负颜色值
                //             return data.value >= 0 ? "#c23531" : "green";
                //         }
                //     }
                // }
            }, {
                name: '投资活动产生的现金流量净额',
                data: Y2,
                type: 'bar',
                stack: 'total', // 堆叠的关键
                label: {
                    // show: true
                },
                emphasis: {
                    focus: 'series'
                },
                // itemStyle: {
                //     //通常情况下：
                //     normal: {
                //         borderRadius: [0, 4, 4, 0],
                //         color: function (data) { //设置正负颜色值
                //             return data.value >= 0 ? "#c23531" : "green";
                //         }
                //     }
                // }
            }, {
                name: '筹资活动产生的现金流量净额',
                data: Y3,
                type: 'bar',
                stack: 'total', // 堆叠的关键
                label: {
                    // show: true
                },
                emphasis: {
                    focus: 'series'
                },
                // itemStyle: {
                //     //通常情况下：
                //     normal: {
                //         borderRadius: [0, 4, 4, 0],
                //         color: function (data) { //设置正负颜色值
                //             return data.value >= 0 ? "#c23531" : "green";
                //         }
                //     }
                // }
            }]
        }
        return result
    },
    oldLineEchart: function (X, Y) {
        return {
            color: ['#cd4c40', '#2582c9', '#e6a23c'],
            tooltip: {
                trigger: 'axis'
            },
            // tooltip: {
            //     trigger: 'axis',
            //     axisPointer: {
            //         animation: false
            //     },
            //     formatter: function (params) {
            //         var dateStr = '<span>' + params[0].name + '</span><br/>'
            //         var relVal = dateStr
            //         var format = 4
            //         for (var i = 0; i < params.length; i++) {
            //             if (params[i].data !== null) {
            //                 relVal += '<div class="chart-tooltip-circle" ><span style="background:' + params[i].color + '"></span>' + params[i].seriesName + ' : '
            //                 if (i === 1) {
            //                     format = 2
            //                 }
            //                 relVal += common.fomatFloatandThousandFilter(params[i].data, format) + ' </div>'
            //             }
            //         }
            //         return relVal
            //     }
            // },
            dataZoom: [{
                type: 'inside',
                height: 20,
                realtime: true
            }, {
                type: 'slider',
                height: 25,
                realtime: true
            }],
            grid: [{
                right: 50,
                left: 50,
                top: 50,
                bottom: 100,
                containLabel: true
            }],
            // legend: { // 每条折线代表的title
            //     data: ['估价收益率%', '估价净价', '估价全价'],
            //     x: 'center',
            //     y: 'bottom',
            //     top: '80%',
            //     icon: 'circle',
            //     textStyle:{
            //         // fontSize: 18,//字体大小
            //         color: '#ffffff'//字体颜色
            //    },
            // },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                // inverse: true,
                axisLabel: {
                    show: true,
                    // interval: 100,
                    // rotate:"45",
                    textStyle: {
                        color: theme_color.title.subtextStyle.color,
                    }
                },
                axisLine: {
                    onZero: true
                },
                // splitLine:{show: true,lineStyle:{ // 纵向网格是否显示
                //     color:['#363a45'],
                // }},
                data: X // X轴坐标数组
            },
            yAxis: {
                name: '变动后股本',
                type: 'value',
                nameTextStyle: {
                    color: theme_color.title.subtextStyle.color,
                    // color: '#fff',
                    align: 'left'
                },
                axisLabel: {
                    show: true,
                    interval: 100,
                    // rotate:"45",
                    textStyle: {
                        color: theme_color.title.subtextStyle.color,
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: ['#363a45'],
                    }
                },
                scale: true
            },
            series: [{
                name: '变动后股本',
                data: Y, // Y轴数据
                type: 'line',
                itemStyle: {
                    normal: {
                        // color:'#00FF00',
                        lineStyle: {
                            // color:'#00FF00' // 折线颜色
                        }
                    }
                }
            }]
        }
    },
    lineEchart: function (data, extraOp) { // 单折线图
        let X = [];
        let Y = [];
        let result = {}
        data.forEach(item => {
            X.push(item['X'])
            Y.push(item['Y'])
        })

        result = {
            color: ['#cd4c40', '#2582c9', '#e6a23c'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985',
                    }
                },
                // position: function (pt) {
                //     return [pt[0], '10%'];
                // }
            },
            dataZoom: [{
                type: 'inside',
                height: 20,
                realtime: true,
                start:0,
                end:100
            }, {
                type: 'slider',
                height: 25,
                realtime: true,
                start:0,
                end:100
            }],
            grid: [{
                right: 50,
                left: 50,
                top: 50,
                bottom: 100,
                containLabel: true
            }],
            // legend: { // 每条折线代表的title
            //     data: ['估价收益率%', '估价净价', '估价全价'],
            //     x: 'center',
            //     y: 'bottom',
            //     top: '80%',
            //     icon: 'circle',
            //     textStyle:{
            //         // fontSize: 18,//字体大小
            //         color: '#ffffff'//字体颜色
            //    },
            // },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                // inverse: true,
                axisLabel: {
                    show: true,
                    // interval: 100,
                    // rotate:"45",
                    textStyle: {
                        color: theme_color.title.subtextStyle.color,
                    }
                },
                axisLine: {
                    onZero: true
                },
                // splitLine:{show: true,lineStyle:{ // 纵向网格是否显示
                //     color:['#363a45'],
                // }},
                data: X // X轴坐标数组
            },
            yAxis: {
                // name: '变动后股本',
                type: 'value',
                nameTextStyle: {
                    color: theme_color.title.subtextStyle.color,
                    // color: '#fff',
                    align: 'left'
                },
                axisLabel: {
                    show: true,
                    interval: 100,
                    // rotate:"45",
                    textStyle: {
                        color: theme_color.title.subtextStyle.color,
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: ['#363a45'],
                    }
                },
                scale: true
            },
            series: [{
                name: '估价收益率%',
                data: Y, // Y轴数据
                type: 'line',
                itemStyle: {
                    normal: {
                        // color:'#00FF00',
                        lineStyle: {
                            // color:'#00FF00' // 折线颜色
                        }
                    }
                },
            }]
        }
        if (extraOp.tooltipPosition != 'default') {
            result.tooltip.position = function (pt) {
                return [pt[0], '10%'];
            }
        }
        if (extraOp.tooltipName) { // 额外配置项，tooltip的name
            result.series[0].name = extraOp.tooltipName
            if (extraOp.tooltipUnit) {
                result.tooltip.formatter = function (params) {
                    return `${params[0].name}<br/>${params[0].marker}${params[0].seriesName}: ${common.toThousandFilter(params[0].value)}${extraOp.tooltipUnit}`
                }
            }else{ // 没有传单位时默认不处理value
                result.tooltip.formatter = function (params) {
                    return `${params[0].name}<br/>${params[0].marker}${params[0].seriesName}: ${params[0].value == null ? '-' : params[0].value}${extraOp.tooltipUnit}`
                }
            }
        }
        if (extraOp && extraOp.axisLabelFormat != undefined) {
            result.xAxis.axisLabel.formatter = function (value) {
                return value.split(' ')[1]
            }
        }
        return result
    },
    multipleLineEchart: function (X, Y, extraOp) { // 多折线图，可配置成堆叠面积图
        let Yseries = [];
        let legendData = [];
        if (Array.isArray(Y)) {
            Yseries = getMultipleLineEchartSeries(Y, extraOp)
            Y.forEach(i => {
                legendData.push(i.name)
            })
        }
        let result = {
            // color: ['#c23531', '#33eeff'],
            color: theme_color.color,
            tooltip: {
                trigger: 'axis',
                // confine:true,//浮层被遮挡的问题
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985',
                    }
                },
                formatter:function(params){
                    let str = params[0].axisValue + '<br/>'
                    params.forEach(item=>{
                        str += `<div>${item.marker}  ${item.seriesName}：   <div style='float:right;'>${item.value==undefined ? '-' : item.value}</div></div>`
                    })
                    return str

                }
                // //设置Y轴上下固定，x左右跟随
                // position: function(point, params, dom, rect, size){
                //     return [point[0],-1];
                // },
            },
            dataZoom: [{
                type: 'inside',
                height: 20,
                realtime: true,
                start:0,
                end:100
            }, {
                type: 'slider',
                height: 25,
                realtime: true,
                start:0,
                end:100
            }],
            legend: {
                data: legendData,
                textStyle: {
                    color: theme_color.title.subtextStyle.color, // 设置图例文本颜色
                },
                selected: {},
                inactiveColor: '#333' // 图例关闭时候的颜色
            },
            grid: {
                // id:456,
                right: 50,
                left: 50,
                top: 50,
                bottom: 60,
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                axisLabel: {
                    show: true,
                    // interval: 100,
                    // rotate:"45",
                    textStyle: {
                        color: theme_color.title.subtextStyle.color,
                    }
                },
                axisLine: {
                    onZero: true
                },
                axisPointer:{
                    snap:true
                },
                // splitLine:{show: true,lineStyle:{ // 纵向网格是否显示
                //     color:['#363a45'],
                // }},
                // data: X // X轴坐标数组
                data: X
            }],
            yAxis: {
                // name: '变动后股本',
                type: 'value',
                nameTextStyle: {
                    color: theme_color.title.subtextStyle.color,
                    // color: '#fff',
                    align: 'left'
                },
                axisLabel: {
                    show: true,
                    interval: 100,
                    // rotate:"45",
                    textStyle: {
                        color: theme_color.title.subtextStyle.color,
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: ['#363a45'],
                    }
                },
                scale: true // 是否缩放
            },
            series: Yseries
        }
        if (extraOp && extraOp.title != undefined) {
            result.title = {
                text: extraOp.title,
                textStyle: {
                    color: theme_color.title.subtextStyle.color,
                    fontSize: 14
                },
                left: 0,
                top: 0
            }
        }
        if (extraOp && extraOp.axisLabelFormat != undefined) {
            result.xAxis[0].axisLabel.formatter = function (value) {
                return value.split(' ')[1]
            }
        }
        if (extraOp && extraOp.clickedLegend && Object.keys(extraOp.clickedLegend).length != 0) {
            result.legend.selected = extraOp.clickedLegend
        }
        return result
    },
    bigDataLineEchart: function (data, extraOp) { // 大数据量面积图（折线）
        let X = [];
        let Y = [];
        let rotate = null;
        let interval = null;
        let result = {};
        data.forEach(item => {
            X.push(item['X'])
            Y.push(item['Y'])
        })
        X.length <= 4 ? rotate = 0 : rotate = 40 // 是否旋转X轴数值
        X.length <= 4 ? interval = 0 : interval = 50 // 调整X轴数值间隔
        result = {
            tooltip: {
                trigger: 'axis',
                // position: function (pt) {
                //     return [pt[0], '10%'];
                // }
            },
            grid: {
                // top: '4%',
                // left: '3%',
                // right: '4%',
                // bottom: '3%',
                containLabel: true // 防止标签溢出
            },
            // title: {
            //     left: 'center',
            //     text: '大数据量面积图',
            // },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: X,
                axisLabel: {
                    interval: interval,
                    rotate: rotate, // 旋转x坐标以防止重叠
                    textStyle: {
                        color: theme_color.title.subtextStyle.color,
                    }
                },

            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, '100%'],
                axisLabel: {
                    // interval: 0,
                    textStyle: {
                        color: theme_color.title.subtextStyle.color,
                    }
                },
                // scale:true,
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: ['#363a45'],
                    }
                },
            },
            dataZoom: [{
                type: 'inside',
                start: 0,
                end: 100
            }, {
                start: 0,
                end: 100
            }],
            series: [{
                name: '成交额',
                type: 'line',
                // symbol: 'none',
                sampling: 'lttb',
                itemStyle: {
                    color: 'rgb(255, 70, 131)'
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgb(255, 158, 68)'
                    }, {
                        offset: 1,
                        color: 'rgb(255, 70, 131)'
                    }])
                },
                data: Y
            }]
        }
        if (extraOp.tooltipName) { // 额外配置项，tooltip的name
            result.series[0].name = extraOp.tooltipName
            if (extraOp.tooltipUnit) {
                result.tooltip.formatter = function (params) {
                    return `${params[0].name}<br/>${params[0].marker}${params[0].seriesName}: ${common.toThousandFilter(params[0].value)}${extraOp.tooltipUnit}`
                }
            }
        }

        return result
    },
    pieEchart: function (data, extraOp) { // 普通饼图
        if (extraOp.haveElse == undefined) extraOp.haveElse = true
        if (!extraOp.totalRate) {
            throw new Error('请在RWEchart组件上加 :extraOp = "{ totalRate : 1或者100 }"')
        }
        let result = [];
        let totalNum = 0;
        // console.log('pieEchartdata',data);
        data.forEach(item => {
            result.push({
                name: item['X'],
                value: item['Y']
            })
            totalNum += item['Y']
        })
        if (Number(extraOp.totalRate) - totalNum > 0 && extraOp.haveElse == true) {
            result.push({
                name: '其他',
                value: extraOp.totalRate - totalNum
            }) // 这里总量100或者1 ，做extraOp
        }
        let obj = {
            // title: {
            //     text: '33333',
            //     subtext: '纯属虚构',
            //     left: 'center'
            // },
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {d}%',
                // formatter: ''
                appendToBody: true,
            },
            legend: {
                orient: 'horizontal',
                type: 'scroll', //分页类型
                bottom: 10,
                textStyle: {
                    color: theme_color.title.subtextStyle.color, // 设置图例文本颜色
                },
                inactiveColor: '#333' // 图例关闭时候的颜色
            },
            series: [{
                // name: '访问来源',
                type: 'pie',
                radius: '50%',
                data: result,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                label: {
                    color: '#fff'
                }
            }]
        }
        if (extraOp.percentNum) {
            obj.tooltip.formatter = function (params) {
                return `${params.data.name}:${common.toPercent(params.data.value)}`
            }
        }
        if (extraOp.defaultValue == true) {
            obj.tooltip.formatter = ''
        }
        return obj
    },
    scatterEchart: function (data, extraOp) { // 散点图
        // extraOp.
        let obj = {
            title: {
                text: extraOp.title,
                textStyle: {
                    color: theme_color.title.subtextStyle.color,
                    fontSize: 14
                },
                // left: 0,
                // top: 0,
                subtext: extraOp.pValue ? 'P值=' + extraOp.pValue : '',
                subtextStyle: {
                    color: theme_color.title.subtextStyle.color,
                }
            },
            xAxis: {
                splitLine: {
                    show: false,
                    lineStyle: {
                        color: ['#363a45'],
                    }
                },

                axisLabel: {
                    show: true,
                    // interval: 100,
                    // rotate:"45",
                    textStyle: {
                        color: theme_color.title.subtextStyle.color,
                    }
                }
            },
            yAxis: {
                axisLabel: {
                    show: true,
                    interval: 100,
                    // rotate:"45",
                    textStyle: {
                        color: theme_color.title.subtextStyle.color,
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: ['#363a45'],
                    }
                },
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985',
                    }
                },
            },
            series: [{
                symbolSize: 5,
                data: data,
                type: 'scatter',
                // itemStyle:{
                //     normal:{
                //         color:'#0269bf',
                //         shadowColor:'#83bff6',
                //         shadowBlur:3,
                //         shadowOffsetX:1,
                //         shadowOffsetY:2
                //     }
                // },
            }]
        };
        if (extraOp.showLine == true) {
            // 对斜率和截距取X位小数
            extraOp.gradient =
                obj.series[0].markLine = {
                    animation: true,
                    label: {
                        formatter: 'y = ' + extraOp.gradient + ' * x + ' + extraOp.intercept,
                        color: theme_color.title.subtextStyle.color,
                        align: 'left'
                    },
                    lineStyle: {
                        type: 'solid',
                        color: '#c23531',
                        width: 3
                    },
                    tooltip: {
                        formatter: 'y = ' + extraOp.gradient + ' * x + ' + extraOp.intercept,
                    },
                    data: [
                        [{
                            coord: [extraOp.minX, extraOp.minX * extraOp.gradient + extraOp.intercept],
                            symbol: 'none'
                        }, {
                            coord: [extraOp.maxX, extraOp.maxX * extraOp.gradient + extraOp.intercept],
                            symbol: 'none'
                        }]
                    ]
                }
        }
        // ecStat统计插件
        if (extraOp.ecStatLine === true) {
            echarts.registerTransform(ecStat.transform.regression);
            obj.grid = {
                left: '5%',
                right: '5%'
            }
            obj.title.left = 'center'
            obj.title.textStyle.fontSize = 18;
            // obj.xAxis.axisLine = { onZero: false };
            // obj.yAxis.axisLine = { onZero: false };
            // obj.xAxis.nameLocation = 'middle';

            obj.xAxis = {
                ...obj.xAxis,
                axisLine: {
                    onZero: false
                },
                name: extraOp.xAxisName,
                nameLocation: 'center',
                nameGap: 30
            }
            obj.yAxis = {
                ...obj.yAxis,
                axisLine: {
                    onZero: false
                },
                name: extraOp.yAxisName,
            }
            obj.tooltip = {
                ...obj.tooltip,
                formatter: (params) => {
                    return params[0].data[2] + '<br>(' + params[0].data[0] + ',' + params[0].data[1] + ')'
                }
            }

            obj.dataset = [
                {
                    dimensions: ['scatter', 'date'],
                    source: data,
                },
                {
                    transform: {
                        type: 'ecStat:regression',
                        config: {
                            method: 'linear',// 回归线类型
                            dimension: 'scatter'
                        },
                    }
                }
            ]
            obj.series[0] = {
                symbolSize: 10,
                type: 'scatter',
                name: " "
            };
            // 单条统计插件
            obj.series[1] = {
                type: 'line',
                datasetIndex: 1,
                symbolSize: 0.1,
                color: theme_color.color,
                label: {
                    show: false, fontSize: 16,
                    color: theme_color.title,
                },
                labelLayout: { dx: -20 },
                encode: { label: 2, tooltip: 1 }
            };
        }
        return obj
    },
    assetsDebtEchart: function (X, Y, extraoP) {
        let result = {
            legend: {
                textStyle: {
                    color: theme_color.title.subtextStyle.color, // 设置图例文本颜色
                },
                inactiveColor: '#333' // 图例关闭时候的颜色
            },
            tooltip: {
                trigger: 'axis',
                showContent: true
            },
            color: ['#c23531', '#33eeff', '#f7ef1d'],
            dataset: {
                source: [
                    X, Y[0], Y[1], Y[2]
                ]
            },
            xAxis: {
                type: 'category',
                axisLabel: {
                    show: true,
                    // interval: 100,
                    // rotate:"45",
                    textStyle: {
                        color: theme_color.title.subtextStyle.color,
                    }
                },
            },
            yAxis: {
                gridIndex: 0,
                axisLabel: {
                    show: true,
                    interval: 100,
                    // rotate:"45",
                    textStyle: {
                        color: theme_color.title.subtextStyle.color,
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: ['#363a45'],
                    }
                },
            },
            grid: {
                top: '50%'
            },
            series: [{
                type: 'line',
                smooth: true,
                seriesLayoutBy: 'row',
                emphasis: {
                    focus: 'series'
                }
            },
            {
                type: 'line',
                smooth: true,
                seriesLayoutBy: 'row',
                emphasis: {
                    focus: 'series'
                }
            },
            {
                type: 'line',
                smooth: true,
                seriesLayoutBy: 'row',
                emphasis: {
                    focus: 'series'
                }
            },
            {
                type: 'pie',
                id: 'pie',
                radius: '30%',
                center: ['50%', '25%'],
                emphasis: {
                    focus: 'data'
                },
                label: {
                    formatter: `{b}: {@${X[1]}} ({d}%)` // 初始X0
                },
                encode: {
                    itemName: X[0],
                    value: X[1], // 初始X0
                    tooltip: X[1] // 初始X0
                }
            }
            ]
        }
        return result
    },
    KLineEchart: function (data, extraOp) {
        let dates = []; let prices = []; let MA5 = []; let MA10 = []; let MA20 = []; let MA30 = [];
        data.forEach(i => {
            dates.push(i.tradeDate)
            i.open === null ? i.open = '-' : ''
            i.close === null ? i.close = '-' : ''
            i.low === null ? i.low = '-' : ''
            i.high === null ? i.high = '-' : ''
            prices.push([i.open, i.close, i.low, i.high])
            MA5.push(i.mA5 === null ? '-' : i.mA5)
            MA10.push(i.mA10 === null ? '-' : i.mA10)
            MA20.push(i.mA20 === null ? '-' : i.mA20)
            MA30.push(i.mA30 === null ? '-' : i.mA30)
        })
        let result = {
            legend: {
                data: ['日K', 'MA5', 'MA10', 'MA20', 'MA30'],
                textStyle: {
                    color: theme_color.title.subtextStyle.color, // 设置图例文本颜色
                },
                inactiveColor: '#333' // 图例关闭时候的颜色
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    animation: false,
                    type: 'cross',
                    lineStyle: {
                        color: '#376df4',
                        width: 2,
                        opacity: 1
                    }
                },
                formatter: function (params) {
                    let ma5=params[1].data;//ma5的值
                    let ma10=params[2].data;//ma10的值
                    let ma20=params[3].data;//ma20的值
                    let ma30=params[4].data;//ma30的值
                    let first = params[0];//开盘收盘最低最高数据汇总
                    let currentItemData = first.data;
                    return first.name + '<br>' +
                    first.marker + '开盘价:' + currentItemData[1] + '<br>' +
                    first.marker + '收盘价:' + currentItemData[2] + '<br>' +
                    first.marker + '最低价:' + currentItemData[3] + '<br>' +
                    first.marker + '最高价:' + currentItemData[4] + '<br>' +
                    params[1].marker + 'MA5:' + ma5 + '<br>' +
                    params[2].marker + 'MA10:' + ma10 + '<br>' +
                    params[3].marker + 'MA20:' + ma20 + '<br>' +
                    params[4].marker + 'MA30:' + ma30
                    }
            },
            xAxis: {
                type: 'category',
                data: dates,
                axisLine: { lineStyle: { color: '#8392A5' } }
            },
            yAxis: {
                scale: true,
                axisLine: { lineStyle: { color: '#8392A5' } },
                splitLine: { show: false }
            },
            grid: {
                bottom: 80
            },
            dataZoom: [
                {
                    textStyle: {
                        color: '#8392A5'
                    },
                    dataBackground: {
                        areaStyle: {
                            color: '#8392A5'
                        },
                        lineStyle: {
                            opacity: 0.8,
                            color: '#8392A5'
                        }
                    },
                    brushSelect: true,
                    start:0,
                    end:100
                },
                {
                    type: 'inside',
                    start:0,
                    end:100
                }
            ],
            series: [
                {
                    type: 'candlestick',
                    name: 'Day',
                    data: prices,
                    itemStyle: {
                        color: '#FD1050',
                        color0: '#0CF49B',
                        borderColor: '#FD1050',
                        borderColor0: '#0CF49B'
                    }
                },
                {
                    name: 'MA5',
                    type: 'line',
                    data: MA5,
                    smooth: true,
                    showSymbol: false,
                    lineStyle: {
                        width: 1
                    }
                },
                {
                    name: 'MA10',
                    type: 'line',
                    data: MA10,
                    smooth: true,
                    showSymbol: false,
                    lineStyle: {
                        width: 1
                    }
                },
                {
                    name: 'MA20',
                    type: 'line',
                    data: MA20,
                    smooth: true,
                    showSymbol: false,
                    lineStyle: {
                        width: 1
                    }
                },
                {
                    name: 'MA30',
                    type: 'line',
                    data: MA30,
                    smooth: true,
                    showSymbol: false,
                    lineStyle: {
                        width: 1
                    }
                }
            ]
        }
        return result
    }
}

function getMultipleLineEchartSeries(Y, extraOp) {
    if (!extraOp.stackLine) {
        return Y.map(item => {
            return {
                name: item.name,
                type: 'line',
                // stack: '总量',
                // areaStyle: {}, // 没有这个就是普通堆叠折线图
                emphasis: { // 悬浮时是否隐藏其他区域
                    focus: 'series'
                },
                data: item.data
            }
        })
    } else if (extraOp.stackLine === true) {
        return Y.map(item => {
            return {
                name: item.name,
                type: 'line',
                // stack: '总量',
                areaStyle: {}, // 没有这个就是普通堆叠折线图
                emphasis: { // 悬浮时是否隐藏其他区域
                    focus: 'series'
                },
                data: item.data
            }
        })
    }
}
// console.log('theme_color', theme_color)