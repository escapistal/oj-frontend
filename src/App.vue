<template>
    <div id="app">
        <nav id="nav" class="navbar navbar-expand-md bg-dark navbar-dark fixed-top">
            <router-link to="/" class="navbar-brand" @click.native="handleRouterClick(-1)">Online Judge |</router-link>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="collapsibleNavbar">
                <ul class="navbar-nav">
                    <li class="nav-item" v-for="(item,index) in getrouterList"
                        @click="handleRouterClick(index)"
                        data-toggle="collapse" data-target="#collapsibleNavbar.show">
                        <router-link :to="item.to" class="nav-link" :class="$route.path===item.to?'nav-selected':'nav-unselected'">
                            <img class="icon" :src="item.icon">{{item.msg}}
                        </router-link>
                    </li>
                </ul>
                <ul v-if="curUser.id" class="navbar-nav ml-auto">
                    <li class="nav-item dropdown">
                        <span class="nav-link dropdown-toggle" id="navbardrop" data-toggle="dropdown">
                            <img class="icon" src="@/assets/training.png">
                            {{curUser.nickname}}
                        </span>
                        <div class="dropdown-menu" style="left:unset;right:0;min-width:unset;padding: .25rem 0">
                            <router-link v-if="$store.getters.isAdmin" :to="'/admin'">
                                <span class="dropdown-item btn">Management</span>
                            </router-link>
                            <span class="dropdown-item btn">Profile</span>
                            <span class="dropdown-item btn">Settings</span>
                            <span class="dropdown-item btn">Stats</span>
                            <span class="dropdown-item btn" style="border-top: 1px solid rgba(0, 0, 0, .15) !important;" @click="handleLogoutClick">Logout</span>
                        </div>
                    </li>
                </ul>
                <div v-else class="ml-auto">
                    <button type="button" class="btn btn-dark rounded border" @click="signInModalVisible=true">Sign in</button>|
                    <button type="button" class="btn btn-dark rounded border" @click="signUpModalVisible=true">Sign up</button>
                </div>

            </div>
        </nav>
        <router-view class="router-view"></router-view>
        <transition-group name="fade">
            <div class="modal fade show" style="display: block" key="signInModal" v-show="signInModalVisible">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">Sign In</h4>
                            <button type="button" class="close" @click="signInModalVisible=false">&times;</button>
                        </div>
                        <div class="modal-body">
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                <span class="input-group-text">
                                    <img class="icon" src="@/assets/training.png">
                                </span>
                                </div>
                                <input type="text" class="form-control" placeholder="Username or Email" v-model="username">
                            </div>
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                <span class="input-group-text">
                                <img class="icon" src="@/assets/training.png">
                                </span>
                                </div>
                                <input type="password" class="form-control" placeholder="Password" v-model="password">
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-light mr-auto" @click="signInModalVisible=false;signUpModalVisible=true;">Sign Up</button>
                            <button type="button" class="btn btn-secondary" @click="handleSignInClick">Submit</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal fade show" style="display: block" key="signUpModal" v-show="signUpModalVisible">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">Sign Up</h4>
                            <button type="button" class="close" @click="signUpModalVisible=false">&times;</button>
                        </div>
                        <div class="modal-body">
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                <span class="input-group-text">
                                    <img class="icon" src="@/assets/training.png">
                                </span>
                                </div>
                                <input type="text" class="form-control" placeholder="Username" v-model="username">
                            </div>
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                <span class="input-group-text">
                                <img class="icon" src="@/assets/training.png">
                                </span>
                                </div>
                                <input type="password" class="form-control" placeholder="Password" v-model="password">
                            </div>
                            <div class="input-group mb-3 inp">
                                <div class="input-group-prepend">
                                <span class="input-group-text">
                                    <img class="icon" src="@/assets/training.png">
                                </span>
                                </div>
                                <input type="password" class="form-control" placeholder="Repeat Password" v-model="password2">
                            </div>
                            <div class="input-group mb-3 inp">
                                <div class="input-group-prepend">
                                <span class="input-group-text">
                                    <img class="icon" src="@/assets/training.png">
                                </span>
                                </div>
                                <input type="text" class="form-control" placeholder="Email" v-model="emailFirst"
                                       @input="handleAtInput">
                                <div class="input-group-prepend">
                                <span class="input-group-text" style="left: -1px;position: relative">
                                    @
                                </span>
                                </div>
                                <input type="text" class="form-control" style="left: -1px" placeholder="xxx.com/cn/org/..." v-model="emailSecond"
                                       ref="inputEmailSecond">
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-light mr-auto" @click="signUpModalVisible=false;signInModalVisible=true;">Sign in</button>
                            <button type="button" class="btn btn-secondary" @click="handleSignUpClick">Submit</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-backdrop fade show" key="modalBack" v-show="signInModalVisible||signUpModalVisible"></div>
        </transition-group>
    </div>
