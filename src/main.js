/*
 * @Author: your name
 * @Date: 2022-03-22 16:20:31
 * @LastEditTime: 2022-03-24 15:05:28
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \pre-ui\src\main.js
 */
import Vue from "vue";

import Cookies from "js-cookie";

import "normalize.css/normalize.css"; // A modern alternative to CSS resets

import Element from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

import "@/styles/index.scss"; // global css

import App from "./App";
import store from "./store";
import router from "./router";

// import i18n from './lang' // Internationalization
import "./icons"; // icon
import "./errorLog"; // error log
import "./permission"; // permission control

import * as filters from "./filters"; // global filters

Vue.use(Element, {
  size: Cookies.get("size") || "medium" // set element-ui default size
  // i18n: (key, value) => i18n.t(key, value)
});
const dayjs = require("dayjs");
Vue.prototype.dayjs=dayjs;
// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

Vue.config.productionTip = false;
function formatDate(date, fmt) {
  date = new Date(date);
  if (typeof fmt === "undefined") {
    fmt = "yyyy-MM-dd HH:mm:ss";
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  let o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "H+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + "";
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : ("00" + str).substr(str.length)
      );
    }
  }
  return fmt;
}

//定义一个时间过滤器
Vue.filter("FormatDate", function(date, fmt) {
  return formatDate(date, fmt);
});
new Vue({
  el: "#app",
  router,
  store,
  // i18n,
  render: h => h(App)
});
