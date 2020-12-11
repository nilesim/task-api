
const TaskColumns = {
  TASK_ID: {
    title : "Task Id ",
    width: 100,
    editable: "false"
  },
  TASK_NAME: {
    title : "Task Name ",
    width: 250,
    editable: "true"
  }, 
  TASK_TYPE: {
    title : "Task Type ",
    width: 100,
    editable: "true"
  }
}

const getTaskData = (req, res, db) => {
    db.select('*').from('RADAR_TASKS')
      .then(items => {
        if(items.length){
          console.log(items);
          const tableData = {rows: items, columns : TaskColumns}
          res.json(items)
        } else {
          res.json({dataExists: 'false'})
        }
      })
      .catch(err => res.status(400).json({dbError: 'db error'}))
  }
  
  const postTaskData = (req, res, db) => {
    const { TASK_ID, TASK_NAME, TASK_TYPE } = req.body.payload
    const added = new Date()
    db('RADAR_TASKS').insert({TASK_ID, TASK_NAME, TASK_TYPE})
      .returning('*')
      .then(item => {
        res.json(item)
      })
      .catch(err => res.status(400).json({dbError: 'db error: ' + err}))
  }
  
  const putTaskData = (req, res, db) => {
    const { TASK_ID, TASK_NAME, TASK_TYPE } = req.body.payload
    db('RADAR_TASKS').where({TASK_ID}).update({TASK_ID, TASK_NAME, TASK_TYPE})
      .returning('*')
      .then(item => {
        res.json({ TASK_ID, TASK_NAME, TASK_TYPE })
      })
      .catch(err => res.status(400).json({dbError: 'db error: ' + err}))
  }
  
  const deleteTaskData = (req, res, db) => {
    let errors = [];
    req.body.payload.map( item => {
      const { TASK_ID } = item;
      console.log(item);
      console.log(TASK_ID);
      db('RADAR_TASKS').where({TASK_ID}).del()
      .then(() => {
        res.json({delete: 'true'})
      })
      .catch(err => res.status(400).json({dbError: 'db error: ' + err}))
    });
  }
  
  module.exports = {
    getTaskData,
    postTaskData,
    putTaskData,
    deleteTaskData
  }
  