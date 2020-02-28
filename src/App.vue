<template>
    <div id="app">
        <nav id="nav" class="navbar navbar-expand-md bg-dark navbar-dark">
            <router-link to="/" class="navbar-brand" @click.native="handleRouterClick(-1)">Online Judge |</router-link>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="collapsibleNavbar">
                <ul class="navbar-nav">
                    <li class="nav-item" v-for="(item,index) in routerList" @click="handleRouterClick(index)">
                        <router-link :to="item.to" class="nav-link" :class="index==routerSelectId?'nav-selected':'nav-unselected'">
                            <img class="icon" :src="item.icon">{{item.msg}}
                        </router-link>
                    </li>
                </ul>
                <div class="ml-auto">
                    <button type="button" class="btn btn-dark rounded border" @click="signInModalVisible=true">Sign in</button>|
                    <button type="button" class="btn btn-dark rounded border" @click="signUpModalVisible=true">Sign up</button>
                </div>
            </div>
        </nav>
        <router-view></router-view>
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
                                <span class="input-group-text">
                                    @
                                </span>
                                </div>
                                <input type="text" class="form-control" placeholder="xxx.com/cn/org/..." v-model="emailSecond"
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
        {{token}}
        {{email}}
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
                        msg:"Home"
                    },
                    {
                        to:"/",
                        icon:require("@/assets/training.png"),
                        msg:"Problem"
                    },{
                        to:"/about",
                        icon:require("@/assets/training.png"),
                        msg:"Contest"
                    }
                ]
            }
        },
        methods:{
            handleRouterClick:function (index) {
                this.routerSelectId=index
            },
            handleSignInClick:function () {
                this.$axios.post('/api/user/login', qs.stringify({
                    username: this.username,
                    password: this.password
                })).then(response=>{
                    if(response.data.status!=0)
                        console.log(response.data.msg);
                    else{
                        this.$store.commit('setToken',response.data.data)
                        this.signInModalVisible=false;
                    }
                }).catch(error=>{
                    console.log(error);
                });
            },
            handleSignUpClick:function () {

                this.signUpModalVisible=false;
            },
            handleAtInput:function () {
                if(this.emailFirst.endsWith('@')) {
                    this.emailFirst=this.emailFirst.replace(/@/g,'')
                    this.$nextTick(() => {
                        this.$refs.inputEmailSecond.focus()
                    })
                }
            }
        },
        computed: {
            email:function () {
                return this.emailFirst+'@'+this.emailSecond
            },
            ...mapState([
                // 映射 this.token 为 store.state.token
                'token'
            ])
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

</style>
