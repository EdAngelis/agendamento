<template lang='pug'>
v-container.ma-0.pa-0.fluid
  v-layout()
    v-flex.ml-3(lg2 md2 sm2 xs4)
      v-btn(outline @click="listarTodos") Todas
    v-flex(lg4 md4 sm4 xs6)
      v-select(v-model="medicoSecionado" 
      :items="listaDeMedicos" 
      label="Por Medico")
    v-flex(lg4 md4 sm4 xs6)
      v-menu( ref="menu2"
        v-model="menu2"
        :close-on-content-click="false"
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
        :min="new Date().toISOString().substr(0, 10)")
  table.table.table
    thead
      tr
        th(scope="col") Data
        th(scope="col") Paciente
        th(scope="col") Medico
        th(scope="col") Hora
        th(scope="col") {{consultasOrdenados.length}} Consultas
    tbody
      tr(v-for="(consulta, i) in consultasOrdenados" :key="i")
        th(scope="row") {{consulta.data | formatDate}}
        th {{consulta.paciente}}
        th {{consulta.medico}}
        th {{consulta.data | formatDateOnlyHour}}
        div(v-if="windowWidth>700")  
          v-btn(color="red" small outline @click="dialogDeleteOpen(consulta._id)") Cancelar Consulta
          v-btn(color="info" small outline @click="dialogEditOpen(consulta._id)") Mudar Horario
        div(v-if="windowWidth<700")  
          v-btn(icon color="red" small outline @click="dialogDeleteOpen(consulta._id)")
            v-icon delete
          v-btn(icon color="info" small outline @click="dialogEditOpen(consulta._id)")
            v-icon edit
  v-dialog(v-model="dialogDelete")
    v-container
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
        v-layout(wrap)
          v-flex.mr-3.ml-3(sm4 md4 lg4 xs12 )
            v-select(v-model="atendente"
            :rules="[rules.required]" 
            :items="atendentes" label="Atendente")
          v-flex(sm4 md4 lg4 xs12 )
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
  v-dialog(v-model="editDialog")
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
              th(scope="row") {{consultaParaEditar.data | formatDate}}
              th {{consultaParaEditar.paciente}}
              th {{consultaParaEditar.medico}}
              th {{consultaParaEditar.data | formatDateOnlyHour}}
      v-layout()
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
                label="Coloque a nova Data "
                prepend-icon="event"
                readonly
                v-on="on"
              )
            v-date-picker(v-model="date" 
            @input="menu = false"
            :min="new Date().toISOString().substr(0, 10)")
        v-flex.pl-1(md6 lg6 xs12 pr-2 v-show="dadosParaEditar.data != ''")
          v-select(v-model="dadosParaEditar.hora" 
          :rules="[rules.required]" 
          :items="horasDisponiveis" label="Horario Disponível")
      v-layout(wrap)
        v-flex.mr-3.ml-3(sm4 md4 lg4 xs12 )
          v-select(v-model="atendente"
          :rules="[rules.required]" 
          :items="atendentes" label="Atendente")
        v-flex(sm4 md4 lg4 xs12 )
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
        v-btn(color="warning" @click="editarConsulta" :disabled="!logged") Mudar Horario
  v-snackbar(
      v-model="snackbar"
      color="warning"
      bottom
      vertical
      :timeout= 3000 ) {{msg}}
</template>

