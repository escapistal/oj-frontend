<template>
  <div class="problem">
    <div class="container" style="width: 80%">
      <div v-if="!showDetail" class="background">
        <h4 class="text-left">Problems</h4>
        <table class="table table-hover" >
          <thead></thead>
          <tbody>
          <tr v-for="item in problemList[pageId-1]" :key="item.id">
            <td class="text-left" @click="handleProblemClick(item.id)" style="width: 10%"><a href="#">{{item.name}}</a></td>
            <td class="text-left" @click="handleProblemClick(item.id)" style="width: 60%"><a href="#">{{item.title}}</a></td>
            <td class="text-left">{{item.acceptedNumber}}</td>
            <td class="text-left">{{rate(item.acceptedNumber,item.submissionNumber)}}</td>
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
      <div v-else class="background">
        <button type="button" class="btn btn-light rounded border" style="float:right;" @click="showDetail=false">
          <img class="icon" src="@/assets/training.png">Back
        </button>
        <h3 class="text-left">{{problem.title}}</h3>
        <mavon-editor
                :value="problemMarkDown"
                :subfield = "false"
                :defaultOpen = "'preview'"
                :toolbarsFlag = "false"
                :boxShadow="false"
                :transition="false"
                :previewBackground="'#ffffff'"
                style="border:0;z-index: 1000"
>
        </mavon-editor>

      </div>
    </div>
    <div v-if="showDetail" class="container" style="width: 80%">
      <div class="background">
        <div class="dropdown" style="display: flex;margin-bottom: 10px">
          <button type="button" class="btn btn-light dropdown-toggle border rounded" data-toggle="dropdown">
            <span class="text-left" style="width: 50px;display:inline-block;">{{lang}}</span>
          </button>
          <div class="dropdown-menu">
            <div class="dropdown-item" :class="{'active':item==lang}" v-for="item in langList" @click="handleLangClick(item)">{{item}}</div>
          </div>
        </div>
        <ace v-model="code" v-bind:lang="lang"></ace>
        <button class="btn btn-secondary float-right" style="margin-top: 1em">submit</button>
      </div>
    </div>
  </div>
</template>

<script>
  import pagenation from "../components/pagenation.vue";
  import ace from '../components/ace-editor.vue'
  import ClipboardJS from 'clipboard/dist/clipboard.js'
  export default {
    name: "Problem",
    components: {
      pagenation,
      ace
    },
    data: function () {
      return {
        problemList:[],
        problem:{},
        pageId:1,
        pageSize:8,
        pageTotal:0,
        showDetail:false,
        code:'',
        lang:'C',
        langList:[
          'C','C++','Java'
        ]
      }
    },
    created: function () {
      this.$axios.get('/problem/list',{
        params:{
          page: this.pageId - 1,
          size: this.pageSize
        }
      }).then(response=>{
        this.pageTotal=response.data.data.totalPages
        if(this.pageTotal>0) {
          this.problemList = new Array(this.pageTotal)
          this.problemList[0] = (response.data.data.content);
        }
      })
    },
    mounted() {

    },
    methods:{
      rate:function (a, b) {
          if (!b)
            return '0%'
          return (a / b).toFixed(2)+'%'
      },
      handleProblemClick:function(id){
        this.$axios.get('/problem/'+id,{
        }).then(response=> {
          new ClipboardJS('.btn');
          this.problem=response.data.data
          this.showDetail=true
          console.log(response)
        })
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
            this.pageId=pageId
          })
        }
        else
          this.pageId=pageId
      },
      handleLangClick:function(lang){
        this.lang=lang
      }
    },
    computed:{
      problemMarkDown: function () {
        let md='## Description\n'+this.problem.description+
          '\n## Input Description\n'+this.problem.inputDescription+
          '\n## Output Description\n'+this.problem.outputDescription+
          '\n## Sample\n'

        for(let i=0;i<this.problem.sample.length;i++){
          let input=this.problem.sample[i].input
          let output=this.problem.sample[i].output
          md+='<div class="sample">\n'
          md+='<span class="sample-input">input</span>\n'
          md+='<button class="btn btn-light btn-sm" style="float:right;padding: 0rem .5rem;" data-clipboard-target="#input'+i+'">Copy</button>\n'
          md+='<pre id="input'+i+'" class="sample-input border">'+input+'</pre>\n'
          md+='</div><div class="sample sample-up" style="position:relative;top: -1px;">\n'
          md+='<span class="sample-input">output</span>\n'
          md+='<button class="btn btn-light btn-sm" style="float:right;padding: 0rem .5rem;" data-clipboard-target="#output'+i+'">Copy</button>\n'
          md+='<pre id="output'+i+'" class="sample-output border">'+output+'</pre>\n'
          md+='</div><br>\n'
        }
        md+='\n## Hint\n'+this.problem.hint
        return md
      }
    }
  }
</script>

<style>
  a{
    color:black
  }

  .sample{
    border: 1px solid #888;
  }
  .sample-input{
    padding: 2px 4px !important;
    margin: 0 !important;
    border-radius: 0 !important;
  }

  .sample-output{
    padding: 2px 4px !important;
    margin: 0 !important;
    border-radius: 0 !important;
  }
</style>