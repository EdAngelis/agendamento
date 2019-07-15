<template lang='pug'>
v-container.ma-0.pa-0
  table.table.table
    thead
      tr
        th(scope="col") Data
        th(scope="col") Paciente
        th(scope="col") Medico
        th(scope="col") Hora
    tbody
      tr(v-for="(item, i) in items" :key="i")
        th(scope="row") {{item.data | formatDate}}
        th {{item.paciente}}
        th {{item.medico}}
        th {{item.data | formatDateOnlyHour}}




</template>

<script>
export default {
  name: 'lista-consultas',
  data () {
    return {
      fields: ['data', 'paciente', 'medico', 'hora',],
      items: [],
      itensOrdenados: []
    }
  },
  mounted () {
    const url = `${process.env.VUE_APP_API_BASE_URL}/agendamento/listar-consultas`
    this.axios.get(url)
      .then(data => {
        this.items = data.data
        this.itensOrdenados = this.items.sort( ( a, b ) => new Date(a.data) - new Date(b.data))
        console.log(this.items)
      })
  }
  }
</script>

<style scoped>

</style>