

const getTaskVersionData = (req, res, db) => {
    db.select('*').from('RADAR.RADAR_TASKS_VERSION')
      .then(items => {
        if(items.length){

          const tableData = {rows: items, columns : TaskColumns}
          res.json(items)
        } else {
          res.json({dataExists: 'false'})
        }
      })
      .catch(err => res.status(400).json({dbError: 'db error'}))
  }
  
  const postTaskVersionData = (req, res, db) => {
    const { VERSION_ID, TASK_ID, VALID_FROM, VALID_TO } = req.body.payload
    const added = new Date()
    db('RADAR.RADAR_TASKS_VERSION').insert({VERSION_ID, TASK_ID, VALID_FROM, VALID_TO})
      .returning('*')
      .then(item => {
        res.json(item)
      })
      .catch(err => res.status(400).json({dbError: 'db error: ' + err}))
  }
  
  const putTaskVersionData = (req, res, db) => {
    const { VERSION_ID, TASK_ID, VALID_FROM, VALID_TO } = req.body.payload
    db('RADAR.RADAR_TASKS_VERSION')
    .where({ TASK_ID }).where({ VERSION_ID })
    .update({VERSION_ID, TASK_ID, VALID_FROM, VALID_TO})
      .returning('*')
      .then(item => {
        res.json({ VERSION_ID, TASK_ID, VALID_FROM, VALID_TO })
      })
      .catch(err => res.status(400).json({dbError: 'db error: ' + err}))
  }
  
  const deleteTaskVersionData = (req, res, db) => {
    let errors = [];
    req.body.payload.map( item => {
      const { TASK_ID, VERSION_ID } = item
      db('RADAR.RADAR_TASKS_VERSION')
      .where({ TASK_ID }).where({ VERSION_ID }).del()
        .then(() => {
          res.json({delete: 'true'})
        })
        .catch(err => res.status(400).json({dbError: 'db error: ' + err}))
      });
  }
  
  module.exports = {
    getTaskVersionData,
    postTaskVersionData,
    putTaskVersionData,
    deleteTaskVersionData
  }
  