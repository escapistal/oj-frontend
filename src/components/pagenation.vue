<template>
  <ul class="pagination">
    <li class="page-item" :class="{'disabled':pageId<=1}"@click="showPage(pageId-1,false)"><span class="page-link btn"><<</span></li>
    <li class="page-item" :class="{'active':id==pageId}" style="min-width: 42px;"
        v-for="id in pageIds" @click="showPage(id,false)">
      <span class="page-link btn">{{id}}</span>
    </li>
    <li class="page-item" :class="{'disabled':pageId>=pageTotal}" @click="showPage(pageId+1,false)"><span class="page-link btn">>></span></li>
  </ul>
</template>

<script>
  export default {
    name: "pagenation",
    props: {
      pageId: Number,
      pageSize: Number,
      pageTotal: Number,
      showPage: Function
    },
    computed: {
      pageIds: function () {
        let list = []
        if (this.pageTotal <= 9) {
          for (let i = 1; i <= this.pageTotal; i++)
            list.push(i)
          return list
        }
        if(this.pageId<=5){
          for(let i=1;i<=7;i++)
            list.push(i)
          list.push('...')
          list.push(this.pageTotal)
        }
        else if(this.pageId>=this.pageTotal-4){
          list.push(1)
          list.push('...')
          for(let i=this.pageTotal-6;i<=this.pageTotal;i++)
            list.push(i)
        }
        else{
          list.push(1)
          list.push('...')
          for (let i = this.pageId - 2; i <= this.pageId + 2; i++)
            list.push(i)
          list.push('...')
          list.push(this.pageTotal)
        }
        console.log(list)
        return list
      },
    }
  }
</script>

<style scoped>

</style>