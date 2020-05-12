<template>
  <div class="container-fluid">
    <div class="background" style="margin-top: 0;margin-right:0;">
      <div class="row" style="margin-right: 0;margin-bottom: 2px">
        <h4 class="col text-left">Contest</h4>
        <input class="form-control col-3" placeholder="Search Everything" v-model="keyword" @change="showPage(1,true)">
      </div>
      <table class="table table-sm">
        <thead>
        <th>Id</th>
        <th>Sort Id</th>
        <th>Title</th>
        <th>Start At</th>
        <th>Lock At</th>
        <th>End At</th>
        <th>Author</th>
<!--        <th>Create At</th>-->
        <th>Visible</th>
        <th></th>
        </thead>
        <tbody>
        <tr v-for="item in contestList[pageId-1]">
          <td>{{item.id}}</td>
          <td>{{item.sortId}}</td>
          <td>{{item.title}}</td>
          <td>{{item.startTime}}</td>
          <td>{{item.willLock?item.lockTime:'N/A'}}</td>
          <td>{{item.endTime}}</td>
          <td>{{item.createUser.nickname}}</td>
<!--          <td>{{item.createTime}}</td>-->
          <td>{{item.visible}}</td>
          <td>
            <span class="btn btn-sm btn-primary float-right"
                  data-toggle="modal" data-target="#editModal"
                  @click="handleEditClick(item)">Edit
            </span>
          </td>
        </tr>
        </tbody>
      </table>
      <button class="btn btn-primary float-left mr-4" type="button"
              @click="handleCreateClick">
        <strong>+</strong>
      </button>
      <pagenation class="float-left"
                  :page-id="pageId"
                  :page-size="pageSize"
                  :page-total="pageTotal"
                  :show-page="showPage"
      ></pagenation>
    </div>
    <div v-if="mode" class="background text-left" style="overflow: visible">
      <div class="row">
        <h4>{{mode==='create'?'Create Contest':('Edit Contest #'+form.id)}}</h4>
      </div>
      <div class="row">
        <div class="col-1">
          <div class="form-group">
            <label>Sort Id</label>
            <input class="form-control" type="number" v-model="form.sortId">
          </div>
        </div>
        <div class="col-2">
          <div class="form-group">
            <label>Rule Type</label>
            <select class="form-control custom-select" v-model="form.ruleType">
              <option v-for="item in ruleTypeList" :value="item">{{item}}</option>
            </select>
