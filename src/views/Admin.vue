<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-2" style="padding-left:0">
        <div class="background" style="padding: 0;margin-top: 0">
          <div v-for="(item,index) in nav" style="width: 100%">
            <button type="button" class="btn border text-left" style="width: 100%"
                    data-toggle="collapse" :data-target="'#collapse'+index">
              <router-link :to="'/admin'+item.to" style="color:#000;">
                <img class="icon" :src="item.icon">
                {{item.msg}}
              </router-link>
            </button>
            <div v-show="item.children" :id="'collapse'+index" class="collapse" style="width: 100%">
              <div class="btn-group-vertical" style="width: 100%">
                <button v-for="it in item.children" type="button" class="btn border text-left">
                  <router-link :to="'/admin'+it.to" style="color:#000;">
                    <img class="icon" :src="it.icon">
                    {{item.msg}}
                  </router-link>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-10" style="padding: 0">
          <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Admin",
    data:function () {
      return {
        nav:[
          {
            msg:"主页",
            to:'',
            icon:require("@/assets/training.png"),
          },
          {
            msg:"首页管理",
            to:'/announcement',
            icon:require("@/assets/training.png"),
          },
          {
            msg:"用户管理",
            to:"/user",
            icon:require("@/assets/training.png"),
          },
          {
            msg:"题库管理",
            to:"/problem",
            icon:require("@/assets/training.png"),
          },
          {
            msg:"考试/比赛管理",
            to:"/contest",
            icon:require("@/assets/training.png"),
            // children:[
            //   {
            //     msg:"Contest",
            //     to:"/contest",
            //     icon:require("@/assets/training.png"),
            //   },
            //   {
            //     msg:"Contest",
            //     to:"/contest",
            //     icon:require("@/assets/training.png"),
            //   }
            // ]
          },
          {
            msg:"API文档",
            to:"",
            icon:require("@/assets/training.png"),
          },
          {
            msg:"系统配置管理",
            to:"/systemconfig",
            icon:require("@/assets/training.png"),
          }
        ]
      }
    },
    methods:{

    }
  }
</script>

<style scoped>
  .btn:hover{
    background-color: #e9ecef;
    color: #57a3f3;
  }
</style>