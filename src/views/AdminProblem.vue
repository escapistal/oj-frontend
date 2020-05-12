<template>
  <div class="container-fluid">
    <div class="background" style="margin-top: 0;margin-right:0;">
      <div class="row" style="margin-right: 0;margin-bottom: 2px">
        <h4 class="col text-left">Problem</h4>
        <input class="form-control col-3" placeholder="Search Everything" v-model="keyword" @change="showPage(1,true)">
      </div>
      <table class="table table-sm">
        <thead>
          <th>Id</th>
          <th>Sort Id</th>
          <th>Name</th>
          <th>Title</th>
          <th>Author</th>
          <th>Create At</th>
          <th>Visible</th>
          <th></th>
        </thead>
        <tbody>
        <tr v-for="item in problemList[pageId-1]">
          <td>{{item.id}}</td>
          <td>{{item.sortId}}</td>
          <td>{{item.name}}</td>
          <td>{{item.title}}</td>
          <td>{{item.createUser.nickname}}</td>
          <td>{{item.createTime}}</td>
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
    <div v-if="mode" id="collapseCreateForm" class="background collapse show text-left">
      <div class="row">
        <h4>{{mode==='create'?'Create Problem':('Edit Problem #'+createForm.id)}}</h4>
      </div>
      <div class="row">
        <div class="col-1">
          <div class="form-group">
            <label>Sort Id</label>
            <input class="form-control" type="number" v-model="createForm.sortId">
          </div>
        </div>
        <div class="col-2">
          <div class="form-group">
            <label>Short Name</label>
            <input class="form-control" v-model="createForm.name">
            <small class="text-muted">leave empty for default</small>
          </div>
        </div>
        <div class="col">
          <div class="form-group">
            <label>Title</label>
            <input class="form-control" v-model="createForm.title">
          </div>
        </div>
      </div>
      <div class="form-group">
        <label>Description</label>
        <mavon-editor
                v-model='createForm.description'
                ref="md1"
                placeholder="点击工具栏-全屏编辑可获得更好的编辑体验..."
                :toolbars='$store.state.toolbars'
                :style="{'z-index': descriptionZ}"
                @imgAdd="handleimgAdd1"
                @fullScreen="handleDescriptionZ"
        />
      </div>
      <div class="form-group">
        <label>Input Description</label>
        <mavon-editor
                v-model="createForm.inputDescription"
                ref="md2"
                placeholder="点击工具栏-全屏编辑可获得更好的编辑体验..."
                :toolbars='$store.state.toolbars'
                style="min-height: unset;"
                :style="{'z-index': inputZ}"
                @imgAdd="handleimgAdd2"
                @fullScreen="handleInputZ"
        />
      </div>
      <div class="form-group">
        <label>Output Description</label>
        <mavon-editor
                v-model='createForm.outputDescription'
                ref="md3"
                placeholder="点击工具栏-全屏编辑可获得更好的编辑体验..."
                :toolbars='$store.state.toolbars'
                style="min-height: unset;"
                :style="{'z-index': outputZ}"
                @imgAdd="handleimgAdd3"
                @fullScreen="handleOutputZ"
        />
      </div>
