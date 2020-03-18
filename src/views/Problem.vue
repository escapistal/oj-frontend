<template>
  <div class="problem">
    <div class="container-fluid">
      <div class="row" style="margin:0 auto">
        <div class="col">
          <div class="container">
            <div class="background">
              <h4 class="text-left">Problems</h4>
              <table class="table table-hover">
                <thead></thead>
                <tbody>
                <tr v-for="item in problemList[pageId-1]" :key="item.id">
                  <td class="text-left" style="width: 10%; padding:.5rem .75rem;">
                    <router-link :to="'/problem/'+item.id" class="router-link">{{item.name}}</router-link>
                  </td>
                  <td class="text-left" style="width: 60%; padding:.5rem .75rem">
                    <router-link :to="'/problem/'+item.id" class="router-link">{{item.title}}</router-link>
                  </td>
                  <td class="text-left" style="vertical-align:center !important;">{{item.acceptedNumber}}</td>
                  <td class="text-left" style="vertical-align:center !important;">{{rate(item.acceptedNumber,item.submissionNumber)}}</td>
                </tr>
                </tbody>
              </table>
              <pagenation
                      :page-id="pageId"
                      :page-size="pageSize"
                      :page-total="pageTotal"
                      :show-page="showPage"
              ></pagenation>
            </div>
          </div>
        </div>
        <div class="col-md-2">
          <div class="container background" style="padding: 0">
            <table class="table">
              <tbody>
                <tr>
                  <td class="text-left">
                    aaa
                  </td>
                  <td class="text-right">
                    bbb
                  </td>
                </tr>
              </tbody>
            </table>
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
  </div>
</template>

<script>
  import pagenation from "../components/pagenation";
  import {mapState} from "vuex";
  export default {
    name: "Problem",
    components: {
      pagenation,
    },
    data: function () {
      return {
        problemList:[],
        pageId:1,
        pageSize:8,
        pageTotal:0,
      }
    },
    created: function () {
      this.pageId=this.problemPageId
      this.$axios.get('/problem/list',{
        params:{
          page: this.pageId - 1,
          size: this.pageSize
        }
      }).then(response=>{
        this.pageTotal=response.data.data.totalPages
        if(this.pageTotal>0) {
          this.problemList = new Array(this.pageTotal)
          this.problemList[this.pageId - 1] = (response.data.data.content);
        }
      })
    },
    mounted() {

    },
    methods:{
      rate:function (a, b) {
          if (!b)
            return '0%'
          return (a / b*100).toFixed(2)+'%'
      },
      showPage:function(pageId,forceUpdate){
        if(pageId=='...'||pageId<1||pageId>this.pageTotal)
          return
        if(forceUpdate||!this.problemList[pageId-1]){
          this.$axios.get('/problem/list',{
            params:{
              page: pageId - 1,
              size: this.pageSize
            }
          }).then(response=>{
            console.log(response)
            if(response.data.data.totalPages>this.pageTotal) {
              this.pageTotal=response.data.data.totalPages
              this.problemList = new Array(this.pageTotal)
            }
            this.problemList[pageId-1]=(response.data.data.content)
            this.$store.commit('changeProblemPageId',pageId)
            this.pageId=pageId
          })
        }
        else {
          this.$store.commit('changeProblemPageId',pageId)
          this.pageId = pageId
        }
      },
    },
    computed: {
      ...mapState([
        // 映射 this.token 为 store.state.token
        'problemPageId'
      ])
    }
  }
</script>

<style scoped>
  .router-link{
    color:black
  }

  .btn:hover{
    background-color: #e9ecef;
    color: #57a3f3;
  }

  .btn:focus{
    box-shadow: unset;
    -webkit-box-shadow: unset;
  }

  .table td{
    vertical-align: unset;
  }
</style>