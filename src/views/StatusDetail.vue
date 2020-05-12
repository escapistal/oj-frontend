<template>
  <div class="container-fluid">
    <div class="background text-left">
      <div class="row">
        <h4>Submission #{{submission.id}}</h4>
          <button type="button" class="btn btn-light rounded border ml-auto"
                                                 @click="$router.back()">
            <img class="icon" src="@/assets/training.png">Back
          </button>
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
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>{{submission.id}}</td>
          <td>{{submission.createTime}}</td>
          <td>{{submission.user.nickname+'/'+submission.user.realname}}</td>
          <td>
            <router-link :to="'/problem/'+submission.problem.id">
              {{submission.problem.name+". "+submission.problem.title}}
            </router-link>
          </td>
          <td>{{submission.language}}</td>
          <td>
            <span class="badge" :class="statusSet[submission.status].clazz">{{statusSet[submission.status].msg}}</span>
          </td>
          <td>{{submission.executeTime}}</td>
          <td>{{submission.executeMemory}}</td>
          <td>{{submission.codeLength}}</td>
        </tr>
        </tbody>
      </table>
      <h4>Source</h4>
      <pre ref="code" class="prettyprint text-left">{{submission.code}}</pre>
      <h4>Detail</h4>
      <div class="row">
        <div class="col" v-for="(list,listindex) in detailList">
          <table class="table table-sm text-center" style="margin-top: 3px">
            <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Verdict</th>
              <th scope="col">Time</th>
              <th scope="col">Memory</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in list">
              <td>{{index+1+detailOffset(listindex)}}</td>
              <td>
                <span class="badge" :class="statusSet[item.result].clazz">{{statusSet[item.result].msg}}</span>
              </td>
              <td>{{item.execTime}}</td>
              <td>{{item.execMemory}}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from "vuex";
  const prettyPrint = require('code-prettify');
  require('code-prettify/src/prettify.css');
  export default {
    name: "StatusDetail",
    data: function () {
      return {
        submission: {
          user: {},
          problem: {},
          status: "SE",
        },
        statusSet: {
          'AC': {msg: 'Accepted', clazz: {'badge-success': true}},
          'WA': {msg: 'Wrong Answer', clazz: {'badge-danger': true}},
          'TLE': {msg: 'Time Limit Exceed', clazz: {'badge-danger': true}},
          'MLE': {msg: 'Memory Limit Exceed', clazz: {'badge-danger': true}},
          'RE': {msg: 'Runtime Error', clazz: {'badge-danger': true}},
          'PE': {msg: 'Presentation Error', clazz: {'badge-warning': true}},
          'CE': {msg: 'Compile Error', clazz: {'badge-danger': true}},
          'SE': {msg: 'System Error', clazz: {'badge-dark': true}},
          'PENDING': {msg: 'Pending', clazz: {'badge-secondary': true}},
          'JUDGING': {msg: 'Judging', clazz: {'badge-info': true}}
        },
      }
    },
    methods: {
      detailLength:function (index){
        const all=this.submission.detail.length
        const len=Math.floor(all/this.listCnt)
        const r=all%this.listCnt
        return len+(index<r?1:0)
      },
      detailOffset:function (index) {
        let res=0
        for(let i=0;i<index;i++)
          res+=this.detailLength(i)
        return res
      },
    },
    computed: {
      listCnt:function(){
        if(!this.submission||!this.submission.detail)
          return 1
        const all=this.submission.detail.length
        return Math.min(4,Math.max(1,all))
      },
      detailList:function () {
        if(!this.submission||!this.submission.detail)
          return []
        let res=[],cnt=0
        for(let i=0;i<this.listCnt;i++) {
          const add=this.detailLength(i)
          res.push(this.submission.detail.slice(cnt,cnt+add))
          cnt+=add
        }
        return res
      },
      ...mapState([
        // 映射
        'curUser', 'contest', 'contestProblems'
      ])
    },
    beforeRouteEnter: function (to, from, next) {
      next(async vm => {
        const res = await vm.$axios.get('/submission/' + vm.$route.params.sid, {})
        if (res.data.status == 0) {
          vm.submission = res.data.data
          setTimeout(function () {
            prettyPrint.prettyPrint();
          }, 0)
        } else
          vm.$toastr.warning(res.data.msg)
      })
    },
    beforeRouteUpdate: async function (to, from, next) {
      const res = await this.$axios.get('/submission/' + to.params.sid, {})
      if (res.data.status == 0) {
        this.$refs.code.classList.remove("prettyprinted")
        this.submission = res.data.data
        this.$refs.code.innerText = res.data.data.code
        setTimeout(function () {
          prettyPrint.prettyPrint();
        }, 0)
      } else
        this.$toastr.warning(res.data.msg)
      next()
    }
  }
</script>

<style scoped>

</style>