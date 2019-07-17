<template lang='pug'>
v-container(fluid)
  //Exibir lista por atributo, seleções.
  v-layout(wrap)
    v-flex.ml-2(lg2 md2 sm2 xs6)
      v-btn(outline @click="listarTodos") Todas
    v-flex.pr-5(lg3 md3 sm4 xs4)
      v-select(v-model="medicoSelecionado"
      :items="listaDeMedicos"
      label="Por Medico")
    v-flex.mr-3(v-if="windowWidth>500" md3 lg3 sm4 xs6 pr-2)
        v-select(v-model="especialidadeSelecionada"
        :items="especialidades" label="Por Especialidade")  
    v-flex(lg2 md2 sm4 xs6)
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
  //Tabela com lista de Consultas      
  table.table.table
    thead
      tr
        th(scope="col") Data
        th(scope="col") Paciente
        th(scope="col") Medico
        th(scope="col" v-if="windowWidth>500") Especialidade
        th(scope="col") Hora
        th(scope="col") {{consultasParaoTemplate.length}}
    tbody
      tr(v-for="(consulta, i) in consultasParaoTemplate" :key="i")
        th(scope="row") {{consulta.data | formatDate}}
        th {{consulta.paciente}}
        th {{consulta.medico}}
        th(v-if="windowWidth>500") {{consulta.especialidade}}
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
      medicoSelecionado: null,
      especialidadeSelecionada: null,
      dataSelecionada: ''

    }
  },
  mounted () {
    this.atualizarDados()
  },
  //Assistir mudanças das Variaveis de seleção
  watch: {
    'medicoSelecionado': function () {
      if (this.medicoSelecionado != null) {
        this.consultasParaoTemplate = []
        for (let i = 0; i < this.consultasPassadas.length; i++) {
          const element = this.consultasPassadas[i]
          if (element.medico === this.medicoSelecionado) {
            this.consultasParaoTemplate.push(element)
          }
        }
      }
    },
    'especialidadeSelecionada': function () {
      if (this.especialidadeSelecionada != null) {
        this.consultasParaoTemplate = []
        for (let i = 0; i < this.consultasPassadas.length; i++) {
          const element = this.consultasPassadas[i]
          if (element.especialidade === this.especialidadeSelecionada) {
            this.consultasParaoTemplate.push(element)
          }
        }
      }
    },
    'dataSelecionada': function () {
      if (this.dataSelecionada != '') {
        this.consultasParaoTemplate = []
        for (let i = 0; i < this.consultasPassadas.length; i++) {
          const element = this.consultasPassadas[i]
          const elementDate = moment(element.data).format('YYYY MM DD')
          const dataSelecionada = moment(this.dataSelecionada).format('YYYY MM DD')
          if (elementDate === dataSelecionada) {
            this.consultasParaoTemplate.push(element)
          }
        }
      }
    }
  },
  methods: {
    //Requisição axios para obter e Ordenar lista de consultas, guardando apenas consultas anteriores a data atual
    atualizarDados () {
      this.consultasPassadas = []
      const url = `${process.env.VUE_APP_API_BASE_URL}/agendamento/listar-consultas`
      this.axios.get(url)
        .then(data => {
          const listaConsultasBase = data.data.sort((a, b) => new Date(a.data) - new Date(b.data))
          for (let i = 0; i < listaConsultasBase.length; i++) {
            const element = listaConsultasBase[i]
            if (new Date(element.data) < new Date()) {
              this.consultasPassadas.push(element)
            }
          }
          //Criar uma Lista que irá para template e poderá ser alterada, e manter outra que não poderá ser alterada.
          this.consultasParaoTemplate = this.consultasPassadas
        })
    },
    //resetar filtro da lista e mostrar todas as consultas
    listarTodos () {
      this.medicoSelecionado = null
      this.especialidadeSelecionada = null
      this.dataSelecionada = ''
      this.consultasParaoTemplate = this.consultasPassadas
    }
  }
}
</script>

<style scoped>

</style>
