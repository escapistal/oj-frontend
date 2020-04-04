<template>
  <div class="container-fluid">
    <div class="background text-left">
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
            <router-link :to="'/contest/'+contest.id+'/problem/'+submission.problem.id">
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
    </div>
  </div>
</template>

<script>
  import {mapState} from "vuex";
  const prettyPrint = require('code-prettify');
  require('code-prettify/src/prettify.css');
  export default {
    name: "ContestStatusDetail",
    data:function () {
      return {
        submission:{
          user:{},
          problem:{},
          status:"SE",
        },
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

    },
    computed:{

      ...mapState([
        // 映射
        'curUser','contest','contestProblems'
      ])
    },
    beforeRouteEnter: function (to,from,next) {
      next(async vm => {
        const res=await vm.$axios.get('/contestSubmission/'+vm.$route.params.sid,{})
        if(res.data.status==0) {
          vm.submission = res.data.data
          setTimeout(function() {prettyPrint.prettyPrint();},0)
        }
        else
          vm.$toastr.warning(res.data.msg)
      })
    },
    beforeRouteUpdate: async function (to,from,next) {
      const res=await this.$axios.get('/contestSubmission/'+to.params.sid,{})
      if(res.data.status==0) {
        this.$refs.code.classList.remove("prettyprinted")
        this.submission = res.data.data
        this.$refs.code.innerText=res.data.data.code
        setTimeout(function() {prettyPrint.prettyPrint();},0)
      }
      else
        this.$toastr.warning(res.data.msg)
      next()
    },
    beforeRouteLeave:function (to,from,next) {
      next()
    }
  }
</script>

<style>
  li.L0, li.L1, li.L2, li.L3,
  li.L5, li.L6, li.L7, li.L8 {
    /*list-style-type: decimal !important;*/
    background: unset;
  }
</style>