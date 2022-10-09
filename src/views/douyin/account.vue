<template>
  <div>
    <!-- 文件上传 -->
    <div class="updown">
      <el-upload
        class="upload"
        :show-file-list="false"
        action="fakeAction"
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
    <!-- 条件查询 -->
    <el-input
      style="width: 25%; margin-bottom: 20px; margin-left: 20px"
      v-model="search.uid"
      placeholder="请输入uid"
    ></el-input>
    <el-input
      style="width: 25%; margin-bottom: 20px; margin-left: 20px"
      v-model="search.ck"
      placeholder="请输入ck"
    />
    <el-button style="margin-left: 20px" type="primary" @click="onSearch"
      >查找</el-button
    >
    <!-- table -->
    <el-table
      :data="tableData"
      border
      :row-key="tableData.id"
      style="width: 100%"
      fit="true"
    >
      <el-table-column prop="uid" label="抖音账号"> </el-table-column>
      <el-table-column prop="ck" label="抖音CK" show-overflow-tooltip="true"> </el-table-column>
      <el-table-column prop="isEnable" label="是否启用">
        <template slot-scope="{ row }">
          <span>{{ row.isEnable == 1 ? "启用" : "停用" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="maxAmount" label="下单最大金额"> </el-table-column>
      <el-table-column fixed prop="createTime" label="创建时间">
      </el-table-column>
      <el-table-column prop="failReason" label="失败原因" show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="fileName" label="文件名"> </el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column prop="updateTime" label="修改时间"></el-table-column>

      <el-table-column label="操作" width="140px" align="center">
        <template slot-scope="{ row }">
          <el-button type="primary" @click="changeStatus(row)">{{
            row.isEnable == 1 ? "停用" : "启用"
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-flex">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="changePage"
        :total="pagetotol"
        page-size="15"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { getAccountList, changeDouyinAble, uploadFile } from "@/api/douyin";
export default {
  data() {
    return {
      tableData: [],
      filelist: [],
      search:{
        ck:null,
        uid:null,
        current: 1,
        size: 15,
      }
    };
  },
  mounted() {
    this.ajax(this.search);
  },
  methods: {
    async ajax(params) {
      const { data } = await getAccountList({...params});
      console.log("data", data);
      if (data.code === 200) {
        this.tableData = data.data.records;
        this.pagetotol=data.data.total;
      } else {
        this.$message.error("获取数据失败");
      }
    },
    async changeStatus(row) {
      const { data } = await changeDouyinAble({
        id: row.id,
        isEnable: row.isEnable === 1 ? 0 : 1,
      });
      if (data.code === 200) {
        this.ajax();

        this.$message.success("成功");
      } else {
        this.$message.error(data.msg);
      }
    },
    // 文件上传
    uploadSectionFile(file) {
      this.loading = true;
      let fd = new FormData();
      fd.append("file", file.file); //传⽂件
      uploadFile(fd, false).then((res) => {
        if (res.data.code == 200) {
          this.loading = false;
          this.$message.success("上传成功");
        } else {
          this.$message.error("上传失败");
        }
      });
    },
    // 查找
    onSearch(){
        this.search.current=1

        this.ajax(this.search)
    },
    changePage(val) {
        this.search.current=val;
        this.ajax(this.search)
    },
  },
};
</script>