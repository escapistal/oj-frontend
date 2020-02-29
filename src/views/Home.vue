<template>
  <div class="home">
    <div class="container" style="width: 80%">
      <div class="background">
        <h4 class="text-left">Announcements</h4>
        <table class="table table-hover" >
          <tbody>
          <tr v-for="item in announcementList" :key="item.id">
            <td @click="handleAnnouncementClick(item.id)"><a href="#">{{item.title}}</a></td>
            <td>{{item.createTime}}</td>
            <td>By {{item.createUser.nickname}}</td>
          </tr>
          </tbody>
        </table>
        <ul class="pagination">
          <li class="page-item"><a class="page-link" href="#">Previous</a></li>
          <li class="page-item"><a class="page-link" href="#">1</a></li>
          <li class="page-item active"><a class="page-link" href="#">2</a></li>
          <li class="page-item"><a class="page-link" href="#">3</a></li>
          <li class="page-item"><a class="page-link" href="#">Next</a></li>
        </ul>
      </div>
    </div>
    {{curUser}}
  </div>
</template>

<script>
// @ is an alias to /src

import {mapState} from "vuex";

export default {
  name: 'Home',
  components: {

  },
  data: function () {
    return {
      announcementList:[]
    }
  },
  created: function () {
    this.$axios.get('/announcement/list',{
    }).then(response=>{
      console.log(response)
      response.data.data.forEach(v=>{
                v.createTime=new Date(v.createTime).toLocaleString()
                v.updateTime=new Date(v.updateTime).toLocaleString()
                if(v.title.replace(/[\u0391-\uFFE5]/g,"aa").length>70) {
                  let len=0
                  console.log(v.title)
                  for (let i=0;i<v.title.length;i++) {
                    if ((v.title.charCodeAt(i) & 0xff00) != 0)
                      ++len
                    ++len
                    if(len>=70) {
                      v.title=v.title.substr(0,i)
                      break
                    }
                  }
                }
              })
      this.announcementList=response.data.data;
    })
  },
  methods:{
    handleAnnouncementClick:function(id){
      this.$toastr.warning('Are you the 6 fingered man?');
      this.$axios.get('/announcement/list/'+id,{
      }).then(response=> {
        console.log(response)
      })
    }
  },
  computed :{
    ...mapState([
      'token','curUser'
    ])
  }
}
</script>

<style scoped>
  a{
    color:black
  }
  .background{
    padding: 1.5rem 2rem 0.2rem 2rem;
    margin-top: 1rem;
    background-color: #ffffff;
    border-radius: 0.5rem;
  }
  .home{
    margin-top: 60px;
    position: fixed;
    background-color: #e9ecef;
    width: 100%;
    height: 100%;
  }
</style>
