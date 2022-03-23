<template>
  <div>
    <h1>ck</h1>
    <!-- <input type="file" id="txt" @change="uploadfile()" /> -->
    <el-upload
      :multiple="false"
      :show-file-list="false"
      action="fakeAction"
      drag
      :headers="headers"
      :http-request="uploadSectionFile"
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">Drag或<em>点击上传</em></div>
    </el-upload>
    <el-input
      style="width:25%;margin-bottom:20px;margin-left:20px"
      v-model="input"
      placeholder="请输入pt"
    ></el-input
    ><el-button style="margin-left:20px" type="primary" @click="onSearch"
      >查找</el-button
    >
    <el-table
      :data="tableData"
      border
      :row-key="tableData.id"
      style="width: 100%"
    >
      <el-table-column fixed prop="id" label="id" width="50"> </el-table-column>
      <el-table-column prop="ck" label="ck" width="400"> </el-table-column>
      <el-table-column prop="createTime" label="createTime" width="120">
      </el-table-column>
      <el-table-column prop="fileName" label="fileName" width="120">
      </el-table-column>
      <el-table-column prop="isEnable" label="isEnable" width="40">
      </el-table-column>
      <el-table-column prop="ptPin" label="ptPin" width="120">
      </el-table-column>
      <el-table-column prop="updateTime" label="updateTime" width="120">
      </el-table-column>
      <el-table-column prop="useTimes" label="useTimes" width="120">
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
import axios from "axios";
import { getckList, searchCkList } from "../../api/ajax";
// axios.defaults.baseURL = '192.168.2.149:8081'; //  请求服务器具体的地址
axios.defaults.headers["Content-Type"] = "application/json;charset=utf-8";
axios.defaults.withCredentials = true; //  在跨域中允许携带凭证
export default {
  methods: {
    handleClick(row) {
      //   console.log(row);
    },
    ajax() {
      getckList({ current: 1 }).then(res => {
        // console.log(res.data.data.records);
        this.tableData = res.data.data.records;
      });
    },
    // 根据pt那啥查询
    onSearch() {
      let params = this.input;
      //   console.log("search", params);
      searchCkList({ ptPin: "pt_pin=jd_JSwOTgjqxAcT" }).then(res => {
        // console.log(res);
        this.tableData = res.data.data.records;
      });
    },
    changePage(val) {
      //   console.log(val);
      searchCkList({ current: val }).then(res => {
        // console.log(res);
        this.tableData = res.data.data.records;
      });
    },
    uploadfile() {
      let dom = document.querySelector("#txt");
      console.log(dom);
      var file = dom.files[0]; //判断上传文件是不是txt格式,判断后缀是不是.txt

      if (file.name.substr(-4).toLocaleLowerCase() != ".txt") {
        alert("请上传格式为txt的文件！");

        windows.location = "test.jsp"; //重新定位到上传txt文件页面
      } //如果上传文件是txt文件，则显示文件的预览
      else {
        var reader = new FileReader();

        reader.readAsText(file, "utf-8"); //reader.readAsDataURL(file);

        reader.onload = function(evt) {
          var data = evt.target.result;
          console.log("data", evt.target);
          document.querySelector("#textarea_id").val(data);
        };
      }
    },
    // submitTxt() {
    //   console.log("process.env.BASE_API", process.env.BASE_API);
    //   let dom = document.querySelector("#fileform");
    //   dom.setAttribute("action", "http://505442n6n0.zicp.vip/ck/ckUpload");
    //   dom.submit();
    // },
    uploadSectionFile(form) {
      console.log(form);
      axios("/ck/ckUpload", form, {
        headers: { "content-type": "multipart/form-data" }
      }).then(res => {
        console.log("uploadSectionFile", res);
      });
    }
  },
  mounted() {
    this.ajax();
  },
  data() {
    return {
      tableData: [],
      input: "",
      headers: { "content-type": "multipart/form-data" }
    };
  }
};
</script>
