<template>
  <div>
    <h1>地址管理</h1>
    <el-table
      :data="tableData"
      border
      :row-key="tableData.id"
      style="width: 100%"
    >
      <el-table-column fixed prop="id" label="id" width="50"> </el-table-column>
      <el-table-column prop="url" label="url" width="400"> </el-table-column>
      <el-table-column prop="tag" label="tag" width="120"> </el-table-column>
      <el-table-column prop="mark" label="mark" width="120"> </el-table-column>
      <el-table-column prop="step" label="step" width="40"> </el-table-column>
      <el-table-column prop="ext" label="ext" width="120"> </el-table-column>
      <el-table-column prop="groupNum" label="groupNum" width="120">
      </el-table-column>
      <el-table-column label="iEnable" width="120">
        <template slot-scope="scope">
          <span>{{
            scope.row.isEnable == "0"
              ? "未启用"
              : scope.row.isEnable == "1"
              ? "启用"
              : "已完成"
          }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small"
            >查看</el-button
          >
          <el-button type="text" size="small">编辑</el-button>
        </template>
      </el-table-column> -->
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
  </div>
</template>

<script>
import { getAddress } from "../../api/ajax";
export default {
  data() {
    return {
      tableData: [],
      pagetotol: ""
    };
  },
  mounted() {
    this.ajax();
  },
  methods: {
    ajax() {
      getAddress({ current: 1, size: 5 }).then(res => {
        // console.log(res);
        this.tableData = res.data.data.records;
        this.pagetotol = res.data.data.total;
      });
    },
    changePage(val) {
      //   console.log(val);
      getAddress({ current: val, size: 5 }).then(res => {
        // console.log(res);
        this.tableData = res.data.data.records;
      });
    }
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
</style>
