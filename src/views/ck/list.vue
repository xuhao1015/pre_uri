<template>
  <div>
    <h1>ck上传,必选skuid</h1>
   <div class="updown">
     <span>SKUID:</span>
      <el-select v-model="input_skuid" placeholder="请输入skuid">
      <el-option
        v-for="(item, inde) in options"
        :key="inde"
        :label="item.mz"
        :value="item.skuid"
      >
      </el-option>
    </el-select>

    <el-upload
    class="upload"
      :multiple="true"
      :show-file-list="false"
      action="fakeAction"
      drag
      :headers="headers"
      :file-list="filelist"
      :http-request="uploadSectionFile"
      :before-upload="beforeup"
      :on-change="changeup"
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">Drag或<em>点击上传</em></div>
    </el-upload>
   </div>
    <h1>条件查找</h1>
    <el-input
      style="width: 25%; margin-bottom: 20px; margin-left: 20px"
      v-model="input"
      placeholder="请输入pt"
    ></el-input
    ><el-button style="margin-left: 20px" type="primary" @click="onSearch"
      >查找</el-button
    >
    <el-table
      :data="tableData"
      border
      :row-key="tableData.id"
      style="width: 100%"
    >
      <el-table-column fixed prop="id" label="id" width="50"> </el-table-column>
      <el-table-column prop="ck" label="ck"  show-overflow-tooltip="true" width="100"> </el-table-column>
      <el-table-column label="createTime" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | FormatDate("yyyy-MM-dd HH:mm:ss") }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="fileName" label="fileName" width="120">
      </el-table-column>
      <el-table-column prop="isEnable" label="是否可用(5:生产;1:有效)" width="200"> </el-table-column>
      <el-table-column prop="ptPin" label="jd账号" width="120">
      </el-table-column>
      <!-- <el-table-column label="updateTime" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime | FormatDate("yyyy-MM-dd") }}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="failTime" label="失败次数" width="120">
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
        layout="total,prev, pager, next"
        @current-change="changePage"
        :total="pagetotol"
        page-size="5"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { getckList, searchCkList, uploadFile } from "../../api/ajax";
// axios.defaults.baseURL = '192.168.2.149:8081'; //  请求服务器具体的地址
axios.defaults.headers["Content-Type"] = "application/json;charset=utf-8";
axios.defaults.withCredentials = true; //  在跨域中允许携带凭证
export default {
  methods: {
    handleClick(row) {
      //   console.log(row);
    },
    ajax() {
      getckList({ current: 1, size: 5 }).then((res) => {
        // console.log(res.data.data.records);
        this.tableData = res.data.data.records;
        this.pagetotol = res.data.data.total;
      });
    },
    // 根据pt那啥查询
    onSearch() {
      let params = this.input;
      //   console.log("search", params);
      searchCkList({ ptPin: "pt_pin=jd_JSwOTgjqxAcT" }).then((res) => {
        // console.log(res);
        this.tableData = res.data.data.records;
      });
    },
    changePage(val) {
      //   console.log(val);
      searchCkList({ current: val }).then((res) => {
        // console.log(res);
        this.tableData = res.data.data.records;
      });
    },
    // uploadfile() {
    //   let dom = document.querySelector("#txt");
    //   console.log(dom);
    //   var file = dom.files[0]; //判断上传文件是不是txt格式,判断后缀是不是.txt

    //   if (file.name.substr(-4).toLocaleLowerCase() != ".txt") {
    //     alert("请上传格式为txt的文件！");

    //     windows.location = "test.jsp"; //重新定位到上传txt文件页面
    //   } //如果上传文件是txt文件，则显示文件的预览
    //   else {
    //     var reader = new FileReader();

    //     reader.readAsText(file, "utf-8"); //reader.readAsDataURL(file);

    //     reader.onload = function(evt) {
    //       var data = evt.target.result;
    //       console.log("data", evt.target);
    //       document.querySelector("#textarea_id").val(data);
    //     };
    //   }
    // },
    // submitTxt() {
    //   console.log("process.env.BASE_API", process.env.BASE_API);
    //   let dom = document.querySelector("#fileform");
    //   dom.setAttribute("action", "http://505442n6n0.zicp.vip/ck/ckUpload");
    //   dom.submit();
    // },

    uploadSectionFile(file) {
      console.log("file==", file, this.filelist);
      var that = this;
      let fd = new FormData();
      if (this.input_skuid == "") {
        this.$message.error("skuid必选");
      }else{
        fd.append("file", file.file); //传⽂件
      console.log("aaaa=", fd);
      // fd.append('srid',this.aqForm.srid);//传其他参数
      uploadFile(fd, that.input_skuid).then((res) => {
        console.log("res=", res);
      });
      }
    },
  },
  mounted() {
    this.ajax();
  },
  data() {
    return {
      tableData: [],
      input: "",
      headers: { "content-type": "multipart/form-data" },
      filelist: [],
      pagetotol: "",
      input_skuid: "",
      uploadfile: null,
      options: [
        { mz: "App Store 充值卡 100元", skuid: "11183343342" },
        { mz: "App Store 充值卡 200元", skuid: "11183368356" },
      ],
    };
  },
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
.updown{
  display: flex;
  .upload{
    height: 100px;
  }
}
  ::v-deep .el-upload-dragger{
  height: 125px !important;
}
</style>
