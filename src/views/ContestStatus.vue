<template>
  <div class="container-fluid">
    <div class="background">
      <div class="row dropright">
        <h4 class="text-left">Submissions</h4>
        <div class="col">
          <div class="input-group">
            <section class="model-7">
              <div class="checkbox">
                <input type="checkbox" style="height: 100%" v-model="mine" @change="handleFilterChange" />
                <label style="top:8px;line-height: 17px;" :class="mine?'text-left':'text-right'">
                  <span :style="mine?'padding-left: 2px;':'padding-right:5px;'">{{mine?' mine':'all'}}</span>
                </label>
              </div></section>
            <div class="input-group-prepend">
              <span class="input-group-text">User</span>
            </div>
            <input type="text" class="form-control" v-model="uname" @change="handleFilterChange" :disabled="mine">
            <div class="input-group-prepend">
              <span class="input-group-text">Problem</span>
            </div>
            <select class="form-control" v-model="pid" @change="handleFilterChange">
              <option value="">All</option>
              <option v-for="item in contestProblems" :value="item.id">{{item.name+'.'+item.title}}</option>
            </select>
            <div class="input-group-prepend">
              <span class="input-group-text">Status</span>
            </div>
            <select class="form-control" v-model="status" @change="handleFilterChange">
              <option value="">All</option>
              <option v-for="item in statusList" :value="item.value">{{item.msg}}</option>
            </select>
            <div class="input-group-prepend">
              <span class="input-group-text">Lang</span>
            </div>
            <select class="form-control" v-model="lang" @change="handleFilterChange">
              <option value="">All</option>
              <option v-for="item in langList">{{item}}</option>
            </select>
          </div>
        </div>
      </div>
      <table class="table table-sm" style="margin-top: 3px">
        <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Submit Time</th>
          <th scope="col">User</th>
          <th scope="col">Problem</th>
          <th scope="col">Lang</th>
          <th scope="col">Verdict</th>
          <th scope="col">Time</th>
          <th scope="col">Memory</th>
          <th scope="col">Code Len</th>
<!--          <th scope="col">Source</th>-->
        </tr>
        </thead>
        <tbody v-if="submissionList[pageId-1]">
        <tr v-for="item in submissionList[pageId-1]" :key="item.id">
          <td>{{item.id}}</td>
          <td>{{item.createTime}}</td>
          <td>{{item.user.nickname+'/'+item.user.realname}}</td>
          <td>
            <router-link :to="'/contest/'+contest.id+'/problem/'+item.problem.id">
              {{item.problem.name+". "+item.problem.title}}
            </router-link>
          </td>
          <td>
            <router-link v-if="item.user.id===curUser.id" :to="'/contest/'+contest.id+'/submission/'+item.id">
              {{item.language}}
            </router-link>
            <span v-else>{{item.language}}</span>
          </td>
          <td>
            <router-link v-if="item.user.id===curUser.id" :to="'/contest/'+contest.id+'/submission/'+item.id">
              <span class="badge" :class="statusSet[item.status].clazz">{{statusSet[item.status].msg}}</span>
            </router-link>
            <span v-else class="badge" :class="statusSet[item.status].clazz">{{statusSet[item.status].msg}}</span>
          </td>
          <td>{{item.executeTime}}</td>
          <td>{{item.executeMemory}}</td>
          <td>{{item.codeLength}}</td>
        </tr>
        </tbody>
      </table>
      <pagenation
              :page-id="pageId"
              :page-size="pageSize"
              :page-total="pageTotal"
              :show-page="showPage"
      ></pagenation>
    </div>
  </div>
</template>

