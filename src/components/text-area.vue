<template>
  <textarea :ref="ref1" class="form-control textarea" :style="{'height': height}"
            v-model="v"></textarea>
</template>

<script>
  import calcTextareaHeight from '@/assets/calcTextareaHeight';
  export default {
    name: "text-area",
    props: {
      value: {
        type: String,
        default:''
      },
      ref1:{
        type: String,
        default:'textarea'+new Date().getTime()
      }
    },
    data:function () {
      return{
        height: undefined,
        v:this.value
      }
    },
    watch: {
      v:function () {
        this.height = calcTextareaHeight(this.$refs[this.ref1], 3, null).height;
        this.$emit('input',this.v)
      },
      value:function () {
        this.v=this.value
        this.height = calcTextareaHeight(this.$refs[this.ref1], 3, null).height;
      }
    },
    mounted() {
      this.$nextTick(
        function () {
          this.height = calcTextareaHeight(this.$refs[this.ref1], 3, null).height;
        }
      )
    },
    methods: {
    }
  }
</script>

<style scoped>
  .textarea{
    /*min-height:100px;*/
    /*max-height:300px;*/
    overflow: auto;
    /*height: auto;*/
  }
</style>