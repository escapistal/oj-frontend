<template>
  <div class="container">
    <div class="background">
<!--      {{contest}}-->

      <router-link :to="'/contest'">
        <button type="button" class="btn btn-light rounded border" style="float:right;">
          <img class="icon" src="@/assets/training.png">Back
        </button>
      </router-link>
      <h3 class="text-left">{{contest?contest.title:'loading...'}}</h3>
      <mavon-editor
              :value="contest?contest.description:'loading...'"
              :subfield = "false"
              :defaultOpen = "'preview'"
              :toolbarsFlag = "false"
              :boxShadow="false"
              :transition="false"
              :previewBackground="'#ffffff'"
              style="border:0;z-index: 1000; min-height:350px;"
      >
      </mavon-editor>
      <table class="table table-striped table-sm">
        <thead>
          <tr>
            <th>Start At</th>
            <th>Lasts</th>
            <th v-if="contest.willLock">Lock At</th>
            <th>End At</th>
          </tr>
        </thead>
        <tbody>
        <tr>
          <td>{{contest.startTime}}</td>
          <td>{{timeDist(contest.startTime,contest.endTime)}}</td>
          <td v-if="contest.willLock">{{contest.lockTime}}</td>
          <td>{{contest.endTime}}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>

  import {mapState} from "vuex";

  export default {
    name: "ContestOverview",
    data: function () {
      return {
        // contest:{title:'111'}
      }
    },
    methods:{
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
        console.log(ret)
        return ret.trim()
      }
    },
    created:function () {

    },
    computed:{

      ...mapState([
        // 映射
        'curUser','contest'
      ])
    }
  }
</script>

<style scoped>

</style>