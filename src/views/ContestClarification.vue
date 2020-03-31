<template>
  <div class="container">
    <div class="background" style="padding-bottom: 20px">
      <h4 class="text-left">Announcements</h4>
      <div id="annos-accordion">
        <div class="card" v-for="(item,index) in annos" :key="item.id">
          <div class="card-header" style="padding: 0 10px">
            <div class="row">
              <span class="btn text-left col-2" data-toggle="collapse" :data-target="'#collapse'+index">
                {{item.problem?item.problem.name+'. '+item.problem.title:"General issue"}}
              </span>
              <span class="btn text-left col" data-toggle="collapse" :data-target="'#collapse'+index">
                {{item.title}}
              </span>
              <span class="btn text-right col-3" data-toggle="collapse" :data-target="'#collapse'+index">
                {{item.createTime}}
              </span>
            </div>
          </div>
          <div :id="'collapse'+index" class="collapse" :class="{show:index===0}" data-parent="#annos-accordion">
            <div class="card-body" style="padding: 0">
              <mavon-editor
                      :value="item.content"
                      :subfield = "false"
                      :defaultOpen = "'preview'"
                      :toolbarsFlag = "false"
                      :boxShadow="false"
                      :transition="false"
                      :previewBackground="'#ffffff'"
                      style="border:0;z-index: 1000;min-height: unset;padding: 0"
              >
              </mavon-editor>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="background">
      <h4 class="text-left">Clarifications</h4>
      {{clars}}
    </div>
  </div>
</template>

<script>
  import {mapState} from "vuex";

  export default {
    name: "ContestClarification",
    data:function () {
      return {

      }
    },
    method:{

    },
    computed:{

      ...mapState([
        // 映射
        'curUser','contest','annos','clars'
      ])
    },
    beforeRouteEnter: function (to,from,next) {
      next(async vm => {
          await vm.$store.dispatch('loadAnnosAndClars',{id:vm.$route.params.id})
        }
      )
    },
    beforeRouteUpdate: async function (to,from,next) {
      await this.$store.dispatch('loadAnnosAndClars',{id:to.params.id})
    }
  }
</script>

<style scoped>


</style>