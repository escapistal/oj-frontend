<template>
  <div class="container">
    <div class="background">
      <div class="row dropright">
        <h4 class="text-left">Submissions</h4>
        <div class="col">
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">User</span>
            </div>
            <input type="text" class="form-control" v-model="uname" @change="handleFilterChange">
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
        <tbody>
        <tr v-for="item in submissionList[pageId-1]" :key="item.id">
          <td>{{item.id}}</td>
          <td>{{item.createTime}}</td>
          <td>{{item.user.nickname+'/'+item.user.realname}}</td>
          <td>
            <router-link :to="'/contest/'+contest.id+'/problem/'+item.problem.id">
              {{item.problem.name+". "+item.problem.title}}
            </router-link>
          </td>
          <td>{{item.language}}</td>
          <td>
            <span v-if="item.status==='PENDING'" class="badge badge-secondary">Pending</span>
            <span v-else-if="item.status==='JUDGING'" class="badge badge-info">Judging</span>
            <span v-else-if="item.status==='AC'" class="badge badge-success">Accepted</span>
            <span v-else-if="item.status==='WA'" class="badge badge-danger">Wrong Answer</span>
            <span v-else-if="item.status==='TLE'" class="badge badge-danger">Time Limit Exceed</span>
            <span v-else-if="item.status==='MLE'" class="badge badge-danger">Memory Limit Exceed</span>
            <span v-else-if="item.status==='RE'" class="badge badge-danger">Runtime Error</span>
            <span v-else-if="item.status==='PE'" class="badge badge-warning">Presentation Error</span>
            <span v-else class="badge badge-dark">System Error</span>
          </td>
          <td>{{item.executeTime}}</td>
          <td>{{item.executeMemory}}</td>
          <td>{{item.codeLength}}</td>
<!--          <td v-if="item.problem.contest">-->
<!--            <router-link :to="'/contest/'+item.problem.contest.id">{{item.problem.contest.title.strip(30)}}</router-link>-->
<!--          </td>-->
<!--          <td v-else>题库</td>-->
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
        // langList:[
        //   'All',
        //   'C',
        //   'C++',
        //   'Java',
        //   'Python 2',
        //   'Python 3'
        // ]
      }
    },
    created: async function () {
      if(this.$route.params.id)
        this.cid=this.$route.params.id
      else{
        this.$toastr.warning('比赛id不能为空')
        return
      }
      await this.$store.dispatch('loadContestProblems',{id:this.$route.params.id})
      if(this.$route.params.uname) {
        this.uname = this.$route.params.uname
      }
      if(this.$route.params.pid) {
        this.pid = this.$route.params.pid
      }
      this.$axios.get('/contestSubmission/list',{
        params:{
          page: this.pageId - 1,
          size: this.pageSize,
          cid:this.cid,
          uid:this.uid,
          uname:this.uname,
          pid:this.pid,
          status:this.status,
          lang:this.lang
        }
      }).then(response=>{
        this.pageTotal=response.data.data.totalPages
        if(this.pageTotal>0) {
          this.submissionList = new Array(this.pageTotal)
          this.submissionList[0] = (response.data.data.content);
        }
        this.refresh(3000)
      })
    },
    methods:{
      refresh:function(depth){
        console.log(depth)
        if(this.$route.name!=='ContestStatus'||depth>=30*60*1000)
          return
        if(!this.refreshing)
          this.showPage(this.pageId,true)
        const that = this
        setTimeout(function () {
          that.refresh(depth*1.5)
        }, depth)
      },
      handleFilterChange:function(){
        this.showPage(this.pageId,true)
      },
      showPage:function(pageId,forceUpdate){
        if(pageId==='...'||pageId<1||pageId>this.pageTotal)
          return
        if(forceUpdate||!this.contestList[pageId-1]){
          this.refreshing=true
          this.$axios.get('/contestSubmission/list',{
            params:{
              page: this.pageId - 1,
              size: this.pageSize,
              cid:this.cid,
              uid:this.uid,
              uname:this.uname,
              pid:this.pid,
              status:this.status,
              lang:this.lang
            }
          }).then(response=>{
            this.refreshing=false
            console.log(response)
            if(response.data.data.totalPages>this.pageTotal) {
              this.pageTotal = response.data.data.totalPages
              this.submissionList = new Array(this.pageTotal)
            }
            this.$set(this.submissionList,pageId-1,response.data.data.content)
            this.pageId=pageId
          })
        }
        else {
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
    }
  }
</script>

<style scoped>

</style>