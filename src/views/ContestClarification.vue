<template>
  <div class="container-fluid">
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
      <h4 class="text-left" style="width: 100%;margin-bottom: 5px">Clarifications
        <button type="button" class="btn btn-primary btn-sm" style="float: right"
                data-toggle="modal" data-target="#clarModal" @click="handleCreateClick">+ Create</button>
      </h4>
      <div class="modal fade" id="clarModal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Create Clarification</h5>
              <button type="button" class="close" data-dismiss="modal">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body text-left">
                <div class="form-group">
                  <label>About</label>
                  <select class="form-control" v-model="about">
                    <option value="">General issue</option>
                    <option v-for="item in contestProblems" :key="item.id" :value="item.id">{{item.name+'. '+item.title}}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Content</label>
                  <textarea class="form-control" rows="3" placeholder="Enter your problem" v-model="content"></textarea>
                </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary" data-dismiss="modal" @click="handleCreateSubmit">Submit</button>
            </div>
          </div>
        </div>
      </div>
      <table class="table table-bordered table-striped table-hover table-sm">
        <thead>
          <tr>
            <th style="width: 20%" class="text-left">About</th>
            <th style="width: 60%" class="text-left">Content</th>
            <th style="width: 20%">Time</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in clars" :key="item.id"
              :class="{'font-weight-bold':!item.readByUser}" class="table-row" style="table-layout:fixed;word-break:break-all;"
              @click="$router.push({name:'ContestClarificationDetail',params:{clarid:item.id}})">
            <td class="text-left">{{item.problem?item.problem.name+'. '+item.problem.title:"General"}}</td>
            <td class="text-left">{{item.content}}</td>
            <td>{{item.createTime}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import {mapState} from "vuex";

  export default {
    name: "ContestClarification",
    data:function () {
      return {
        about:undefined,
        content:undefined
      }
    },
    methods:{
      handleCreateClick: async function () {
        await this.$store.dispatch('loadContestProblems', {id:this.$route.params.id})
      },
      handleCreateSubmit:function () {
        console.log(this.about+this.content)
        this.$axios.post('/clarification/add',{
          'contestId':this.$route.params.id,
          'problem':this.about===""?undefined:{'id':this.about},
          'content':this.content
        }).then(res=>{
          this.$toastr.success('Success')
          this.$store.dispatch('loadAnnosAndClars',{id:this.$route.params.id})
        })
      }
    },
    computed:{
      ...mapState([
        // 映射
        'curUser','contest','annos','clars','contestProblems'
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
  .table-row:hover{
    cursor: pointer;
  }

</style>