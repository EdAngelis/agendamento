const router = require('express').Router();
const agendamentoSchema = require('../models/agendamento-models');
const moment = require ('moment')

router.post('/agendar-consulta', async (req, res, next) => {
   const newAgendamento = await new agendamentoSchema({
    atendente: req.body.atendente,
    especialidade: req.body.especialidade,
    medico: req.body.medico,
    data: moment(`${req.body.data} ${req.body.hora}`),
    paciente: req.body.paciente
  });
     await newAgendamento.save()
        .then(result => {
            res.status(201).send({msg: 'Consulta Agendada'})
        })
 });

router.get('/listar-consultas', async (req, res, next) => {
  await agendamentoSchema.find()
   .then(data => {
     res.send(data)
   })
});

router.delete('/remover-consulta/:id', async (req, res, next) => {
  await agendamentoSchema.findByIdAndDelete({_id: req.params.id})
    .then(data => {
      res.status(200).send({msg:'Consulta Cancelada', color:'red'})
    }).catch(err => {
      res.status(404).send("")
    }) 
})
router.post('/verificar-horarios', async (req, res, next) => {
  var horariosDisponiveis = ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30", "18:00"]
  const day = req.body.data
  const endOfDay = moment(day).endOf('day')
  await agendamentoSchema.find({data: {$gt: day, $lt: endOfDay}, medico: req.body.medico})
    .then(result => {
      if(result.length === 0) {
        res.send(horariosDisponiveis)
      }else {
        for (let i = 0; i < result.length; i++) {
          const date = result[i].data
          const hora = moment(date).format("HH:mm")
          const index = horariosDisponiveis.indexOf(hora)
          horariosDisponiveis.splice(index, 1)
        }
        res.send(horariosDisponiveis)
      }
    })
})

router.put('/editar-consulta', async (req, res, next) => {
  await agendamentoSchema.findByIdAndUpdate({_id: req.body._id})
        .then(result => {
          const newData = moment(`${req.body.data} ${req.body.hora}`).format("YYYY MM DD HH:mm")
          result.data = newData
          result.save()
            .then(data => {
              res.status(200).send({msg:'Consulta Editada', color:'info'})
            }).catch(err => {
               res.status(404).send('Consulta não Salva')
            })
        }).catch (err => {
          res.status(404).send('Banco não acessado')
        })
})
module.exports = router;
