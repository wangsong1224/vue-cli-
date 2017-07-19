// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

//引入Vue相关包
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'

//引入项目文件
import router from './router'
import store from './store'


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
})