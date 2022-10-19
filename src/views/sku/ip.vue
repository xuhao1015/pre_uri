<!--
 * @Author: your name
 * @Date: 2022-03-23 22:08:32
 * @LastEditTime: 2022-03-24 15:19:19
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \pre-ui\src\views\sku\ip.vue
-->
<template>
  <div>
    <h1>IP管理</h1>
    <el-table
      :data="tableData"
      border
      :row-key="tableData.id"
      style="width: 100%"
    >
      <el-table-column fixed prop="id" label="id"> </el-table-column>
      <el-table-column prop="agentAddress" label="agentAddress" width="400">
      </el-table-column>
      <el-table-column prop="ip" label="ip"> </el-table-column>
      <el-table-column label="createTime">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | FormatDate("yyyy-MM-dd") }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="port" label="port"> </el-table-column>
      <el-table-column prop="useTime" label="useTime"> </el-table-column>
      <el-table-column prop="isUse" label="isUse"> </el-table-column>
      <el-table-column label="expirationTime">
        <template slot-scope="scope">
          <span>{{ scope.row.expirationTime | FormatDate("yyyy-MM-dd") }}</span>
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
import { getip } from "../../api/ajax";
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
      getip({ current: 1, size: 5 }).then(res => {
        // console.log("usetime", res);
        this.tableData = res.data.data.records;
        this.pagetotol = res.data.data.total;
        // Math.ceil(res.data.data.totol / 5);
      });
    },
    changePage(val) {
      //   console.log(val);
      getip({ current: val, size: 5 }).then(res => {
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
