<template>
  <div class="container-fluid">
    {{contest}}
  </div>
</template>

<script>

  export default {
    name: "ContestDetail",
    props:['id'],
    data:function () {
      return {
        contest:undefined
      }
    },
    methods:{

    },
    beforeRouteEnter: function (to, from, next) {
      next(vm =>{
        vm.$axios.get('/contest/' + vm.id, {}).then(response => {
          vm.contest = response.data.data
        })
      })
    },
  }
</script>

<style scoped>

</style>