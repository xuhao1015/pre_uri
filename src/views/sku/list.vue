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
      <!-- <el-table-column fixed prop="appStoreVo" label="appStoreVo" width="250">
      </el-table-column> -->
      <!-- <el-table-column prop="config" label="config" width="400">
      </el-table-column> -->
      <el-table-column prop="groupNum" label="groupNum"> </el-table-column>
      <el-table-column prop="id" label="id"> </el-table-column>
      <el-table-column prop="mark" label="mark"> </el-table-column>
      <el-table-column prop="skuId" label="商品编码"> </el-table-column>
      <el-table-column prop="skuName" label="商品名称"> </el-table-column>
      <el-table-column prop="skuPrice" label="商品价格"> </el-table-column>
      <el-table-column prop="expireTime" label="订单支付过期时间">
      </el-table-column>
      <el-table-column prop="payIdExpireTime" label="库存订单过期时间">
      </el-table-column>
      <el-table-column prop="productStockNum" label="库存（x/次）">
      </el-table-column>
      <el-table-column prop="isProduct" label="是否生产">
        <!-- <template slot-scope="scope">
         {scope==1?'生产':'不生产'}
        </template> -->
      </el-table-column>
      <!-- <el-table-column prop="url" label="url" width="400"> </el-table-column> -->
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button
            @click="handleClick(scope.row.skuId)"
            type="text"
            size="small"
            >增加库存</el-button
          >
          <!-- <el-button type="text" size="small">编辑</el-button> -->
        </template>
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
import { searchskuList, addskuid } from "../../api/ajax";
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
    },
    handleClick(skuId) {
      addskuid({ skuId: skuId }).then(res => {
        console.log(res);
        const h = this.$createElement;
        this.$notify({
          title: "库存添加",
          message: h("i", { style: "color: teal" }, "添加成功")
        });
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
