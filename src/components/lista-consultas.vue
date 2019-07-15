<template lang='pug'>
v-container.ma-0.pa-0
  h1 Lista de Consultas   
</template>

<script>
export default {
  name: 'lista-consultas',
  mounted () {
    const url = `${process.env.VUE_APP_API_BASE_URL}/agendamento/listar-consultas`
    this.axios.get(url)
      .then(data => {
        console.log(data)
      })
  }
  }
</script>

<style scoped>

</style>