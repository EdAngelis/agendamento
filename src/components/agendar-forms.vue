<template lang='pug'>
v-container.pa-1.ma-0
  v-form
    v-layout
      v-flex(md6 lg6 xs12 pr-2)
        v-select(v-model="dadosConsulta.atendente"
        box 
        :rules="[rules.required]" 
        :items="atendentes" label="Atendente")
      v-flex(md6 lg6 xs12 pr-3)
        v-text-field(
          v-model='dadosConsulta.senhaAtendente' 
          counter 
          label="Senha" 
          :append-icon="showSenha ? 'visibility' : 'visibility_off'"
          :type="showSenha ? 'text' : 'password'"
          :rules="[rules.required, rules.min8]" 
          @click:append="showSenha = !showSenha"
          required) 
    v-flex(xs12)
      v-text-field(
        v-model='dadosConsulta.namePaciente' 
        :rules="[rules.required]" 
        label="Nome Paciente")
    v-layout(wrap)  
      v-flex(md6 lg6 xs12 pr-2)
        v-select(v-model="especialidade" 
        box
        :rules="[rules.required]" 
        :items="especialidades" label="Especialidade")
      v-flex(md6 lg6 xs12 pr-2)
        v-select(v-model="dadosConsulta.nomeMedico" 
        box
        :rules="[rules.required]" 
        :items="medicosLista" label="Médico")
    v-layout
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
      v-flex.pl-1(md6 lg6 xs12 pr-2)
        v-select(v-model="dadosConsulta.horaAgendada" 
        :rules="[rules.required]" 
        :items="horasDisponiveis" label="Hora")
      
</template>

<script>
import medicosFromJson from '../../public/medicos.json'
export default {
  name: 'agendar-forms',
  data () {
    return {
      showSenha: false,
      dadosConsulta:{
        atendente: '',
        senhaAtendente: '',
        namePaciente: '',
        especialidadeMedico: '',
        nomeMedico: '',
        dataAgendada: '',
        horaAgendada: ''

      },
      atendentes: [
        { value: 'Lola Bunny', text: 'Lola Bunny', senha: '123' },
        { value: 'Petúnio', text: 'Petúnio', senha: '123' },
        { value: 'Pete Puma', text: 'Pete Puma', senha: '123' },

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
        validEmail: v => /.+@.+/.test(v) || 'E-mail não valido',
        min8: v => v.length >=8 || 'Mínimo de 8 caracteres',
        confirmPassword: v => v === this.register.password || 'Senhas não conferem',
        confirmEmail:  v => v === this.register.email || 'E-mails não conferem',
        validCep: v => /^[0-9]{5}-[0-9]{3}$/.test(v) || 'Digite um cep valido'
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
        console.log(this.dadosConsulta);
      }
}
}
</script>

<style scoped>

</style>