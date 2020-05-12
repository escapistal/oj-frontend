<template>
  <div class="container-fluid">
    <div class="background" style="margin-top: 0;margin-right:0;">
      <div class="row" style="margin-right: 0;margin-bottom: 2px">
        <h4 class="col text-left">User</h4>
        <input class="form-control col-3" placeholder="Search Everything" v-model="keyword" @change="showPage(1,true)">
      </div>

      <table class="table table-sm">
        <thead>
        <th>Id</th>
        <th>username</th>
        <th>nickname</th>
        <th>realname</th>
        <th>email</th>
        <th>role</th>
        <th>Create At</th>
        <th>Last Login</th>
        <th>blocked</th>
        <th></th>
        </thead>
        <tbody>
        <tr v-for="item in userList[pageId-1]">
          <td>{{item.id}}</td>
          <td>{{item.username}}</td>
          <td>{{item.nickname}}</td>
          <td>{{item.realname}}</td>
          <td>{{item.email}}</td>
          <td>{{item.role.join(',')}}</td>
          <td>{{item.createTime}}</td>
          <td>{{item.lastLoginTime}}</td>
          <td>{{item.disabled}}</td>
          <td><span class="btn btn-sm btn-primary float-right"
                    data-toggle="modal" data-target="#editModal"
                    @click="handleEditClick(item)">Edit</span></td>
        </tr>
        </tbody>
      </table>
      <pagenation
              :page-id="pageId"
              :page-size="pageSize"
              :page-total="pageTotal"
              :show-page="showPage"
      ></pagenation>
      <div class="modal fade bd-example-modal-lg" id="editModal" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Edit User #{{editform.id}}</h5>
              <button type="button" class="close" data-dismiss="modal">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body text-left">
              <div class="row">
                <div class="col">
                  <div class="form-group">
                    <label>Username</label>
                    <input class="form-control" disabled v-model="editform.username">
                  </div>
                </div>
                <div class="col">
                  <div class="form-group">
                    <label>Email</label>
                    <input class="form-control" placeholder="root@example.com" v-model="editform.email">
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="form-group">
                    <label>Nickname</label>
                    <input class="form-control" v-model="editform.nickname">
                  </div>
                </div>
                <div class="col">
                  <div class="form-group">
                    <label>Realname</label>
                    <input class="form-control" v-model="editform.realname">
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="form-group">
                    <label>Roles (press ctrl to multiselect)</label>
                    <select multiple class="form-control" v-model="editform.role" :size="roleList.length">
                      <option v-for="item in roleList" :value="item.toLowerCase()">{{item}}</option>
                    </select>
                  </div>
                </div>
                <div class="col">
                  <div class="form-group">
                    <label>New Password</label>
                    <input class="form-control" type="password" v-model="editform.password">
                  </div>
                  <div class="form-group">
                    <label style="padding-right: 4px">Blocked</label>
                    <section class="model-1" style="display: inline-block;transform: translate(0, 4px)">
                      <div class="checkbox">
                        <input type="checkbox" v-model="editform.disabled"/>
                        <label style="margin: 0"></label>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary" data-dismiss="modal" @click="handleEditSubmit">Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="background text-left" style="margin-right:0;margin-bottom: 10px;">
      <h4 class="text-left">Create Account</h4>
      <div class="row">
        <div class="col">
          <div class="form-group">
            <label>Username</label>
            <input class="form-control" v-model="createform.username">
          </div>
        </div>
        <div class="col">
          <div class="form-group">
            <label>Email</label>
            <input class="form-control" placeholder="root@example.com" v-model="createform.email">
          </div>
        </div>
        <div class="col">
          <div class="form-group">
            <label>Password</label>
            <input type="password" class="form-control" v-model="createform.password">
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="form-group">
            <label>Nickname</label>
            <input class="form-control" v-model="createform.nickname">
          </div>
        </div>
        <div class="col">
          <div class="form-group">
            <label>Realname</label>
            <input class="form-control" v-model="createform.realname">
          </div>
        </div>
        <div class="col">
          <div class="form-group">
            <label>Roles (press ctrl to multiselect)</label>
            <select multiple class="form-control" v-model="createform.role" :size="roleList.length">
              <option v-for="item in roleList" :value="item.toLowerCase()">{{item}}</option>
            </select>
          </div>
        </div>
      </div>
      <div class="row">
        <button type="button" class="btn btn-primary ml-auto" style="margin-right: 15px;margin-bottom: 15px" @click="handleCreateSubmit">Submit</button>
      </div>
    </div>
  </div>

</template>

<script>
  import pagenation from "../components/pagenation";

  export default {
    name: "AdminUser",
    components: {
      pagenation,
    },
    data:function () {
      return {
        userList:[],
        pageId:1,
        pageSize:8,
        pageTotal:0,
        keyword:'',
        roleList:['User','Admin'],
        editform: {
          id: undefined,
          username: undefined,
          nickname: undefined,
          realname: undefined,
          email:undefined,
          role:[],
          disabled:undefined,
          password:undefined
        },
        createform:{
          username: undefined,
          nickname: undefined,
          realname: undefined,
          email:undefined,
          role:[],
          password:undefined
        }
      }
    },
    methods:{
      showPage:function(pageId,forceUpdate){
        if(pageId=='...')
          return
        if(forceUpdate){
          this.userList=[]
          this.pageTotal=0
        }
        if(forceUpdate||!this.userList[pageId-1]){
          this.$axios.get('/user/list',{
            params:{
              page: pageId - 1,
              size: this.pageSize,
              keyword: this.keyword
            }
          }).then(res=>{
            if(res.data.status==0) {
              if (res.data.data.totalPages > this.pageTotal) {
                this.pageTotal = res.data.data.totalPages
                this.userList = new Array(this.pageTotal)
              }
              this.$set(this.userList,pageId-1,res.data.data.content)
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
      handleEditClick:function (item) {
        this.editform.id=item.id
        this.editform.username=item.username
        this.editform.nickname=item.nickname
        this.editform.realname=item.realname
        this.editform.email=item.email
        this.editform.role=item.role.slice()
        this.editform.disabled=item.disabled
        this.editform.password=item.password
      },
      handleEditSubmit:function () {
        this.$axios.post('/user/update/'+this.editform.id,{
          'nickname':this.editform.nickname,
          'realname':this.editform.realname,
          'email':this.editform.email,
          'role':this.editform.role,
          'disabled':this.editform.disabled,
          'password':this.editform.password
        }).then(res=> {
          if(res.data.status==0){
            this.$toastr.success('Success')
            this.showPage(this.pageId,true)
          }
          else
            this.$toastr.warning(res.data.msg)
        })
      },
      handleCreateSubmit:function(){
        this.$axios.post('/user/add',{
          'username':this.createform.username,
          'nickname':this.createform.nickname,
          'realname':this.createform.realname,
          'email':this.createform.email,
          'role':this.createform.role,
          'password':this.createform.password
        }).then(res=> {
          if(res.data.status==0){
            this.$toastr.success('Success')
            this.showPage(1,true)
          }
          else
            this.$toastr.warning(res.data.msg)
        })
      }
    },
    computed:{

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