<script>
import moment from 'moment'
import { vueWindowSizeMixin } from 'vue-window-size'
import medicosFromJson from '../../public/medicos.json'
import mixins from '../../src/mixins/mixins'
import senhasJson from '../../public/senhas.json'
export default {
  name: 'lista-consultas',
  mixins: [mixins, vueWindowSizeMixin],
  data () {
    return {
      dialogDelete: false, confirmacaoDoAtendente: false, showSenha: false, logged: false, snackbar: false,
      editDialog: false, menu: false, menu2: false,
      fields: ['data', 'paciente', 'medico', 'hora',],
      consultas: [],
      listaConsultasBase: [],
      consultasOrdenados: [],
      consultasPorMedico: [],
      consultasPorData: [],
      horasDisponiveis: [],
      medicos: [],
      consultaParaCancelar: {},
      consultaParaEditar: {},
      dadosParaEditar: {
        medico: '',
        data: '',
        hora: '',
        _id: ''
      },
      atendente: null,
      medicoSecionado: null,
      dataSelecionada: '',
      senhaAtendente: '',
      senha: '',
      date: '',
      msg: '',
      atendentes: [
        { value: 'Lola Bunny', text: 'Lola Bunny'},
        { value: 'Petunio', text: 'Petúnio'},
        { value: 'Pete Puma', text: 'Pete Puma'}
      ],
    }
  },
  mounted () {
    //Puxar e Ordenar lista de consultas
    this.listarConsultas() 
  },
  watch: {
      'atendente': function () {
      this.senha = senhasJson[this.atendente].senha
      },
      'date': function () {
        this.dadosParaEditar.data = this.date
        this.dadosParaEditar.medico = this.consultaParaEditar.medico
        console.log(this.dadosParaEditar)
        const url = `${process.env.VUE_APP_API_BASE_URL}/agendamento/verificar-horarios`
        this.axios.post( url , this.dadosParaEditar)
          .then(data => {
            this.horasDisponiveis = data.data
          })
      },
      'medicoSecionado': function () {
        this.consultasOrdenados = []
        for (let i = 0; i < this.listaConsultasBase.length; i++) {
          const element = this.listaConsultasBase[i];
          if(element.medico === this.medicoSecionado){
            this.consultasOrdenados.push(element)
            console.log(this.consultasOrdenados)
          }
        }
      },
      'dataSelecionada': function () {
        this.consultasOrdenados = []
        for (let i = 0; i < this.listaConsultasBase.length; i++) {
          const element = this.listaConsultasBase[i];
          const elementDate = moment(element.data).format("YYYY MM DD")
          const dataSelecionada = moment(this.dataSelecionada).format("YYYY MM DD")
          console.log(elementDate)
          console.log(dataSelecionada)
          if(elementDate === dataSelecionada){
            this.consultasOrdenados.push(element)
            console.log(this.consultasOrdenados)
          }
        }
      }

  },
  methods: {
    listarConsultas() {
    //Puxar e Ordenar lista de consultas
    const url = `${process.env.VUE_APP_API_BASE_URL}/agendamento/listar-consultas`
    this.axios.get(url)
      .then(data => {
        this.consultas = data.data
        this.consultasOrdenados = this.consultas.sort( ( a, b ) => new Date(a.data) - new Date(b.data))
        this.listaConsultasBase = this.consultasOrdenados
      })
    },
    listarTodos () {
        this.listarConsultas()
        this.medicoSecionado = null
        this.dataSelecionada = ''
      },

    dialogDeleteOpen(idConsulta) {
      for (let i = 0; i < this.consultas.length; i++) {
        const element = this.consultas[i];
        if (element._id === idConsulta) {
          this.consultaParaCancelar = element;
        }
      }
      this.dialogDelete = !this.dialogDelete;
    },
    dialogEditOpen(idConsulta) {
      for (let i = 0; i < this.consultas.length; i++) {
        const element = this.consultas[i];
        if (element._id === idConsulta) {
          this.consultaParaEditar = element;
        }
      }
      this.editDialog = !this.editDialog;
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
          this.logged = false
          this.senhaAtendente = ''
        })
    },
    editarConsulta () {
      this.dadosParaEditar._id = this.consultaParaEditar._id
      const url = `${process.env.VUE_APP_API_BASE_URL}/agendamento/editar-consulta`
      this.axios.put(url, this.dadosParaEditar)
        .then(res => {
          this.msg = res.data
          this.snackbar = true
          this.editDialog = false
          this.logged = false
          this.senhaAtendente = ''
          this.dadosParaEditar.data = ''
          this. dadosParaEditar.hora = ''
          this.date = ''
        })
       
    }
  }
}
</script>

<style scoped>

</style>