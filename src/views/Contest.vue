<template>
  <div class="container-fluid">
    <div class="row" style="margin:0 auto">
      <div class="col">
        <div class="row" v-if="curContestList.length>0">
          <div class="container">
            <div class="background">
              <h4 class="text-left">Ongoing or upcoming</h4>
              <div class="container">
                <div class="card bg-light text-dark text-left" v-for="item in curContestList" :key="item.id">
                  <div class="card-body">
                    <h5 class="card-title">
                      <router-link :to="'/contest/'+item.id">{{item.title}}</router-link>
                      <img v-show="item.password=='set'" class="icon" src="@/assets/training.png">
                      <span class="card-img" v-show="item.password=='set'">lock_img</span>
                    </h5>
                    <span class="card-text">{{timeRange(item.startTime,item.endTime)}}</span>
                    <img class="icon" src="@/assets/training.png">
                    <span class="card-text">{{timeDist(item.startTime,item.endTime)}}</span>
<!--                    <span class="card-text float-right">{{getStatus(item.startTime,item.endTime)}}</span>-->
                    <!--                  <a href="#" class="card-link">Card link</a>-->
                    <span class="card-text float-right">
                      <span v-if="new Date()<new Date(item.startTime)" class="badge badge-primary">Pending</span>
                      <span v-else-if="new Date()<new Date(item.endTime)" class="badge badge-success">Running</span>
                      <span v-else class="badge badge-secondary">Ended</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="container">
          <div class="background">
            <h4 class="text-left">Contests</h4>
            <div class="container">
              <div class="card bg-light text-dark text-left" v-for="item in contestList[pageId-1]" :key="item.id">
                <div class="card-body">
                  <h5 class="card-title">
                    <router-link :to="'/contest/'+item.id">{{item.title}}</router-link>
                    <img v-show="item.password=='set'" class="icon" src="@/assets/training.png">
                    <span class="card-img" v-show="item.password=='set'">lock_img</span>
                  </h5>
                  <span class="card-text">{{timeRange(item.startTime,item.endTime)}}</span>
                  <img class="icon" src="@/assets/training.png">
                  <span class="card-text">{{timeDist(item.startTime,item.endTime)}}</span>
                  <span class="card-text float-right">
<!--                    <span v-if="new Date()<item.startTime" class="badge badge-secondary">{{getStatus(item.startTime,item.endTime)}}</span>-->
                    <span v-if="new Date()<new Date(item.startTime)" class="badge badge-primary">Pending</span>
                    <span v-else-if="new Date()<new Date(item.endTime)" class="badge badge-success">Running</span>
                    <span v-else class="badge badge-secondary">Ended</span>
                  </span>
                </div>
              </div>
            </div>
            <pagenation
                    :page-id="pageId"
                    :page-size="pageSize"
                    :page-total="pageTotal"
                    :show-page="showPage"
            ></pagenation>
          </div>
        </div>
        </div>
      </div>
      <div class="col-md-2">
        <div class="container background" style="padding: 0">
          <div class="btn-group-vertical" style="width: 100%">
            <button type="button" class="btn border text-left" style="min-width: 134px"><img class="icon" src="@/assets/training.png">Overview</button>
            <button type="button" class="btn border text-left" style="min-width: 134px"><img class="icon" src="@/assets/training.png">Clarification</button>
            <button type="button" class="btn border text-left" style="min-width: 134px"><img class="icon" src="@/assets/training.png">ProblemSet</button>
            <button type="button" class="btn border text-left" style="min-width: 134px"><img class="icon" src="@/assets/training.png">Submission</button>
            <button type="button" class="btn border text-left" style="min-width: 134px"><img class="icon" src="@/assets/training.png">Ranking</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import pagenation from "../components/pagenation";
  import {mapState} from "vuex";

  export default {
    name: "Contest",
    components: {
      pagenation,
    },
    data: function () {
      return {
        curContestList:[],
        contestList:[],
        pageId:1,
        pageSize:8,
        pageTotal:0,
      }
    },
    created: function () {
      this.$axios.get('/contest/list',{
        params:{
          state: 'current'
        }
      }).then(response=>{
          this.curContestList = response.data.data.content;
      })

      this.pageId=this.contestPageId
      this.$axios.get('/contest/list',{
        params:{
          page: this.pageId - 1,
          size: this.pageSize,
          state: 'ended'
        }
      }).then(response=>{
        this.pageTotal=response.data.data.totalPages
        if(this.pageTotal>0) {
          this.contestList = new Array(this.pageTotal)
          this.$set(this.contestList, this.pageId-1, response.data.data.content)
        }
      })
    },
    methods:{
      timeRange:function(d1,d2){
        d1=new Date(d1)
        d2=new Date(d2)
        if(d1.getDate()==d2.getDate())
          return d1.format("yyyy-MM-dd hh:mm")+' ~ '+d2.format("hh:mm")
        return d1.format("yyyy-MM-dd hh:mm")+' ~ '+d2.format("yyyy-MM-dd hh:mm")
      },
      timeDist:function(d1,d2){
        let dis=new Date(d2).getTime()-new Date(d1).getTime()
        dis=Math.round(dis/60000)
        let ret='',t=0
        if(dis>=24*60) {
          t=Math.floor(dis/24/60)
          ret += t + ' day'
          if(t>1)
            ret+='s'
          dis-=t*24*60
        }
        if(dis>=60){
          t=Math.floor(dis/60)
          ret +=' '+ t + ' hour'
          if(t>1)
            ret+='s'
          dis-=t*60
        }
        if(dis>=1){
          ret +=' '+ dis + ' minute'
          if(dis>1)
            ret+='s'
        }
        return ret.trim()
      },
      getStatus:function(d1,d2){
        d1=new Date(d1)
        d2=new Date(d2)
        let now=new Date()
        if(now<d1)
          return '未开始'
        else if(now>d2)
          return '已结束'
        return '正在进行'
      },
      showPage:function(pageId,forceUpdate){
        if(pageId=='...')
          return
        if(forceUpdate||!this.contestList[pageId-1]){
          this.$axios.get('/contest/list',{
            params:{
              page: pageId - 1,
              size: this.pageSize,
              state: 'ended'
            }
          }).then(response=>{
            if(forceUpdate||response.data.data.totalPages>this.pageTotal) {
              this.pageTotal=response.data.data.totalPages
              this.contestList = new Array(this.pageTotal)
            }
            this.$set(this.contestList, pageId - 1, response.data.data.content)
            this.$store.commit('changeContestPageId',pageId)
            this.pageId=pageId
          })
        }
        else {
          this.$store.commit('changeContestPageId',pageId)
          this.pageId = pageId
        }
      }
    },
    computed: {
      ...mapState([
        // 映射 this.token 为 store.state.token
        'token','curUser','contestPageId'
      ])
    }
  }

</script>

<style scoped>
  a{
    color:black
  }
  .card{
    margin-bottom: .75rem;
  }
  .card-body{
    padding: .3rem 1rem;
  }
</style>