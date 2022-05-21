
<template>
  <!-- // water -->
  <div>
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
      <el-button type="primary" @click="search">查找</el-button>
    </div>
    <!-- <el-table
      :data="tableData"
      border
      :row-key="tableData.id"
      style="width: 100%"
      fit="true"
    >
      <el-table-column fixed prop="createOrderNums" label="创建订单量">
      </el-table-column>
      <el-table-column prop="successOrderNums" label="成功订单">
      </el-table-column>
      <el-table-column prop="totalFlowingWater" label="总流水">
      </el-table-column>
      <el-table-column prop="successFlowingWater" label="成功流水">
      </el-table-column>
      <el-table-column
        prop="failFlowingWater"
        label="failFlowingWater"
        width="120"
      >
      </el-table-column>
      <el-table-column
        prop="noMatchFlowingWater"
        label="没有匹配流水"
        width="120"
      >
      </el-table-column>
      <el-table-column prop="successRate" label="successRate" width="120">
      </el-table-column>
    </el-table> -->
    <div class="lsecharts">
      <div id="e1" style="width: 33.3%; height: 500px"></div>
      <div id="e2" style="width: 33.3%; height: 500px"></div>
      <div id="e3" style="width: 33.3%; height: 500px"></div>
    </div>
  </div>
</template>

<script>
import { getflowing_water } from "../../api/ajax";
import * as echarts from "echarts";

export default {
  data() {
    return {
      tableData: [],
      pagetotol: "",
      value1: [
        new Date(this.formatDate(new Date(), "yyyy-MM-dd")) -
          8 * 60 * 60 * 1000,
        new Date(),
      ],
    };
  },
  mounted() {
    this.ajax();
    console.log(this.formatDate(new Date(), "yyyy-MM-dd"));
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
            name: "Access From",
            type: "pie",
            radius: "50%",
            data: [
              {
                value: that.tableData[0].createOrderNums,
                name: "创建订单量",
                itemStyle: { color: "#006699" },
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
            name: "Access From",
            type: "pie",
            radius: "50%",
            data: [
              {
                value: that.tableData[0].totalFlowingWater,
                name: "总流水",
                itemStyle: { color: "#006699" },
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
            name: "Access From",
            type: "pie",
            radius: "50%",
            data: [
              {
                value: that.tableData[0].totalFlowingWater,
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
    ajax() {
      var that = this;
      getflowing_water({
        startTime: that.formatDate(that.value1[0], "yyyy-MM-dd HH:mm:ss"),
        endTime: that.formatDate(that.value1[1], "yyyy-MM-dd HH:mm:ss"),
      }).then((res) => {
        console.log("water", res);
        that.tableData = res.data.data.records;
        that.pagetotol = res.data.data.total;
        that.echarts();
        that.echarts2();
        that.echarts3();
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
  width: 100%;
  justify-content: space-around;
  // background-color: #fff;
}
</style>
