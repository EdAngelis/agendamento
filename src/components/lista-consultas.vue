<template lang='pug'>
v-container.ma-0.pa-0.fluid
  //Seleção para Filtrar lista de consultas
  v-layout.pa-2(wrap)
    v-flex.ml-3(lg2 md2 sm2 xs4)
      v-btn(outline @click="listarTodos") Todas
    v-flex.pr-3(lg3 md3 sm4 xs6)
      v-select(v-model="filtrarPorMedico"
      :items="listaDeMedicos"
      label="Por Medico")
    v-flex.pr-3(md3 lg3 sm4 xs6 pr-2)
      v-select(v-model="filtrarPorEspecialidade"
      :items="especialidades" label="Por Especialidade")  
    v-flex(lg2 md2 sm4 xs6)
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
          v-text-field(v-model="filtrarPorData"
            label="Por Data "
            prepend-icon="event"
            readonly
            v-on="on"
          )
        v-date-picker(v-model="filtrarPorData"
        @input="menu2 = false"
        :min="new Date().toISOString().substr(0, 10)")
  //Tabela com lista de consultas      
  table.table.table
    thead
      tr
        th(scope="col") Data
        th(scope="col") Paciente
        th(scope="col") Medico
        th(scope="col") Especialidade
        th(scope="col") Hora
        th(scope="col") {{consultasParaoTemplate.length}}
    tbody
      tr(v-for="(consulta, i) in consultasParaoTemplate" :key="i")
        th(scope="row") {{consulta.data | formatDate}}
        th {{consulta.paciente}}
        th {{consulta.medico}}
        th {{consulta.especialidade}}
        th {{consulta.data | formatDateOnlyHour}}
        //Botões de Cancelar e editar consultas que serão em texto ou icones dependendo do tamanho do screen
        div(v-if="windowWidth>700")
          v-btn(color="red" small outline @click="dialogDeleteOpen(consulta._id)") Cancelar Consulta
          v-btn(color="info" small outline @click="dialogEditOpen(consulta._id)") Mudar Horario
        div(v-if="windowWidth<700")
          v-btn(icon color="red" small outline @click="dialogDeleteOpen(consulta._id)")
            v-icon delete
          v-btn(icon color="info" small outline @click="dialogEditOpen(consulta._id)")
            v-icon edit
  //Dialog para cancelar consulta
  v-dialog(v-model="dialogDelete")
    v-container
      v-card
        //tabela com Consulta selecionada para confirmação do cancelamento
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
        //Confirmação de senha do atendente para autorizar cancelamento
        v-form(ref="form")
          v-layout(wrap)
            v-flex.mr-3.ml-3(sm4 md4 lg4 xs12 )
              v-select(v-model="atendente"
              :rules="[rules.required]"
              :items="atendentes" label="Atendente")
            v-flex.mr-3.ml-3(sm4 md4 lg4 xs12 )
              v-text-field(v-on:keyup="verificarSenha"
                v-model='senhaAtendente'
                counter
                label="Senha"
                :append-icon="showSenha ? 'visibility' : 'visibility_off'"
                :type="showSenha ? 'text' : 'password'"
                :rules="[rules.required, rules.checkPassord]"
                @click:append="showSenha = !showSenha"
                required)
            v-card-actions.ml-3
              v-layout
                v-btn(color="warning" @click="cancelarConsulta" :disabled="!logged ") Cancelar Consulta
                v-btn(color="primary" @click="resetVariaveis") não cancelar
  //Dialago para Editar Consulta
  v-dialog(v-model="editDialog")
    v-card
      //Tabela com Consulta que será editada
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
      //Abrir Date Picker para seleção de nova Data
      v-form(v-model="valid" ref="form")
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
        //Confirmar senha para autorizar edição da consulta
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
          v-btn(color="warning" @click="editarConsulta" :disabled="!valid") Mudar Horario
          v-btn(@click="resetVariaveis" color="info") cancelar
  v-snackbar(
      v-model="snackbar"
      :color="respostaServer.color"
      bottom
      vertical
      :timeout= 3000 ) {{respostaServer.msg}}
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
      dialogDelete: false,
      showSenha: false,
      logged: false,
      snackbar: false,
      editDialog: false,
      menu: false,
      menu2: false,
      valid: false,
      consultasFuturas: [],
      consultasParaoTemplate: [],
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
      date: null,
      atendente: null,
      filtrarPorMedico: null,
      filtrarPorEspecialidade: null,
      filtrarPorData: '',
      senhaAtendente: '',
      senha: '',
      respostaServer: {}
    }
  },
  mounted () {
    this.atualizarDados()
  },
  watch: {
    'atendente': function () {
      if ( this.atendente != null) {
      this.senha = senhasJson[this.atendente].senha
      }
    },
    //Enviar Requisição para obter horarios disponiveis 
    'date': function () {
      this.dadosParaEditar.data = this.date
      this.dadosParaEditar.medico = this.consultaParaEditar.medico
      const url = `${process.env.VUE_APP_API_BASE_URL}/agendamento/verificar-horarios`
      this.axios.post(url, this.dadosParaEditar)
        .then(data => {
          this.horasDisponiveis = data.data
        })
    },
    'filtrarPorMedico': function () {
      this.filtrarPorEspecialidade = null
      this.filtrarPorData = ''
      if (this.filtrarPorMedico != null) {
        this.consultasParaoTemplate = []
        for (let i = 0; i < this.consultasFuturas.length; i++) {
          const element = this.consultasFuturas[i]
          if (element.medico === this.filtrarPorMedico) {
            this.consultasParaoTemplate.push(element)
          }
        }
      }
    },
    'filtrarPorEspecialidade': function () {
      this.filtrarPorData = ''
      this.filtrarPorMedico = null
      if (this.filtrarPorEspecialidade != null) {
        this.consultasParaoTemplate = []
        for (let i = 0; i < this.consultasFuturas.length; i++) {
          const element = this.consultasFuturas[i]
          if (element.especialidade === this.filtrarPorEspecialidade) {
            this.consultasParaoTemplate.push(element)
          }
        }
      }
    },
    'filtrarPorData': function () {
      this.filtrarPorMedico = null
      this.filtrarPorEspecialidade = null
      if (this.filtrarPorData != '') {
        this.consultasParaoTemplate = []
        for (let i = 0; i < this.consultasFuturas.length; i++) {
          const element = this.consultasFuturas[i]
          const elementDate = moment(element.data).format('YYYY MM DD')
          const filtrarPorData = moment(this.filtrarPorData).format('YYYY MM DD')
          if (elementDate === filtrarPorData) {
            this.consultasParaoTemplate.push(element)
          }
        }
      }
    }
  },
  methods: {
    //Limpar Filtro e mostrar Todas consultas
    listarTodos () {
      this.filtrarPorMedico = null
      this.filtrarPorEspecialidade = null
      this.filtrarPorData = ''
      this.consultasParaoTemplate = this.consultasFuturas
    },

    dialogDeleteOpen (idConsulta) {
      this.senha = false
      //Loop para buscar consulta que será deletada para mostra no Dialog
      for (let i = 0; i < this.consultasFuturas.length; i++) {
        const element = this.consultasFuturas[i]
        if (element._id === idConsulta) {
          this.consultaParaCancelar = element
        }
      }
      this.dialogDelete = !this.dialogDelete
    },
    dialogEditOpen (idConsulta) {
      this.senha = false
      //Loop para buscar consulta que será Editada para mostra no Dialog
      for (let i = 0; i < this.consultasFuturas.length; i++) {
        const element = this.consultasFuturas[i]
        if (element._id === idConsulta) {
          this.consultaParaEditar = element
        }
      }
      this.editDialog = !this.editDialog
    },
    verificarSenha () {
      if (this.senhaAtendente === this.senha) {
        this.logged = true
      } else {
        this.logged = false
      }
    },
    cancelarConsulta () {
      const url = `${process.env.VUE_APP_API_BASE_URL}/agendamento/remover-consulta/${this.consultaParaCancelar._id}`
      this.axios.delete(url)
        .then(res => {
          this.respostaServer = res.data
         this.snackbar = true
          this.resetVariaveis()
          this.atualizarDados()
        })
    },
    editarConsulta () {
      this.dadosParaEditar._id = this.consultaParaEditar._id
      const url = `${process.env.VUE_APP_API_BASE_URL}/agendamento/editar-consulta`
      this.axios.put(url, this.dadosParaEditar)
        .then(res => {
          this.respostaServer = res.data
          this.snackbar = true
          this.resetVariaveis()
          this.atualizarDados()
        })
    },
    atualizarDados () {
      // Puxar e Ordenar lista de consultas
      this.consultasFuturas = []
      const url = `${process.env.VUE_APP_API_BASE_URL}/agendamento/listar-consultas`
      this.axios.get(url)
        .then(data => {
          const listaConsultasBase = data.data.sort((a, b) => new Date(a.data) - new Date(b.data))
          for (let i = 0; i < listaConsultasBase.length; i++) {
            const element = listaConsultasBase[i]
            if (new Date(element.data) >= new Date()) {
              this.consultasFuturas.push(element)
            }
          }
          this.consultasParaoTemplate = this.consultasFuturas
        })
    },
    resetVariaveis(){
      this.$refs.form.reset()
      this.logged = false
      this.senhaAtendente = ''
      this.senha = ''
      this.atendente = null
      this.dadosParaEditar.data = ''
      this.dadosParaEditar.hora = ''
      this.date = null
      this.dialogDelete = false
      this.editDialog = false

      
    }
  }
}
</script>

<style scoped>

</style>