<!--      <div v-for="item in createForm.sample" >-->
<!--      {{item}}-->
<!--      </div>-->
      <div class="form-group">
        <label>Samples</label>
        <div v-for="(item,index) in createForm.sample" :key="sampleKey(index)">
          <div class="row divider-container"
               @click="handleAddSample(index)">
            <div class="float-left divider-plus"
                 @click.stop="handleAddSample(index)">
              <span class="font-weight-bold">+</span>
            </div>
            <div class="divider"></div>
          </div>

          <div class="row">
            <div class="col">
              <div class="form-group">
                <label>Input #{{index+1}}</label>
                <div class="delete-sign"
                     @click="handleDeleteSample(index)">
                  <span class="font-weight-bold" style="font-size: 20px">-</span>
                </div>
                <text-area v-model="item.input"></text-area>
              </div>
            </div>
            <div class="col">
              <div class="form-group">
                <label>Output #{{index+1}}</label>
                <text-area v-model="item.output"></text-area>
              </div>
            </div>
          </div>
        </div>
        <button type="button" class="btn btn-light w-100" @click="handleAddSample(createForm.sample.length)">Add Sample</button>
        <div class="form-group">
          <label>Hint</label>
          <mavon-editor
                  v-model='createForm.hint'
                  ref="md4"
                  placeholder="点击工具栏-全屏编辑可获得更好的编辑体验..."
                  :toolbars='$store.state.toolbars'
                  style="min-height: unset;"
                  :style="{'z-index': hintZ}"
                  @imgAdd="handleimgAdd4"
                  @fullScreen="handlehintZ"
          />
        </div>
        <div class="row">
          <div class="col">
            <div class="row">
              <div class="col">
                <div class="form-group">
                  <label>Time Limit(ms)</label>
                  <input class="form-control" type="number" v-model="createForm.timeLimit">
                </div>
              </div>
              <div class="col">
                <div class="form-group">
                  <label>Memory Limit(mb)</label>
                  <input class="form-control" type="number" v-model="createForm.memoryLimit">
                </div>
              </div>
            </div>
            <div class="row">
              <div class="form-group col">
                <label>Tags <button class="btn btn-sm btn-light font-weight-bold border" @click="handleAddTag(createForm.tag.length)">+</button></label>
                <div class="row">
                <div class="input-group input-group-sm mb-3 col-4" v-for="(item,index) in createForm.tag">
                  <input type="text" class="form-control" v-model="createForm.tag[index]">
                  <div class="input-group-append" @click="handleDeleteTag(index)">
                    <span class="input-group-text btn">&times;</span>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
          <div class="form-group col">
  <!--          <label>Languages</label>-->
            <div class="row">
              <div class="col">Languages</div>
              <div class="col">Time Factor</div>
              <div class="col">Memory Factor</div>
            </div>
            <div class="row mb-1" v-for="(item,index) in createForm.allowLanguage">
              <div class="col">
                <div class="delete-sign"
                     @click="handleDeleteLang(index)">
                  <span class="font-weight-bold" style="font-size: 20px">-</span>
                </div>
                <select class="form-control" v-model="item.language">
                  <option v-if="unselectedLang.indexOf(item.language)==-1" :value="item.language">{{item.language}}</option>
                  <option v-for="la in unselectedLang" :value="la">{{la}}</option>
                </select>
              </div>
              <div class="col">
                <input class="form-control" v-model="item.time_factor">
              </div>
              <div class="col">
                <input class="form-control" v-model="item.memory_factor">
              </div>
            </div>
            <button v-if="unselectedLang.length>0" type="button" class="btn btn-light w-100" @click="handleAddLang(createForm.allowLanguage.length)">Add Language</button>
          </div>
        </div>
        <div class="row mb-3">
          <div class="input-group col">
            <div class="input-group-prepend">
              <span class="input-group-text">Testcase Upload</span>
            </div>
            <div class="custom-file">
              <input ref="testcase" type="file" class="custom-file-input" accept=".zip" @change="handleTestcaseUpload">
              <label class="custom-file-label">{{createForm.testcaseMd5}}</label>
            </div>
          </div>
        </div>
        <div class="progress mb-3" v-if="uploading">
          <div class="progress-bar" role="progressbar" :style="{width: uploadProgress}">
            {{uploadProgress==='100%'?'上传成功，正在处理，请稍后...':uploadProgress}}
          </div>
        </div>
        <div class="row" style="margin: 0">
          <button class="btn btn-primary ml-auto" type="button" @click="handleSubmit">Submit</button>
        </div>
<!--        {{uploadProgress}}-->
      </div>
    </div>
  </div>
</template>

