<!--
 * @Author: your name
 * @Date: 2022-03-23 21:57:23
 * @LastEditTime: 2022-03-23 22:23:03
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \pre-ui\src\views\sku\daili.vue
-->
<template>
  <div>
    <h1>sku</h1>
    <el-table
      :data="tableData"
      border
      :row-key="tableData.id"
      style="width: 100%"
    >
      <el-table-column fixed prop="id" label="id" width="50"> </el-table-column>
      <el-table-column prop="agentAddress" label="agentAddress" width="400">
      </el-table-column>
      <el-table-column prop="ip" label="ip" width="120"> </el-table-column>
      <el-table-column prop="createTime" label="createTime" width="120">
      </el-table-column>
      <el-table-column prop="port" label="port" width="120"> </el-table-column>
      <el-table-column prop="useTime" label="useTime" width="40">
      </el-table-column>
      <el-table-column prop="isUse" label="isUse" width="40"> </el-table-column>
      <el-table-column
        prop="expiration_time"
        label="expiration_time"
        width="40"
      >
      </el-table-column>
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
import { getip } from "../../api/ajax";
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
      getip({ current: 1, pageSize: 5 }).then(res => {
        console.log("usetime", res);
        this.tableData = res.data.data.records;
      });
    },
    changePage(val) {
      //   console.log(val);
      getip({ current: val }).then(res => {
        // console.log(res);
        this.tableData = res.data.data.records;
      });
    }
  }
};
</script>
