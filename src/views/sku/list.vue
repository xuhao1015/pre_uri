<template>
  <div>
    <h1>sku管理</h1>
    <el-table
      :data="tableData"
      border
      :row-key="tableData.id"
      style="width: 100%"
      fit="true"
    >
      <el-table-column fixed prop="appStoreVo" label="appStoreVo" width="250">
      </el-table-column>
      <el-table-column prop="config" label="config" width="400">
      </el-table-column>
      <el-table-column prop="groupNum" label="groupNum"> </el-table-column>
      <el-table-column prop="id" label="id"> </el-table-column>
      <el-table-column prop="mark" label="mark"> </el-table-column>
      <el-table-column prop="skuId" label="skuId" width="120">
      </el-table-column>
      <el-table-column prop="skuName" label="skuName" width="120">
      </el-table-column>
      <el-table-column prop="skuPrice" label="skuPrice" width="120">
      </el-table-column>
      <el-table-column prop="url" label="url" width="400"> </el-table-column>
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
import { searchskuList } from "../../api/ajax";
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
      searchskuList({ current: 1, size: 5 }).then(res => {
        console.log(res);
        this.tableData = res.data.data.records;
        this.pagetotol = res.data.data.total;
      });
    },
    changePage(val) {
      //   console.log(val);
      searchskuList({ current: val }).then(res => {
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
