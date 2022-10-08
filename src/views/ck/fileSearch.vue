<template>
  <div>
    <!-- <el-button type="primary">刷新当前页数据</el-button> -->

    <div class="flexdiv" style="margin-bottom: 30px">
      <div>
        <el-input
          v-model="search.account"
          placeholder="请输入账号"
          style="width: 150px"
        ></el-input>
        <!-- 0，失败，1待支付，2支付成功 -->
        <el-select placeholder="请选择" v-model="search.isEnable">
          <el-option
            v-for="item in [
              { name: '不可用', val: -1 },
              { name: '可用，不可下单', val: 0 },
              { name: '可用', val: 1 },
              { name: '下满5单的账号', val: 2 },
              { name: '已下架', val: 3 },
              { name: '全部', val: null },
            ]"
            :key="item.val"
            :label="item.name"
            :value="item.val"
          >
          </el-option>
        </el-select>
        <el-select placeholder="请选择" v-model="search.fileName">
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
        <el-button type="primary" @click="domnByFileName()">文件批量下架</el-button>
      </div>
      <div class="updown">
        <el-upload
          class="upload-demo"
          :multiple="true"
          :show-file-list="false"
          action="fakeAction"
          :headers="headers"
          :file-list="filelist"
          :http-request="uploadSectionFile"
          :before-upload="beforeup"
          v-loading.lock="loading"
          element-loading-text="拼命上传中"
          :on-change="changeup"
          ><el-button size="large" type="primary">点击上传</el-button>
        </el-upload>
      </div>
    </div>

    <el-table :data="List" border :row-key="List.id" style="width: 100%">
      <!-- <el-table-column prop="writeOffCode" label="核销编码" width="100" ></el-table-column>
       -->
      <el-table-column prop="successMoney" label="成功金额" >
      <template slot-scope="scope">
        <div style="color:green">{{scope.row.successMoney}}</div>
        </template>
      
      </el-table-column>
      <el-table-column prop="fileName" label="文件名"> </el-table-column>
      <el-table-column prop="account" label="账号"> </el-table-column>
      <el-table-column prop="password" label="密码"> </el-table-column>
      <el-table-column prop="appck" label="appck" show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="failPay" label="失败数" width="50">
      </el-table-column>
      <el-table-column prop="toBePay" label="待支付数" width="50">
      </el-table-column>
      <el-table-column prop="successPay" label="成功数" width="50">
      </el-table-column>

      <el-table-column
        prop="orderStatus"
        label="订单状态"
        style='`${scope.row.status == 0||3 "color:red" ?(scope.row.status == 1?"":"color:green")}`'
      width="100"  align = "center"
      >
        <template slot-scope="scope" class="fail">
          <span v-if="scope.row.isEnable == -1" style="color:red"  > 不可用 </span>
          <span v-else-if="scope.row.isEnable == 0"> 可用，不可下单 </span>
          <span v-else-if="scope.row.isEnable == 1"> 可用 </span>
          <span v-else-if="scope.row.isEnable == 3"> 已下架 </span>
          <span v-else-if="scope.row.isEnable == 2" style="color: green">
            下满5单的账号
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="failReason"
        label="失败原因"
        show-overflow-tooltip="true"
      >
      </el-table-column>

      <!-- <el-table-column prop="" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="订单支付详情">
        <template slot-scope="{ row }">
          <el-button @click="show(row.jdOrderPtList)">查看</el-button>
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
import { getFileList, getALLFileName, uploadZhideng,batchWriteOff } from "../../api/ajax";
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
        isEnable: null,
        fileName: null,
        account: "",
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
      const { data } = await getFileList({
        current: that.currentPage,
        size: 30,
      });
      if (data.code == 200) {
        that.List = data.data.records;
        that.pagetotol = data.data.total;
        that.size = data.data.size;
      }
    },
    // 条件查询
    async searchList() {
      const { data } = await getFileList({
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
      const { data } = await getFileList({
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
    handleClose() {
      this.dialogVisible = false;
    },
    uploadSectionFile(file) {
      var that = this;
      if (this.file_get_result == null) {
        that.loading = true;
        let fd = new FormData();
        fd.append("file", file.file); //传⽂件
        uploadZhideng(fd, true).then((res) => {
          if (res.data.code == 200) {
            that.loading = false;
            this.$message.success("上传成功");
            this.file_get_result = null;
          }else{
            this.file_get_result = null;
            this.$message.success(res.data.code);
          }
        });
      }
    },
   async domnByFileName(){
      const { data } = await batchWriteOff({fileName:this.search.fileName});
      if (data.code == 200) {
        this.$message.success('删除成功')
      }else{
        this.$message.error(data.msg);
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