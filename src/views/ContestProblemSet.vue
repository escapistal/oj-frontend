<template>
  <div class="container-fluid">
    <div class="background">
      <table class="table table-hover text-left">
        <thead>
        <th>#</th>
        <th>Title</th>
<!--        <th>Limit</th>-->
        <th>AC/Submission</th>
        <th>AC Rate</th>
        </thead>
        <tbody>
        <tr v-for="(item,index) in problems" :key="item.id" @click="$router.push('/contest/'+contest.id+'/problem/'+item.id)">
          <td class="text-left" style="width: 10%;">
            {{item.name}}
          </td>
          <td class="text-left" style="width: 60%;">
            {{item.title}}
            <small class="text-muted" style="float: right">{{timeAndMemoryLabel(index)}}</small>
          </td>
<!--          <td class="text-left">-->
<!--            -->
<!--          </td>-->
          <td class="text-left">{{item.acceptedNumberLocked}}/{{item.submissionNumberLocked}}</td>
          <td class="text-left">{{rate(item.acceptedNumberLocked,item.submissionNumberLocked)}}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import {mapState} from "vuex";

  export default {
    name: "ContestProblemSet",
    data: function () {
      return {
        refreshInterval:undefined
      }
    },
    methods:{
      rate:function (a, b) {
        if (!b)
          return '0%'
        return (a / b*100).toFixed(2)+'%'
      },
        timeAndMemoryLabel:function (id) {
          let t=(this.problems[id].timeLimit/1000).toFixed(1)
          let m=(this.problems[id].memoryLimit).toFixed(0)
          let a=this.problems[id].allowLanguage
          let s=this.problems[id].spj
          let ttag='',mtag=''
        for(let i=0;i<a.length;i++) {
          if (a[i].time_factor != 1)
            ttag = '*'
          if(a[i].memory_factor !=1)
            mtag = '*'
        }
        return (s?'Special Judge, ':'')+t+'s'+ttag+', '+m+'MB'+mtag
      }
    },
    computed:{
      ...mapState({
        // 映射
        curUser:'curUser',
        contest:'contest',
        problems:'contestProblems'
      })
    },
    beforeRouteEnter: function (to,from,next) {
      next(async vm => {
          await vm.$store.dispatch('loadContestProblems',{id:vm.$route.params.id,force:true})
          vm.refreshInterval = setInterval(function () {
            vm.$store.dispatch('loadContestProblems',{id:vm.$route.params.id,force:true})
          },60000)
        }
      )
    },
    beforeRouteUpdate: async function (to,from,next) {
      await this.$store.dispatch('loadContestProblems',{id:to.params.id,force:true})
      this.refreshInterval = setInterval(function () {
        this.$store.dispatch('loadContestProblems',{id:to.params.id,force:true})
      },60000)
      next()
    },
    beforeRouteLeave:function (to,from,next) {
      console.log('leave')
      if(this.refreshInterval)
        clearInterval(this.refreshInterval)
      next()
    }
  }
</script>

<style scoped>
  a{
    color: black;
  }
  tr:hover{
    cursor: pointer;
  }
</style>