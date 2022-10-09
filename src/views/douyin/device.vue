<template>
  <div>
    <!-- 新增 -->
    <el-button type="text" @click="dialogVisible = true">新增</el-button>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <div>
        <p>请输入deviceId:</p>
        <el-input
          v-model="add.deviceId"
          placeholder="请输入deviceId"
        ></el-input>
      </div>
      <div>
        <p>请输入iid:</p>
        <el-input v-model="add.iid" placeholder="请输入iid" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDecive()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 条件查询 -->
    <el-input
      style="width: 25%; margin-bottom: 20px; margin-left: 20px"
      v-model="search.deviceId"
      placeholder="请输入deviceId"
    ></el-input>
    <el-input
      style="width: 25%; margin-bottom: 20px; margin-left: 20px"
      v-model="search.iid"
      placeholder="请输入iid"
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
      <el-table-column prop="deviceId" label="抖音账号"> </el-table-column>
      <el-table-column prop="iid" label="安装号" show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="isEnable" label="是否启用">
        <template slot-scope="{ row }">
          <span>{{ row.isEnable == 1 ? "启用" : "停用" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="lastSuccessTime"
        label="最后一次成功时间"
      ></el-table-column>

      <el-table-column prop="success" label="成功次数"></el-table-column>

      <el-table-column prop="lastFailTime" label="最后一次失败时间">
      </el-table-column>

      <el-table-column prop="fail" label="失败次数"></el-table-column>

      <el-table-column
        prop="failReason"
        label="失败原因"
        show-overflow-tooltip="true"
      ></el-table-column>

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
        page-size="10"
      >
      </el-pagination>
    </div>
  </div>
</template>
  <script>
import { getAccountList, changeDouyinAble, addDevice } from "@/api/device";
export default {
  data() {
    return {
      tableData: [],
      filelist: [],
      search: {
        iid: null,
        deviceId: null,
        current: 1,
        size: 10,
      },
      add: {
        iid: null,
        deviceId: null,
      },
      dialogVisible: false,
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
    // 查找
    onSearch() {
      this.search.current = 1;
      this.ajax(this.search);
    },
    changePage(val) {
      this.search.current = val;
      this.ajax(this.search);
    },
    async addDecive() {
      const { data } = await addDevice({ ...this.add });
      if (data.code === 200) {
        this.$message.success("新增成功");
        this.dialogVisible = false;
      } else {
        this.$message.error("新增失败");
      }
    },
  },
};
</script>