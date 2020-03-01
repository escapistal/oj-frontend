<template>
  <ul class="pagination">
    <li class="page-item ml-auto" @click="showPage(1,false)"><a class="page-link" href="#">首页</a></li>
    <li class="page-item" :class="{'disabled':pageId==1}"@click="showPage(pageId-1,false)"><a class="page-link" href="#">上一页</a></li>
    <li class="page-item" :class="{'active':id==pageId}" style="min-width: 42px;"
        v-for="id in pageIds" @click="showPage(id,false)">
      <a class="page-link" href="#">{{id}}</a>
    </li>
    <li class="page-item" :class="{'disabled':pageId==pageTotal}" @click="showPage(pageId+1,false)"><a class="page-link" href="#">下一页</a></li>
    <li class="page-item" @click="showPage(pageTotal,false)"><a class="page-link" href="#">末页</a></li>
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
        if (this.pageTotal <= 7) {
          for (let i = 1; i <= this.pageTotal; i++)
            list.push(i)
          return list
        }
        let need = 0
        for (let i = this.pageId - 2; i <= this.pageId + 2; i++)
          if (i >= 1 && i <= this.pageTotal)
            list.push(i)
          else
            need++
        if (list[0] == 1) {
          for (let i = 1; i <= need; i++)
            list.push(list[list.length - 1] + 1)
        }
        if (list[list.length - 1] == this.pageTotal) {
          for (let i = 1; i <= need; i++)
            list.unshift(list[0] - 1)
        }
        if (list[0] == 1)
          list.push(list[list.length - 1] + 1)
        if (list[list.length - 1] == this.pageTotal)
          list.unshift(list[0] - 1)

        if (list[0] == 2)
          list.unshift(1)
        else if (list[0] > 2)
          list.unshift('...')

        if (list[list.length - 1] < this.pageTotal - 1)
          list.push('...')
        else if (list[list.length - 1] == this.pageTotal - 1)
          list.push(this.pageTotal)
        console.log(list)
        return list
      },
    }
  }
</script>

<style scoped>

</style>