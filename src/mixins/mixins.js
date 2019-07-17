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
        atendentes: [
          { value: 'Lola Bunny', text: 'Lola Bunny' },
          { value: 'Petunio', text: 'Petúnio' },
          { value: 'Pete Puma', text: 'Pete Puma' }
        ]
    }
  },
}
