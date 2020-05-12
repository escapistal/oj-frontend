<template>
    <div class="home">
        <div class="container" style="width: 80%">
            <div v-if="!showDetail" class="background">
                <h4 class="text-left">Announcements</h4>
                <table class="table table-hover" >
                    <tbody>
                    <tr v-for="item in announcementList[pageId-1]" :key="item.id">
                        <td class="text-left" @click="handleAnnouncementClick(item.id)" style="width: 70%">{{item.title.strip(70)}}</td>
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
<!--        {{curUser}}-->
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
                })
            },
            showPage:function(pageId,forceUpdate){
                if(pageId=='...')
                    return
                if(forceUpdate||!this.announcementList[pageId-1]){
                    this.$axios.get('/announcement/list',{
                        params:{
                            page: pageId - 1,
                            size: this.pageSize
                        }
                    }).then(response=>{
                        if(response.data.status!=0)
                            this.$toastr.warning(response.data.msg)
                        else {
                            if (forceUpdate || response.data.data.totalPages > this.pageTotal) {
                                this.pageTotal = response.data.data.totalPages
                                this.announcementList = new Array(this.pageTotal)
                            }
                            this.$set(this.announcementList, pageId - 1, response.data.data.content)
                            this.pageId = pageId
                        }
                    })
                }
                else
                    this.pageId=pageId
            }
        },
        computed :{

            ...mapState([
                'curUser'
            ])
        }
    }
</script>

<style scoped>
    a{
        color:black
    }

    td{
        cursor: pointer;
    }
    /*.home{*/
    /*  padding-top: 60px;*/
    /*  position: fixed;*/
    /*  background-color: #e9ecef;*/
    /*  width: 100%;*/
    /*  height: 100%;*/
    /*}*/
</style>
