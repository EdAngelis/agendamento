const router = require('express').Router();
const agendamentoSchema = require('../models/agendamento-models');
const repositorio = require('repositorio');

router.post('/agendar-consulta', async (req, res, next) => {
  const newAgendamento = await new agendamentoSchema(req.body);
  console.log(req.body);
  repositorio.verification(newAgendamento)
    await newHeroe.save()
      .then(result => {
          res.send({msg: 'Heroe Salved'})
      })
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
module.exports = router;

