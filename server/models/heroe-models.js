const mongoose = require('mongoose');
const schema = mongoose.Schema;

const heroe = new schema({
    name: {type: String, required: true, unique: true},
    company: {type: String, required: true},
    description: {type: String},
    img: {type: String}
})

module.exports = mongoose.model('heroe', heroe);