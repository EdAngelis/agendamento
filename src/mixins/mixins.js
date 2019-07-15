export default {
  data () {
    return {
      rules: {
          required: v => !!v || 'Campo requerido',
          checkPassord: v => v === this.senha || 'Senha não confere',
      }
    }
  }
}