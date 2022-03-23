<template>
  <div>
    <h1>sku</h1>
    <el-table
      :data="tableData"
      border
      :row-key="tableData.id"
      style="width: 100%"
    >
      <el-table-column fixed prop="appStoreVo" label="appStoreVo" width="50">
      </el-table-column>
      <el-table-column prop="config" label="config" width="400">
      </el-table-column>
      <el-table-column prop="groupNum" label="groupNum" width="120">
      </el-table-column>
      <el-table-column prop="id" label="id" width="120"> </el-table-column>
      <el-table-column prop="mark" label="mark" width="40"> </el-table-column>
      <el-table-column prop="skuId" label="skuId" width="120">
      </el-table-column>
      <el-table-column prop="skuName" label="skuName" width="120">
      </el-table-column>
      <el-table-column prop="skuPrice" label="skuPrice" width="120">
      </el-table-column>
      <el-table-column prop="url" label="url" width="120"> </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small"
            >查看</el-button
          >
          <el-button type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      @current-change="changePage"
      :total="1000"
    >
    </el-pagination>
  </div>
</template>

<script>
import { searchskuList } from "../../api/ajax";
export default {
  data() {
    return {
      tableData: []
    };
  },
  mounted() {
    this.ajax();
  },
  methods: {
    ajax() {
      searchskuList({ current: 1, pageSize: 5 }).then(res => {
        console.log(res);
        this.tableData = res.data.data.records;
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
