<template>
  <div class="container-fluid">
    <div class="background" style="margin-top: 0;margin-right:0;">
      <h4 class="text-left mb-3">System Configs</h4>
      <form class="form-inline mb-2 align-middle" v-for="item in configsList">
        <div class="form-group h-100">
          <input type="text" readonly class="form-control-plaintext" :value="item.key">
        </div>
        <div class="form-group h-100 mr-2">
          <input type="text" class="form-control" v-model="item.value">
        </div>
        <button type="button" class="btn btn-primary" @click="handleConfirm(item)">Confirm</button>
      </form>
    </div>
  </div>
</template>

<script>
  import qs from 'qs';
  export default {
    name: "AdminSystemConfig",
    data:function () {
      return {
        configs:{}
      }
    },
    methods:{
      getConfig: async function () {
        const res = await this.$axios.get('/common/options')
        this.configs = res.data.data
      },
      handleConfirm: async function (item) {
        const res = await this.$axios.post('/common/changeOption', qs.stringify(item))
        this.$toastr.success('Success')
        this.getConfig()
      }
    },
    computed:{
      configsList:function () {
        let res=[]
        for(let key in this.configs)
          res.push({key:key,value:this.configs[key]})
        return res
      }
    },
    beforeRouteEnter: function (to,from,next) {
      next(async vm => {
          vm.getConfig()
        }
      )
    },
    beforeRouteUpdate: async function (to,from,next) {
      this.getConfig()
      next()
    }

  }
</script>

<style scoped>

</style>