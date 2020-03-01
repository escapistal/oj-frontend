<template>
    <div class="home">
        <div class="container" style="width: 80%">
            <div v-if="!showDetail" class="background">
                <h4 class="text-left">Announcements</h4>
                <table class="table table-hover" >
                    <tbody>
                    <tr v-for="item in announcementList[pageId-1]" :key="item.id">
                        <td class="text-left" @click="handleAnnouncementClick(item.id)" style="width: 60%"><a href="#">{{item.title}}</a></td>
                        <td class="text-left">{{item.createTime}}</td>
                        <td class="text-left">By {{item.createUser.nickname}}</td>
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
                <h5 class="text-left">{{announcement.title}}</h5>
                <mavon-editor
                        :value="announcement.content"
                        :subfield = "false"
                        :defaultOpen = "'preview'"
                        :toolbarsFlag = "false"
                        :boxShadow="false"
                        :transition="false"
                        :previewBackground="'#ffffff'"
                        style="border:0;z-index: 1000"
                ></mavon-editor>
            </div>
        </div>
        {{curUser}}
    </div>
</template>

<script>
    // @ is an alias to /src
    import {mapState} from "vuex";
    import pagenation from "../components/pagenation.vue";

    export default {
        name: 'Home',
        components: {
            pagenation
        },

        data: function () {
            return {
                announcementList:[],
                announcement:{},
                pageId:1,
                pageSize:8,
                pageTotal:0,
                showDetail:false,

            }
        },
        created: function () {
            this.$axios.get('/announcement/list',{
                params:{
                    page: this.pageId - 1,
                    size: this.pageSize
                }
            }).then(response=>{
                console.log(response)
                this.transData(response.data.data.content)
                this.pageTotal=response.data.data.totalPages
                if(this.pageTotal>0) {
                    this.announcementList=new Array(this.pageTotal)
                    this.announcementList[0]=(response.data.data.content);
                }
            })
        },
        methods:{
            handleAnnouncementClick:function(id){
                this.$axios.get('/announcement/'+id,{
                }).then(response=> {
                    this.announcement=response.data.data
                    this.showDetail=true
                    console.log(response)
                })
            },
            transData(list){
                list.forEach(v=>{
                    v.createTime=new Date(v.createTime).toLocaleString()
                    v.updateTime=new Date(v.updateTime).toLocaleString()
                    if(v.title.replace(/[\u0391-\uFFE5]/g,"aa").length>70) {
                        let len=0
                        console.log(v.title)
                        for (let i=0;i<v.title.length;i++) {
                            if ((v.title.charCodeAt(i) & 0xff00) != 0)
                                ++len
                            ++len
                            if(len>=70) {
                                v.title=v.title.substr(0,i)+'...'
                                break
                            }
                        }
                    }
                })
            },
            showPage:function(pageId,forceUpdate){
                if(pageId=='...'||pageId<1||pageId>this.pageTotal)
                    return
                if(forceUpdate||!this.announcementList[pageId-1]){
                    this.$axios.get('/announcement/list',{
                        params:{
                            page: pageId - 1,
                            size: this.pageSize
                        }
                    }).then(response=>{
                        console.log(response)
                        this.transData(response.data.data.content)
                        if(response.data.data.totalPages>this.pageTotal) {
                            this.pageTotal=response.data.data.totalPages
                            this.announcementList = new Array(this.pageTotal)
                        }
                        this.announcementList[pageId-1]=(response.data.data.content)
                        this.pageId=pageId
                    })
                }
                else
                    this.pageId=pageId
            }
        },
        computed :{

            ...mapState([
                'token','curUser'
            ])
        }
    }
</script>

<style scoped>
    a{
        color:black
    }

    /*.home{*/
    /*  padding-top: 60px;*/
    /*  position: fixed;*/
    /*  background-color: #e9ecef;*/
    /*  width: 100%;*/
    /*  height: 100%;*/
    /*}*/
</style>
