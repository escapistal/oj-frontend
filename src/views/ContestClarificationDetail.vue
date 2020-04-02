<template>
  <div class="container">
    <div class="background" style="min-height: 600px;position: relative;">
      <router-link :to="'/contest/'+contest.id+'/clarification'">
        <button type="button" class="btn btn-light rounded border" style="position: absolute;right: 24px;">
          <img class="icon" src="@/assets/training.png">Back
        </button>
      </router-link>
      <div class="card w-75 m-auto text-left">
        <div class="card-header">
          Clarification&nbsp;{{clar.id}}
          <span style="float: right">{{clar.createTime}}</span>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col">
              From&nbsp;:&nbsp;{{clar.createUser.nickname}}
            </div>
            <div class="col">
              About&nbsp;:&nbsp;
              <router-link v-if="clar.problem" :to="'/contest/'+contest.id+'/problem/'+clar.problem.id">
                {{clar.problem.name+'. '+clar.problem.title}}
              </router-link>
              <span v-else>General issue</span>
            </div>
          </div>
          <div class="card-text bg-light" style="padding: 1rem;margin-top: 1rem;">
            {{clar.content}}
          </div>
        </div>
      </div>
      <div class="card w-75 m-auto text-left">
        <div class="card-body" v-for="(item,index) in clar.reply">
          <div class="card-text bg-light" style="padding: 1rem">
            {{item.content}}
            <p style="margin:0"><small class="text-muted">#{{index+1}} From&nbsp;:&nbsp;{{item.createUser.nickname}}&nbsp;at&nbsp;{{item.createTime}}</small></p>
          </div>
        </div>
      </div>
      <div class="card w-75 text-left" style="margin:1rem auto;">
        <div class="card-body">
          <div class="card-text" style="padding: 1rem;">
            <div class="form-group">
              <label>Reply</label>
              <textarea class="form-control" rows="3" placeholder="Enter your problem" v-model="content"></textarea>
            </div>
          </div>
          <button class="btn btn-primary" style="float: right" @click="handleReplySubmit">Reply</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from "vuex";

  export default {
    name: "ContestClarificationDetail",
    data:function () {
      return {
        content:""
      }
    },
    methods:{
      handleReplySubmit: function () {
        if(!this.content.length){
          this.$toastr.warning('Too Short')
          return
        }
        this.$axios.post('/clarification/reply',{
          "clarId":this.clar.id,
          "content":this.content
        }).then(async res=>{
          await this.$store.dispatch('loadClar',{id:this.clar.id})
          this.content=''
          this.$toastr.success('Success')
        })
      }
    },
    computed:{
      ...mapState([
        // 映射
        'curUser','contest','clar'
      ])
    },
    watch:{

    },
    beforeRouteEnter: function (to,from,next) {
      next(async vm => {
          await vm.$store.dispatch('loadClar',{id:vm.$route.params.clarid})
        }
      )
    },
    beforeRouteUpdate: async function (to,from,next) {
      await this.$store.dispatch('loadClar',{id:to.params.clarid})
    }
  }
</script>

<style scoped>

</style>