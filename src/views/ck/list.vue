<template>
  <div>
    <h1>ck上传,必选skuid</h1>
    <div class="updown">
      <span>SKUID:</span>
      <el-select v-model="input_skuid" placeholder="请输入skuid">
        <el-option
          v-for="(item, inde) in options"
          :key="inde"
          :label="item.mz"
          :value="item.skuid"
        >
        </el-option>
      </el-select>

      <el-upload
        class="upload"
        :multiple="true"
        :show-file-list="false"
        action="fakeAction"
        drag
        :headers="headers"
        :file-list="filelist"
        :http-request="uploadSectionFile"
        :before-upload="beforeup"
        v-loading.lock="loading"
        element-loading-text="拼命上传中"
        :on-change="changeup"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">Drag或<em>点击上传</em></div>
      </el-upload>
    </div>
    <h1>条件查找</h1>
    <el-input
      style="width: 25%; margin-bottom: 20px; margin-left: 20px"
      v-model="Search.ptPin"
      placeholder="请输入pt"
    ></el-input>
    <el-input
      style="width: 25%; margin-bottom: 20px; margin-left: 20px"
      v-model="Search.fileName"
      placeholder="请输入文件名"
    />
    <el-button style="margin-left: 20px" type="primary" @click="onSearch"
      >查找</el-button
    >
    <h2>批量禁用或启用</h2>
    <el-input
      style="width: 25%; margin-bottom: 20px; margin-left: 20px"
      v-model="filename"
      placeholder="请输入文件名并且带后缀"
    />
    <el-select v-model="filestatus" placeholder="请选择">
      <el-option
        v-for="item in [
          { name: '启用', status: 1 },
          { name: '禁用', status: 0 }
        ]"
        :key="item.status"
        :label="item.name"
        :value="item.status"
      >
      </el-option>
    </el-select>
    <el-button
      style="margin-left: 20px"
      type="primary"
      @click="DisbatchDeleteCk"
      >批量禁用或启用</el-button
    >
    <el-table
      :data="tableData"
      border
      :row-key="tableData.id"
      style="width: 100%"
    >
      <el-table-column fixed prop="id" label="id" width="50"> </el-table-column>
      <el-table-column
        prop="ck"
        label="ck"
        show-overflow-tooltip="true"
        width="100"
      >
      </el-table-column>
      <el-table-column label="createTime" width="200">
        <template slot-scope="scope">
          <span>{{
            scope.row.createTime | FormatDate("yyyy-MM-dd HH:mm:ss")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="fileName" label="fileName" width="120">
      </el-table-column>
      <el-table-column
        prop="isEnable"
        label="是否可用(5:生产;1:有效)"
        width="200"
      >
      </el-table-column>
      <el-table-column prop="ptPin" label="jd账号" width="120">
      </el-table-column>
      <el-table-column prop="failTime" label="失败次数" width="120">
      </el-table-column>
    </el-table>
    <div class="pagination-flex">
      <el-pagination
        background
        layout="total,prev, pager, next"
        @current-change="changePage"
        :total="pagetotol"
        page-size="5"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {
  getckList,
  searchCkList,
  uploadFile,
  batchDeleteCk
} from "../../api/ajax";
// axios.defaults.baseURL = '192.168.2.149:8081'; //  请求服务器具体的地址
axios.defaults.headers["Content-Type"] = "application/json;charset=utf-8";
axios.defaults.withCredentials = true; //  在跨域中允许携带凭证
export default {
  methods: {
    // 批量警用
    DisbatchDeleteCk() {
      // console.log(!!this.filestatus, !!this.filename);
      if (!this.filename) {
        return this.$message.error("必填文件名和状态");
      }
      batchDeleteCk({ fileName: this.filename, status: this.filestatus }).then(
        res => {
          console.log("dis", res);
        }
      );
    },
    ajax() {
      getckList({ current: 1, size: 5 }).then(res => {
        this.tableData = res.data.data.records;
        this.pagetotol = res.data.data.total;
      });
    },
    // 根据pt那啥查询
    onSearch() {
      //  "pt_pin=jd_JSwOTgjqxAcT"
      // fileName 查询有问题
      var that = this;
      searchCkList({
        current: 1,
        size: 5,
        ...that.Search
      }).then(res => {
        this.tableData = res.data.data.records;
      });
    },
    changePage(val) {
      var that = this;
      searchCkList({ current: val, size: 5, ...that.Search }).then(res => {
        this.tableData = res.data.data.records;
      });
    },

    uploadSectionFile(file) {
      this.loading = true;
      // console.log("file==", file, this.filelist);
      var that = this;
      let fd = new FormData();
      if (this.input_skuid == "") {
        this.$message.error("skuid必选");
        this.loading = false;
        return;
      } else {
        fd.append("file", file.file); //传⽂件
        console.log("aaaa=", fd);
        // fd.append('srid',this.aqForm.srid);//传其他参数
        uploadFile(fd, that.input_skuid).then(res => {
          console.log("res=", res);
          if (res.data.code == 200) {
            this.loading = false;
            this.$message.success("上传成功");
          }
        });
      }
    }
  },
  mounted() {
    this.ajax();
  },
  data() {
    return {
      // 查询条件
      Search: {
        ptPin: "",
        fileName: ""
      },

      // 查询条件
      tableData: [],

      headers: { "content-type": "multipart/form-data" },
      filelist: [],
      pagetotol: "",
      input_skuid: "",
      uploadfile: null,
      loading: false,
      options: [
        { mz: "App Store 充值卡 100元", skuid: "11183343342" },
        { mz: "App Store 充值卡 200元", skuid: "11183368356" }
      ],
      // 批量禁用或启用
      filestatus: 0,
      filename: ""
    };
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
.updown {
  display: flex;
  .upload {
    height: 100px;
  }
}
::v-deep .el-upload-dragger {
  height: 125px !important;
}
</style>
