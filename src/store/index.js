import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token:undefined,
    curUser:undefined,
    problemPageId:1,
    contestPageId:1
  },
  mutations: {
    login(state,data){
      state.token=data.token
      delete data.token
      state.curUser=data
    },
    changeProblemPageId(state,data){
      state.problemPageId=data
    },
    changeContestPageId(state,data){
      state.contestPageId=data
    }
  },
  actions: {
  },
  modules: {
  }
})
