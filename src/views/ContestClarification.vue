<template>
  <div class="container">
    <div class="background">
      {{annoList}}
      {{clarList}}
    </div>
  </div>
</template>

<script>
  import {mapState} from "vuex";

  export default {
    name: "ContestClarification",
    data:function () {
      return {
        annoList:[],
        clarList:[]
      }
    },
    created() {
      this.$axios.get('/contestAnnouncement/list/'+this.contest.id,{}).then(response=>{
        this.annoList = response.data.data;
      })
      this.$axios.get('/clarification/list/'+this.contest.id,{}).then(response=>{
        this.clarList = response.data.data;
      })
    },
    method:{

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