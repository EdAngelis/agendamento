const mongoose = require('mongoose');
const schema = mongoose.Schema;

const consulta = new schema({
    atendente: {type: String},
    especialidadeMedico: {type: String},
    nomeMedico: {type: String},
    dataAgendada: {type: Date},
    horaAgendada: {type: String}
})

module.exports = mongoose.model('consulta', consulta);