<script>
  import pagenation from "../components/pagenation";
  import {mapState} from "vuex";

  export default {
    name: "ContestStatus",
    components: {
      pagenation,
    },
    data:function () {
      return {
        submissionList:[],
        pageId:1,
        pageSize:50,
        pageTotal:0,
        cid:undefined,
        pid:'',
        uid:'',
        uname:'',
        status:'',
        lang:'',
        refreshing:false,
        refreshTimeout:undefined,
        mine:true,
        statusList:[
          {msg:'Accepted',value:'AC'},
          {msg:'Wrong Answer',value:'WA'},
          {msg:'Time Limit Exceed',value:'TLE'},
          {msg:'Memory Limit Exceed',value:'MLE'},
          {msg:'Runtime Error',value:'RE'},
          {msg:'Presentation Error',value:'PE'},
          {msg:'Compile Error',value:'CE'},
          {msg:'System Error',value:'SE'},
          {msg:'Pending',value:'PENDING'},
          {msg:'Judging',value:'JUDGING'}
        ],
        statusSet:{
          'AC':{msg:'Accepted',clazz:{'badge-success':true}},
          'WA':{msg:'Wrong Answer',clazz:{'badge-danger':true}},
          'TLE':{msg:'Time Limit Exceed',clazz:{'badge-danger':true}},
          'MLE':{msg:'Memory Limit Exceed',clazz:{'badge-danger':true}},
          'RE':{msg:'Runtime Error',clazz:{'badge-danger':true}},
          'PE':{msg:'Presentation Error',clazz:{'badge-warning':true}},
          'CE':{msg:'Compile Error',clazz:{'badge-danger':true}},
          'SE':{msg:'System Error',clazz:{'badge-dark':true}},
          'PENDING':{msg:'Pending',clazz:{'badge-secondary':true}},
          'JUDGING':{msg:'Judging',clazz:{'badge-info':true}}
        }
      }
    },
    methods:{
      refresh: async function (depth) {
        if (!this.refreshing){
          await this.showPage(this.pageId, true)
        }
        const that = this
        this.refreshTimeout = setTimeout(function () {
          that.refresh(depth * 1.5)
        }, depth)
      },
      handleFilterChange:function(){
        if(this.refreshing)
          this.$toastr.warning('你的操作太快啦')
        else
          this.showPage(this.pageId,true)
      },
      showPage: async function (pageId, forceUpdate) {
        if (pageId === '...')
          return
        if (forceUpdate || !this.contestList[pageId - 1]) {
          this.refreshing = true
          await this.$axios.get('/contestSubmission/list', {
            params: {
              page: this.pageId - 1,
              size: this.pageSize,
              cid: this.cid,
              uid: this.mine ? this.curUser.id : undefined,
              uname: this.uname,
              pid: this.pid,
              status: this.status,
              lang: this.lang
            }
          }).then(response => {
            this.refreshing = false
            if (response.data.data.totalPages > this.pageTotal) {
              this.pageTotal = response.data.data.totalPages
              this.submissionList = new Array(this.pageTotal)
            }
            this.$set(this.submissionList, pageId - 1, response.data.data.content)
            this.pageId = pageId
          })
        } else {
          this.pageId = pageId
        }
      }
    },
    computed:{
      langList:function () {
        let set=new Set()
        for(let i=0;i<this.contestProblems.length;i++)
          for(let j=0;j<this.contestProblems[i].allowLanguage.length;j++)
            set.add(this.contestProblems[i].allowLanguage[j].language)
        return Array.from(set)
      },
      ...mapState([
        // 映射
        'curUser','contest','contestProblems'
      ])
    },
    beforeRouteEnter: function (to,from,next) {
      next(async vm => {
        vm.cid=vm.$route.params.id
        await vm.$store.dispatch('loadContestProblems',{id:vm.$route.params.id})
        if(vm.$route.params.mine!==undefined)
          vm.mine = vm.$route.params.mine
        if(vm.$route.params.pid)
          vm.pid = vm.$route.params.pid
        vm.refresh(3000)
      })
    },
    beforeRouteUpdate: async function (to,from,next) {
      this.cid=to.params.id
      await this.$store.dispatch('loadContestProblems',{id:to.params.id})
      if(to.params.mine!==undefined)
        this.mine = to.params.mine
      if(to.params.pid)
        this.pid = to.params.pid
      await this.showPage(this.pageId, true)
      if(this.refreshTimeout)
        clearTimeout(this.refreshTimeout)
      this.refresh(3000)
      next()
    },
    beforeRouteLeave:function (to,from,next) {
      console.log('leave')
      if(this.refreshTimeout)
        clearTimeout(this.refreshTimeout)
      next()
    }
  }
</script>

<style scoped>
  .checkbox {
    position: relative;
    display: inline-block;
    font-size: 13px;
    overflow: hidden;
  }
  .checkbox:after, .checkbox:before {
    /*font-family: FontAwesome;*/
    -webkit-font-feature-settings: normal;
    -moz-font-feature-settings: normal;
    font-feature-settings: normal;
    -webkit-font-kerning: auto;
    -moz-font-kerning: auto;
    font-kerning: auto;
    -webkit-font-language-override: normal;
    -moz-font-language-override: normal;
    font-language-override: normal;
    font-stretch: normal;
    font-style: normal;
    font-synthesis: weight style;
    font-variant: normal;
    font-weight: normal;
    text-rendering: auto;
  }
  .checkbox label {
    width: 55px;
    height: 23px;
    background: #ccc;
    position: relative;
    display: inline-block;
    border-radius: 25px;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }
  .checkbox label:after {
    content: '';
    position: absolute;
    width: 35px;
    height: 27px;
    border-radius: 100%;
    left: 0;
    top: -5px;
    z-index: 2;
    background: #fff;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }
  .checkbox input {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 5;
    opacity: 0;
    cursor: pointer;
  }
  .checkbox input:hover + label:after {
    box-shadow: 0 2px 15px 0 rgba(0, 0, 0, 0.2), 0 3px 8px 0 rgba(0, 0, 0, 0.15);
  }
  .checkbox input:checked + label:after {
    /*content: 'all';*/
    left: 30px;
  }
  .model-7 .checkbox label {
    background: none;
    border: 3px solid #555;
    height: 24px;
  }
  .model-7 .checkbox label:after {
    /*content: 'mine';*/
    background: #555;
    box-shadow: none;
    top: 1px;
    left: 1px;
    width: 16px;
    height: 16px;
  }
  .model-7 .checkbox input:checked + label {

    border-color: #329043;
  }
  .model-7 .checkbox input:checked + label:after {
    background: #3eb454;
    left: 32px;
  }
  /*.model-7 .checkbox:after {*/
  /*  content: '123';*/
  /*  color: #000000;*/
  /*  position: relative;*/
  /*  right: 15px;*/
  /*  bottom: 7px;*/
  /*}*/
  /*.model-7 .checkbox:before {*/
  /*  content: '456';*/
  /*  position: relative;*/
  /*  left: 17px;*/
  /*  bottom: 7px;*/
  /*  color: #000000;*/
  /*  z-index: 1;*/
  /*}*/
</style>