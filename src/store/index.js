import Vue from 'vue'
import Vuex from 'vuex'
// import axios from '../plugins/axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token:localStorage.getItem('curToken')?localStorage.getItem('curToken'):undefined,
    curUser:localStorage.getItem('curUser')?JSON.parse(localStorage.getItem('curUser')):{role:[]},
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
      updateUser:{},
      allowLanguage:[]
    },
    annos:[],
    clars:[],
    clar:{
      createUser:{},
      reply:[]
    },
    toolbars:{
      bold: true, // 粗体
      italic: true, // 斜体
      header: true, // 标题
      underline: true, // 下划线
      strikethrough: true, // 中划线
      mark: true, // 标记
      superscript: true, // 上角标
      subscript: true, // 下角标
      quote: true, // 引用
      ol: true, // 有序列表
      ul: true, // 无序列表
      link: true, // 链接
      imagelink: true, // 图片链接
      code: true, // code
      table: true, // 表格
      fullscreen: true, // 全屏编辑
      help: true, // 帮助
      undo: true, // 上一步
      redo: true, // 下一步
      alignleft: true, // 左对齐
      aligncenter: true, // 居中
      alignright: true, // 右对齐
      preview: true, // 预览
    }
  },
  getters: {
    isAdmin: state => {
      return state.curUser.role&&state.curUser.role.indexOf('admin')!=-1
    },
    isLogin: state =>{
      return state.token!==undefined
    }
  },
  mutations: {
    login(state,data){
      state.token=data.token
      delete data.token
      state.curUser=data
      localStorage.setItem('curToken',state.token)
      localStorage.setItem('curUser',JSON.stringify(state.curUser))
    },
    logout(state){
      state.token=undefined
      state.curUser={role:[]}
      state.contestProblems=[]
      localStorage.removeItem('curToken')
      localStorage.removeItem('curUser')
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
    },
    setAnnos(state,data){
      state.annos=data
    },
    setClars(state,data){
      state.clars=data
    },
    setClar(state,data){
      state.clar=data
    },
    setClarRead(state,data){
      for(let i=0;i<state.clars.length;i++)
        if(data===state.clars[i].id) {
          if(state.curUser.role&&state.curUser.role.indexOf('admin')!=-1)
            state.clars[i].readByAdmin = true
          else
            state.clars[i].readByUser = true
          return
        }
    }
  },
  actions: {
    loadContest:async function({dispatch,commit,state},payload){
      if(!payload.id||payload.id==state.contest.id)
        return
      let res = await Vue.prototype.$axios.get('/contest/' + payload.id, {})
      if(res.data.status==0)
        await commit('setContest', res.data.data)
      else
        Vue.prototype.$toastr.warning(res.data.msg)
    },
    loadContestProblems:async function({dispatch,commit,state},payload){
      if(!payload.id||
        !payload.force&&state.contestProblems.length&&state.contestProblems[0].contest.id==payload.id||
        !state.token)
        return
      await dispatch('loadContest', {id: payload.id})
      let res = await Vue.prototype.$axios.get('/contestProblem/list/' + payload.id, {})
      if(res.data.status==0)
        await commit('setContestProblems', res.data.data)
      else {
        await commit('setContestProblems',[])
        Vue.prototype.$toastr.warning(res.data.msg)
      }
    },
    loadContestProblem:async function({dispatch,commit,state},payload){
      if(!payload.id||!state.token)
        return
      let res = await Vue.prototype.$axios.get('/contestProblem/' + payload.id,{})
      if(res.data.status==0) {
        await commit('setContestProblem', res.data.data)
        if(res.data.data.contest.id!=state.contest.id)
          await dispatch('loadContest', {id: res.data.data.contest.id})
      }
      else
        Vue.prototype.$toastr.warning(res.data.msg)
    },
    loadAnnosAndClars:async function({dispatch,commit,state},payload){
      if(!payload.id||!state.token)
        return
      let res1 = await Vue.prototype.$axios.get('/contestAnnouncement/list/'+payload.id,{})
      if(res1.data.status==0)
        await commit('setAnnos',res1.data.data)
      else
        Vue.prototype.$toastr.warning(res1.data.msg)
      let res2 = await Vue.prototype.$axios.get('/clarification/list/'+payload.id,{})
      if(res1.data.status==0)
        await commit('setClars',res2.data.data)
      else
        Vue.prototype.$toastr.warning(res2.data.msg)
    },
    loadClar: async function ({dispatch,commit,state},payload) {
      if(!payload.id||!state.token)
        return
      let res = await Vue.prototype.$axios.get('/clarification/'+payload.id,{})
      if(res.data.status==0) {
        await commit('setClar', res.data.data)
        await commit('setClarRead',payload.id)
      }
      else
        Vue.prototype.$toastr.warning(res.data.msg)
    }
  },
  modules: {
  }
})
