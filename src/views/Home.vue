<template lang="pug">
v-container.pa-0.ma-0(fluid)
  v-layout(justify-center wrap)
    v-layout(row justify-center align-center)
      v-icon.mr-2(size="50px" color="red") local_hospital
      v-flex(lg3 md3 xs12)
        h2.clinica.red--text CLÍNICA
    v-flex(lg6 md6 xs12)
      v-img.logo( src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Acme_Markets_lolo.svg/1200px-Acme_Markets_lolo.svg.png")
    v-flex(lg3 md3 xs0)
  toolbarComponent( @aba="mudarAba")
  //Conteúdo
  v-content()
    //- listarConsultas(v-if="aba != 'Nova Consulta'")
    agendarComponent(v-if="aba != 'Nova Consulta'" @aba="mudarAba")
</template>

<script>
import listarConsultas from '../components/lista-consultas'
import agendarComponent from '../components/agendar-forms'
import toolbarComponent from '../components/toolbar'
export default {
  components: {
    toolbarComponent,
    agendarComponent,
    listarConsultas
  },
  data () {
    return {
      aba: "",
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
