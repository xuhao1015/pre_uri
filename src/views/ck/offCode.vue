<template>
  <div>
    <div class="flexdiv" style="margin-bottom: 30px">
      <div>
        <el-select placeholder="请选择" v-model="search.isWriteOffCode">
          <el-option
            v-for="item in [
              { name: '未核销', val: 0 },
              { name: '已核销', val: 1 },
              { name: '全部', val: null },
            ]"
            :key="item.val"
            :label="item.name"
            :value="item.val"
          >
          </el-option>
        </el-select>
        <el-input
          v-model="search.account"
          placeholder="请输入账号"
          style="width: 150px"
        ></el-input>
        <!-- 0，失败，1待支付，2支付成功 -->
        <el-select placeholder="选择查询文件" v-model="search.fileName">
          <el-option
            v-for="(item, index) in DropList"
            :key="index"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
        <el-button type="primary" @click="searchList()">查找</el-button>
        <el-button type="primary" @click="reset()">重置</el-button>
      </div>
    </div>

    <el-table :data="List" border :row-key="List.id" style="width: 100%">
      <el-table-column
        prop="writeOffCode"
        label="核销编码"
        width="100"
      ></el-table-column>

      <el-table-column prop="successMoney" label="成功金额">
        <template slot-scope="scope">
          <div style="color: green">{{ scope.row.successMoney }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="" label="核销时间">
        <template slot-scope="scope">
          <span>{{ scope.row.writeOffCodeTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否核销">
        <template slot-scope="scope">
          <span
            :style="`color:${
              scope.row.isWriteOffCode == 0 ? 'red' : 'green'
            }`"
            >{{
              scope.row.isWriteOffCode == 0 ? "未核销" : "已核销"
            }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="account" label="账号"> </el-table-column>
      <el-table-column prop="password" label="密码"> </el-table-column>
      <!-- <el-table-column prop="appck" label="appck" show-overflow-tooltip="true">
      </el-table-column> -->
      <!-- <el-table-column prop="failPay" label="失败数" width="50">
      </el-table-column>
      <el-table-column prop="toBePay" label="待支付数" width="50">
      </el-table-column> -->
      <el-table-column prop="successPay" label="成功数" width="50">
      </el-table-column>
      <!-- <el-table-column
        prop="failReason"
        label="失败原因"
        show-overflow-tooltip="true"
      >
      </el-table-column> -->

      <el-table-column label="订单支付详情">
        <template slot-scope="{ row }">
          <el-button @click="hexiao(row.id)" type="primary">核销</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-flex">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="changePage"
        :total="pagetotol"
        :current-page.sync="currentPage"
        :page-size="size"
      >
      </el-pagination>
    </div>

    <el-dialog
      title="支付详情"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
    >
      <el-card class="box-card">
        <div
          v-for="(item, index) in showData"
          :key="index"
          class="text item itemcard"
        >
          <div>{{ "创建时间: " + item.createTime }}</div>
          <div>{{ "订单号: " + item.orderId }}</div>
          <div>{{ "商品名称: " + item.skuName }}</div>
          <div
            v-if="item.isWxSuccess == 1 && item.paySuccessTime != null"
            style="color: green"
          >
            {{ "状态:" + "成功" }}
          </div>
          <div v-if="item.isWxSuccess == 1 && item.paySuccessTime == null">
            {{ "状态:" + "待支付" }}
          </div>
          <div v-if="item.isWxSuccess == 0" style="color: red">
            {{ "状态:" + "失败" }}
          </div>
        </div>
      </el-card>
    </el-dialog>
  </div>
</template>
<script>
import {
  getFileList,
  getALLFileName,
  uploadZhideng,
  batchWriteOff,
  zhidengOffCode,writeOffById
} from "../../api/ajax";
export default {
  data() {
    return {
      List: [],
      dialogVisible: false,
      showData: [],
      currentPage: 1,
      pagetotol: 0,
      size: 1,
      DropList: [],
      search: {
        fileName: null,
        account: "",
        isWriteOffCode: 0,
      },
      filelist: [],
    };
  },
  mounted() {
    this.ajax();
    this.DropData();
  },
  methods: {
    //   获取页面数据
    async DropData() {
      const { data } = await getALLFileName();
      this.DropList = data.data;
    },
    async ajax() {
      var that = this;
      const { data } = await zhidengOffCode({
        current: that.currentPage,
        size: 30,
        ...this.search,
      });
      if (data.code == 200) {
        that.List = data.data.records;
        that.pagetotol = data.data.total;
        that.size = data.data.size;
      }
    },
    // 条件查询
    async searchList() {
      const { data } = await zhidengOffCode({
        ...this.search,
        size: 30,
        current: this.currentPage,
      });
      if (data.code == 200) {
        this.List = data.data.records;
        this.pagetotol = data.data.total;
        this.size = data.data.size;
      }
    },
    reset() {
      this.search = {
        isEnable: null,
        fileName: null,
        account: "",
      };
      this.searchList();
    },
    async changePage(val) {
      var that = this;
      that.currentPage = val;
      const { data } = await zhidengOffCode({
        current: that.currentPage,
        size: 30,
        ...this.search,
      });
      if (data.code == 200) {
        that.List = data.data.records;
        that.pagetotol = data.data.total;
        that.size = data.data.size;
      }
    },
    show(params) {
      this.dialogVisible = true;
      this.showData = params;
    },
    hexiao(id) {
        var that=this
      this.$confirm("是否核销?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
          writeOffById({ id }).then((res) => {
            if (res.data.code == 200) {
              that.ajax();
              const h = this.$createElement;
              that.$notify({
                title: "核销成功",
                message: h("i", { style: "color: teal" }, "核销成功"),
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消核销",
          });
        });
    },
    handleClose() {
      this.dialogVisible = false;
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
.my-label {
  background: #e1f3d8;
}
.itemcard {
  border: 1px solid #000;
  font-size: 18px;
  font-weight: 500;
}
.flexdiv {
  display: flex;
  justify-content: flex-start;
  > div:nth-child(2) {
    margin-left: 20px;
  }
}
</style>