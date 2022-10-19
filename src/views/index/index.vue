
<template>
  <!-- // water -->
  <div v-if="isSee">
    <h1>流水订单统计</h1>
    <div class="block" style="margin-bottom: 30px">
      <span class="demonstration">时间选择:</span>
      <el-date-picker
        v-model="value1"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      >
      </el-date-picker>
      <el-button type="primary" @click="search" :disabled="user==='hexiao'">查找</el-button>
    </div>
    <!-- <el-table
      :data="source"
      border
      :row-key="tableData.id"
      style="width: 100%"
      fit="true"
    >
      <el-table-column fixed prop="fileName" label="文件名"> </el-table-column>
      <el-table-column prop="num" label="数量"> </el-table-column>
      <el-table-column prop="status" label="状态"> </el-table-column>
    </el-table> -->
    <div class="lsecharts">
      <div id="e1"></div>
      <div id="e2"></div>
      <div id="e3"></div>
      <div id="e4"></div>
      <div id="e5"></div>
    </div>
  </div>
</template>

<script>
import { getflowing_water, getbaifenbi, writeOffCodestatistics } from "../../api/ajax";
import * as echarts from "echarts";

export default {
  data() {
    return {
      tableData: [],
      source: [],
      pagetotol: "",
      value1: [
        new Date(this.formatDate(new Date(), "yyyy-MM-dd")) -
          8 * 60 * 60 * 1000,
        new Date(),
      ],
      cgl: "",
      isSee: true,
      user:""
    };
  },

  mounted() {
    this.user = JSON.parse(localStorage.getItem("userinfo")).username;
    if (this.user !== "hexiao") {
      this.ajax();
    }

    // console.log(this.formatDate(new Date(), "yyyy-MM-dd"));
  },
  methods: {
    echarts() {
      var that = this;
      var myChart = echarts.init(document.getElementById("e1"));
      var option = {
        title: {
          text: "订单统计",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: "50%",
            data: [
              {
                value:
                  that.tableData[0].createOrderNums -
                  that.tableData[0].successOrderNums,
                name: "失败订单",
                itemStyle: { color: "#ff4d4f" },
              },
              {
                value: that.tableData[0].successOrderNums,
                name: "成功订单",
                itemStyle: { color: "#00ccff" },
              },
            ],
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: "{b} : {c} ({d}%)", //展示的文字   类型+百分比
                },
                labelLine: { show: true },
              },
            },
          },
        ],
      };

      option && myChart.setOption(option);
    },
    echarts2() {
      var that = this;
      var myChart = echarts.init(document.getElementById("e2"));
      var option = {
        title: {
          text: "流水统计",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: "50%",
            data: [
              {
                value:
                  that.tableData[0].totalFlowingWater -
                  that.tableData[0].successFlowingWater,
                name: "失败流水",
                itemStyle: { color: "#ff4d4f" },
              },
              {
                value: that.tableData[0].successFlowingWater,
                name: "成功流水",
                itemStyle: { color: "#00ccff" },
              },
            ],
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: "{b} : {c} ({d}%)", //展示的文字   类型+百分比
                },
                labelLine: { show: true },
              },
            },
          },
        ],
      };

      option && myChart.setOption(option);
    },
    echarts3() {
      var that = this;
      var myChart = echarts.init(document.getElementById("e3"));
      var option = {
        title: {
          text: "流水匹配统计",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: "50%",
            data: [
              {
                value:
                  that.tableData[0].totalFlowingWater -
                  that.tableData[0].noMatchFlowingWater,
                name: "总流水",
                itemStyle: { color: "#006699" },
              },
              {
                value: that.tableData[0].noMatchFlowingWater,
                name: "没有匹配流水",
                itemStyle: { color: "#ff4d4f" },
              },
            ],
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: "{b} : {c} ({d}%)", //展示的文字   类型+百分比
                },
                labelLine: { show: true },
              },
            },
          },
        ],
      };

      option && myChart.setOption(option);
    },
    echarts4() {
      var that = this;
      var myChart = echarts.init(document.getElementById("e4"));
      var option = {
        title: {
          text: "成功率统计",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: "50%",
            data: [
              {
                value: 100 - that.cgl,
                name: "总数",
                itemStyle: { color: "#006699" },
              },
              {
                value: that.cgl,
                name: "成功数",
                itemStyle: { color: "#ff4d4f" },
              },
            ],
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: " ({d}%)", //展示的文字   类型+百分比
                },
                labelLine: { show: true },
              },
            },
          },
        ],
      };

      option && myChart.setOption(option);
    },
    echarts5() {
      var that = this;
      var myChart = echarts.init(document.getElementById("e5"));
      var option = {
        title: {
          text: "成功率统计",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: "50%",
            data: [
              {
                value: that.source,
                name: "总数",
                itemStyle: { color: "#006699" },
              },
              {
                value: that.source,
                name: "成功数",
                itemStyle: { color: "#ff4d4f" },
              },
            ],
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: " ({d}%)", //展示的文字   类型+百分比
                },
                labelLine: { show: true },
              },
            },
          },
        ],
      };

      option && myChart.setOption(option);
    },

    ajax() {
      var that = this;
      getflowing_water({
        startTime: that.formatDate(that.value1[0], "yyyy-MM-dd HH:mm:ss"),
        endTime: that.formatDate(that.value1[1], "yyyy-MM-dd HH:mm:ss"),
      }).then((res) => {
        // console.log("water", res);
        that.tableData = res.data.data.records;

        that.echarts();
        that.echarts2();
        that.echarts3();
      });
      // 成功概率查询
      getbaifenbi(
        that.formatDate(that.value1[0], "yyyy-MM-dd HH:mm:ss"),
        that.formatDate(that.value1[1], "yyyy-MM-dd HH:mm:ss")
      ).then((res) => {
        that.cgl = res.data.data * 100;
        that.echarts4();
      });
      writeOffCodestatistics(
        that.formatDate(that.value1[0], "yyyy-MM-dd HH:mm:ss"),
        that.formatDate(that.value1[1], "yyyy-MM-dd HH:mm:ss")
      ).then((res) => {
        console.log(res);
        that.source = res.data.data;
        that.echarts5();
      });
    },

    changePage(val) {
      var that = this;
      getflowing_water({
        startTime: that.formatDate(that.value1[0], "yyyy-MM-dd HH:mm:ss"),
        endTime: that.formatDate(that.value1[1], "yyyy-MM-dd HH:mm:ss"),
      }).then((res) => {
        this.tableData = res.data.data.records;
      });
    },
    formatDate(date, fmt) {
      date = new Date(date);
      if (typeof fmt === "undefined") {
        fmt = "yyyy-MM-dd HH:mm:ss";
      }
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      }
      let o = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "H+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds(),
      };
      for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
          let str = o[k] + "";
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length === 1 ? str : ("00" + str).substr(str.length)
          );
        }
      }
      return fmt;
    },
    search() {
      var that = this;
      getflowing_water({
        startTime: that.formatDate(that.value1[0], "yyyy-MM-dd HH:mm:ss"),
        endTime: that.formatDate(that.value1[1], "yyyy-MM-dd HH:mm:ss"),
      }).then((res) => {
        that.tableData = res.data.data.records;
        that.echarts();
        that.echarts2();
        that.echarts3();
      });
      // 成功概率查询
      getbaifenbi(
        that.formatDate(that.value1[0], "yyyy-MM-dd HH:mm:ss"),
        that.formatDate(that.value1[1], "yyyy-MM-dd HH:mm:ss")
      ).then((res) => {
        that.cgl = res.data.data * 100;
        that.echarts4();
      });
      writeOffCodestatistics(
        that.formatDate(that.value1[0], "yyyy-MM-dd HH:mm:ss"),
        that.formatDate(that.value1[1], "yyyy-MM-dd HH:mm:ss")
      ).then((res) => {
        console.log(res);
        that.source = res.data.data;
        that.echarts5();
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.pagination-flex {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
  background-color: #fff;
  padding: 20px 40px;
}
.lsecharts {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  > div {
    height: 500px;
    width: 25%;
    &:last-child {
      width: 100%;
    }
    @media screen and (max-width: 750px) {
      width: 100%;
    }
  }
}
</style>
