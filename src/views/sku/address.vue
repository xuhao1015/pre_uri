<!--
 * @Author: your name
 * @Date: 2022-03-23 21:42:07
 * @LastEditTime: 2022-03-23 21:55:57
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \pre-ui\src\views\sku\address.vue
-->
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
      <el-table-column prop="group_num" label="group_num" width="120">
      </el-table-column>
      <el-table-column label="is_enable" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.is_enable }}</span>
        </template>
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
import { getAddress } from "../../api/ajax";
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
      getAddress({ current: 1, pageSize: 5 }).then(res => {
        console.log(res);
        this.tableData = res.data.data.records;
      });
    },
    changePage(val) {
      //   console.log(val);
      getAddress({ current: val }).then(res => {
        // console.log(res);
        this.tableData = res.data.data.records;
      });
    }
  }
};
</script>
