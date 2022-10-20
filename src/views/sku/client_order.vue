<template>
  <div>
    <el-card class="box-card">
      <el-collapse>
        <el-collapse-item title="筛选条件" name="1">
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
        </el-collapse-item>
      </el-collapse>
    </el-card>
    <el-card>
    <el-table
      :data="tableData"
      border
      :row-key="tableData.id"
      fit="true"
      size="mini"
      style="font-size: 10px"
      :row-style="{height:'20px'}"
      :cell-style="{padding:'0px'}"
      v-loading="loading"
      :row-class-name="tableRowClassName"
      >
      <el-table-column label="订单支付详情" show-overflow-tooltip >
        <template slot-scope="scope">
          <el-button @click="showModal(scope.row.html)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="tradeNo" label="订单号" width="150"> </el-table-column>
      <el-table-column prop="amount" label="订单金额"> </el-table-column>
      <el-table-column prop="outTradeNo" label="外部订单号" width="170"> </el-table-column>
      <el-table-column prop="originalTradeNo" label="商城订单号" width="150">
      </el-table-column>

      <el-table-column prop="createTimeStr" label="订单创建时间" width="135">
      </el-table-column>
      <el-table-column prop="" label="成功支付时间" width="135">
        <template slot-scope="scope">
          <span>{{ scope.row.paySuccessTime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="matchTime" label="匹配时间(s)" > </el-table-column>
      <el-table-column label="用户请求头">
        <template slot-scope="{ row }">
          {{
            row.userAgent && row.userAgent.match(/android/i) ? "Android" : "IOS"
          }}
        </template>
      </el-table-column>
      <el-table-column prop="userIp" label="用户请求IP" width="110"> </el-table-column>
      <el-table-column prop="cardNumber" label="卡密号码" width="150"> </el-table-column>
      <!-- orgAppCk -->
      <el-table-column
        prop="clickPay"
        label="点击支付"
        show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        prop="orgAppCk"
        label="查询的最后时间"
        show-overflow-tooltip="true"
      >
      </el-table-column>

      <el-table-column
      width="60"
        prop="orderStatus"
        label="订单状态"
        style='`${scope.row.status == 0||3 "color:red" ?(scope.row.status == 1?"":"color:green")}`'
      >
        <template slot-scope="scope" class="fail">
          <span v-if="scope.row.status == 0"> 失败 </span>
          <span v-else-if="scope.row.status == 1"> 待支付 </span>
          <span v-else-if="scope.row.status == 3"> 退款 </span>
          <span v-else-if="scope.row.status == 2" style="color: green">
            成功
          </span>
        </template>
      </el-table-column>
      <el-table-column label="通知是否成功"  width="60" >
        <template slot-scope="{row}">
          <span :style="`color:${row.status==2&&row.notifySucc!=1&&'red'}`">{{ row.notifySucc == 1 ? "成功" : "失败" }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="220">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row, 0)" type="info" size="small"
            >通知</el-button
          >
          <el-button
            @click="handleClick(scope.row, 1)"
            type="primary"
            size="small"
            >卡密</el-button
          >
          <el-button
            @click="handleChangeStatus(scope.row)"
            type="danger"
            size="small"
            >补单</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </el-card>
    <div class="pagination-flex">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="changePage"
        :total="pagetotol"
        :current-page="currentPage"
        page-size="20"
      >
      </el-pagination>
    </div>
    <el-dialog
      title="支付详情"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <div id="Modal"></div>
    </el-dialog>
    <!-- 修改补单状态 -->
    <el-dialog
      :visible.sync="orderVisible"
      width="30%"
      :before-close="handleOrderClose"
    >
      <span slot="title" class="dialog-footer">
        补单状态编辑- 当前补单id：{{ orderCurrentId }}
      </span>
      <div>
        <el-radio v-model="orderradio" label="0">支付失败</el-radio>
        <el-radio v-model="orderradio" label="1">待支付</el-radio>
        <el-radio v-model="orderradio" label="2">成功</el-radio>
        <el-radio v-model="orderradio" label="3">退款</el-radio>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="orderVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleChangeStatusOK"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getclient_order,
  getkami,
  getbaifenbi,
  getnotify,
  getbudan,
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
      orderVisible: false,
      orderradio: null,
      orderCurrentId: null, //当前补单id
      originalTradeNo: "",
      searchTime: [],
      PayorderStatus: null,
      loading: true
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
    // 关闭订单状态弹窗
    handlOrderClose() {
      this.orderVisible = false;
    },
    // 下载
    outkami() {
      window.location.href = `http://${window.location.hostname}:8888/pre/ck/upload/uploadMy?carMy=${this.outkami_input}`;
    },
    ajax() {
      this.loading=true;
      var that = this;
      getclient_order({ current: that.currentPage, size: 20 }).then((res) => {
        this.loading=false
        that.tableData = res.data.data.records;
        that.pagetotol = res.data.data.total;
        that.currentPage = res.data.data.current;
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
        size: 20,
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
        size: 20,
      }).then((res) => {
        this.tableData = res.data.data.records;
      });
    },
    handleClick(row, type) {
      let id = row.id;
      var that = this;
      this.$confirm(
        `此操作将${
          type === 0 ? "通知" : type === 1 ? "获取卡密" : "补单"
        }, 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(async () => {
          let res;
          if (type === 0) {
            res = await getnotify({ id });
          } else if (type === 1) {
            res = await getkami({ id });
          } else if (type === 2) {
            res = await getbudan({ id, status: row.status });
          } else {
            return this.$message.error("错误，请联系管理员");
          }

          if (res.data.code == 200) {
            that.ajax();
            const h = this.$createElement;
            this.$notify({
              title: `${
                type === 0 ? "通知" : type === 1 ? "获取卡密" : "补单"
              }获取成功`,
              message: h(
                "i",
                { style: "color: teal" },
                `${type === 0 ? "通知" : type === 1 ? "获取卡密" : "补单"}成功`
              ),
            });
          } else {
            this.$message.error("失败");
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 补单按钮
    handleChangeStatus(row) {
      this.orderVisible = true;
      this.orderradio = JSON.stringify(row.status);
      this.orderCurrentId = row.id;
      console.log("rowstatus=", row.status);
    },
    // 点击补单弹窗确认回调
    async handleChangeStatusOK() {
      const res = await getbudan({
        id: this.orderCurrentId,
        status: this.orderradio,
      });
      if (res.data.code === 200) {
        this.ajax();
        this.orderVisible = false;
        const h = this.$createElement;
        this.$notify({
          title: "补单成功",
          message: h("i", { style: "color: teal" }, "补单成功"),
        });
      } else {
        this.$message.error("补单失败");
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
     tableRowClassName({row, rowIndex}) {
        if (!row.clickPay) {
          return 'tablebg';
        }
        return '';
      }
  },
};
</script>
<style lang="scss" scoped>
// 隐藏hover显示框
.el-tooltip__popper {
  display: none;
}

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

.box-card::v-deep {
  margin-bottom: 20px;
  .el-collapse {
    border: none;
  }
  .el-collapse-item__header {
    border-bottom: none;
    font-size: 18px;
    font-weight: bold;
  }
  .el-collapse-item__wrap {
    border-bottom: none;
  }
  .el-form-item__label {
    font-weight: normal;
  }
}
 .el-table::v-deep .tablebg{background-color:	#DCDCDC;}
 .el-table::v-deep .warning-row {
    background: oldlace;
  }

  .el-table::v-deep .success-row {
    background: #f0f9eb;
  }
</style>
