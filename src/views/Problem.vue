<template>
  <div class="problem">
    <div class="container-fluid">
      <div class="row" style="margin:0 auto">
        <div class="col">
          <div class="container">
            <div class="background">
              <div class="row" style="margin-right: 0;margin-bottom: 2px">
                <h4 class="col text-left">Problems</h4>
                <input class="form-control col-3" placeholder="Search Everything" v-model="keyword" @change="showPage(1,true)">
              </div>
              <table class="table table-hover text-left">
                <thead>
                <th>#</th>
                <th>Title</th>
                <th>ACs</th>
                <th>AC Rate</th>
                </thead>
                <tbody>
                <tr v-for="item in problemList[pageId-1]" :key="item.id" @click="$router.push('/problem/'+item.id)">
                  <td class="text-left" style="width: 10%; padding:.5rem .75rem;">
                    <span>{{item.name}}</span>
                  </td>
                  <td class="text-left" style="width: 70%; padding:.5rem .75rem">
                    <span>{{item.title}}</span>
                    <span v-for="tag in item.tag" style="transform: translate(0,2px)" class="badge badge-pill badge-light ml-1 float-right">{{tag}}</span>
                  </td>
                  <td class="text-left" style="vertical-align:center !important;">{{item.acceptedNumber+'/'+item.submissionNumber}}</td>
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
        <div class="col-md-2" style="padding: 0">
          <div class="container" style="padding: 0">
            <div class="background" style="padding: 1.5rem 1rem 0.2rem;">
              <h5 class="mb-3">Tags</h5>
              <div class="d-flex flex-wrap">
                <span v-for="(item,index) in tags" class="badge mr-2 border rounded mb-2 probtag" :class="{'badge-dark':tag.indexOf(item)!=-1}" @click="handleFilterChange(item)">
                  {{item}}
                </span>
              </div>
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
  import qs from 'qs';

  export default {
    name: "Problem",
    components: {
      pagenation,
    },
    data: function () {
      return {
        problemList:[],
        tags:[],
        pageId:1,
        pageSize:8,
        pageTotal:0,
        keyword:'',
        tag:[]
      }
    },
    methods:{
      rate:function (a, b) {
          if (!b)
            return '0%'
          return (a / b*100).toFixed(2)+'%'
      },
      handleFilterChange:function(item,index){
        const idx=this.tag.indexOf(item)
        if(idx==-1){
          this.tag.splice(this.tag.length,0,item)
        }
        else{
          this.tag.splice(idx,1)
        }
        this.showPage(1,true)
      },
      showPage:function(pageId,forceUpdate){
        if(pageId=='...')
          return
        if(forceUpdate||!this.problemList[pageId-1]){
          this.$axios.get('/problem/list',{
            params:{
              page: pageId - 1,
              size: this.pageSize,
              keyword: this.keyword,
              tag:this.tag
            },
            paramsSerializer: params => {
              return qs.stringify(params, { indices: false })
            }
          }).then(response=>{
            if(forceUpdate||response.data.data.totalPages>this.pageTotal) {
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
    },
    beforeRouteEnter: function (to,from,next) {
      next(async vm => {
          vm.$axios.get('/problem/tags',{}).then(res=>{
            vm.tags=res.data.data
          })
          vm.pageId=vm.problemPageId
          vm.showPage(vm.pageId,true)
        }
      )
    },
    beforeRouteUpdate: async function (to,from,next) {
      this.$axios.get('/problem/tags',{}).then(res=>{
        this.tags=res.data.data
      })
      this.pageId=this.problemPageId
      this.showPage(this.pageId,true)
      next()
    }
  }
</script>

<style scoped>
  .router-link{
    color:black
  }

  .table td{
    vertical-align: unset;
  }

  tr:hover{
    cursor: pointer;
  }

  .probtag:hover{
    cursor: pointer;
  }
</style>