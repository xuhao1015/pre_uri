<template>
  <div>
    <h1>sku管理</h1>
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
      <span class="demonstration">订单状态:</span>
      <el-radio v-model="radio" label="-1">全部</el-radio>
      <el-radio v-model="radio" label="0">未匹配</el-radio>
      <el-radio v-model="radio" label="1">成功</el-radio>
      <el-radio v-model="radio" label="2">失败</el-radio>
      <el-radio v-model="radio" label="3">退款</el-radio>
      <el-button type="primary" @click="search">查找</el-button>
    </div>

    <el-table
      :data="tableData"
      border
      :row-key="tableData.id"
      style="width: 100%"
      fit="true"
    >
      <el-table-column fixed label="创建时间" width="180">
        <template slot-scope="scope">
          <span>{{
            scope.row.createTime | FormatDate("yyyy-MM-dd HH:mm:ss")
          }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="config" label="config" width="400">
      </el-table-column> -->
      <el-table-column prop="groupNum" label="通道"> </el-table-column>
      <el-table-column prop="id" label="编号"> </el-table-column>
      <el-table-column prop="orderClientId" label="订单号"> </el-table-column>
      <el-table-column prop="orderPtId" label="JD订单号"> </el-table-column>
      <el-table-column prop="orderStatus" label="订单状态">
        <template slot-scope="scope">
          <span v-if="scope.row.orderStatus == 0">
            未匹配
          </span>
          <span v-else-if="scope.row.orderStatus == 1">
            成功
          </span>
          <span v-else-if="scope.row.orderStatus == 2">
            失败
          </span>
          <span v-else>
            退款
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="价格"> </el-table-column>
      <el-table-column prop="tenantId" label="商家编号"> </el-table-column>
      <el-table-column prop="tenantName" label="商家姓名"> </el-table-column>

      <!-- <el-table-column prop="url" label="url" width="400"> </el-table-column> -->
      <!-- <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small"
            >查看</el-button
          >
          <el-button type="text" size="small">编辑</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <div class="pagination-flex">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="changePage"
        :total="pagetotol"
        page-size="5"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getclient_order } from "../../api/ajax";
export default {
  data() {
    return {
      tableData: [],
      pagetotol: "",
      value1: [
        this.formatDate(new Date() - 3600 * 24 * 1000, "yyyy-MM-dd HH:mm:ss"),
        this.formatDate(new Date(), "yyyy-MM-dd HH:mm:ss")
      ],
      radio: "0"
    };
  },
  mounted() {
    this.ajax();
    // console.log();
  },
  methods: {
    ajax() {
      getclient_order({ current: 1, size: 5 }).then(res => {
        // console.log("getclient_order", res);
        this.tableData = res.data.data.records;
        this.pagetotol = res.data.data.total;
      });
    },
    changePage(val) {
      getclient_order({ current: val, size: 5 }).then(res => {
        this.tableData = res.data.data.records;
      });
    },
    search() {
      console.log("value1", this.value1);
      let [startTime, endTime] = this.value1;
      //   全选不带订单状态，不全选带上
      if (this.radio == "-1") {
        getclient_order({
          //   current: val,
          size: 5,
          startTime: startTime,
          endTime: endTime
        }).then(res => {
          this.tableData = res.data.data.records;
        });
      } else {
        getclient_order({
          //   current: val,
          size: 5,
          startTime: startTime,
          endTime: endTime,
          orderStatus: this.radio
        }).then(res => {
          console.log("search===", res.data.data.records);
          this.tableData = res.data.data.records;
        });
      }
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
        "s+": date.getSeconds()
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
