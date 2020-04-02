<template>
  <div class="container-fluid">
    <div class="background">
      <router-link :to="'/contest/'+contest.id+'/problemset'">
        <button type="button" class="btn btn-light rounded border" style="float:right;">
          <img class="icon" src="@/assets/training.png">Back
        </button>
      </router-link>
      <h3 class="text-left">{{problem.name+". "+problem.title}}</h3>
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
    <div class="background">
      <div class="btn-group dropdown" style=" display:flex; margin-bottom: 10px">
        <div class="border rounded">
          <button type="button" class="btn btn-light text-left" style="min-width: 60px;max-width: 100px"
                  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            {{lang}}
          </button>
          <button type="button" class="btn btn-light dropdown-toggle dropdown-toggle-split" style="max-width: 30px"
                  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <span class="sr-only"></span>
          </button>
          <div class="dropdown-menu">
            <div class="dropdown-item" :class="{'active':item==lang}" v-for="item in langList" @click="lang=item">{{item}}</div>
          </div>
        </div>
      </div>
      <ace v-model="code" v-bind:lang="lang"></ace>
      <button class="btn btn-secondary float-right" style="margin-top: 1em"
              @click="submit">submit</button>
    </div>
  </div>
</template>

<script>
  import ace from "../components/ace-editor";
  import ClipboardJS from "clipboard";
  import {mapState} from "vuex";

  export default {
    name: "ContestProblem",
    components: {
      ace
    },
    data: function () {
      return {
        // problem: {
        //   title:'',
        //   createUser:{},
        //   updateUser:{}
        // },
        code: '',
        lang:undefined,
        // lang: 'Python 3',
        // langList: [
        //   'C', 'C++', 'Java', 'Python 2', 'Python 3'
        // ]
      }
    },
    methods: {
      submit:function(){
        if(!this.curUser)
          this.$toastr.error('登录后才能提交')
        else{
          this.$axios.post('/contestSubmission/submit',{
            'contest': {
              'id':this.problem.contest.id
            },
            'problem':{
              'id':this.problem.id
            },
            'user':this.curUser,
            'language':this.lang,
            'code':this.code
          }).then(response=>{
            console.log(response)
            this.$toastr.success('提交成功')
            console.log(this.curUser)
            this.$router.push({ name: 'ContestStatus', params: { mine:true }})
          })
        }
      },
      rate:function (a, b) {
        if (!b)
          return '0%'
        return (a / b*100).toFixed(2)+'%'
      },
    },
    beforeRouteEnter: function (to, from, next) {
      next(async vm =>{
        await vm.$store.dispatch('loadContestProblem',{id:vm.$route.params.pid})
        new ClipboardJS('.btn');
      })
    },
    beforeRouteUpdate: async function (to, from, next) {
      await this.$store.dispatch('loadContestProblem', {id: to.params.pid})
      new ClipboardJS('.btn');
      next()
    },
    computed: {
      problemMarkDown: function () {
        if(!this.problem.sample)
          return ''
        let md = '## Description\n' + this.problem.description +
          '\n## Input Description\n' + this.problem.inputDescription +
          '\n## Output Description\n' + this.problem.outputDescription +
          '\n## Sample\n'

        for (let i = 0; i < this.problem.sample.length; i++) {
          let input = this.problem.sample[i].input
          let output = this.problem.sample[i].output
          md += '<div class="sample">\n'
          md += '<span class="sample-input">input</span>\n'
          md += '<button class="btn btn-light btn-sm" style="float:right;padding: 0 .5rem;border-top: unset;border-bottom: unset;" data-clipboard-target="#input' + i + '">Copy</button>\n'
          md += '<pre id="input' + i + '" class="sample-input border">' + input + '</pre>\n'
          md += '</div><div class="sample" style="position:relative;top: -1px;">\n'
          md += '<span class="sample-input">output</span>\n'
          md += '<button class="btn btn-light btn-sm" style="float:right;padding: 0 .5rem;border-top: unset;border-bottom: unset;" data-clipboard-target="#output' + i + '">Copy</button>\n'
          md += '<pre id="output' + i + '" class="sample-output border">' + output + '</pre>\n'
          md += '</div><br>\n'
        }

        md += '\n## Hint\n' + this.problem.hint
        return md
      },
      langList: function () {
        if(!this.problem)
          return ['loading']
        let list=[]
        for(let i=0;i<this.problem.allowLanguage.length;i++)
          list.push(this.problem.allowLanguage[i].language)
        this.lang=list[0]
        return list
      },
      ...mapState({
        curUser: 'curUser',
        contest: 'contest',
        problem: 'contestProblem'
      })
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

  .info-left{
    padding-left: .75rem !important;
  }

  .info-right{
    padding-right: .75rem !important;
  }
</style>