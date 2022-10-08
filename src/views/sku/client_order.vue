<template>
  <div>
    <h1>客户订单管理</h1>
    <el-button type="primary" @click="ajax">刷新当前页数据</el-button>
    <div style="margin-bottom: 30px">
      <el-input
        v-model="input1"
        placeholder="请输入系统订单号"
        style="width: 150px"
      ></el-input>
      <el-input
        v-model="input2"
        placeholder="请输入外部订单号"
        style="width: 150px"
      ></el-input>
      <el-input
        v-model="originalTradeNo"
        placeholder="请输入JD订单号"
        style="width: 150px"
      ></el-input>

      <el-date-picker
        v-model="searchTime"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      >
      </el-date-picker>
      <!-- 0，失败，1待支付，2支付成功 -->
      <el-select v-model="PayorderStatus" placeholder="请选择">
        <el-option
          v-for="item in [
            { name: '失败', val: 0 },
            { name: '待支付', val: 1 },
            { name: '支付成功', val: 2 },
            { name: '全部', val: null },
          ]"
          :key="item.val"
          :label="item.name"
          :value="item.val"
        >
        </el-option>
      </el-select>
      <el-button type="primary" @click="search">查找</el-button>
    </div>
    <el-input
      v-model="outkami_input"
      placeholder="请输入卡密"
      style="width: 300px"
    ></el-input>
    <el-button type="danger" @click="outkami()">导出</el-button>

    <el-table
      :data="tableData"
      border
      :row-key="tableData.id"
      style="width: 100%"
      fit="true"
    >
      <el-table-column label="订单支付详情" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button @click="showModal(scope.row.html)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="tradeNo" label="订单号"> </el-table-column>
      <el-table-column prop="amount" label="订单金额"> </el-table-column>
      <el-table-column prop="outTradeNo" label="外部订单号"> </el-table-column>
      <el-table-column prop="originalTradeNo" label="商城订单号">
      </el-table-column>

      <el-table-column prop="createTimeStr" label="订单创建时间">
      </el-table-column>
      <el-table-column prop="" label="成功支付时间">
        <template slot-scope="scope">
          <span>{{ scope.row.paySuccessTime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="matchTime" label="匹配时间(s)"> </el-table-column>
      <el-table-column label="用户请求头">
        <template slot-scope="{ row }">
          {{
            row.userAgent && row.userAgent.match(/android/i) ? "Android" : "IOS"
          }}
        </template>
      </el-table-column>
      <el-table-column prop="userIp" label="用户请求IP"> </el-table-column>
      <el-table-column prop="cardNumber" label="号码"> </el-table-column>
      <!-- orgAppCk -->
      <el-table-column prop="orgAppCk" label="状态" show-overflow-tooltip="true"> </el-table-column>

      <el-table-column
        prop="orderStatus"
        label="订单状态"
        style='`${scope.row.status == 0||3 "color:red" ?(scope.row.status == 1?"":"color:green")}`'
      >
        <template slot-scope="scope" class="fail">
          <span v-if="scope.row.status == 0"> 失败 </span>
          <span v-else-if="scope.row.status == 1"> 待支付 </span>
          <span v-else-if="scope.row.status == 3"> 退款 </span>
          <span v-else-if="scope.row.status == 2" style="color: green">
            支付成功
          </span>
        </template>
      </el-table-column>

      <el-table-column label="通知是否成功">
        <template slot-scope="scope">
          <span>{{ scope.row.notifySucc == 1 ? "成功" : "失败" }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row.id)" type="text" size="small"
            >获取卡密</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-flex">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="changePage"
        :total="pagetotol"
        :current-page="currentPage"
        page-size="30"
      >
      </el-pagination>
    </div>
    <div class="div-flex">
      <span class="demonstration">时间选择:</span>
      <el-date-picker
        v-model="value1"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      >
      </el-date-picker>
      <p>
        订单成功率：<span>{{ baifenbi }}</span>
      </p>
      <el-button type="primary" @click="chaxun()">查询成功率</el-button>
    </div>
    <!-- <div id="Modal"></div> -->
    <el-dialog
      title="支付详情"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <div id="Modal"></div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getclient_order,
  getcallback,
  getbaifenbi,
  outKm,
} from "../../api/ajax";
export default {
  data() {
    return {
      tableData: [],
      pagetotol: "",
      currentPage: "1",
      input1: "",
      input2: "",
      baifenbi: "",
      value1: [],
      outkami_input: "",
      dialogVisible: false, //dialog弹窗
      originalTradeNo: "",
      searchTime: [],
      PayorderStatus: null,
    };
  },
  mounted() {
    this.ajax();
  },
  methods: {
    // 展示HTML
    showModal(html) {
      this.dialogVisible = true;
      this.$nextTick(() => {
        let dom = document.querySelector("#Modal");
        dom.innerHTML = html;
      });
    },
    handleClose(done) {
      done();
    },
    // 下载
    outkami() {
      window.location.href = `http://${window.location.hostname}:8888/pre/ck/upload/uploadMy?carMy=${this.outkami_input}`;
    },
    ajax() {
      var that = this;
      getclient_order({ current: that.currentPage, size: 30 }).then((res) => {
        that.tableData = res.data.data.records;
        that.pagetotol = res.data.data.total;
        that.currentPage = res.data.data.current;
        console.log("curr=", that.currentPage);
      });
    },
    changePage(val) {
      var that = this;
      that.currentPage = val;
      let startCreateTime;
      let endCreateTime;
      if (that.searchTime.length !== 0) {
        startCreateTime = this.formatDate(
          that.searchTime[0],
          "yyyy-MM-dd HH:mm:ss"
        );
        endCreateTime = this.formatDate(
          that.searchTime[1],
          "yyyy-MM-dd HH:mm:ss"
        );
      }
      getclient_order({
        current: val,
        size: 30,
        tradeNo: this.input1,
        outTradeNo: this.input2,
        originalTradeNo: this.originalTradeNo,
        startCreateTime,
        endCreateTime,
        status: this.PayorderStatus,
      }).then((res) => {
        this.tableData = res.data.data.records;
      });
    },
    // 成功概率查询
    chaxun() {
      var that = this;
      getbaifenbi(
        this.formatDate(this.value1[0], "yyyy-MM-dd HH:mm:ss"),
        this.formatDate(this.value1[1], "yyyy-MM-dd HH:mm:ss")
      ).then((res) => {
        that.baifenbi = res.data.data * 100 + "%";
      });
    },
    // 条件查询
    search() {
      var that = this;
      that.currentPage = "1";
      let startCreateTime;
      let endCreateTime;
      if (that.searchTime.length !== 0) {
        startCreateTime = this.formatDate(
          that.searchTime[0],
          "yyyy-MM-dd HH:mm:ss"
        );
        endCreateTime = this.formatDate(
          that.searchTime[1],
          "yyyy-MM-dd HH:mm:ss"
        );
      }
      getclient_order({
        tradeNo: this.input1,
        outTradeNo: this.input2,
        originalTradeNo: this.originalTradeNo,
        startCreateTime,
        endCreateTime,
        status: this.PayorderStatus,
        current: that.currentPage,
        size: 30,
      }).then((res) => {
        this.tableData = res.data.data.records;
      });
    },
    handleClick(id) {
      var that=this;
      this.$confirm("此操作将获取卡密, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          getcallback({ id }).then((res) => {
            if (res.data.code == 200) {
              that.ajax();
              const h = this.$createElement;
              this.$notify({
                title: "获取成功",
                message: h("i", { style: "color: teal" }, "获取成功"),
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
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
  },
};
</script>
<style lang="scss" scoped>
// 隐藏hover显示框
.el-tooltip__popper {
  display: none;
}
// #Modal {
//   position: absolute;
//   left: 100px;
//   top: 0;
//   width: 1000px;
//   z-index: 3;
//   background-color: lightgray;
//   display: none;
// }
.pagination-flex {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
  background-color: #fff;
  padding: 20px 40px;
}
.fail {
  color: red;
}
.div-flex {
  display: flex;
  justify-content: start;
  flex-wrap: nowrap;
  p {
    margin-left: 2%;
    margin-top: 5px;
    margin-right: 2%;
    color: green;
    span {
      font-weight: bolder;
      font-size: larger;
    }
  }
}
</style>
