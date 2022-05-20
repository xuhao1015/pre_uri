<template>
  <div>
    <h1>代理管理</h1>
    <el-table
      :data="tableData"
      border
      :row-key="tableData.id"
      style="width: 100%"
      header-row-class-name="table-header"
    >
      <el-table-column fixed prop="id" label="id"> </el-table-column>
      <el-table-column prop="agentAddress" label="agentAddress" width="400">
      </el-table-column>
      <el-table-column prop="num" label="num"> </el-table-column>
      <el-table-column prop="expirationTime" label="expirationTime">
      </el-table-column>
      <el-table-column prop="isProduct" label="isProduct"> </el-table-column>

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
import { getdaili } from "../../api/ajax";
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
      getdaili({ current: 1, size: 5 }).then(res => {
        // console.log("daili", res);
        this.tableData = res.data.data.records;
        this.pagetotol = res.data.data.total;
      });
    },
    changePage(val) {
      //   console.log(val);
      getdaili({ current: val, size: 5 }).then(res => {
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
.table-header {
  background-color: pink;
}
</style>
