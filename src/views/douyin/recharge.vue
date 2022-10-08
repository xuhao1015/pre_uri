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
      v-model="search.rechargePhone"
      placeholder="请输入rechargePhone"
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
      <el-table-column prop="rechargePhone" label="充值手机号">
      </el-table-column>
      <el-table-column prop="batchNum" label="批号"> </el-table-column>
      <el-table-column prop="isEnable" label="是否启用">
        <template slot-scope="{ row }">
          <span>{{ row.isEnable == 1 ? "启用" : "停用" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="充值状态">
        <template slot-scope="{ row }">
          <span>{{ getOrderStatus(row.orderStatus) }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="createTime" label="创建时间">
      </el-table-column>
      <el-table-column prop="price" label="价格"></el-table-column>
      <el-table-column prop="successTime" label="充值成功时间">
      </el-table-column>
      <el-table-column label="操作" width="140px" align="center">
        <template slot-scope="{ row }">
          <el-button type="primary" @click="del(row)"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-flex">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="changePage"
        :total="pagetotol"
        page-size="10"
      >
      </el-pagination>
    </div>
  </div>
</template>
  <script>
import { getAccountList, changeDouyinAble, uploadFile } from "@/api/recharge";
export default {
  data() {
    return {
      tableData: [],
      filelist: [],
      search: {
        ck: null,
        rechargePhone: null,
        current: 1,
        size: 10,
      },
    };
  },
  mounted() {
    this.ajax(this.search);
  },
  methods: {
    async ajax(params) {
      const { data } = await getAccountList({ ...params });
      console.log("data", data);
      if (data.code === 200) {
        this.tableData = data.data.records;
        this.pagetotol = data.data.total;
      } else {
        this.$message.error("获取数据失败");
      }
    },
    del(row) {
      this.$confirm("此操作将删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const { data } = await changeDouyinAble({
          id: row.id,
        });
        if (data.code === 200) {
          this.ajax();
          this.$message.success("成功");
        } else {
          this.$message.error(data.msg);
        }
      });
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
          this.ajax(this.search);
        } else {
          this.$message.error("上传失败");
        }
      });
    },
    // 查找
    onSearch() {
        this.search.current=1
      this.ajax(this.search);
    },
    changePage(val) {
      this.search.current = val;
      this.ajax(this.search);
    },
    getOrderStatus(id) {
      const status = ["还未充值", "充值中", "充值完成", "充值失败"];
      return status[id];
    },
  },
};
</script>