//引入相关文件
import Vue from 'vue'
import Vuex from 'vuex'

//在这里使用use use必须放在new vue之前(实例创建之前)
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        count: 0
    },
    mutations: {
        increment(state) {
            state.count++
        }
    }
})