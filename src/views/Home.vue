<template lang="pug">
v-container.pa-0.ma-0(fluid)
  v-layout(justify-center wrap)
    v-layout(justify-center align-center)
      v-icon.mr-2(size="50px" color="red") local_hospital
      v-flex(lg3 md3 sm3 xs12)
        h2.clinica.red--text CLÍNICA
    v-flex(lg6 md6 sm6 xs10)
      v-img.logo( src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Acme_Markets_lolo.svg/1200px-Acme_Markets_lolo.svg.png")
    v-flex(lg3 md3 sm0 xs0)
  toolbarComponent( @aba="mudarAba")
  //Conteúdo
  v-content.pa-0.ma-0.fluid
    v-layout
      v-flex(xs12)
        listarConsultas( v-if="aba === 'Agendamentos'")
        agendarComponent( v-if="aba === 'Nova Consulta'")
        listaHistorico( v-if="aba === 'Historico'")
</template>

<script>
import listaHistorico from '../components/lista-historico'
import listarConsultas from '../components/lista-consultas'
import agendarComponent from '../components/agendar-forms'
import toolbarComponent from '../components/toolbar'
export default {
  components: {
    toolbarComponent,
    agendarComponent,
    listarConsultas,
    listaHistorico
  },
  data () {
    return {
      aba: 'Agendamentos'
    }
  },
  methods: {
    mudarAba (aba) {
      this.aba = aba
    }
  }
}
</script>

<style lang="scss" scoped>
.clinica{
  font-family: 'Courier New', Courier, monospace;
  font-size: 30px;
}
</style>
