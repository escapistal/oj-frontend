<template>
  <div class="container-fluid">
    <div class="background" style="margin-top: 0;margin-right:0;">
      <div class="row" style="margin-right: 0;margin-bottom: 2px">
        <h4 class="col text-left">公告</h4>
        <input class="form-control col-3" placeholder="Search Everything" v-model="keyword" @change="showPage(1,true)">
      </div>
      <table class="table table-sm">
        <thead>
        <th>#</th>
        <th>排序id</th>
        <th>标题</th>
        <th>发布者</th>
        <th>发布时间</th>
        <th>可见性</th>
        <th></th>
        </thead>
        <tbody>
        <tr v-for="item in annoList[pageId-1]">
          <td>{{item.id}}</td>
          <td>{{item.sortId}}</td>
          <td>{{item.title?item.title.strip(70):''}}</td>
          <td>{{item.createUser.nickname}}</td>
          <td>{{item.createTime}}</td>
          <td>{{item.visible}}</td>
          <td><span class="btn btn-sm btn-primary float-right"
                    @click="handleEditClick(item)">Edit</span></td>
        </tr>
        </tbody>
      </table>
      <button class="btn btn-primary float-left mr-4" type="button"
              @click="handleCreateClick">
        <strong>+</strong>
      </button>
      <pagenation
              :page-id="pageId"
              :page-size="pageSize"
              :page-total="pageTotal"
              :show-page="showPage"
      ></pagenation>
    </div>
    <div v-if="mode" class="background text-left" style="margin-right:0;margin-bottom: 10px;">
      <h4 class="text-left">{{mode==='create'?'发布公告':('编辑公告 #'+form.id)}}</h4>
      <div class="row">
        <div class="col-2">
          <div class="form-group">
            <label>Sort Id</label>
            <input class="form-control" type="number" v-model="form.sortId">
          </div>
        </div>
        <div class="col">
          <div class="form-group">
            <label>Title</label>
            <input class="form-control" v-model="form.title">
          </div>
        </div>
      </div>
      <div class="form-group">
        <label>Hint</label>
        <mavon-editor
                v-model='form.content'
                ref="md"
                placeholder="点击工具栏-全屏编辑可获得更好的编辑体验..."
                :toolbars='$store.state.toolbars'
                :style="{'z-index': descriptionZ}"
                @imgAdd="handleimgAdd"
                @fullScreen="handleDescriptionZ"
        />
      </div>
      <div class="row">
        <button type="button" class="btn btn-primary ml-auto" style="margin-right: 15px;margin-bottom: 15px" @click="handleSubmit">Submit</button>
      </div>
    </div>
  </div>
</template>

<script>
  import pagenation from "../components/pagenation";

  export default {
    name: "AdminAnnouncement",
    components:{
      pagenation
    },
    data: function () {
      return {
        annoList: [],
        pageId: 1,
        pageSize: 8,
        pageTotal: 0,
        keyword: '',
        mode: undefined,
        form: {
          sortId:0,
          title:'',
          content:'',
          visible:true
        },
        descriptionZ: '1000',
      }
    },
    methods: {
      handleDescriptionZ:function(status,value){
        this.descriptionZ=status?'2000':'1000'
      },
      handleEditClick:function(item){
        if(this.mode==='edit'){
          if(this.form.id===item.id) {//同一条，关闭窗体
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
                  that.form=item
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
                that.form=item
              }
            })
        }
        else{
          this.mode='edit'
          this.form=item
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
                that.form={
                  sortId:0,
                  title:'',
                  content:'',
                  visible:true
                }
              }
            })
        }
        else{
          this.mode='create'
          this.form={
            sortId:0,
            title:'',
            content:'',
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
      handleCreateSubmit: async function () {
        const res = await this.$axios.post('/announcement/add',this.form)
        if(res.data.status!=0)
          this.$toastr.warning(res.data.msg+',请重试')
        else {
          this.$toastr.success('公告添加成功')
          this.showPage(1,true)
          this.mode=undefined
        }
      },
      handleEditSubmit: async function () {
        const res = await this.$axios.post('/announcement/update/'+this.form.id, this.form)
        if (res.data.status != 0)
          this.$toastr.warning(res.data.msg + ',请重试')
        else {
          this.$toastr.success('公告编辑成功')
          this.showPage(1, true)
          this.mode = undefined
        }
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
        if(forceUpdate||!this.annoList[pageId-1]){
          this.$axios.get('/announcement/list',{
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
                this.annoList = new Array(this.pageTotal)
              }
              this.$set(this.annoList,pageId-1,res.data.data.content)
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