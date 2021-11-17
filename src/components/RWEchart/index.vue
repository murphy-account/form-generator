<template>
  <div>
    <slot></slot>
    <div
      v-if="$parent.$options._componentTag !== 'RWEchartsGroup'"
      class="echart-view"
      :style="{ height: height + 'px' }"
    >
      <div :id="generateId" />
      <div :class="data.length <= 0 ? 'echart-view-empty' : ''" />
    </div>
  </div>
</template>
<script>
// 注释：--------------如果有点击切换图表的需求，在RWechart上加v-if
import common from "@/utils/common.js";
// 统计插件
// import ecStat from 'echarts-stat';
import { getEcharts, setTheme } from "@/utils/echarts";
import EC from "@/utils/echartsOption.js";
var echarts = getEcharts();
var url_theme = common.getUrlKey("theme");
var theme = setTheme(url_theme);
var theme_color = theme.theme_json;
export default {
  name: "RwEchart",
  components: {
    // RwStockSpan
  },
  props: {
    height: {
      type: String,
      default: "400",
    },
    name: {
      type: String,
      default: "",
    },
    type: {
      // 图表类型
      type: String,
      default: "bar",
    },
    contrast: {
      // 接受的同比和环比数据 [a,b] a为同比，b为环比，值为0则不显示相关数据
      type: Array,
      default: function () {
        return [];
      },
    },
    extraOp: {
      // 除了图表数据之外的额外配置
      type: Object,
      default: function () {
        return {};
      },
    },
    hasHoverEvent: {
      // 专供港股-财务报表-财务摘要-资产负债图使用---开启鼠标悬停事件
      type: Boolean,
      default: false,
    },
    data: {
      type: Array,
      default: function () {
        return [{X:'123',Y:10}, {X:'456',Y:20}];
      },
    },
  },
  data: function () {
    window.mousePos = { x: 0, y: 0 }
    return {
      echartdata: [],
      echartObj: {},
      clickedLegend: {}, // 多折线图中使用，multipleLine，使图表刷新时保留图例点击状态
      datazoomStart:0,
      datazoomEnd:100
    };
  },
  computed: {
    generateId() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    },
  },
  mounted() {
    var vm = this;
    if (this.$parent.$options._componentTag !== "RWEchartsGroup") {
      this.echartObj = echarts.init(
        document.getElementById(this.generateId, theme.theme_name)
      );
      this.echartObj.on("legendselectchanged", function (params) {
        console.log("图例点击事件", params.selected);
        vm.clickedLegend = params.selected || {};
      });
      this.echartObj.on('datazoom',function(params){
        // console.log(params);
        /**保证鼠标滚轮和单击拖动移动和直接操作slider都能赋值start和end */
        if(params.batch && params.batch.length!=0 ){
          vm.datazoomStart = params.batch[0].start
          vm.datazoomEnd = params.batch[0].end
        }else{
          vm.datazoomStart = params.start
          vm.datazoomEnd = params.end
        }
      })
      if (this.hasHoverEvent) {
        this.echartObj.on("updateAxisPointer", function (event) {
          console.log("X轴数据鼠标悬停事件", event, xAxisInfo);
          let xAxisInfo = event.axesInfo[0];
          if (xAxisInfo) {
            let dimension = xAxisInfo.value + 1;
            vm.echartObj.setOption({
              series: {
                id: "pie",
                label: {
                  formatter: "{b}: {@[" + dimension + "]} ({d}%)",
                },
                encode: {
                  value: dimension,
                  tooltip: dimension,
                },
              },
            });
          }
        });
      }
      document.onmousemove = function mouseMove(ev) {
        ev = ev || window.event;
        vm.mouseCoords(ev);
      };
      this.$nextTick(function () {
        window.addEventListener(
          "resize",
          () => {
            vm.echartObj.resize();
          },
          false
        );
      });
      this.selectOp();
    }
  },
  watch: {
    data: {
      handler(val, oldVal) {
        // console.log("echarts data watch", val, oldVal, this.echartObj);
        if (Object.keys(this.echartObj).length !== 0) {
          this.selectOp();
        }
      },
      deep: true,
    },
  },
  methods: {
    selectOp() {
      debugger
      if (this.type === "pie") {
        this.setPersonnelChart(EC["pieEchart"](this.data, this.extraOp));
      } else if (this.type === "oldLine") {
        this.setPersonnelChart(EC["oldLineEchart"](...this.data));
      } else if (this.type === "bar") {
        this.setPersonnelChart(EC["barEchart"](this.data, this.extraOp));
      } else if (this.type === "pie2") {
        this.setPersonnelChart(EC["stockStructureOp_pie"](this.data));
      } else if (this.type === "multipleBar") {
        this.setPersonnelChart(
          EC["multipleBarEchart"](...this.data, this.extraOp)
        );
      } else if (this.type === "stackBar") {
        this.setPersonnelChart(
          EC["stackBarEchart"](...this.data, this.extraOp)
        );
      } else if (this.type === "bigDataLine") {
        this.setPersonnelChart(
          EC["bigDataLineEchart"](this.data, this.extraOp)
        );
      } else if (this.type === "line") {
        this.setPersonnelChart(EC["lineEchart"](this.data, this.extraOp));
      } else if (this.type === "multipleLine") {
        this.setPersonnelChart(
          EC["multipleLineEchart"](...this.data, {
            ...this.extraOp,
            clickedLegend: this.clickedLegend,
          })
        );
      } else if (this.type === "horizontalBar") {
        this.setPersonnelChart(
          EC["horizontalBarEchart"](this.data, this.extraOp)
        );
      } else if (this.type === "assetsDebt") {
        this.setPersonnelChart(
          EC["assetsDebtEchart"](...this.data, this.extraOp)
        );
      } else if (this.type === "scatter") {
        this.setPersonnelChart(EC["scatterEchart"](this.data, this.extraOp));
      } else if (this.type === "KLine") {
        this.setPersonnelChart(EC["KLineEchart"](this.data, this.extraOp));
      } else {
        throw new Error("未传入type");
      }
    },
    setPersonnelChart(option) {
      let _ = this;
      /**设置缩放条的初始start和end */
      if(this.type == "multipleLine" || this.type == "line" || this.type== "KLine" ){ // 
        option.dataZoom[0].start = _.datazoomStart
        option.dataZoom[0].end = _.datazoomEnd
        option.dataZoom[1].start = _.datazoomStart
        option.dataZoom[1].end = _.datazoomEnd
      }
      this.echartObj.setOption(option, true);
      if (this.type == "multipleLine" || this.type == "line" || this.type== "KLine") {
        let offsetX = _.echartObj.getDom().getBoundingClientRect().left
        let offsetY = _.echartObj.getDom().getBoundingClientRect().top
        // console.log("x", window.mousePos.x, "y", window.mousePos.y);
        _.echartObj.dispatchAction({
          type: "showTip", // 根据 tooltip 的配置项显示提示框。
          x: window.mousePos.x - offsetX, //x的相对坐标
          y: window.mousePos.y - offsetY, //y的相对坐标
        });
        // console.log(_.datazoomStart,_.datazoomEnd);
      }
    },
    /**获取鼠标X,Y值 */
    mouseCoords(ev) {
      if (ev.pageX || ev.pageY) {
        window.mousePos = { x: ev.pageX, y: ev.pageY };
      }
      window.mousePos = {
        x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
        y: ev.clientY + document.body.scrollTop - document.body.clientTop,
      };
    },
  },
};
</script>
<style lang="scss" scoped>
</style>

