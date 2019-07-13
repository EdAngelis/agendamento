<template lang='pug'>
div  
  v-toolbar.toolbar(flat)
    v-menu(v-if="windowWidth<450" bottom left)
      template( v-slot:activator="{ on }")
        v-btn( icon v-on="on")
          v-icon more_vert
      v-list
        v-list-tile(v-for="(item, i ) in items" :key="i" @click="mudarAba(item.title)")
          v-btn(flat) {{item.title}}
    v-toolbar-items(v-if="windowWidth>450" v-for="(item, i ) in items" :key="i" @click="mudarAba(item.title)")
      v-btn(flat) {{item.title}}
</template>

<script>
import { vueWindowSizeMixin } from 'vue-window-size'
export default {
  name: 'toolbar',
  mixins: [vueWindowSizeMixin],
  data() {
    return {
      aba: '',
      items: [
          {title: 'Agendamentos'},
          {title: 'Historico'},
          {title: 'Nova Consulta'}
      ]
    }    
  },
  methods: {
    mudarAba (item) {
      this.$emit('aba', item)
    }
  }
}
</script>

<style lang="scss" scoped>
.toolbar{
    border-top: 1px solid;
    border-bottom: 1px solid;
    border-color: red;
}
</style>