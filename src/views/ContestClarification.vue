<template>
  <div class="container-fluid">
    <div class="background" style="padding-bottom: 20px">
      <h4 class="text-left">Announcements
        <button v-if="$store.getters.isAdmin" type="button" class="btn btn-primary btn-sm" style="float: right"
                data-toggle="modal" data-target="#annoModal" @click="handleAnnoCreate">+ Create</button>
      </h4>
      <div v-if="$store.getters.isAdmin" class="modal fade bd-example-modal-lg" id="annoModal" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{annomode==='create'?'Create ':'Update '}}Announcement</h5>
              <button type="button" class="close" data-dismiss="modal">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body text-left">
              <div class="row">
                <div class="col-2">
                  <div class="form-group">
                    <label>Sort Id</label>
                    <input type="number" class="form-control" placeholder="Enter Sort Id" v-model="annoSortId">
                  </div>
                </div>
                <div class="col">
                  <div class="form-group">
                    <label>About</label>
                    <select class="form-control" v-model="annoAbout">
                      <option value="">General issue</option>
                      <option v-for="item in contestProblems" :key="item.id" :value="item.id">{{item.name+'. '+item.title}}</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label>Title</label>
                <input type="text" class="form-control" placeholder="Enter Title" v-model="annoTitle">
              </div>
              <div class="form-group">
                <label>Content</label>
                <mavon-editor
                        v-model='annoContent'
                        placeholder="点击工具栏-全屏编辑可获得更好的编辑体验..."
                        :toolbars='{
                          bold: true, // 粗体
                          italic: true, // 斜体
                          header: true, // 标题
                          underline: true, // 下划线
                          strikethrough: true, // 中划线
                          mark: true, // 标记
                          superscript: true, // 上角标
                          subscript: true, // 下角标
                          quote: true, // 引用
                          ol: true, // 有序列表
                          ul: true, // 无序列表
                          link: true, // 链接
                          imagelink: true, // 图片链接
                          code: true, // code
                          table: true, // 表格
                          fullscreen: true, // 全屏编辑
                          help: true, // 帮助
                          undo: true, // 上一步
                          redo: true, // 下一步
                          alignleft: true, // 左对齐
                          aligncenter: true, // 居中
                          alignright: true, // 右对齐
                          preview: true, // 预览
                        }'
                />
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary" data-dismiss="modal" @click="handleAnnoSubmit">Submit</button>
            </div>
          </div>
        </div>
      </div>
      <div id="annos-accordion">
