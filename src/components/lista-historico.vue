<template lang='pug'>
v-container(fluid)
  v-layout()
    v-flex.ml-3(lg2 md2 sm2 xs4)
      v-btn(outline @click="listarTodos") Todas
    v-flex(lg4 md4 sm4 xs6)
      v-select(v-model="medicoSecionado" 
      :items="listaDeMedicos" 
      label="Por Medico")
    v-flex(lg4 md4 sm4 xs6)
      v-menu( ref="menu"
        v-model="menu"
        :close-on-content-click="true"
        :nudge-right="40"
        lazy
        transition="scale-transition"
        offset-y
        full-width
        min-width="290px"
        )
        template(v-slot:activator="{ on }")
          v-text-field(v-model="dataSelecionada"
            label="Por Data "
            prepend-icon="event"
            readonly
            v-on="on"
          )
        v-date-picker(v-model="dataSelecionada" 
        @input="menu2 = false"
        )
  table.table.table
    thead
      tr
        th(scope="col") Data
        th(scope="col") Paciente
        th(scope="col") Medico
        th(scope="col") Hora
        th(scope="col") {{consultasParaoTemplate.length}} Consultas
    tbody
      tr(v-for="(consulta, i) in consultasParaoTemplate" :key="i")
        th(scope="row") {{consulta.data | formatDate}}
        th {{consulta.paciente}}
        th {{consulta.medico}}
        th {{consulta.data | formatDateOnlyHour}}
</template>

<script>
import moment from 'moment'
import mixins from '../mixins/mixins'
export default {
  name: 'lista-historico',
  mixins: [mixins],
  data () {
    return {
      menu: false,
      consultasParaoTemplate: [],
      consultasPassadas: [],
      medicoSecionado: null,
      dataSelecionada: ''

    }
  },
  mounted () {
    this.atualizarDados()
  },
  watch: {
    'medicoSecionado': function () {
      if ( this.medicoSecionado != null) {  
        this.consultasParaoTemplate = []
        for (let i = 0; i < this.consultasPassadas.length; i++) {
          const element = this.consultasPassadas[i];
          if(element.medico === this.medicoSecionado){
            this.consultasParaoTemplate.push(element)
          }
        }
      }        
    },
    'dataSelecionada': function () {
      if ( this.dataSelecionada != ''){
        this.consultasParaoTemplate = []
        for (let i = 0; i < this.consultasPassadas.length; i++) {
          const element = this.consultasPassadas[i];
          const elementDate = moment(element.data).format("YYYY MM DD")
          const dataSelecionada = moment(this.dataSelecionada).format("YYYY MM DD")
          if(elementDate === dataSelecionada){
            this.consultasParaoTemplate.push(element)
          }
        }
      }
    }
  },
  methods: {
    atualizarDados() {
      //Puxar e Ordenar lista de consultas
      this.consultasPassadas = []
      const url = `${process.env.VUE_APP_API_BASE_URL}/agendamento/listar-consultas`
       this.axios.get(url)
        .then(data => {
          const listaConsultasBase = data.data.sort( ( a, b ) => new Date(a.data) - new Date(b.data))
          for (let i = 0; i < listaConsultasBase.length; i++) {
          const element = listaConsultasBase[i];
            if(new Date(element.data) < new Date()) {
              this.consultasPassadas.push(element)    
            }
          }
          this.consultasParaoTemplate = this.consultasPassadas
        })
    },
    listarTodos () {
        this.medicoSecionado = null
        this.dataSelecionada = ''
        this.consultasParaoTemplate = this.consultasPassadas
      }    
  }
  }
</script>

<style scoped>

</style>