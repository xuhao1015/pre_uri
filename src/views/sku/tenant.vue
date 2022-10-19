<template>
  <!-- // 商户管理 -->
  <div>
    <h1>商户管理</h1>
    <el-table
      :data="tableData"
      border
      :row-key="tableData.id"
      style="width: 100%"
      fit="true"
    >
      <el-table-column fixed prop="id" label="id"> </el-table-column>
      <el-table-column prop="username" label="用户名"> </el-table-column>
      <el-table-column prop="password" label="密码"> </el-table-column>
      <el-table-column label="到期时间">
        <template slot-scope="scope">
          <span>{{ scope.row.expirationTime | FormatDate("yyyy-MM-dd") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否正常使用" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.isEnable == 1 ? "正常使用" : "不能使用" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="tenantName" label="tenantName" width="120">
      </el-table-column>
      <el-table-column prop="urlPre" label="urlPre" width="120">
      </el-table-column>
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
import { getjd_tenant } from "../../api/ajax";
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
      getjd_tenant({ current: 1, size: 5 }).then(res => {
        // console.log("getjd_tenant", res);
        this.tableData = res.data.data.records;
        this.pagetotol = res.data.data.total;
      });
    },
    changePage(val) {
      getjd_tenant({ current: val, size: 5 }).then(res => {
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
