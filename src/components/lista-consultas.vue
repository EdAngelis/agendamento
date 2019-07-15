<template lang='pug'>
v-container.ma-0.pa-0.fluid
  table.table.table
    thead
      tr
        th(scope="col") Data
        th(scope="col") Paciente
        th(scope="col") Medico
        th(scope="col") Hora
    tbody
      tr(v-for="(consulta, i) in consultas" :key="i")
        th(scope="row") {{consulta.data | formatDate}}
        th {{consulta.paciente}}
        th {{consulta.medico}}
        th {{consulta.data | formatDateOnlyHour}}
        div(v-if="windowWidth>750")  
          v-btn(color="red" small outline @click="dialogDeleteOpen(consulta._id)") Cancelar Consulta
          v-btn(color="info" small outline) Mudar Horario
        div(v-if="windowWidth<750")  
          v-btn(icon color="red" small outline @click="dialogDeleteOpen(consulta._id)")
            v-icon delete
          v-btn(icon color="info" small outline)
            v-icon edit
  v-dialog(v-model="dialogDelete")
    v-container(center justify-center texte-center)
      v-card  
        table.table.table
          thead
            tr
              th(scope="col") Data
              th(scope="col") Paciente
              th(scope="col") Medico
              th(scope="col") Hora
          tbody
            tr
              th(scope="row") {{consultaParaCancelar.data | formatDate}}
              th {{consultaParaCancelar.paciente}}
              th {{consultaParaCancelar.medico}}
              th {{consultaParaCancelar.data | formatDateOnlyHour}}
        v-layout
          v-flex.mr-3.ml-3(xs12 )
            v-select(v-model="atendente"
            :rules="[rules.required]" 
            :items="atendentes" label="Atendente")
          v-flex(xs12 )
            v-text-field(v-on:keyup="verificarSenha"
              v-model='senhaAtendente' 
              counter 
              label="Senha" 
              :append-icon="showSenha ? 'visibility' : 'visibility_off'"
              :type="showSenha ? 'text' : 'password'"
              :rules="[rules.required, rules.checkPassord]" 
              @click:append="showSenha = !showSenha"
              required) 
          v-card-actions
            v-layout
              v-btn(color="warning" @click="cancelarConsulta" :disabled="!logged") Cancelar Consulta
  v-snackbar(
      v-model="snackbar"
      color="warning"
      bottom
      vertical
      :timeout= 3000 ) {{msg}}
</template>

<script>
import { vueWindowSizeMixin } from 'vue-window-size'
import mixins from '../../src/mixins/mixins'
import senhasJson from '../../public/senhas.json'
export default {
  name: 'lista-consultas',
  mixins: [mixins, vueWindowSizeMixin],
  data () {
    return {
      dialogDelete: false, confirmacaoDoAtendente: false, showSenha: false, logged: false, snackbar: false,
      msg: '',
      fields: ['data', 'paciente', 'medico', 'hora',],
      consultas: [],
      itensOrdenados: [],
      consultaParaCancelar: {},
      atendente: null,
      senhaAtendente: '',
      senha: '',
      atendentes: [
        { value: 'Lola Bunny', text: 'Lola Bunny'},
        { value: 'Petunio', text: 'Petúnio'},
        { value: 'Pete Puma', text: 'Pete Puma'}
      ],
    }
  },
  updated () {
    const url = `${process.env.VUE_APP_API_BASE_URL}/agendamento/listar-consultas`
    this.axios.get(url)
      .then(data => {
        this.consultas = data.data
        this.itensOrdenados = this.consultas.sort( ( a, b ) => new Date(a.data) - new Date(b.data))
      })
  },
  mounted () {
    const url = `${process.env.VUE_APP_API_BASE_URL}/agendamento/listar-consultas`
    this.axios.get(url)
      .then(data => {
        this.consultas = data.data
        this.itensOrdenados = this.consultas.sort( ( a, b ) => new Date(a.data) - new Date(b.data))
      })
  },
  watch: {
      'atendente': function () {
      this.senha = senhasJson[this.atendente].senha
      }
  },
  methods: {
    dialogDeleteOpen(idConsulta) {
      for (let i = 0; i < this.consultas.length; i++) {
        const element = this.consultas[i];
        if (element._id === idConsulta) {
          this.consultaParaCancelar = element;
        }
      }
      this.dialogDelete = !this.dialogDelete;
    },
    verificarSenha () {
      if (this.senhaAtendente === this.senha) {
        this.logged = true
      }
      else
      {
        this.logged = false
      }    
  },
    cancelarConsulta ()  {
      const url = `${process.env.VUE_APP_API_BASE_URL}/agendamento/remover-consulta/${this.consultaParaCancelar._id}`
      this.axios.delete(url)
        .then(res => {
          this.msg = res.data
          this.snackbar = true
          this.dialogDelete = false
          console.log(res.data)
        })
    }
  }
}
</script>

<style scoped>

</style>