<!--            <small class="text-muted">leave empty for default</small>-->
          </div>
        </div>
        <div class="col">
          <div class="form-group">
            <label>Title</label>
            <input class="form-control" v-model="form.title">
          </div>
        </div>

      </div>
      <div class="row">
        <div class="col">
          <div class="form-group">
            <label>Start At</label>
            <date-picker v-model="form.startTime" :config="options"></date-picker>
          </div>
        </div>
        <div class="col">
          <div class="form-group">
            <label>Lock At</label>
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <div class="input-group-text">
                  <input type="checkbox" v-model="form.willLock">
                </div>
              </div>
              <date-picker :disabled="!form.willLock" v-model="form.lockTime" :config="options"></date-picker>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="form-group">
            <label>End At</label>
            <date-picker v-model="form.endTime" :config="options"></date-picker>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="form-group">
            <div class="form-check">
              <input type="checkbox" class="form-check-input" id="visibleCheck" v-model="form.visible">
              <label class="form-check-label" for="visibleCheck">Visible</label>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="form-group">
            <div class="form-check">
              <input type="checkbox" class="form-check-input" id="realTimeRankCheck" v-model="form.realTimeRank">
              <label class="form-check-label" for="realTimeRankCheck">Real Time Rank</label>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="form-group">
            <label>Penalty Time(s)</label>
            <input type="number" class="form-control" v-model="form.penaltyTime" >
            <small class="text-muted">leave empty for global default</small>
          </div>
        </div>
      </div>
      <div class="form-group">
        <label>Description</label>
        <mavon-editor
                v-model='form.description'
                ref="md"
                placeholder="点击工具栏-全屏编辑可获得更好的编辑体验..."
                :toolbars='$store.state.toolbars'
                :style="{'z-index': descriptionZ}"
                @imgAdd="handleimgAdd"
                @fullScreen="handleDescriptionZ"
        />
      </div>
      <div class="row mt-5">
        <h4>{{mode==='create'?'Contest Problems':('Problems for Contest #'+form.id)}}</h4>
      </div>
      <table class="table table-hover table-sm">
        <thead>
          <th>#</th>
          <th>Sort Id</th>
          <th>Title</th>
          <th>Author</th>
          <th>visible</th>
          <th></th>
        </thead>
        <tbody>
        <tr v-for="(item,index) in withoutDeleteProblemList" :key="item.id">
          <td style="width: 6%">
            {{item.name}}
          </td>
          <td style="width: 8%">
            {{item.sortId}}
          </td>
          <td class="text-left" style="width: 60%">
            {{item.title}}
            <small class="text-muted" style="float: right">{{timeAndMemoryLabel(item)}}</small>
          </td>
          <td>{{item.createUser.nickname}}</td>
          <td>{{item.visible}}</td>
          <td>
            <span class="btn btn-sm btn-primary mr-1" style="padding: 0 .25rem"
                  @click="handleEditProblemClick(item,index)">Edit
            </span>
            <span class="btn btn-sm btn-primary" style="padding: 0 .25rem"
                  @click="$set(contestProblems[index],'mode','deleted')">Delete
            </span>
          </td>
        </tr>
        </tbody>
      </table>
      <div class="row" style="margin: 0">
        <button class="btn btn-primary" type="button"
                @click="handleAddProblemClick">
          <strong>+</strong>
        </button>
        <div class="modal-backdrop fade show" key="modalBack" v-if="modalVisible"></div>
        <div v-if="modalVisible" class="modal fade show" style="display: block" role="dialog">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Add Problem</h5>
                <button type="button" class="close" @click="modalVisible=false">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body text-left">
                <div class="row">
                  <div class="col-3">
                    <div class="form-group">
                      <label>Sort Id</label>
                      <input class="form-control" type="number" v-model="modal.sortId">
                    </div>
                  </div>
                  <div class="col">
                    <div class="form-group">
                      <label>Origin Problem</label>
                      <v-selectpage v-model="modal.problem.id" :data="probInfoList"
                                    :tb-columns="cols" :show-field="showInfo" @values="handleModalSelect">
                      </v-selectpage>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-4">
                    <div class="form-group">
                      <label>Alias</label>
                      <input class="form-control" v-model="modal.name">
                      <small class="text-muted">leave empty for default</small>
                    </div>
                  </div>
                  <div class="col">
                    <div class="form-group">
                      <label>Title</label>
                      <input class="form-control" v-model="modal.title">
                      <small class="text-muted">leave empty for default</small>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-4">
                    <div class="form-group">
                      <label>Time Limit</label>
                      <input class="form-control" type="number" v-model="modal.timeLimit">
                      <small class="text-muted">leave empty for default</small>
                    </div>
                  </div>
                  <div class="col">
                    <div class="form-group">
                      <label>Memory Limit</label>
                      <input class="form-control" type="number" v-model="modal.memoryLimit">
                      <small class="text-muted">leave empty for default</small>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="modalVisible=false">Close</button>
                <button type="button" class="btn btn-primary" data-dismiss="modal" @click="handleModalSubmit">Submit</button>
              </div>
            </div>
          </div>
        </div>
        <button class="btn btn-primary ml-auto" type="button" @click="handleSubmit">Submit</button>
      </div>
    </div>
  </div>
</template>