<!--        <div v-if="$store.getters.isAdmin" class="card">-->
<!--          <div class="card-header" style="padding: 0 10px" >-->
<!--            <div class="row" style="align-items: center;">-->
<!--              <div class="col">-->
<!--              </div>-->
<!--              <div class="col-2">-->
<!--                可见性-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
        <div class="card" v-for="(item,index) in annos" :key="item.id">
          <div class="card-header" style="padding: 0 10px" >
            <div class="row" style="align-items: center;">
              <span class="btn text-left col-2" :style="{opacity:item.visible?1:0.6}" data-toggle="collapse" :data-target="'#collapse'+index">
                {{item.problem?item.problem.name+'. '+item.problem.title:"General issue"}}
              </span>
              <span class="btn text-left col" :style="{opacity:item.visible?1:0.6}" data-toggle="collapse" :data-target="'#collapse'+index">
                {{item.title}}
              </span>
              <span class="btn text-right col-3" :style="{opacity:item.visible?1:0.6}" data-toggle="collapse" :data-target="'#collapse'+index">
                {{item.createTime}}
              </span>
              <div class="col-2" v-if="$store.getters.isAdmin">
                <section class="model-1" style="display: inline-block;transform: translate(0, 4px)"
                         data-toggle="tooltip" data-placement="top" title="可见性">
                  <div class="checkbox">
                    <input type="checkbox" v-model="item.visible" @change="handleChangeVisible(item.id)"/>
                    <label style="margin: 0"></label>
                  </div>
                </section>
                <span class="btn btn-sm btn-primary float-right"
                     data-toggle="modal" data-target="#annoModal"
                     @click="handleAnnoEdit(item)">Edit</span>
              </div>
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
                data-toggle="modal" data-target="#clarModal" @click="handleClarCreate">+ Create</button>
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
                  <select class="form-control" v-model="clarAbout">
                    <option value="">General issue</option>
                    <option v-for="item in contestProblems" :key="item.id" :value="item.id">{{item.name+'. '+item.title}}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Content</label>
                  <textarea class="form-control" rows="3" placeholder="Enter your problem" v-model="clarContent"></textarea>
                </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary" data-dismiss="modal" @click="handleClarSubmit">Submit</button>
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
              :class="{'font-weight-bold':!$store.getters.isAdmin&&!item.readByUser||$store.getters.isAdmin&&!item.readByAdmin}" class="table-row" style="table-layout:fixed;word-break:break-all;"
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
        annomode:undefined,
        annoId:undefined,
        annoSortId:0,
        annoAbout:'',
        annoTitle:'',
        annoContent:'',
        clarAbout:'',
        clarContent:'',
      }
    },
    methods:{
      handleClarCreate: async function () {

      },
      handleClarSubmit:function () {
        this.$axios.post('/clarification/add',{
          'contestId':this.$route.params.id,
          'problem':this.clarAbout===""?undefined:{'id':this.clarAbout},
          'content':this.clarContent
        }).then(res=>{
          if(res.data.status==0) {
            this.$toastr.success('Success')
            this.clarAbout = ""
            this.clarContent = ""
            this.$store.dispatch('loadAnnosAndClars', {id: this.$route.params.id})
          }
          else
            this.$toastr.warning(res.data.msg)
        })
      },
      handleAnnoCreate: async function(){
        if(this.annomode!=='create'){
          this.annomode='create'
          this.annoSortId=0
          this.annoAbout=''
          this.annoTitle=''
          this.annoContent=''
        }
      },
      handleAnnoSubmit:function(){
        if(this.annomode==='create')
          this.handleAnnoCreateSubmit()
        else if(this.annomode==='update')
          this.handleAnnoEditSubmit()
      },
      handleAnnoCreateSubmit: function(){
        this.$axios.post('/contestAnnouncement/add',{
          'contestId':this.$route.params.id,
          'problem':this.annoAbout===""?undefined:{'id':this.annoAbout},
          'sortId':this.annoSortId,
          'title':this.annoTitle,
          'content':this.annoContent
        }).then(res=>{
          if(res.data.status==0) {
            this.$toastr.success('Success')
            this.annoSortId=0
            this.annoAbout=''
            this.annoTitle=''
            this.annoContent=''
            this.$store.dispatch('loadAnnosAndClars', {id: this.$route.params.id})
          }
          else
            this.$toastr.warning(res.data.msg)
        })
      },
      handleAnnoEdit:async function(item){
        this.annomode='update'
        this.annoSortId=item.sortId
        this.annoAbout=item.problem?item.problem.id:""
        this.annoTitle=item.title
        this.annoContent=item.content
        this.annoId=item.id
      },
      handleAnnoEditSubmit:async function(){
        this.$axios.post('/contestAnnouncement/update/'+this.annoId,{
          'contestId':this.$route.params.id,
          'problem':this.annoAbout===""?undefined:{'id':this.annoAbout},
          'sortId':this.annoSortId,
          'title':this.annoTitle,
          'content':this.annoContent
        }).then(res=>{
          if(res.data.status==0) {
            this.$toastr.success('Success')
            this.annoSortId=0
            this.annoAbout=''
            this.annoTitle=''
            this.annoContent=''
            this.$store.dispatch('loadAnnosAndClars', {id: this.$route.params.id})
          }
          else
            this.$toastr.warning(res.data.msg)
        })
      },
      handleChangeVisible:function (id) {
        this.$axios.post('/contestAnnouncement/changeVisible/'+id,{}).then(res=> {
          this.$toastr.success('Success')
        })
      }
    },
    computed:{
      ...mapState([
        // 映射
        'curUser','contest','annos','clars','contestProblems'
      ])
    },
    mounted:function() {

    },
    beforeRouteEnter: function (to,from,next) {
      next(async vm => {
          await vm.$store.dispatch('loadContestProblems', {id:vm.$route.params.id})
          await vm.$store.dispatch('loadAnnosAndClars',{id:vm.$route.params.id})
        }
      )
    },
    beforeRouteUpdate: async function (to,from,next) {
      await this.$store.dispatch('loadContestProblems', {id:to.params.id})
      await this.$store.dispatch('loadAnnosAndClars',{id:to.params.id})
    }
  }
</script>

<style scoped>
  .table-row:hover{
    cursor: pointer;
  }
  .checkbox {
    position: relative;
    display: inline-block;
  }
  /*.checkbox:hover .dropdown-menu {display: block;}*/
  .checkbox:after, .checkbox:before {
    font-family: FontAwesome;
    -webkit-font-feature-settings: normal;
    -moz-font-feature-settings: normal;
    font-feature-settings: normal;
    -webkit-font-kerning: auto;
    -moz-font-kerning: auto;
    font-kerning: auto;
    -webkit-font-language-override: normal;
    -moz-font-language-override: normal;
    font-language-override: normal;
    font-stretch: normal;
    font-style: normal;
    font-synthesis: weight style;
    font-variant: normal;
    font-weight: normal;
    text-rendering: auto;
  }
  .checkbox label {
    width: 45px;
    height: 21px;
    background: #ccc;
    position: relative;
    display: inline-block;
    border-radius: 46px;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }
  .checkbox label:after {
    content: '';
    position: absolute;
    width: 25px;
    height: 25px;
    border-radius: 100%;
    left: 0;
    top: -2px;
    z-index: 2;
    background: #fff;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }
  .checkbox input {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 5;
    opacity: 0;
    cursor: pointer;
  }
  .checkbox input:hover + label:after {
    box-shadow: 0 2px 15px 0 rgba(0, 0, 0, 0.2), 0 3px 8px 0 rgba(0, 0, 0, 0.15);
  }
  .checkbox input:checked + label:after {
    left: 22px;
  }
  .model-1 .checkbox input:checked + label {
    background: #007BFF;
  }
  .model-1 .checkbox input:checked + label:after {

  }

</style>