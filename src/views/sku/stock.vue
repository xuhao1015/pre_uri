<template>
  <!-- // stock -->
  <div>
    <h1>后台库存</h1>
    <el-table
      :data="tableData"
      border
      :row-key="tableData.id"
      style="width: 100%"
      fit="true"
    >
      <el-table-column fixed prop="skuName" label="商品名称"> </el-table-column>
      <el-table-column prop="skuId" label="商品sku"> </el-table-column>
      <el-table-column prop="stock" label="已有库存"> </el-table-column>
       <el-table-column prop="realTimeStock" label="真实有效库存"> </el-table-column>
        <el-table-column prop="lockStock" label="锁定库存"> </el-table-column>
         <el-table-column prop="surplusStock" label="能匹配库存"> </el-table-column>
      <el-table-column prop="productStock" label="正在生产数量" width="120">
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
import { getstock } from "../../api/ajax";
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
      getstock().then(res => {
        console.log("getstock", res);
        this.tableData = res.data.data.records;
        this.pagetotol = res.data.data.total;
      });
    },
    changePage(val) {
      getstock().then(res => {
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
