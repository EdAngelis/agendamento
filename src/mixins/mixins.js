export default {
  data () {
    return {
      rules: {
        required: v => !!v || 'Campo requerido',
        checkPassord: v => v === this.senha || 'Senha não confere'
      },
      listaDeMedicos: [
        'Pernalonga',
        'Patolino',
        'Ligerinho',
        'Frajola',
        'Piu-Piu',
        'Papa-Léguas',
        'Hortelino',
        'Eufrazino',
        'Gaguinho'],
        especialidades: [
          { value: 'Dermatologia', text: 'Dermatologia' },
          { value: 'Cardiologia', text: 'Cardiologia' },
          { value: 'Gastroenterologia', text: 'Gastroenterologia' }
  
        ],
    }
  },
  methods: {
    listarConsultasMixin () {
      // Puxar e Ordenar lista de consultas
      const url = `${process.env.VUE_APP_API_BASE_URL}/agendamento/listar-consultas`
      this.axios.get(url)
        .then(data => {
          const listaConsultasBase = data.data.sort((a, b) => new Date(a.data) - new Date(b.data))
          for (let i = 0; i < listaConsultasBase.length; i++) {
            const element = listaConsultasBase[i]
            if (new Date(element.data) >= new Date()) {
              this.consultasFuturas.push(element)
            } else {
              this.consultasPassadas.push(element)
            }
          }
        })
    }
  }
}
