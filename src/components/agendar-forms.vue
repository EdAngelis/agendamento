<template lang='pug'>
v-container.pa-1.ma-0
  v-form(ref="form")
    v-layout(v-show="!logged")
      v-flex(md6 lg6 xs12 pr-2)
        v-select(v-model="atendente"
        box 
        :rules="[rules.required]" 
        :items="atendentes" label="Atendente")
      v-flex(md6 lg6 xs12 pr-3)
        v-text-field(v-on:keyup="verificarSenha"
          v-model='senhaAtendente' 
          counter 
          label="Senha Padrão 123" 
          :append-icon="showSenha ? 'visibility' : 'visibility_off'"
          :type="showSenha ? 'text' : 'password'"
          :rules="[rules.required, rules.checkPassord]" 
          @click:append="showSenha = !showSenha"
          required) 
    v-layout(v-show="logged")  
      v-flex(md6 lg6 sm6 xs12 pr-2)
        v-select(v-model="especialidade" 
        box
        :rules="[rules.required]" 
        :items="especialidades" label="Especialidade")
      v-flex(md6 lg6 sm6 xs12 pr-2 v-show="dadosConsulta.especialidade != ''")
        v-select(v-model="dadosConsulta.medico" 
        box
        :rules="[rules.required]" 
        :items="medicosLista" label="Médico")
    v-layout(v-show="dadosConsulta.medico != ''")
      v-flex.pr-1(xs12 md6 lg6)
        v-menu( ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :nudge-right="40"
          lazy
          transition="scale-transition"
          offset-y
          full-width
          min-width="290px"
        )
          template(v-slot:activator="{ on }")
            v-text-field(v-model="date"
              label="Data da Consulta"
              prepend-icon="event"
              readonly
              v-on="on"
            )
          v-date-picker(v-model="date" 
          @input="menu = false"
          :min="new Date().toISOString().substr(0, 10)")
      v-flex.pl-1(md6 lg6 xs12 pr-2 v-show="dadosConsulta.data != ''")
        v-select(v-model="dadosConsulta.hora" 
        :rules="[rules.required]" 
        :items="horasDisponiveis" label="Horario Disponível")
    v-layout  
      v-flex(xs12 v-show="dadosConsulta.hora != ''")
        v-text-field(
          v-model='dadosConsulta.paciente' 
          :rules="[rules.required]" 
          label="Nome Paciente")
    v-layout
      v-flex(v-if="dadosConsulta.paciente != ''")
        v-btn(outline @click="marcarConsulta") Marcar Consulta
    v-snackbar(
      v-model="snackbar"
      color="red"
      bottom
      vertical
      :timeout= 3000 ) Consulta Agendada
</template>

<script>
import mixins from '../mixins/mixins'
import medicosFromJson from '../../public/medicos.json'
import senhasJson from '../../public/senhas.json'
export default {
  name: 'agendar-forms',
  mixins: [mixins],
  data () {
    return {
      showSenha: false, logged: false, snackbar: false, menu: false,
      dadosConsulta:{
        atendente: '',
        paciente: '',
        especialidade: '',
        medico: '',
        data: '',
        hora: ''

      },
      atendente: null,
      senhaAtendente: '',
      senhasJson,
      senha: '',
      atendentes: [
        { value: 'Lola Bunny', text: 'Lola Bunny'},
        { value: 'Petunio', text: 'Petúnio'},
        { value: 'Pete Puma', text: 'Pete Puma'}
      ],
      especialidades: [
        { value: 'Dermatologia', text: 'Dermatologia'},
        { value: 'Cardiologia', text: 'Cardiologia'},
        { value: 'Gastroenterologia', text: 'Gastroenterologia'},

      ],
      especialidade: null,
      medicosLista: [],
      medicosFromJson,
      date: '',
      horasDisponiveis: [],
      
    }
  },
  watch: {
      'atendente': function () {
        this.senha = senhasJson[this.atendente].senha
        },
      'especialidade': function () {
        if( this.especialidade != '') {
        this.medicosLista = medicosFromJson[this.especialidade].medicos
        this.dadosConsulta.especialidade = this.especialidade
        }
      },
      'date': function () {
        if ( this.date != '') {
        this.dadosConsulta.data = this.date
        const url = `${process.env.VUE_APP_API_BASE_URL}/agendamento/verificar-horarios`
        this.axios.post( url , this.dadosConsulta)
          .then(data => {
            this.horasDisponiveis = data.data
          })
        }
      },
  },
  methods: {
    verificarSenha () {
      this.dadosConsulta.atendente = this.atendente
      if (this.senhaAtendente === senhasJson[this.atendente].senha) {
        this.logged = true
      }
    },
    marcarConsulta () {
      console.log(this.dadosConsulta)
      const url = `${process.env.VUE_APP_API_BASE_URL}/agendamento/agendar-consulta`
      this.axios.post( url, this.dadosConsulta )
        .then(data => {
          this.snackbar = true
          this.$refs.form.reset()
          this.logged = false
          this.dadosConsulta.atendente = '',
          this.dadosConsulta.paciente = '',
          this.dadosConsulta.especialidade = '',
          this.dadosConsulta.medico = '',
          this.dadosConsulta.data = '',
          this.dadosConsulta.hora = '',
          this.senhaAtendente = '',
          this.atendente = null,
          this.especialidade = null,
          this.medicosLista = [],
          this.horasDisponiveis = []
          this.$emit('atualizarDados')
        })
    },
  }
}
</script>

<style scoped>

</style>