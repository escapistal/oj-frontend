import Vue from 'vue'
import Vuex from 'vuex'
// import axios from '../plugins/axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token:undefined,
    curUser:undefined,
    problemPageId:1,
    contestPageId:1,
    contest:{
      createUser:{},
      updateUser:{},
      startTime:undefined,
      endTime:undefined,
      lockTime:undefined
    },
    contestProblems:[],
    contestProblem:{
      createUser:{},
      updateUser:{}
    }
  },
  getters: {
    // doneTodos: state => {
    //   return state.todos.filter(todo => todo.done)
    // }
  },
  mutations: {
    login(state,data){
      state.token=data.token
      delete data.token
      state.curUser=data
    },
    logout(state){
      state.token=undefined
      state.curUser=undefined
      state.contestProblems=[]
    },
    changeProblemPageId(state,data){
      state.problemPageId=data
    },
    changeContestPageId(state,data){
      state.contestPageId=data
    },
    setContest(state,data){
      state.contest=data
    },
    setContestProblems(state,data){
      state.contestProblems=data
    },
    setContestProblem(state,data){
      state.contestProblem=data
    }
  },
  actions: {
    loadContest:async function({dispatch,commit,state},payload){
      if(payload.id===state.contest.id)
        return
      let res = await Vue.prototype.$axios.get('/contest/' + payload.id, {})
      if(res.data.status==0)
        commit('setContest', res.data.data)
      else
        Vue.prototype.$toastr.warning(res.data.msg)
    },
    loadContestProblems:async function({dispatch,commit,state},payload){
      if(payload.id&&payload.id!==state.contest.id)
        await dispatch('loadContest', {id: payload.id})
      if(state.contestProblems.length&&state.contestProblems[0].contest.id===payload.id)
        return
      let res = await Vue.prototype.$axios.get('/contestProblem/list/' + payload.id, {})
      if(res.data.status==0)
        commit('setContestProblems', res.data.data)
      else
        Vue.prototype.$toastr.warning(res.data.msg)
    },
    loadContestProblem:async function({dispatch,commit,state},payload){
      let res = await Vue.prototype.$axios.get('/contestProblem/' + payload.id,{})
      if(res.data.status==0) {
        commit('setContestProblem', res.data.data)
        if(res.data.data.contest.id!=state.contest.id)
          await dispatch('loadContest', {id: res.data.data.contest.id})
      }
      else
        Vue.prototype.$toastr.warning(res.data.msg)
    }
  },
  modules: {
  }
})
