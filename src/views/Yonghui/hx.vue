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
    <el-date-picker
      v-model="search.date"
      type="datetimerange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
    >
    </el-date-picker>
    
    <el-input
      style="width: 25%; margin-bottom: 20px; margin-left: 20px"
      v-model="search.hxphone"
      placeholder="请输入hexiaoPhone"
    ></el-input>
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
      <el-table-column prop="batchNum" label="批号"> </el-table-column>
      <el-table-column prop="fileName" label="文件名"> </el-table-column>
      <el-table-column prop="createTime" label="创建时间"> </el-table-column>
      <el-table-column prop="updateTime" label="更新时间"> </el-table-column>
      <el-table-column prop="isEnable" label="是否启用">
        <template slot-scope="{ row }">
          <span>{{ row.isEnable == 1 ? "启用" : "停用" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="hexiaoPhoneStart" label="核销开始">
      </el-table-column>

      <el-table-column
        prop="hexiaoPhoneEnd"
        label="核销结束"
        show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column prop="hexiaoPhone" label="核销电话"></el-table-column>
      <el-table-column prop="hexiaoName" label="核销名字"></el-table-column>

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
import { getAccountList, changeDouyinAble, uploadFile } from "@/api/yonghui";
export default {
  data() {
    return {
      tableData: [],
      filelist: [],
      search: {
        date: null,
        current: 1,
        size: 15,
        hxphone:null
      },
    };
  },
  mounted() {
    this.ajax(this.search);
  },
  methods: {
    async ajax(params) {
      const { data } = await getAccountList({ ...params });
      if (data.code === 200) {
        this.tableData = data.data.records;
        this.pagetotol = data.data.total;
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
    onSearch() {
      this.search.current = 1;
      console.log(this.search);
      let hexiaoPhoneStart;
      let hexiaoPhoneEnd;
      if (this.search.date) {
        hexiaoPhoneStart= this.formatDate(
          this.search.date[0],
          "yyyy-MM-dd HH:mm:ss"
        ),
        hexiaoPhoneEnd= this.formatDate(
          this.search.date[1],
          "yyyy-MM-dd HH:mm:ss"
        );
      }
      delete this.search.date
      this.ajax({
        hexiaoPhoneStart,
        hexiaoPhoneEnd,
        current: this.search.current,
        size: this.search.size,
        hexiaoPhone:this.search.hxphone
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
    changePage(val) {
      this.search.current = val;
      this.ajax(this.search);
    },
  },
};
</script>