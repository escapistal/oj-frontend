<template>
    <div class="container-fluid">
      <div class="row" style="margin:0 auto">
        <div class="col">
          <div class="container">
            <div class="background">
              <router-link :to="'/problem'">
                <button type="button" class="btn btn-light rounded border" style="float:right;">
                  <img class="icon" src="@/assets/training.png">Back
                </button>
              </router-link>
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
          <div class="container">
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
        </div>
        <div class="col-md-2" style="padding: 0">
          <div class="container background" style="padding: .5rem 0">
            <h6>Information</h6>
            <table class="table table-sm">
              <tbody>
              <tr>
                <td class="text-left info-left">ID</td>
                <td class="text-right info-right">{{problem.id}}</td>
              </tr>
              <tr>
                <td class="text-left info-left">Name</td>
                <td class="text-right info-right">{{problem.name}}</td>
              </tr>
              <tr>
                <td class="text-left info-left">Timelimit</td>
                <td class="text-right">{{problem.timeLimit}}ms
                  <button type="button" class="btn btn-sm dropdown-toggle dropdown-toggle-split" style="padding:0;width: 1rem" data-toggle="collapse" data-target="#timeFactor">
                     <span class="sr-only"></span>
                  </button>
                </td>
              </tr>
              <tr id="timeFactor" class="collapse">
                <td colspan="2" style="padding: 0">
                  <table class="table" style="width:100%;margin-bottom: 0;">
                    <tr v-for="lang in problem.allowLanguage">
                      <td class="text-left info-left">{{lang.language}}</td>
                      <td class="text-right info-right">{{Math.round(problem.timeLimit*lang.time_factor)}}ms</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td class="text-left info-left">Memorylimit</td>
                <td class="text-right info-right">{{problem.memoryLimit}}mb
                  <button type="button" class="btn btn-sm dropdown-toggle dropdown-toggle-split" style="padding:0;width: 1rem" data-toggle="collapse" data-target="#memoryFactor">
                    <span class="sr-only"></span>
                  </button>
                </td>
              </tr>
              <tr id="memoryFactor" class="collapse">
                <td colspan="2" style="padding: 0">
                  <table class="table" style="width:100%;margin-bottom: 0;">
                    <tr v-for="lang in problem.allowLanguage">
                      <td class="text-left info-left">{{lang.language}}</td>
                      <td class="text-right info-right">{{Math.round(problem.memoryLimit*lang.memory_factor)}}mb</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr v-if="problem.contest">
                <td class="text-left info-left">Source</td>
                <td class="text-right info-right">
                  <router-link :to="'/contest/'+problem.contest.id">{{problem.contest.title.strip(15)}}</router-link>
                </td>
              </tr>
              <tr>
                <td class="text-left info-left">AC</td>
                <td class="text-right info-right">{{problem.acceptedNumber}}</td>
              </tr>
              <tr>
                <td class="text-left info-left">Submission</td>
                <td class="text-right info-right">{{problem.submissionNumber}}</td>
              </tr>
              <tr>
                <td class="text-left info-left">AC Rate</td>
                <td class="text-right info-right">{{rate(problem.acceptedNumber,problem.submissionNumber)}}</td>
              </tr>
              <tr>
                <td class="text-left info-left">Create At</td>
                <td class="text-right info-right">{{problem.createTime}}</td>
              </tr>
              <tr>
                <td class="text-left info-left">Create By</td>
                <td class="text-right info-right">{{problem.createUser.nickname}}</td>
              </tr>
              <tr>
                <td class="text-left info-left">Update At</td>
                <td class="text-right info-right">{{problem.updateTime}}</td>
              </tr>
              <tr>
                <td class="text-left info-left">Update By</td>
                <td class="text-right info-right">{{problem.updateUser.nickname}}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import ClipboardJS from 'clipboard/dist/clipboard.js'
  import ace from "../components/ace-editor";
  import {mapState} from "vuex";
  export default {
    name: "ProblemDetail",
    props: ['id'],
    components: {
      ace
    },
    data: function () {
      return {
        problem: {
          title:'',
          createUser:{},
          updateUser:{}
        },
        code: '',
        lang: 'Python 3',
        langList: [
          'C', 'C++', 'Java', 'Python 2', 'Python 3'
        ]
      }
    },
    methods: {
      submit:function(){
        if(!this.curUser)
          this.$toastr.error('登录后才能提交')
        else{
          this.$axios.post('/submission/submit',{
            'contestId':0,
            'problem':{
              'id':this.id
            },
            'user':this.curUser,
            'language':this.lang,
            'code':this.code
          }).then(response=>{
            console.log(response)
            this.$toastr.success('提交成功')
            console.log(this.curUser)
            this.$router.push({ name: 'Status', params: { uid:this.curUser.id }})
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
      next(vm =>{
        vm.$axios.get('/problem/' + vm.id, {}).then(response => {
          new ClipboardJS('.btn');
          vm.problem = response.data.data
          let list=[]
          for(let i=0;i<response.data.data.allowLanguage.length;i++)
            list.push(response.data.data.allowLanguage[i].language)
          vm.langList=list
          vm.lang=list[0]
        })
      })
    },
    beforeRouteUpdate: function(to, from, next){
      this.beforeRouteEnter(to,from,next)
    },
    computed: {
      problemMarkDown: function () {
        if(!this.problem.sample)
          return ''
        console.log(this.problem)
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
      ...mapState([
        // 映射 this.token 为 store.state.token
        'curUser'
      ])
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