<script>
  import TextArea from "../components/text-area";
  import pagenation from "../components/pagenation";
  import datePicker from 'vue-bootstrap-datetimepicker';
  import {mapState} from "vuex";
  export default {
    name: "AdminContest",
    components: {
      TextArea,
      pagenation,
      datePicker
    },
    data:function () {
      return {
        probInfoList:[],
        cols:[
          { title: 'id',data: 'id' },
          { title: 'name',data: 'name' },
          { title: 'title',data: 'title' }
        ],
        contestList: [],
        pageId: 1,
        pageSize: 8,
        pageTotal: 0,
        keyword: '',
        mode:undefined,
        form:{
          sortId:0,
          ruleType:'ACM',
          title:'',
          startTime:new Date().format("yyyy-MM-dd HH:mm:ss"),
          endTime:new Date().format("yyyy-MM-dd HH:mm:ss"),
          lockTime:new Date().format("yyyy-MM-dd HH:mm:ss"),
          willLock:true,
          realTimeRank:true,
          penaltyTime:2400,
          visible:true,
          description:''
        },
        contestProblems:[],
        descriptionZ:500,
        ruleTypeList:['ACM'],
        options:{
          format: 'YYYY/MM/DD HH:mm',
          useCurrent: false,
          showTodayButton:true
        },
        modal:{
          problem:{}
        },
        selectedProblem:undefined,
        modalVisible:false
      }
    },
    methods:{
      handleDescriptionZ:function(status,value){
        this.descriptionZ=status?'2000':'500'
      },
      handleCreateClick:function(){
        if(this.mode==='create'){
          const that=this
          this.$toastr.warning(
            '点我确认放弃正在编辑的内容', '',
            {onclick : function() {
                that.mode=undefined
              }
            })
        }
        else if(this.mode==='edit'){
          const that=this
          this.$toastr.warning(
            '点我确认放弃正在编辑的内容', '',
            {onclick : function() {
                that.mode='create'
                that.form={
                  sortId:0,
                    ruleType:'ACM',
                    title:'',
                    startTime:new Date().format("yyyy-MM-dd HH:mm:ss"),
                    endTime:new Date().format("yyyy-MM-dd HH:mm:ss"),
                    lockTime:new Date().format("yyyy-MM-dd HH:mm:ss"),
                    willLock:true,
                    realTimeRank:true,
                    penaltyTime:2400,
                    visible:true,
                    description:''
                }
                that.contestProblems=[]
              }
            })
        }
        else{
          this.mode='create'
          this.form={
            sortId:0,
            ruleType:'ACM',
            title:'',
            startTime:new Date().format("yyyy-MM-dd HH:mm:ss"),
            endTime:new Date().format("yyyy-MM-dd HH:mm:ss"),
            lockTime:new Date().format("yyyy-MM-dd HH:mm:ss"),
            willLock:true,
            realTimeRank:true,
            penaltyTime:2400,
            visible:true,
            description:''
          }
          this.contestProblems=[]
        }
      },
      handleEditClick:function(item){
        if(this.mode==='edit'){
          if(this.form.id===item.id) {//同一题，关闭窗体
            const that=this
            this.$toastr.warning(
              '点我确认放弃正在编辑的内容', '',
              {onclick : function() {
                  that.mode = undefined
                }
              })
          }
          else{//切换编辑题目
            const that=this
            this.$toastr.warning(
              '点我确认放弃正在编辑的内容', '',
              {onclick : function() {
                  that.form=JSON.parse(JSON.stringify(item))
                  that.getProblems(item.id)
                }
              })
          }
        }
        else if(this.mode==='create'){
          const that=this
          this.$toastr.warning(
            '点我确认放弃正在编辑的内容', '',
            {onclick : function() {
                that.mode='edit'
                that.form=JSON.parse(JSON.stringify(item))
                that.getProblems(item.id)
              }
            })
        }
        else{
          this.mode='edit'
          this.form=JSON.parse(JSON.stringify(item))
          this.getProblems(item.id)
        }
      },
      getProblems: async function (id) {
        const res = await this.$axios.get('/contestProblem/list/' + id, {})
        if (res.data.status == 0) {
          this.contestProblems = res.data.data
          for(let i=0;i<this.contestProblems.length;i++)          //为每个题目打当前mode的tag，有修改或新建的题需要submit时提交
            this.$set(this.contestProblems[i],'mode','unchanged')
        }
        else
          this.$toastr.warning(res.data.msg)
      },
      showInfo:function(row){
        return row.id+' '+(row.name?row.name+' ':'')+row.title
      },
      handleAddProblemClick: async function () {
        const res = await this.$axios.get('/problem/list',{
          params:{
            page: 0,
            size: 1000,
            checkVisible:false
        }})
        this.probInfoList=res.data.data.content
        this.modal = {
          mode: 'new',
          sortId: 0,
          name: '',
          title: '',
          problem: {
            id: undefined
          },
          allowLanguage: [
            {
              language: "C++",
              time_factor: 1,
              memory_factor: 1
            }
          ],
          timeLimit: 0,
          memoryLimit: 0,
          visible: true,
          createUser: this.curUser
        }
        this.modalVisible = true
      },
      handleEditProblemClick: async function (item,index) {
        const res = await this.$axios.get('/problem/list', {
          params: {
            page: 0,
            size: 1000,
            checkVisible: false
          }
        })
        this.probInfoList = res.data.data.content
        console.log(item)
        item.problem.id+=''
        this.modal = item
        this.modal.mode = index
        this.modalVisible = true
      },
      handleModalSubmit:function(){
        if(!this.modal.problem.id){
          this.$toastr.warning('请选择来源题目')
          return
        }
        if(this.modal.name==='')
          this.modal.name=this.selectedProblem.name
        if(this.modal.title==='')
          this.modal.title=this.selectedProblem.title
        if(this.modal.timeLimit<=0)
          this.modal.timeLimit=this.selectedProblem.timeLimit
        if(this.modal.memoryLimit<=0)
          this.modal.memoryLimit=this.selectedProblem.memoryLimit
        if(this.modal.mode==='new')
          this.contestProblems.push(this.modal)
        else {
          const id=this.modal.mode
          this.modal.mode='changed'
          this.contestProblems[id]=this.modal
        }
        console.log(this.modal)
        this.modalVisible=false
      },
      handleModalSelect:function(data){
        if(data.length===0)return
        data=data[0]
        this.selectedProblem=data
        if(this.modal.name==='')
          this.modal.name=data.name
        if(this.modal.title==='')
          this.modal.title=data.title
        if(this.modal.timeLimit<=0)
          this.modal.timeLimit=data.timeLimit
        if(this.modal.memoryLimit<=0)
          this.modal.memoryLimit=data.memoryLimit
      },
      handleSubmit:function(){
        if(this.mode==='edit')
          this.handleEditSubmit();
        else if(this.mode==='create')
          this.handleCreateSubmit();
      },
      handleCreateSubmit: async function () {
        this.form.startTime=new Date(this.form.startTime).format("yyyy-MM-dd HH:mm:ss")
        this.form.endTime=new Date(this.form.endTime).format("yyyy-MM-dd HH:mm:ss")
        this.form.lockTime=new Date(this.form.lockTime).format("yyyy-MM-dd HH:mm:ss")
        // console.log(this.form)
        const res = await this.$axios.post("/contest/add", this.form)
        if (res.data.status != 0)
          this.$toastr.warning(res.data.msg + ',请重试')
        else {
          this.$toastr.success('比赛添加成功,等待添加题目')
          let upd=false
          for(let i=0;i<this.contestProblems.length;i++){
            this.contestProblems[i].contest={id:res.data.data}
            if(['new','changed','deleted'].indexOf(this.contestProblems[i].mode)==-1)
              continue
            upd=true
            let ress
            if(this.contestProblems[i].mode==='deleted'&&this.contestProblems[i].id!==undefined)
              ress=await this.$axios.post("/contestProblem/delete/"+this.contestProblems[i].id,{})
            else if(this.contestProblems[i].id==undefined)
              ress=await this.$axios.post("/contestProblem/add",this.contestProblems[i])
            else
              ress=await this.$axios.post("/contestProblem/update/"+this.contestProblems[i].id,this.contestProblems[i])
            const msg={'new':'成功添加题目','changed':'成功更新题目','deleted':'成功删除题目'}
            if(ress.data.status!=0)
              this.$toastr.warning(ress.data.msg + ',请重试')
            else
              this.$toastr.success(msg[this.contestProblems[i].mode]+this.contestProblems[i].name)
          }
          if(!upd)
            this.$toastr.success('没有题目需要更新')
          this.showPage(1, true)
          this.mode = undefined
        }
      },
      handleEditSubmit: async function () {
        this.form.startTime = new Date(this.form.startTime).format("yyyy-MM-dd HH:mm:ss")
        this.form.endTime = new Date(this.form.endTime).format("yyyy-MM-dd HH:mm:ss")
        this.form.lockTime = new Date(this.form.lockTime).format("yyyy-MM-dd HH:mm:ss")
        // console.log(this.form)
        const res = await this.$axios.post("/contest/update/" + this.form.id, this.form)
        if (res.data.status != 0)
          this.$toastr.warning(res.data.msg + ',请重试')
        else {
          this.$toastr.success('比赛更新成功,等待更新题目')
          let upd=false
          for (let i = 0; i < this.contestProblems.length; i++) {
            this.contestProblems[i].contest = {id: this.form.id}
            if(this.contestProblems[i].mode==='unchanged')
              continue
            upd=true
            let ress
            if(this.contestProblems[i].mode==='deleted'&&this.contestProblems[i].id!==undefined)
              ress=await this.$axios.post("/contestProblem/delete/"+this.contestProblems[i].id,{})
            else if(this.contestProblems[i].id==undefined)
              ress=await this.$axios.post("/contestProblem/add",this.contestProblems[i])
            else
              ress=await this.$axios.post("/contestProblem/update/"+this.contestProblems[i].id,this.contestProblems[i])
            const msg={'new':'成功添加题目','changed':'成功更新题目','deleted':'成功删除题目'}
            if (ress.data.status != 0)
              this.$toastr.warning(ress.data.msg + ',请重试')
            else
              this.$toastr.success(msg[this.contestProblems[i].mode] + this.contestProblems[i].name)
          }
          if(!upd)
            this.$toastr.success('没有题目需要更新')
          this.showPage(1, true)
          this.mode = undefined
        }
      },
      timeAndMemoryLabel:function (item) {
        if(!item.timeLimit||!item.memoryLimit)
          return 'inherit from common problem'
        item.timeLimit=parseInt(item.timeLimit)
        item.memoryLimit=parseInt(item.memoryLimit)
        let t=(item.timeLimit/1000).toFixed(1)
        let m=(item.memoryLimit).toFixed(0)
        let a=item.allowLanguage
        let s=item.spj
        let ttag='',mtag=''
        for(let i=0;i<a.length;i++) {
          if (a[i].time_factor != 1)
            ttag = '*'
          if(a[i].memory_factor !=1)
            mtag = '*'
        }
        return (s?'Special Judge, ':'')+t+'s'+ttag+', '+m+'MB'+mtag
      },
      async handleimgAdd(pos, $file) {
        let img = new FormData();
        img.append('file', $file);
        const res = await this.$axios.post("/common/upload", img)
        if (res.data.status != 0) {
          this.$toastr.warning(res.data.msg + ',请重试')
        } else
          this.$refs.md.$img2Url(pos, decodeURIComponent(res.data.data));
      },
      showPage:function(pageId,forceUpdate){
        if(pageId=='...')
          return
        if(forceUpdate){
          this.contestList=[]
          this.pageTotal=0
        }
        if(forceUpdate||!this.contestList[pageId-1]){
          this.$axios.get('/contest/list',{
            params:{
              page: pageId - 1,
              size: this.pageSize,
              keyword: this.keyword
            }
          }).then(res=>{
            if(res.data.status==0) {
              if (res.data.data.totalPages > this.pageTotal) {
                this.pageTotal = res.data.data.totalPages
                this.contestList = new Array(this.pageTotal)
              }
              this.$set(this.contestList,pageId-1,res.data.data.content)
              this.pageId = pageId
            }
            else
              this.$toastr.warning(res.data.msg)
          })
        }
        else {
          this.pageId = pageId
        }
      }
    },
    computed:{
      withoutDeleteProblemList:function () {
        let res=[]
        for(let i=0;i<this.contestProblems.length;i++)
          if(this.contestProblems[i].mode!=='deleted')
            res.push(this.contestProblems[i])
        return res
      },
      ...mapState({
        // 映射
        curUser: 'curUser',
      })
    },
    mounted:function () {

    },
    beforeRouteEnter: function (to,from,next) {
      next(async vm => {
          vm.showPage(vm.pageId,true)
        }
      )
    },
    beforeRouteUpdate: async function (to,from,next) {
      this.showPage(this.pageId,true)
      next()
    }
  }
</script>

<style scoped>

</style>