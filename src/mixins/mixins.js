export default {
  data () {
    return {
      rules: {
          required: v => !!v || 'Campo requerido',
          checkPassord: v => v === this.senha || 'Senha não confere',
      },
      listaDeMedicos:[
      "Pernalonga", 
      "Patolino", 
      "Ligerinho",
      "Frajola",
      "Piu-Piu",
      "Papa-Léguas",
      "Hortelino",
      "Eufrazino",
      "Gaguinho"]
    }
  }
}
