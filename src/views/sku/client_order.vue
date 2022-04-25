<template>
  <div>
    <h1>客户订单管理</h1>
    <!-- <div class="block" >
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
    </div> -->
    <div style="margin-bottom: 30px">
      <el-input
        v-model="input1"
        placeholder="请输入订单号"
        style="width: 300px"
      ></el-input>
      <el-input
        v-model="input2"
        placeholder="请输入外部订单号"
        style="width: 300px"
      ></el-input>
      <el-button type="primary" @click="search">查找</el-button>
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
      <el-input
        v-model="outkami_input"
        placeholder="请输入卡密"
        style="width: 300px"
      ></el-input>
      <el-button type="danger" @click="outkami()">导出</el-button>
    </div>
    <el-table
      :data="tableData"
      border
      :row-key="tableData.id"
      style="width: 100%"
      fit="true"
    >
      <!-- <el-table-column fixed label="创建时间" width="180">
        <template slot-scope="scope">
          <span>{{
            scope.row.createTime | FormatDate("yyyy-MM-dd HH:mm:ss")
          }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column prop="config" label="config" width="400">
      </el-table-column> -->
      <el-table-column label="订单支付详情" show-overflow-tooltip>
        <template slot-scope="scope">
          <!-- <el-popover
            width="1000"
            placement="top-start"
            trigger="hover"
            :content="document.write(scope.row.html)"
          >
            <span slot="reference" class="btn">{{ scope.row.html }}</span>
          </el-popover> -->
          <el-button @click="showModal(scope.row.html)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="subject" label="商品"> </el-table-column>
      <el-table-column prop="tradeNo" label="订单号"> </el-table-column>
      <el-table-column prop="skuName" label="商品名称" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="amount" label="订单金额"> </el-table-column>
      <el-table-column prop="outTradeNo" label="外部订单号"> </el-table-column>
      <el-table-column prop="originalTradeNo" label="JD订单号">
      </el-table-column>

      <el-table-column prop="createTimeStr" label="订单创建时间">
      </el-table-column>
      <el-table-column prop="" label="成功支付时间">
        <template slot-scope="scope">
          <span>{{ scope.row.paySuccessTime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="matchTime" label="匹配时间(s)"> </el-table-column>
      <el-table-column prop="payUrl" label="支付链接" show-overflow-tooltip>
      </el-table-column>

      <el-table-column prop="failTime" label="失败次数"> </el-table-column>
      <el-table-column
        prop="userAgent"
        label="用户请求头"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column prop="userIp" label="用户请求IP"> </el-table-column>
      <el-table-column prop="cardNumber" label="卡号"> </el-table-column>
      <!-- <el-table-column prop="carMy" label="卡密"> </el-table-column> -->
      <el-table-column prop="money" label="价格"> </el-table-column>
      <el-table-column
        prop="orderStatus"
        label="订单状态"
        style='`${scope.row.status == 0 "color:red" ?(scope.row.status == 1?"":"color:green")}`'
      >
        <template slot-scope="scope" class="fail">
          <span v-if="scope.row.status == 0"> 失败 </span>
          <span v-else-if="scope.row.status == 1"> 待支付 </span>
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

      <!-- <el-table-column prop="ptId" label="" width="400"> </el-table-column> -->
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
        page-size="5"
      >
      </el-pagination>
    </div>
    <!-- <div id="Modal"></div> -->
    <el-dialog
      title="支付详情"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <div id="Modal"></div>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span> -->
    </el-dialog>
  </div>
</template>

<script>
import {
  getclient_order,
  getcallback,
  getbaifenbi,
  outKm
} from "../../api/ajax";
export default {
  data() {
    return {
      tableData: [],
      pagetotol: "",
      input1: "",
      input2: "",
      baifenbi: "",
      value1: [],
      outkami_input: "",
      dialogVisible: false //dialog弹窗
      // dataHtml: null
    };
  },
  mounted() {
    this.ajax();
    // console.log();
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
      // this.$confirm("确认关闭？")
      //   .then(_ => {
      //     done();
      //   })
      //   .catch(_ => {});
    },
    // 下载
    outkami() {
      // console.log('sraer',)
      window.location.href = `http://${
        window.location.hostname
      }:8888/pre/ck/upload/uploadMy?carMy=${this.outkami_input}`;
    },
    ajax() {
      getclient_order({ current: 1, size: 5 }).then(res => {
        console.log("getclient_order", res);
        this.tableData = res.data.data.records;
        this.pagetotol = res.data.data.total;
      });
    },
    changePage(val) {
      getclient_order({ current: val, size: 5 }).then(res => {
        this.tableData = res.data.data.records;
      });
    },
    chaxun() {
      console.log("time=", this.value1);
      var that = this;
      getbaifenbi(
        this.formatDate(this.value1[0], "yyyy-MM-dd HH:mm:ss"),
        this.formatDate(this.value1[1], "yyyy-MM-dd HH:mm:ss")
      ).then(res => {
        console.log(res.data);
        that.baifenbi = res.data.data + "%";
      });
    },
    search() {
      getclient_order({
        tradeNo: this.input1,
        outTradeNo: this.input2
      }).then(res => {
        this.tableData = res.data.data.records;
      });
    },
    handleClick(id) {
      getcallback({ id }).then(res => {
        if (res.data.code == 200) {
          const h = this.$createElement;
          this.$notify({
            title: "获取成功",
            message: h("i", { style: "color: teal" }, "获取成功")
          });
        }
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
