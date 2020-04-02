<template>
  <div class="container-fluid">
<!--    <div class="background">-->
<!--    <ul class="nav nav-tabs">-->
<!--      <li class="nav-item" v-for="(item,index) in nav">-->
<!--        <router-link class="nav-link" :class="{'active':index===routerSelectId}"-->
<!--                     @click.native="routerSelectId=index" :to="'/contest/'+id+item.to" style="color:#000;">-->
<!--          <img class="icon" :src="item.icon">{{item.msg}}-->
<!--        </router-link>-->
<!--      </li>-->
<!--    </ul>-->
<!--    </div>-->
<!--    <router-view></router-view>-->
<!--    <div class="row" style="margin:0 auto">-->
<!--          -->
<!--    </div>-->
    <div class="row" style="margin:0 auto">
<!--      {{startTick}}-->
<!--      {{tick}}-->
<!--      {{endTick}}-->
      <div class="col">
        <div class="container">
          <div class="background"  style="padding: 0">
            <div class="progress text-center" style="background-color: #ffffff;">

              <div class="progress-bar progress-bar-striped progress-bar-animated bg-dark" role="progressbar"
                   :style="{width: progress+'%'}">
                <div class="timebar">{{bartext}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="container" v-show="newclar&&$route.name!=='ContestClarificationDetail'&&$route.name!=='ContestClarification'">
          <div class="background font-weight-bold" style="padding: 0">
            <router-link :to="'/contest/'+contest.id+'/clarification'">
              New Clarification Response, Click to see
            </router-link>
          </div>
        </div>
        <router-view></router-view>
      </div>

      <div class="col-md-2 show" style="padding: 0" id="bar">
        <div class="container background" style="padding: 0">
          <div class="btn-group-vertical" style="width: 100%">
            <button v-for="item in nav" type="button" class="btn border text-left">
              <router-link :to="'/contest/'+contest.id+item.to" style="color:#000;">
                <img class="icon" :src="item.icon">{{item.msg}}
              </router-link>
            </button>
          </div>
        </div>
        <div v-if="$router.currentRoute.name==='ContestProblem'&&contestProblem.id==$router.currentRoute.params.pid"
             class="container background" style="padding: .5rem 0">
          <h6>Information</h6>
          <table class="table table-sm" style="margin-bottom: 0">
            <tbody>
            <tr>
              <td class="text-left info-left">ID</td>
              <td class="text-right info-right">{{contestProblem.id}}</td>
            </tr>
            <tr>
              <td class="text-left info-left">Name</td>
              <td class="text-right info-right">{{contestProblem.name}}</td>
            </tr>
            <tr>
              <td class="text-left info-left">Timelimit</td>
              <td class="text-right">{{contestProblem.timeLimit}}ms
                <button type="button" class="btn btn-sm dropdown-toggle dropdown-toggle-split" style="padding:0;width: 1rem" data-toggle="collapse" data-target="#timeFactor">
                  <span class="sr-only"></span>
                </button>
              </td>
            </tr>
            <tr id="timeFactor" class="collapse">
              <td colspan="2" style="padding: 0">
                <table class="table" style="width:100%;margin-bottom: 0;">
                  <tr v-for="lang in contestProblem.allowLanguage">
                    <td class="text-left info-left">{{lang.language}}</td>
                    <td class="text-right info-right">{{Math.round(contestProblem.timeLimit*lang.time_factor)}}ms</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td class="text-left info-left">Memorylimit</td>
              <td class="text-right info-right">{{contestProblem.memoryLimit}}mb
                <button type="button" class="btn btn-sm dropdown-toggle dropdown-toggle-split" style="padding:0;width: 1rem" data-toggle="collapse" data-target="#memoryFactor">
                  <span class="sr-only"></span>
                </button>
              </td>
            </tr>
            <tr id="memoryFactor" class="collapse">
              <td colspan="2" style="padding: 0">
                <table class="table" style="width:100%;margin-bottom: 0;">
                  <tr v-for="lang in contestProblem.allowLanguage">
                    <td class="text-left info-left">{{lang.language}}</td>
                    <td class="text-right info-right">{{Math.round(contestProblem.memoryLimit*lang.memory_factor)}}mb</td>
                  </tr>
                </table>
              </td>
            </tr>
<!--            <tr v-if="problem.contest">-->
<!--              <td class="text-left info-left">Source</td>-->
<!--              <td class="text-right info-right">-->
<!--                <router-link :to="'/contest/'+problem.contest.id">{{problem.contest.title.strip(15)}}</router-link>-->
<!--              </td>-->
<!--            </tr>-->
            <tr>
              <td class="text-left info-left">AC</td>
              <td class="text-right info-right">{{contestProblem.acceptedNumber}}</td>
            </tr>
            <tr>
              <td class="text-left info-left">Submission</td>
              <td class="text-right info-right">{{contestProblem.submissionNumber}}</td>
            </tr>
            <tr>
              <td class="text-left info-left">AC Rate</td>
              <td class="text-right info-right">{{rate(contestProblem.acceptedNumber,contestProblem.submissionNumber)}}</td>
            </tr>
            <tr>
              <td class="text-left info-left">Create At</td>
              <td class="text-right info-right">{{contestProblem.createTime}}</td>
            </tr>
            <tr>
              <td class="text-left info-left">Create By</td>
              <td class="text-right info-right">{{contestProblem.createUser.nickname}}</td>
            </tr>
            <tr>
              <td class="text-left info-left">Update At</td>
              <td class="text-right info-right">{{contestProblem.updateTime}}</td>
            </tr>
            <tr>
              <td class="text-left info-left">Update By</td>
              <td class="text-right info-right">{{contestProblem.updateUser.nickname}}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <button class="btn btn-light bar-collapse" type="button" data-toggle="collapse" data-target="#bar"
            data-trigger="hover" aria-expanded="true" aria-controls="bar">
    </button>
  </div>
</template>

<script>

  import {mapState} from "vuex";

  export default {
    name: "ContestDetail",
    props:['id'],
    data:function () {
      return {
        tick:0,
        routerSelectId:0,
        newclar:false,
        countdownExist:false,
        refreshExist:false,
        nav:[
          {
            msg:"Overview",
            to:'',
            icon:require("@/assets/training.png"),
          },
          {
            msg:"Clarification",
            to:"/clarification",
            icon:require("@/assets/training.png"),
          },
          {
            msg:"Problem Set",
            to:"/problemset",
            icon:require("@/assets/training.png"),
          },
          {
            msg:"Status",
            to:"/status",
            icon:require("@/assets/training.png"),
          },
          {
            msg:"Rank",
            to:"/rank",
            icon:require("@/assets/training.png"),
          }
        ]
      }
    },
    methods:{
      countdown(){
        this.tick = new Date().getTime()
        if (this.endTick&&this.tick > this.endTick||!this.$route.path.startsWith('/contest/')) {
          this.countdownExist=false
          return
        }
        const that = this
        setTimeout(function () {
          that.countdown()
        }, 100)
      },
      refreshAnnosAndClars: async function () {
        if(!this.$route.path.startsWith('/contest/')) {
          this.refreshExist=false
          return
        }
        await this.$store.dispatch('loadAnnosAndClars', {id: this.$route.params.id})
        let has=false
        for(let i=0;i<this.clars.length;i++)
          if(!this.clars[i].readByUser)
            has=true
        this.newclar=has
        const that = this
        setTimeout(function () {
          that.refreshAnnosAndClars()
        }, 60000)
      },
      rate:function (a, b) {
        if (!b)
          return '0%'
        return (a / b*100).toFixed(2)+'%'
      }
    },
    computed:{
      progress:function () {
        if(this.tick>this.endTick)
          return 100;
        if(this.endTick==this.startTick)
          return 0;
        let ret=(this.tick-this.startTick)*100/(this.endTick-this.startTick);
        ret=Math.min(100,ret)
        ret=Math.max(0,ret)
        return ret
      },
      bartext:function () {
        if(this.tick>this.endTick)
          return 'Ended'
        let ret='',msec=0
        if(this.tick<this.startTick){
          ret='-'
          msec = parseInt((this.startTick-this.tick)/1000);
        }
        else{
          msec = parseInt((this.endTick-this.tick)/1000);
        }
        let day = parseInt(msec / 60 / 60 / 24)
        let hr = parseInt(msec / 60 / 60 % 24)
        let min = parseInt(msec / 60 % 60)
        let sec = parseInt(msec % 60)
        return ret+(day?day+":":"")+(hr > 9 ? hr : '0' + hr)+':'+(min > 9 ? min : '0' + min)+':'+(sec > 9 ? sec : '0' + sec)
      },
      startTick:function () {
        return new Date(this.contest.startTime).getTime()
      },
      endTick:function () {
        return new Date(this.contest.endTime).getTime()
      },
      ...mapState([
        // 映射
        'curUser','contestProblem','contest','clars'
      ])
    },
    beforeRouteEnter: function (to,from,next) {
      next(async vm => {
          await vm.$store.dispatch('loadContest',{id:vm.$route.params.id})
          if(!vm.countdownExist) {
            vm.countdownExist=true
            vm.countdown()
          }
          //await vm.$store.dispatch('loadAnnosAndClars',{id:vm.$route.params.id})
          if(!vm.refreshExist) {
            vm.refreshExist=true
            vm.refreshAnnosAndClars()
          }
        }
      )
    },
    beforeRouteUpdate: async function (to,from,next) {
      await this.$store.dispatch('loadContest',{id:to.params.id})
      if(!this.countdownExist) {
        this.countdownExist = true
        this.countdown()
      }
      //await this.$store.dispatch('loadAnnosAndClars',{id:to.params.id})
      if(!this.refreshExist) {
        this.refreshExist = true
        this.refreshAnnosAndClars()
      }
      next()
    }

  }
</script>

<style scoped>
  .btn:hover{
    background-color: #e9ecef;
    color: #57a3f3;
  }

  .btn:focus{
    box-shadow: unset;
    -webkit-box-shadow: unset;
  }

  .timebar{
    position:absolute;
    left: 0;
    right: 0;
    text-align: center;
    mix-blend-mode: difference;
    /*transform: translate(0, -50%);*/
  }

  .bar-collapse{
    position: fixed;
    top:0;
    right: 0;
    height: 100%;
    padding: 5px;
  }
  /*.progress-bar-striped {*/
  /*  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);*/
  /*  background-size: 1rem 1rem;*/
  /*}*/

  /*.progress-bar-animated {*/
  /*  -webkit-animation: progress-bar-stripes 1s linear infinite;*/
  /*  animation: progress-bar-stripes 1s linear infinite;*/
  /*}*/
</style>