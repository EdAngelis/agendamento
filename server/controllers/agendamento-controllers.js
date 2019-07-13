const router = require('express').Router();
const agendamentoSchema = require('../models/agendamento-models');
const repositorio = require('../repositorio');

router.post('/agendar-consulta', async (req, res, next) => {
//  const newAgendamento = await new agendamentoSchema(req.body);
  console.log(req.body);
  //repositorio.verification(newAgendamento)
//     await newHeroe.save()
//       .then(result => {
//           res.send({msg: 'Heroe Salved'})
//       })
 });
router.get('/listar-consultas', async (req, res, next) => {
  await heroeSchema.find()
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
  const buscahorarios = await agendamentoSchema.find({dataAgendada: req.body.dataAgendada})
    .then(result => {
      console.log(result)
      if(result.length === 0) {
        res.send(horariosDisponiveis)
      }
    })
})
module.exports = router;
