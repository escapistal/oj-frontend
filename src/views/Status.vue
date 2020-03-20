<template>
  <div class="container-fluid">
          <div class="background">
            <div class="row dropright">
              <h4 class=" text-left">Submissions</h4>
              <button type="button" class="btn btn-sm dropdown-toggle dropdown-toggle-split" style="margin-bottom: 3px" data-toggle="collapse" data-target="#collapseFilter" aria-haspopup="true" aria-expanded="false">
<!--                  <span class="sr-only"></span>-->
              </button>
              <div class="collapse col" id="collapseFilter">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">User</span>
                  </div>
                  <input type="text" class="form-control">
                  <div class="input-group-prepend">
                    <span class="input-group-text">Problem</span>
                  </div>
                  <input type="text" class="form-control">
                  <div class="input-group-prepend">
                    <span class="input-group-text">Status</span>
                  </div>
                  <select class="form-control">
                    <option v-for="item in statusList">{{item}}</option>
                  </select>
                  <div class="input-group-prepend">
                    <span class="input-group-text">Lang</span>
                  </div>
                  <select class="form-control">
                    <option v-for="item in langList">{{item}}</option>
                  </select>
                </div>
              </div>
            </div>
            <table class="table table-sm" style="margin-top: 3px">
              <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Submit Time</th>
                <th scope="col">User</th>
                <th scope="col">Problem</th>
                <th scope="col">Lang</th>
                <th scope="col">Verdict</th>
                <th scope="col">Time</th>
                <th scope="col">Memory</th>
                <th scope="col">Code Len</th>
                <th scope="col">Source</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in submissionList[pageId-1]" :key="item.id">
                <td>{{item.id}}</td>
                <td>{{item.createTime}}</td>
                <td>{{item.user.nickname}}</td>
                <td>
                  <router-link :to="'/problem/'+item.problem.id">
                    {{item.problem.name+". "+item.problem.title}}
                  </router-link>
                </td>
                <td>{{item.language}}</td>
                <td>
                  <span v-if="item.status=='PENDING'" class="badge badge-secondary">{{item.status}}</span>
                  <span v-else-if="item.status=='JUDGING'" class="badge badge-info">{{item.status}}</span>
                  <span v-else-if="item.status=='AC'" class="badge badge-success">{{item.status}}</span>
                  <span v-else-if="item.status=='WA' || item.status=='TLE' || item.status=='MLE' || item.status=='RE'" class="badge badge-danger">{{item.status}}</span>
                  <span v-else-if="item.status=='PE'" class="badge badge-warning">{{item.status}}</span>
                  <span v-else class="badge badge-dark">{{item.status}}</span>
                </td>
                <td>{{item.executeTime}}</td>
                <td>{{item.executeMemory}}</td>
                <td>{{item.codeLength}}</td>
                <td v-if="item.problem.contest">
                  <router-link :to="'/contest/'+item.problem.contest.id">{{item.problem.contest.title.strip(30)}}</router-link>
                </td>
                <td v-else>题库</td>
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
</template>

<script>
  import pagenation from "../components/pagenation";

  export default {
    name: "Status",
    components: {
      pagenation,
    },
    data: function () {
      return {
        submissionList:[],
        pageId:1,
        pageSize:50,
        pageTotal:0,

        statusList:[
          'All',
          'Accepted',
          'Wrong Answer',
          'Time Limit Exceed',
          'Memory Limit Exceed',
          'Runtime Error',
          'Presentation Error',
          'Compile Error',
          'System Error',
          'Pending',
          'Judging'
        ],
        langList:[
          'All',
          'C',
          'C++',
          'Java',
          'Python 2',
          'Python 3'
        ]
      }
    },
    created: function () {
      console.log(this.$route.params)
      if(this.$route.params) {
        this.uid = this.$route.params.uid
      }
      this.$axios.get('/submission/list',{
        params:{
          page: this.pageId - 1,
          size: this.pageSize,
          uid: this.uid
        }
      }).then(response=>{
        console.log(response)
        this.pageTotal=response.data.data.totalPages
        if(this.pageTotal>0) {
          this.submissionList = new Array(this.pageTotal)
          this.submissionList[0] = (response.data.data.content);
        }
      })
    },
    methods:{
      showPage:function(pageId,forceUpdate){
        if(pageId=='...'||pageId<1||pageId>this.pageTotal)
          return
        if(forceUpdate||!this.contestList[pageId-1]){
          this.$axios.get('/submission/list',{
            params:{
              page: pageId - 1,
              size: this.pageSize
            }
          }).then(response=>{
            console.log(response)
            if(response.data.data.totalPages>this.pageTotal) {
              this.pageTotal=response.data.data.totalPages
              this.submissionList = new Array(this.pageTotal)
            }
            this.submissionList[pageId-1]=(response.data.data.content)
            this.pageId=pageId
          })
        }
        else {
          this.pageId = pageId
        }
      }
    }
  }
</script>

<style scoped>

</style>