<template>
  <div class="container">
    <div class="background">
      <table class="table table-hover text-left">
        <thead>
        <th>#</th>
        <th>Title</th>
        <th>Limit</th>
        <th>AC/Submission</th>
        <th>AC Rate</th>
        </thead>
        <tbody>
        <tr v-for="(item,index) in problems" :key="item.id" @click="$router.push('/contest/'+contest.id+'/problem/'+item.id)">
          <td class="text-left" style="width: 10%;">
            {{item.name}}
          </td>
          <td class="text-left" style="width: 50%;">
            {{item.title}}
          </td>
          <td class="text-left">
            <small class="text-muted">{{timeAndMemoryLabel(index)}}</small>
          </td>
          <td class="text-left" style="vertical-align:center !important;">{{item.acceptedNumberLocked}}/{{item.submissionNumberLocked}}</td>
          <td class="text-left" style="vertical-align:center !important;">{{rate(item.acceptedNumberLocked,item.submissionNumberLocked)}}</td>
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
        // problems:[]
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
        let ttag='',mtag=''
        for(let i=0;i<a.length;i++) {
          if (a[i].time_factor != 1)
            ttag = '*'
          if(a[i].memory_factor !=1)
            mtag = '*'
        }
        return t+'s'+ttag+', '+m+'MB'+mtag
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
          await vm.$store.dispatch('loadContestProblems',{id:vm.$route.params.id})
        }
      )
    },
    beforeRouteUpdate: async function (to,from,next) {
      await this.$store.dispatch('loadContestProblems',{id:to.params.id})
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