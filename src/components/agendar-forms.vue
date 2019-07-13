<template lang='pug'>
v-container.pa-1.ma-0
  v-form
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
          label="Senha" 
          :append-icon="showSenha ? 'visibility' : 'visibility_off'"
          :type="showSenha ? 'text' : 'password'"
          :rules="[rules.required]" 
          @click:append="showSenha = !showSenha"
          required) 
    v-layout(wrap v-show="logged")  
      v-flex(md6 lg6 xs12 pr-2)
        v-select(v-model="especialidade" 
        box
        :rules="[rules.required]" 
        :items="especialidades" label="Especialidade")
      v-flex(md6 lg6 xs12 pr-2 v-show="dadosConsulta.especialidadeMedico != ''")
        v-select(v-model="dadosConsulta.nomeMedico" 
        box
        :rules="[rules.required]" 
        :items="medicosLista" label="Médico")
    v-layout(v-show="dadosConsulta.nomeMedico != ''")
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
          v-date-picker(v-model="date" @input="menu = false")
      v-flex.pl-1(md6 lg6 xs12 pr-2 v-show="dadosConsulta.dataAgendada != ''")
        v-select(v-model="dadosConsulta.horaAgendada" 
        :rules="[rules.required]" 
        :items="horasDisponiveis" label="Horario Disponível")
    v-layout  
      v-flex(xs12 v-show="dadosConsulta.horaAgendada != ''")
        v-text-field(
          v-model='dadosConsulta.namePaciente' 
          :rules="[rules.required]" 
          label="Nome Paciente")
</template>

<script>
import medicosFromJson from '../../public/medicos.json'
import senhasJson from '../../public/senhas.json'
export default {
  name: 'agendar-forms',
  data () {
    return {
      showSenha: false, logged: false,
      dadosConsulta:{
        atendente: '',
        namePaciente: '',
        especialidadeMedico: '',
        nomeMedico: '',
        dataAgendada: '',
        horaAgendada: ''

      },
      atendente: null,
      senhaAtendente: '',
      senhasJson,
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
      date: new Date().toISOString().substr(0, 10),
      menu: false,
      horasDisponiveis: [],
      rules: {
        required: v => !!v || 'Campo requerido',
      }
    }
  },
  watch: {
      'especialidade': function () {
        //Busca as cidades do estado selecionado e põe na variavel Cidades
        this.medicosLista = medicosFromJson[this.especialidade].medicos
        this.dadosConsulta.especialidadeMedico = this.especialidade
      },
      'date': function () {
        this.dadosConsulta.dataAgendada = this.date
        const url = `${process.env.VUE_APP_API_BASE_URL}/agendamento/verificar-horarios` 
        this.axios.post( url, this.dadosConsulta)
          .then(data => {
            this.horasDisponiveis = data.data
          })
      },
/*      'atendente': function () {
        this.senhaAtendente = senhasJson[this.atendente].senha
        console.log(this.senhaAtendente);
        
      } */
  },
  methods: {
    verificarSenha () {
      this.dadosConsulta.atendente = this.atendente
      if (this.senhaAtendente === senhasJson[this.atendente].senha) {
        this.logged = true
      }
    }
  }
}
</script>

<style scoped>

</style>