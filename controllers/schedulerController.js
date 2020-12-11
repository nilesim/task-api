
const SchedulerColumns = {
  //TASK_ID, SCHEDULER_TYPE, SCHEDULER_EXP, STATUS
  TASK_ID: {
    title : "Task Id ",
    align: "left",
    editable: "false"
  }
}

const getSchedulerData = (req, res, db) => {
    db.select('*').from('RADAR_SCHEDULER')
      .then(items => {
        if(items.length){

          const tableData = {rows: items, columns : SchedulerColumns}
          res.json(items)
        } else {
          res.json({dataExists: 'false'})
        }
      })
      .catch(err => res.status(400).json({dbError: 'db error'}))
  }
  
  const postSchedulerData = (req, res, db) => {
    const { SCHEDULER_ID, TASK_ID, SCHEDULER_TYPE, SCHEDULER_EXP, STATUS } = req.body.payload
    db('RADAR_SCHEDULER').insert({SCHEDULER_ID, TASK_ID, SCHEDULER_TYPE, SCHEDULER_EXP, STATUS})
      .returning('*')
      .then(item => {
        res.json(item)
      })
      .catch(err => res.status(400).json({dbError: 'db error: ' + err + ' : ' + first + " , " + last + " , " + email }))
  }
  
  const putSchedulerData = (req, res, db) => {
    const { SCHEDULER_ID, TASK_ID, SCHEDULER_TYPE, SCHEDULER_EXP, STATUS } = req.body.payload
    db('RADAR_SCHEDULER').where({SCHEDULER_ID}).update({SCHEDULER_ID, TASK_ID, SCHEDULER_TYPE, SCHEDULER_EXP, STATUS})
      .returning('*')
      .then(item => {
        res.json({ SCHEDULER_ID, TASK_ID, SCHEDULER_TYPE, SCHEDULER_EXP, STATUS })
      })
      .catch(err => res.status(400).json({dbError: 'db error'}))
  }
  
  const deleteSchedulerData = (req, res, db) => {
    let errors = [];
    req.body.payload.map( item => {
      const { TASK_ID } = item
      db('RADAR_SCHEDULER').where({SCHEDULER_ID}).del()
        .then(() => {
          res.json({delete: 'true'})
        })
        .catch(err => res.status(400).json({dbError: 'db error'}))
      });
  }
  
  module.exports = {
    getSchedulerData,
    postSchedulerData,
    putSchedulerData,
    deleteSchedulerData
  }
  