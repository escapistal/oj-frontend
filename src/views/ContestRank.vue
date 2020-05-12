<template>
  <div class="container-fluid">
    <div class="background" style="min-height: 600px;">
      <div v-if="$store.getters.isAdmin" class="btn-group float-right">
        <button type="button" class="btn btn-sm btn-light dropdown-toggle dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          tools
        </button>
        <div class="dropdown-menu dropdown-menu-right">
          <form class="px-2">
            <div class="form-group">
              <label style="margin: 0;padding-right: .2rem">locked: </label>
              <section class="model-1" style="display: inline-block;transform: translate(0, 4px)"
                       data-toggle="tooltip" data-placement="top" title="无视封榜">
                <div class="checkbox">
                  <input type="checkbox" v-model="locked" @change="refresh"/>
                  <label style="margin: 0"></label>
                </div>
              </section>
            </div>
          </form>
        </div>
      </div>

      <table class="table table-bordered table-sm" style="word-wrap:break-word;word-break:break-all;">
        <thead><tr>
          <th style="width: 6%;">Rank</th>
          <th style="max-width: 30%">User</th>
          <th style="width: 6%;">AC</th>
          <th style="width: 8%;">Penalty</th>
          <th v-for="item in problems" :id="item.id">
            <router-link :to="'/contest/'+contest.id+'/problem/'+item.id" style="color: unset">{{item.name}}</router-link>
          </th>
        </tr></thead>
        <tbody>
          <tr v-for="(item,index) in ranks" :id="item.id">
            <td style="padding: 0;line-height: 44px;">{{index+1}}</td>
            <td style="padding: 0;line-height: 44px;">{{item.user.nickname}}</td>
            <td style="padding: 0;line-height: 44px;">{{item.acceptedNumber}}</td>
            <td style="padding: 0;line-height: 44px;">{{Math.floor(item.totalTime/60)}}</td>
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
        locked:true,
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
        let res = await this.$axios.get('/acmContestRank/'+this.$route.params.id,{
          params: {
            locked: this.locked
          }
        })
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
      if(this.refreshInterval)
        clearInterval(this.refreshInterval)
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
  .checkbox {
    position: relative;
    display: inline-block;
  }
  /*.checkbox:hover .dropdown-menu {display: block;}*/
  .checkbox:after, .checkbox:before {
    font-family: FontAwesome;
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
    width: 45px;
    height: 21px;
    background: #ccc;
    position: relative;
    display: inline-block;
    border-radius: 46px;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }
  .checkbox label:after {
    content: '';
    position: absolute;
    width: 25px;
    height: 25px;
    border-radius: 100%;
    left: 0;
    top: -2px;
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
    left: 22px;
  }
  .model-1 .checkbox input:checked + label {
    background: #007BFF;
  }
  .model-1 .checkbox input:checked + label:after {

  }
</style>