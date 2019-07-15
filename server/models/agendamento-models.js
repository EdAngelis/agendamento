const mongoose = require('mongoose');
const schema = mongoose.Schema;

const consulta = new schema({
    atendente: {type: String},
    especialidade: {type: String},
    medico: {type: String},
    data: {type: Date},
    paciente: {type: String}
})

module.exports = mongoose.model('consulta', consulta);