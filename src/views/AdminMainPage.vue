<template>
    <iframe ref="iframe" id="iframe" src="http://39.96.54.145/swagger-ui.html" frameborder="0" style="width: 100%"></iframe>
</template>

<script>
  export default {
    name: "AdminMainPage",
    mounted(){
      const iframe = document.getElementById('iframe');
      const deviceHeight = document.documentElement.clientHeight;
      iframe.style.height = (Number(deviceHeight)-61) + 'px'; //数字是页面布局高度差
    },
  }
</script>

<style scoped>

</style>