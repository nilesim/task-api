const getTaskData = (req, res, db) => {
    db.select('*').from('RADAR_TASKS')
      .then(items => {
        if(items.length){
          res.json(items)
        } else {
          res.json({dataExists: 'false'})
        }
      })
      .catch(err => res.status(400).json({dbError: 'db error'}))
  }
  
  const postTaskData = (req, res, db) => {
    const { TASK_ID, TASK_NAME, TASK_TYPE } = req.body
    const added = new Date()
    db('RADAR_TASKS').insert({TASK_ID, TASK_NAME, TASK_TYPE})
      .returning('*')
      .then(item => {
        res.json(item)
      })
      .catch(err => res.status(400).json({dbError: 'db error: ' + err + ' : ' + first + " , " + last + " , " + email }))
  }
  
  const putTaskData = (req, res, db) => {
    const { TASK_ID, TASK_NAME, TASK_TYPE } = req.body
    db('RADAR_TASKS').where({TASK_ID}).update({TASK_ID, TASK_NAME, TASK_TYPE})
      .returning('*')
      .then(item => {
        res.json({ TASK_ID, TASK_NAME, TASK_TYPE })
      })
      .catch(err => res.status(400).json({dbError: 'db error'}))
  }
  
  const deleteTaskData = (req, res, db) => {
    const { TASK_ID } = req.body
    db('RADAR_TASKS').where({TASK_ID}).del()
      .then(() => {
        res.json({delete: 'true'})
      })
      .catch(err => res.status(400).json({dbError: 'db error'}))
  }
  
  module.exports = {
    getTaskData,
    postTaskData,
    putTaskData,
    deleteTaskData
  }
  