<script>
  import pagenation from "../components/pagenation";
  import TextArea from "../components/text-area";

  export default {
    name: "AdminProblem",
    components: {
      TextArea,
      pagenation,
    },
    data:function () {
      return {
        problemList:[],
        pageId:1,
        pageSize:8,
        pageTotal:0,
        keyword:'',
        mode:undefined,
        createForm:{
          sortId:0,
          name:'',
          title:'',
          description:'',
          inputDescription:'',
          outputDescription:'',
          sample:[{
            input:'',
            output:''
          }],
          timeLimit:1000,
          memoryLimit:512,
          tag:[],
          hint:'',
          allowLanguage:[{language:'C',time_factor:1,memory_factor:1}],
          testcaseMd5:'Choose zip file',
          visible:true
        },
        samplekey:[],
        descriptionZ:'1000',
        inputZ:'1000',
        outputZ:'1000',
        hintZ:'1000',
        langList:[
          'C','C++','Java','Python 2','Python 3'
        ],
        uploadProgress:'0%',
        uploading:false
      }
    },
    methods:{
      sampleKey:function(index){
        if(index>=this.samplekey.length)
          this.samplekey[index]=Math.random()
        return this.samplekey[index]
      },
      handleAddSample:function(index){
        this.createForm.sample.splice(index,0,{input:'',output:''})
        this.samplekey=[]
      },
      handleDeleteSample:function(index){
        this.createForm.sample.splice(index,1)
        this.samplekey=[]
      },
      handleAddLang:function(index){
        this.createForm.allowLanguage.splice(index,0,{language:this.unselectedLang[0],time_factor:1,memory_factor:1})
      },
      handleDeleteLang:function(index){
        this.createForm.allowLanguage.splice(index,1)
      },
      handleAddTag:function(index){
        this.createForm.tag.splice(index,0,'')
      },
      handleDeleteTag:function(index){
        this.createForm.tag.splice(index,1)
      },
      handleTestcaseUpload:function(){
        this.$set(this.createForm,'testcaseMd5',this.$refs.testcase.files[0].name)
      },
      handleEditClick:function(item){
        if(this.mode==='edit'){
          if(this.createForm.id===item.id) {//同一题，关闭窗体
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
                  that.createForm=item
                  that.$set(that.createForm,'testcaseMd5','Choose zip file')
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
                that.createForm=item
                that.$set(that.createForm,'testcaseMd5','Choose zip file')
              }
            })
        }
        else{
          this.mode='edit'
          this.createForm=item
          this.$set(this.createForm,'testcaseMd5','Choose zip file')
        }
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
                that.createForm={
                  sortId:0,
                  name:'',
                  title:'',
                  description:'',
                  inputDescription:'',
                  outputDescription:'',
                  sample:[{
                    input:'',
                    output:''
                  }],
                  timeLimit:1000,
                  memoryLimit:512,
                  tag:[],
                  hint:'',
                  allowLanguage:[{language:'C',time_factor:1,memory_factor:1}],
                  testcaseMd5:'Choose zip file',
                  visible:true
                }
              }
            })
        }
        else{
          this.mode='create'
          this.createForm={
            sortId:0,
            name:'',
            title:'',
            description:'',
            inputDescription:'',
            outputDescription:'',
            sample:[{
              input:'',
              output:''
            }],
            timeLimit:1000,
            memoryLimit:512,
            tag:[],
            hint:'',
            allowLanguage:[{language:'C',time_factor:1,memory_factor:1}],
            testcaseMd5:'Choose zip file',
            visible:true
          }
        }
      },
      handleSubmit:function(){
        if(this.mode==='edit')
          this.handleEditSubmit();
        else if(this.mode==='create')
          this.handleCreateSubmit();
      },
      handleEditSubmit:async function(){
        if(this.createForm.testcaseMd5!=='Choose zip file'){
          this.$toastr.warning('开始上传testcase，请稍后')
          this.uploadProgress='0%'
          this.uploading=true
          const testcase=new FormData()
          testcase.append("file",this.$refs.testcase.files[0])
          const config = {
            onUploadProgress: progressEvent => {
              this.uploadProgress = (progressEvent.loaded / progressEvent.total * 100 | 0)+'%'
            }
          }
          const res=await this.$axios.post("/problem/uploadTestcase",testcase,config)
          this.uploading=false
          if(res.data.status!=0){
            this.$toastr.warning(res.data.msg+',请重试')
            return
          }
          else{
            this.$toastr.success('testcase上传成功，正在上传题目...')
            this.createForm.testcaseMd5=res.data.data
          }
        }
        else {
          this.createForm.testcaseMd5 = undefined
          this.$toastr.info('正在上传题目...')
        }
        const ress=await this.$axios.post("/problem/update/"+this.createForm.id,this.createForm)
        if(ress.data.status!=0)
          this.$toastr.warning(ress.data.msg+',请重试')
        else {
          this.$toastr.success('题目编辑成功')
          this.showPage(1,true)
          this.mode=undefined
        }
      },
      handleCreateSubmit: async function(){
        this.$toastr.warning('开始上传testcase，请稍后')
        this.uploadProgress='0%'
        this.uploading=true
        const testcase=new FormData()
        testcase.append("file",this.$refs.testcase.files[0])
        const config = {
          onUploadProgress: progressEvent => {
            this.uploadProgress = (progressEvent.loaded / progressEvent.total * 100 | 0)+'%'
          }
        }
        const res=await this.$axios.post("/problem/uploadTestcase",testcase,config)
        if(res.data.status!=0){
          this.$toastr.warning(res.data.msg+',请重试')
        }
        else{
          this.$toastr.success('testcase上传成功，正在上传题目...')

          this.createForm.testcaseMd5=res.data.data
          const ress=await this.$axios.post("/problem/add",this.createForm)
          if(ress.data.status!=0)
            this.$toastr.warning(ress.data.msg+',请重试')
          else {
            this.$toastr.success('题目添加成功')
            this.showPage(1,true)
            this.mode=undefined
          }

        }
        this.uploading=false
      },
      handleDescriptionZ:function(status,value){
        this.descriptionZ=status?'2000':'1000'
      },
      handleInputZ:function(status,value){
        this.inputZ=status?'2000':'1000'
      },
      handleOutputZ:function(status,value){
        this.outputZ=status?'2000':'1000'
      },
      handlehintZ:function(status,value){
        this.hintZ=status?'2000':'1000'
      },
      async handleimgAdd1(pos, $file) {
        const url = await this.imgAdd(pos, $file)
        if (url !== undefined)
          this.$refs.md1.$img2Url(pos, url)
      },
      async handleimgAdd2(pos, $file) {
        const url = await this.imgAdd(pos, $file)
        if (url !== undefined)
          this.$refs.md2.$img2Url(pos, url)
      },
      async handleimgAdd3(pos, $file) {
        const url = await this.imgAdd(pos, $file)
        if (url !== undefined)
          this.$refs.md3.$img2Url(pos, url)
      },
      async handleimgAdd4(pos, $file) {
        const url = await this.imgAdd(pos, $file)
        if (url !== undefined)
          this.$refs.md4.$img2Url(pos, url)
      },
      async imgAdd(pos, $file) {
        let img = new FormData();
        img.append('file', $file);
        const res = await this.$axios.post("/common/upload", img)
        if (res.data.status != 0) {
          this.$toastr.warning(res.data.msg + ',请重试')
          return undefined
        } else
          return res.data.data
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
              checkVisible:false
            }
          }).then(res=>{
            if(res.data.status==0) {
              if (forceUpdate||res.data.data.totalPages > this.pageTotal) {
                this.pageTotal = res.data.data.totalPages
                this.problemList = new Array(this.pageTotal)
              }
              this.$set(this.problemList,pageId-1,res.data.data.content)
              this.pageId = pageId
            }
            else
              this.$toastr.warning(res.data.msg)
          })
        }
        else {
          this.pageId = pageId
        }
      },

    },
    watch:{
      // createForm:function(){
      //   console.log('gg')
      //   this.$set(this.createForm,'allowLanguage',this.createForm.allowLanguage)
      // }
    },
    computed:{
      unselectedLang:function () {
        console.log('changed')
        console.log(this.createForm.allowLanguage)

        let t=[]
        for(let i=0;i<this.langList.length;i++) {
          let has=false
          for (let j = 0; j < this.createForm.allowLanguage.length; j++)
            if(this.createForm.allowLanguage[j].language === this.langList[i]){
              has=true
              break;
            }
          if(!has)
            t.push(this.langList[i])
        }
        console.log(t)
        return t
      }
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
  .textarea{
    min-height:100px;
    max-height:300px;
    overflow: auto;
    height: auto;
  }

  .delete-sign{
    position:absolute;
    color:#FF8C69;
    top:50%;
    /*left:0;*/
    text-align: center;
    line-height: 8px;
    height: 16px;
    width: 16px;
    border-radius: 50%;
    border: 1px solid #FF8C69;
    /*vertical-align: center;*/
    transform: translate(-20px,-50%);
  }
  .delete-sign:hover{
    cursor: pointer;
    color: #FF3030;
    border: 1px solid #FF3030;
  }

  .divider-container{
    margin: 0;
    height: 3px;
  }
  .divider{
    width: 100%;
    height: 1px;
    background-color: #e9ecef;
    margin-top: 1px;
  }
  .divider-container:hover{
    cursor: pointer;
    background-color: #777777;
  }

  .divider-plus{
    position:absolute;
    color:#e9ecef;
    /*top:0;*/
    /*left:0;*/
    text-align: center;
    line-height: 9px;
    height: 16px;
    width: 16px;
    border-radius: 50%;
    border: 1px solid #e9ecef;
    transform: translate(-15px,-7px);
    z-index:1000;
  }
  .divider-container:hover .divider-plus{
    color: #777777;
    border: 1px solid #777777;
  }
  .divider-plus:hover{
    cursor: pointer;
    color: #777777;
    border: 1px solid #777777;
  }
</style>