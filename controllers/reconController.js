const getTableData = (req, res, db) => {
    db.select('*').from('RADAR_RECONCILIATION_DEFINITION')
      .then(items => {
        if(items.length){
          res.json(items)
        } else {
          res.json({dataExists: 'false'})
        }
      })
      .catch(err => res.status(400).json({dbError: 'db error'}))
  }
  
  const postTableData = (req, res, db) => {
    const { TASK_ID, TASK_VERSION_ID, SOURCE_1_ID, SOURCE_2_ID, SOURCE_1_SQL, SOURCE_2_SQL, SOURCE_1_REPORTING_NAME, SOURCE_2_REPORTING_NAME, EMAIL_FROM, EMAIL_TO, EMAIL_SUBJECT, EMAIL_INFO, TICKET_TO, TICKET_INFO, RESULTS_NEED_VERIFICATION, SCREEN_INTEGRATION, TICKET_OWNER, TICKET_SUBJECT, SOURCE_1_KEYS, SOURCE_1_VALUES, SOURCE_1_SUPPORT, SOURCE_2_KEYS, SOURCE_2_VALUES, SOURCE_2_SUPPORT, SOURCE_1_FILTER, SOURCE_2_FILTER } = req.body
    const added = new Date()
    db('RADAR_RECONCILIATION_DEFINITION')
      .insert({TASK_ID, TASK_VERSION_ID, SOURCE_1_ID, SOURCE_2_ID, SOURCE_1_SQL, SOURCE_2_SQL, SOURCE_1_REPORTING_NAME, SOURCE_2_REPORTING_NAME, EMAIL_FROM, EMAIL_TO, EMAIL_SUBJECT, EMAIL_INFO, TICKET_TO, TICKET_INFO, RESULTS_NEED_VERIFICATION, SCREEN_INTEGRATION, TICKET_OWNER, TICKET_SUBJECT, SOURCE_1_KEYS, SOURCE_1_VALUES, SOURCE_1_SUPPORT, SOURCE_2_KEYS, SOURCE_2_VALUES, SOURCE_2_SUPPORT, SOURCE_1_FILTER, SOURCE_2_FILTER})
      .returning('*')
      .then(item => {
        res.json(item)
      })
      .catch(err => res.status(400).json({dbError: 'db error: ' + err + ' : ' + TASK_ID + " , " + TASK_VERSION_ID }))
  }
  
  const putTableData = (req, res, db) => {
    const { TASK_ID, TASK_VERSION_ID, SOURCE_1_ID, SOURCE_2_ID, SOURCE_1_SQL, SOURCE_2_SQL, SOURCE_1_REPORTING_NAME, SOURCE_2_REPORTING_NAME, EMAIL_FROM, EMAIL_TO, EMAIL_SUBJECT, EMAIL_INFO, TICKET_TO, TICKET_INFO, RESULTS_NEED_VERIFICATION, SCREEN_INTEGRATION, TICKET_OWNER, TICKET_SUBJECT, SOURCE_1_KEYS, SOURCE_1_VALUES, SOURCE_1_SUPPORT, SOURCE_2_KEYS, SOURCE_2_VALUES, SOURCE_2_SUPPORT, SOURCE_1_FILTER, SOURCE_2_FILTER } = req.body
    db('RADAR_RECONCILIATION_DEFINITION').where({TASK_ID}).where({TASK_VERSION_ID})
      .update({TASK_ID, TASK_VERSION_ID, SOURCE_1_ID, SOURCE_2_ID, SOURCE_1_SQL, SOURCE_2_SQL, SOURCE_1_REPORTING_NAME, SOURCE_2_REPORTING_NAME, EMAIL_FROM, EMAIL_TO, EMAIL_SUBJECT, EMAIL_INFO, TICKET_TO, TICKET_INFO, RESULTS_NEED_VERIFICATION, SCREEN_INTEGRATION, TICKET_OWNER, TICKET_SUBJECT, SOURCE_1_KEYS, SOURCE_1_VALUES, SOURCE_1_SUPPORT, SOURCE_2_KEYS, SOURCE_2_VALUES, SOURCE_2_SUPPORT, SOURCE_1_FILTER, SOURCE_2_FILTER})
      .returning('*')
      .then(item => {
        res.json(TASK_ID, TASK_VERSION_ID, SOURCE_1_ID, SOURCE_2_ID, SOURCE_1_SQL, SOURCE_2_SQL, SOURCE_1_REPORTING_NAME, SOURCE_2_REPORTING_NAME, EMAIL_FROM, EMAIL_TO, EMAIL_SUBJECT, EMAIL_INFO, TICKET_TO, TICKET_INFO, RESULTS_NEED_VERIFICATION, SCREEN_INTEGRATION, TICKET_OWNER, TICKET_SUBJECT, SOURCE_1_KEYS, SOURCE_1_VALUES, SOURCE_1_SUPPORT, SOURCE_2_KEYS, SOURCE_2_VALUES, SOURCE_2_SUPPORT, SOURCE_1_FILTER, SOURCE_2_FILTER)
      })
      .catch(err => res.status(400).json({dbError: 'db error'}))
  }
  
  const deleteTableData = (req, res, db) => {
    const { TASK_ID } = req.body
    db('RADAR_RECONCILIATION_DEFINITION').where({TASK_ID}).where({TASK_VERSION_ID}).del()
      .then(() => {
        res.json({delete: 'true'})
      })
      .catch(err => res.status(400).json({dbError: 'db error'}))
  }
  
  module.exports = {
    getTableData,
    postTableData,
    putTableData,
    deleteTableData
  }
  