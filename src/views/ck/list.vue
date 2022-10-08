<template>
  <div>
    <h1>ck上传</h1>
    <div class="updown">
      <el-upload
        class="upload"
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
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text"><em>点击上传</em></div>
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
          { name: '禁用', status: 0 },
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
  batchDeleteCk,
} from "../../api/ajax";
axios.defaults.headers["Content-Type"] = "application/json;charset=utf-8";
axios.defaults.withCredentials = true; //  在跨域中允许携带凭证
export default {
  methods: {
    // 批量警用
    DisbatchDeleteCk() {
      if (!this.filename) {
        return this.$message.error("必填文件名和状态");
      }
      batchDeleteCk({ fileName: this.filename, status: this.filestatus }).then(
        (res) => {
          console.log("dis", res);
        }
      );
    },
    ajax() {
      getckList({ current: 1, size: 5 }).then((res) => {
        this.tableData = res.data.data.records;
        this.pagetotol = res.data.data.total;
      });
    },
    // 根据pt那啥查询
    onSearch() {
      var that = this;
      searchCkList({
        current: 1,
        size: 5,
        ...that.Search,
      }).then((res) => {
        this.tableData = res.data.data.records;
      });
    },
    changePage(val) {
      var that = this;
      searchCkList({ current: val, size: 5, ...that.Search }).then((res) => {
        this.tableData = res.data.data.records;
      });
    },

    uploadSectionFile(file) {
      var that = this;
      if (this.file_get_result == null) {
        that.loading = true;
        let fd = new FormData();
        fd.append("file", file.file); //传⽂件
        uploadFile(fd, false).then((res) => {
          if (res.data.code == 200) {
            that.loading = false;
            that.file_get_result = res.data.data.repeat;
            this.$confirm(`重复数量:${this.file_get_result}`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            that.loading = true;
            let fd = new FormData();
            fd.append("file", file.file); //传⽂件
            uploadFile(fd, true).then((res) => {
              if (res.data.code == 200) {
                this.loading = false;
                this.$message.success("上传成功");
                this.file_get_result = null
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消上传",
            });
          });
          }
        });
      }
    },
  },
  mounted() {
    this.ajax();
  },
  data() {
    return {
      // 查询条件
      Search: {
        ptPin: "",
        fileName: "",
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
        { mz: "App Store 充值卡 200元", skuid: "11183368356" },
      ],
      // 批量禁用或启用
      filestatus: 0,
      filename: "",
      // 重复字段
      file_get_result: null,
    };
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
