<template>
  <div>
    <div class="container w-75">
      <div class="background">
        <mavon-editor
                :value="content"
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
  </div>
</template>
<script>
  export default {
    name: 'About',
    data(){
      return{

      }
    },
    methods:{

    },
    mounted(){

    },
    computed:{
      content:function () {
        return '## 评测结果说明\n'+
          '* 排队中/Pending\n'+
          '程序仍然在评测队列中，尚未开始评测。\n'+
          '* 评测中/Judging\n'+
          '对应的评测任务已经被认领，正在评测中。\n'+
          '* 正确/Accepted(AC)\n'+
          '程序通过了所有测试点，均在时间空间限制内输出了正确答案。\n'+
          '* 答案错误/Wrong Answer(WA)\n'+
          '对于部分或全部测试点，程序没有给出正确的答案。\n'+
          '* 时间超限/Time Limit Exceed(TLE)\n'+
          '对于部分或全部测试点，程序没有在给定时间限制内完成计算。\n'+
          '* 内存超限/Memory Limit Exceed(MLE)\n'+
          '对于部分或全部测试点，程序申请了超出限制的内存。\n'+
          '* 运行错误/Runtime Error(RE)\n'+
          '对于部分或全部测试点，程序没有正常退出，而是中途异常退出，常见的有数组越界、除0错误、Java语言的空指针错误、Python语言的运行时错误等等。\n'+
          '* 格式错误/Presentation Error(PE)\n'+
          '对于部分或全部测试点，程序在规定限制内输出了正确答案，但是格式有误，导致此错误。\n'+
          '* 编译错误/Compile Error(CE)\n'+
          '程序在使用对应编译器编译时包含错误。\n'+
          '* 系统错误/System Error(SE)\n'+
          '后台捕捉到在评测流程进行过程中出现异常，通常与普通用户无关，需要管理员介入修复。\n'+
          '## 不同语言编译命令\n'+
          '* C (GCC 9.3.0)\n'+
          '```\n'+
          'gcc -O2 -std=c11 {src_path} -o {exe_path}\n'+
          '```\n'+
          '* C++ (G++ 9.3.0)\n'+
          '```\n'+
          'g++ -O2 -std=c++17 {src_path} -o {exe_path}\n'+
          '```\n'+
          '* Java (jdk 14.0.1)\n'+
          '```\n'+
          'javac {src_path} -d {exe_folder} -encoding UTF8\n'+
          '```\n'+
          '* Python2 (2.7.5)\n'+
          '```\n'+
          'python2 -m py_compile {src_path}\n'+
          '```\n'+
          '* Python3 (3.8.2)\n'+
          '```\n'+
          'python3 -m py_compile {src_path}\n'+
          '```'
      }
    }
  }
</script>
<style scoped>

</style>