<template>
  <div class="ace-container">
    <div class="ace-editor" ref="ace"></div>
  </div>
</template>

<script>
  import ace from 'ace-builds'

  import 'ace-builds/webpack-resolver'
  import 'ace-builds/src-noconflict/ext-language_tools'
  import 'ace-builds/src-noconflict/theme-chrome'

  import 'ace-builds/src-noconflict/mode-c_cpp'
  import 'ace-builds/src-noconflict/snippets/c_cpp'
  import 'ace-builds/src-noconflict/mode-java'
  import 'ace-builds/src-noconflict/snippets/java'
  import 'ace-builds/src-noconflict/mode-python'
  import 'ace-builds/src-noconflict/snippets/python'
  const modeArray = {
    'C':'ace/mode/c_cpp',
    'C++':'ace/mode/c_cpp',
    'Java':'ace/mode/java',
    'Python 2':'ace/mode/python',
    'Python 3':'ace/mode/python',
    'Python':'ace/mode/python'
  }

  export default {
    name:'ace-editor',
    props: {
      value: String,
      lang: String
    },
    mounted () {
      this.aceEditor = ace.edit(this.$refs.ace, {
        maxLines: 20,
        minLines: 20,
        fontSize: 14,
        value: this.value ? this.value : '',
        theme: this.themePath,
        mode: this.modeArray[this.lang],
        wrap: this.wrap,
        // snippets:this.snippetsPath,
        showPrintMargin:this.showPrintMargin,
        tabSize: 4
      })
      this.aceEditor.setOptions({
        enableSnippets: true,
        enableLiveAutocompletion: true,
        enableBasicAutocompletion: true
      })
      this.aceEditor.getSession().on('change', this.change)
    },
    data () {
      return {
        aceEditor: null,
        toggle: false,
        wrap: false,
        showPrintMargin:false,
        themePath: 'ace/theme/chrome',
        modePath: 'ace/mode/c_cpp',
        // snippetsPath: 'ace/snippets/c_cpp',
        modeArray: modeArray,
      }
    },
    methods: {
      change () {
        this.$emit('input', this.aceEditor.getSession().getValue())
      }
    },
    watch: {
      lang: function (val) {
        this.aceEditor.getSession().setMode(this.modeArray[val])
      }
    }
  }
</script>

<style lang="less" scoped>
  .ace-container {
    position: relative;

    .config-panel {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 50%;
      height: 100%;
      overflow: scroll;
      box-shadow: grey -5px 2px 3px;
      background-color: rgba(255, 255, 255, 0.5);
      z-index: 1;

      .item {
        margin: 10px auto;
        text-align: center;

        .title {
          color: white;
          margin: 0 10px;
          font-size: 14px;
        }
      }
    }

    .bookmarklet {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 20px;
      height: 20px;
      z-index: 2;
      cursor: pointer;
      border-width: 9px;
      border-style: solid;
      border-color: lightblue gray gray rgb(206, 173, 230);
      border-image: initial;
    }
  }
</style>
