const router = require('express').Router();
const agendamentoSchema = require('../models/agendamento-models');
const repositorio = require('../repositorio');

router.post('/agendar-consulta', async (req, res, next) => {
  const newAgendamento = await new agendamentoSchema(req.body);
    await newAgendamento.save()
       .then(result => {
           console.log("Agendado")
           res.status(201).send({msg: 'Consulta Agendada'})
       })
 });
router.get('/listar-consultas', async (req, res, next) => {
  await agendametoSchema.find()
   .then(data => {
     res.send(data)
   })
});
router.delete('/remover-consulta', async (req, res, next) => {
  await agendamentoSchema.findByIdAndDelete({_id: req.params.id})
    .then(data => {
      res.send("")
    }).catch(err => {
      res.send("")
    }) 
})
router.post('/verificar-horarios', async (req, res, next) => {
  var horariosDisponiveis = ["8:00","8:30","9:00","9:30","10:00","10:30","11:00","11:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30"]  
  const buscahorarios = await agendamentoSchema.find({data: req.body.data, medico: req.body.medico})
    .then(result => {
      if(result.length === 0) {
        res.send(horariosDisponiveis)
      }else {
        for (let i = 0; i < result.length; i++) {
          const index = horariosDisponiveis.indexOf(result[i].hora)
          horariosDisponiveis.splice(index, 1)
        }
        res.send(horariosDisponiveis)
      }
    })
})
module.exports = router;
