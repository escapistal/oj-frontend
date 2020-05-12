<template>
  <div class="container-fluid">
    <div class="background">
      <div class="row dropright">
        <h4 class=" text-left">Submissions</h4>
        <button type="button" class="btn btn-sm dropdown-toggle dropdown-toggle-split" style="margin-bottom: 3px" data-toggle="collapse" data-target="#collapseFilter" aria-haspopup="true" aria-expanded="false">
        </button>
        <div class="collapse col" id="collapseFilter">
          <div class="row mb-2">
            <div class="d-flex flex-wrap">
              <div class="input-group input-group-sm mr-1" style="width: unset">
                <div class="input-group-prepend">
                  <span class="input-group-text">User</span>
                </div>
                <input type="text" class="form-control h-100" style="max-width: 136px" v-model="uname" @change="handleFilterChange">
              </div>
              <div class="input-group input-group-sm mr-1" style="width: unset">
                <div class="input-group-prepend">
                  <span class="input-group-text">Status</span>
                </div>
                <v-selectpage v-model="status" :data="statusList" :multiple="true" :pagination="false"
                              :key-field="'value'" :show-field="'msg'" @values="handleFilterChange">
                </v-selectpage>
              </div>
              <div class="input-group input-group-sm mr-1" style="width: unset">
                <div class="input-group-prepend">
                <span class="input-group-text">Lang</span>
                </div>
                <v-selectpage v-model="lang" :data="langList" :multiple="true" :pagination="false"
                              @values="handleFilterChange">
                </v-selectpage>
              </div>
              <div class="input-group input-group-sm" style="width: unset">
                <div class="input-group-prepend">
                  <span class="input-group-text">Problem</span>
                </div>
                <v-selectpage v-model="pid" :data="probInfoList" :multiple="true"
                              :tb-columns="cols" :show-field="showInfo" @values="handleFilterChange">
                </v-selectpage>
              </div>
            </div>
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
          <th scope="col">Source</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in submissionList[pageId-1]" :key="item.id">
          <td>{{item.id}}</td>
          <td>{{item.createTime}}</td>
          <td>{{item.user.nickname}}</td>
          <td>
            <router-link :to="'/problem/'+item.problem.id">
              {{item.problem.name+". "+item.problem.title}}
            </router-link>
          </td>
          <td>
            <router-link v-if="item.user.id===curUser.id||$store.getters.isAdmin" :to="'/submission/'+item.id">
              {{item.language}}
            </router-link>
            <span v-else>{{item.language}}</span>
          </td>
          <td>
            <router-link v-if="item.user.id===curUser.id||$store.getters.isAdmin" :to="'/submission/'+item.id">
              <span class="badge" :class="statusSet[item.status].clazz">{{statusSet[item.status].msg}}</span>
            </router-link>
            <span v-else class="badge" :class="statusSet[item.status].clazz">{{statusSet[item.status].msg}}</span>
          </td>
          <td>{{item.executeTime}}</td>
          <td>{{item.executeMemory}}</td>
          <td>{{item.codeLength}}</td>
          <td v-if="item.problem.contest">
            <router-link :to="'/contest/'+item.problem.contest.id">{{item.problem.contest.title.strip(30)}}</router-link>
          </td>
          <td v-else>题库</td>
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
  import qs from 'qs'

  export default {
    name: "Status",
    components: {
      pagenation,
    },
    data: function () {
      return {
        submissionList:[],
        pageId:1,
        pageSize:50,
        pageTotal:0,
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
        },
        statusList_bak:[
          'All',
          'Accepted',
          'Wrong Answer',
          'Time Limit Exceed',
          'Memory Limit Exceed',
          'Runtime Error',
          'Presentation Error',
          'Compile Error',
          'System Error',
          'Pending',
          'Judging'
        ],
        langList:[
          {id:'C',name:'C'},
          {id:'C++',name:'C++'},
          {id:'Java',name:'Java'},
          {id:'Python 2',name:'Python 2'},
          {id:'Python 3',name:'Python 3'}
        ],
        refreshTimeout:undefined,
        uid:undefined,
        uname:'',
        pid:'',
        status:'',
        lang:'',
        probInfoList:[],
        cols:[
          { title: 'id',data: 'id' },
          { title: 'name',data: 'name' },
          { title: 'title',data: 'title' }
        ],
        filterTag:undefined
      }
    },
    methods:{
      refresh: async function (depth) {
        await this.showPage(this.pageId, true)
        const that = this
        this.refreshTimeout = setTimeout(function () {
          that.refresh(depth * 1.5)
        }, depth)
      },
      showInfo:function(row){
        return row.id+' '+(row.name?row.name+' ':'')+row.title
      },
      handleFilterChange:function(){
        this.filterTag=Math.floor(Math.random()*1000000);
        this.showPage(1,true)
      },
      showPage:function(pageId,forceUpdate){
        if(pageId=='...')
          return
        if(forceUpdate||!this.submissionList[pageId-1]){
          const prevTag=this.filterTag
          this.$axios.get('/submission/list',{
            params:{
              page: this.pageId - 1,
              size: this.pageSize,
              uid: this.uid,
              uname:this.uname,
              pid:this.pid?this.pid.split(','):undefined,
              status:this.status?this.status.split(','):undefined,
              lang:this.lang?this.lang.split(','):undefined,
            },
            paramsSerializer: params => {
              return qs.stringify(params, { indices: false })
            }
          }).then(response=>{
            if(prevTag&&this.filterTag!==prevTag)
              return
            if(forceUpdate||response.data.data.totalPages>this.pageTotal) {
              this.pageTotal=response.data.data.totalPages
              this.submissionList = new Array(this.pageTotal)
            }
            this.$set(this.submissionList, pageId - 1, response.data.data.content)
            this.pageId=pageId
          })
        }
        else {
          this.pageId = pageId
        }
      },
      getProbInfoList: async function () {
        const res = await this.$axios.get('/problem/list', {
          params: {
            page: 0,
            size: 1000,
            checkVisible: true
          }
        })
        this.probInfoList = res.data.data.content
      }
    },
    computed:{
      ...mapState([
        // 映射
        'curUser'
      ])
    },
    beforeRouteEnter: function (to,from,next) {
      next(async vm => {
        if(vm.$route.params&&vm.$route.params.uname!==undefined)
          vm.uname = vm.$route.params.uname
        if(vm.$route.params&&vm.$route.params.pid!==undefined)
          vm.pid=vm.$route.params.pid
        await vm.getProbInfoList()
        vm.refresh(3000)
      })
    },
    beforeRouteUpdate: async function (to,from,next) {
      if(to.params&&to.params.uname!==undefined)
        this.uname = to.params.uname
      if(to.params&&to.params.pid!==undefined)
        this.pid=to.params.pid
      if(this.refreshTimeout)
        clearTimeout(this.refreshTimeout)
      await this.getProbInfoList()
      this.refresh(3000)
      next()
    },
    beforeRouteLeave:function (to,from,next) {
      if(this.refreshTimeout)
        clearTimeout(this.refreshTimeout)
      next()
    }

  }
</script>

<style scoped>

</style>