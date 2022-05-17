<template>
  <!-- // water -->
  <div>
    <h1>流水管理</h1>
    <div class="block" style="margin-bottom:30px">
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
    <el-table
      :data="tableData"
      border
      :row-key="tableData.id"
      style="width: 100%"
      fit="true"
    >
      <el-table-column fixed prop="createOrderNums" label="createOrderNums">
      </el-table-column>
      <el-table-column prop="successOrderNums" label="successOrderNums">
      </el-table-column>
      <el-table-column prop="totalFlowingWater" label="totalFlowingWater">
      </el-table-column>
      <el-table-column prop="successFlowingWater" label="successFlowingWater">
        <!-- <template slot-scope="scope">
          <span>{{ scope.row.expirationTime | FormatDate("yyyy-MM-dd") }}</span>
        </template> -->
      </el-table-column>
      <!-- <el-table-column label="是否正常使用" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.isEnable == 1 ? "正常使用" : "不能使用" }}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        prop="failFlowingWater"
        label="failFlowingWater"
        width="120"
      >
      </el-table-column>
      <el-table-column
        prop="noMatchFlowingWater"
        label="noMatchFlowingWater"
        width="120"
      >
      </el-table-column>
      <el-table-column prop="successRate" label="successRate" width="120">
      </el-table-column>
    </el-table>
    <!-- <div class="pagination-flex">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="changePage"
        :total="pagetotol"
        page-size="5"
      >
      </el-pagination>
    </div> -->
  </div>
</template>

<script>
import { getflowing_water } from "../../api/ajax";
export default {
  data() {
    return {
      tableData: [],
      pagetotol: "",
      value1: [
        new Date(this.formatDate(new Date(), "yyyy-MM-dd"))-8*60*60*1000,
        new Date()
      ]
    };
  },
  mounted() {
    this.ajax();
    console.log((this.formatDate(new Date(), "yyyy-MM-dd")))
  },
  methods: {
    ajax() {
    var that=this
      getflowing_water({ startTime:that.formatDate(that.value1[0], "yyyy-MM-dd HH:mm:ss"),
        endTime: that.formatDate(that.value1[1], "yyyy-MM-dd HH:mm:ss"),}).then(res => {
        console.log("water", res);
        this.tableData = res.data.data.records;
        this.pagetotol = res.data.data.total;
      });
    },
    changePage(val) {
      var that=this
      getflowing_water({ startTime:that.formatDate(that.value1[0], "yyyy-MM-dd HH:mm:ss"),
        endTime: that.formatDate(that.value1[1], "yyyy-MM-dd HH:mm:ss"),}).then(res => {
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
      var that=this
      getflowing_water({
        startTime:that.formatDate(that.value1[0], "yyyy-MM-dd HH:mm:ss"),
        endTime: that.formatDate(that.value1[1], "yyyy-MM-dd HH:mm:ss"),
      }).then(res => {
        this.tableData = res.data.data.records;
      });
    }
  }
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
</style>