</template>
<script>
    import { mapState } from 'vuex'
    import qs from 'qs'
    export default {
        name: 'App',
        data: function () {
            return {
                routerSelectId:-1,
                username:'',
                password:'',
                password2:'',
                emailFirst:'',
                emailSecond:'',
                signInModalVisible:false,
                signUpModalVisible:false,
                routerList:[
                    {
                        to:"/",
                        icon:require("@/assets/training.png"),
                        msg:"Home",
                    },
                    {
                        to:"/problem",
                        icon:require("@/assets/training.png"),
                        msg:"Problem"
                    },{
                        to:"/contest",
                        icon:require("@/assets/training.png"),
                        msg:"Contest"
                    },
                    {
                        to:"/status",
                        icon:require("@/assets/training.png"),
                        msg:"Status"
                    },
                    {
                        to:"/about",
                        icon:require("@/assets/training.png"),
                        msg:"About"
                    },
                    {
                        to:"/admin/user",
                        icon:require("@/assets/training.png"),
                        msg:"Manage",
                        auth:true
                    },
                    {
                        to:"/admin",
                        icon:require("@/assets/training.png"),
                        msg:"API Document",
                        auth:true
                    }
                ]
            }
        },
        methods:{
            handleRouterClick:function (index) {
                this.routerSelectId=index
            },
            handleSignInClick:function () {
                if(!this.username||!this.password){
                    this.$toastr.warning('用户名/密码不能为空')
                    return
                }
                this.$axios.post('/user/login', qs.stringify({
                    username: this.username,
                    password: this.password
                })).then(response=>{
                    if(response.data.status!=0)
                        this.$toastr.warning(response.data.msg)
                    else{
                        this.username=''
                        this.password=''
                        this.$store.commit('login',response.data.data)
                        this.$toastr.info('欢迎回来'+response.data.data.nickname)
                        this.signInModalVisible=false;
                    }
                }).catch(error=>{
                    console.log(error);
                });
            },
            handleSignUpClick:function () {
                if(this.username.length<3||this.username.length>16)
                    this.$toastr.warning('用户名为3~16位字母/数字')
                else if(this.password.length<6||this.password.length>16)
                    this.$toastr.warning('密码为6~16位字母/数字/特殊字符')
                else if(this.password!=this.password2)
                    this.$toastr.warning('两次输入的密码不一致')
                else if(this.emailFirst==''||this.emailSecond==''||this.emailSecond.indexOf('.')<0)
                    this.$toastr.warning('邮箱格式不正确')
                else{
                    this.$axios.post('/user/register', qs.stringify({
                        username: this.username,
                        password: this.password,
                        email: this.email
                    })).then(response=>{
                        if(response.data.status!=0)
                            this.$toastr.warning(response.data.msg)
                        else{
                            this.password2=''
                            this.emailFirst=''
                            this.emailSecond=''
                            this.$toastr.info('注册成功，请登录')
                            this.signInModalVisible=true;
                            this.signUpModalVisible=false;
                        }
                    }).catch(error=>{
                        console.log(error);
                    });
                }
            },
            handleAtInput:function () {
                if(this.emailFirst.endsWith('@')) {
                    this.emailFirst=this.emailFirst.replace(/@/g,'')
                    this.$nextTick(() => {
                        this.$refs.inputEmailSecond.focus()
                    })
                }
            },
            handleLogoutClick:function () {
                this.$store.commit('logout')
            }
        },
        computed: {
            email:function () {
                return this.emailFirst+'@'+this.emailSecond
            },
            getrouterList:function () {
              if(this.$store.getters.isAdmin)
                  return this.routerList
              else
                  return this.routerList.slice(0,this.routerList.length-2)
            },
            ...mapState([
                // 映射 this.token 为 store.state.token
                'curUser'
            ])
        },
        mounted() {

        }
    }
</script>
<style lang="less">
    #app {
        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    .icon{
        width: 1.5em;
        height: 1.5em;
    }

    .nav-selected{
        border-bottom-right-radius: 0.25rem;
        border-bottom-left-radius: 0.25rem;
        border-bottom: 2px solid #dee2e6;
    }
    .nav-unselected{
        border-bottom-right-radius: 0.25rem;
        border-bottom-left-radius: 0.25rem;
        border-bottom: 2px solid #dee2e6;
        border-color: transparent;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }
    .fade-leave-to{
        display: none;
    }
    .fade-enter, .fade-leave-to{
        opacity: 0;
    }
    .router-view{
        padding-top: 60px;
        background-color: #e9ecef;
    }
    html{
        background-color: #e9ecef;
    }
    a{
        color:black;
    }
    .background{
        padding: 1.5rem 2rem 0.2rem;
        margin-top: 1rem;
        background-color: #ffffff;
        border-radius: 0.5rem;
        overflow: auto;
    }
</style>
