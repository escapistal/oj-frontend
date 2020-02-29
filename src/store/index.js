import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token:undefined,
    curUser:undefined
  },
  mutations: {
    login(state,data){
      state.token=data.token
      delete data.token
      state.curUser=data
    }
  },
  actions: {
  },
  modules: {
  }
})
