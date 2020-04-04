<template>
  <div class="container-fluid">
    <div class="background" style="min-height: 600px;">
      <table class="table table-bordered table-sm" style="width: 100%">
        <thead style="width: 100%"><tr>
          <th style="width: 6%;">Rank</th>
          <th style="max-width: 30%">Id</th>
          <th style="width: 8%;">AC</th>
          <th style="width: 6%;">Penalty</th>
          <th v-for="item in problems" :id="item.id">
            <router-link :to="'/contest/'+contest.id+'/problem/'+item.id" style="color: unset">{{item.name}}</router-link>
          </th>
        </tr></thead>
        <tbody>
          <tr v-for="(item,index) in ranks" :id="item.id">
            <td style="padding: 0;line-height: 44px;">{{index+1}}</td>
            <td style="padding: 0;line-height: 44px;">{{item.user.nickname}}</td>
            <td style="padding: 0;line-height: 44px;">{{item.acceptedNumber}}</td>
            <td style="padding: 0;line-height: 44px;">{{(item.totalTime/60-0.5).toFixed(0)}}</td>
            <td v-for="prob in problems" :id="item.id" style="padding: 0;height: 44px; width:62px;" class="align-middle">
<!--              {{item.submissionInfo[prob.id]}}-->
              <div v-if="!item.submissionInfo[prob.id]"></div>
              <div v-else-if="item.submissionInfo[prob.id].ac"
                   :style="{'background-color':item.submissionInfo[prob.id].acTime!==fb[prob.id]?'#60e760':'#1daa1d'}"
                   style="height: 100%;">
                  <p class="align-bottom" style="margin: 0;">+{{item.submissionInfo[prob.id].error>0?item.submissionInfo[prob.id].error:''}}</p>
                  <p style="margin: 0;height:20px;line-height: 20px"><small>
                      {{formatTime(item.submissionInfo[prob.id].acTime)}}
                  </small></p>
              </div>
              <div v-else style="background-color: #e87272;height: 100%;line-height: 44px;">
                -{{item.submissionInfo[prob.id].error>0?item.submissionInfo[prob.id].error:''}}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
<!--      {{ranks}}-->
    </div>
  </div>
</template>

<script>
  import {mapState} from "vuex";

  export default {
    name: "ContestRank",
    data:function () {
      return {
        ranks:[],
        fb:{},
        refreshInterval:undefined
      }
    },
    methods:{
      formatTime:function (msec) {
        let day = parseInt(msec / 60 / 60 / 24)
        let hr = parseInt(msec / 60 / 60 % 24)
        let min = parseInt(msec / 60 % 60)
        let sec = parseInt(msec % 60)
        return (day?day+":":"")+(hr > 9 ? hr : '0' + hr)+':'+(min > 9 ? min : '0' + min)+':'+(sec > 9 ? sec : '0' + sec)
      },
      refresh: async function(){
        await this.$store.dispatch('loadContestProblems',{id:this.$route.params.id})
        let res = await this.$axios.get('/acmContestRank/'+this.$route.params.id,{})
        if(res.data.status==0) {
          this.ranks = res.data.data
          this.loadfb()
        }
        else
          this.$toastr.warning(res.data.msg)
      },
      loadfb:function () {
        for(let j=0;j<this.problems.length;j++)
          this.fb[this.problems[j].id]=1e9
        for(let i=0;i<this.ranks.length;i++){
          for(let key in this.ranks[i].submissionInfo){
            if(this.ranks[i].submissionInfo[key].ac) {
              this.fb[key] = Math.min(this.fb[key], this.ranks[i].submissionInfo[key].acTime)
            }
          }
        }
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
        vm.refresh()
        vm.refreshInterval = setInterval(vm.refresh,60000)
      })
    },
    beforeRouteUpdate: async function (to,from,next) {
      this.refresh()
      this.refreshInterval = setInterval(this.refresh,60000)
      next()
    },
    beforeRouteLeave:function (to,from,next) {
      if(this.refreshInterval)
        clearInterval(this.refreshInterval)
      next()
    }
  }
</script>

<style scoped>

</style>