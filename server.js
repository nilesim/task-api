const express = require('express')

// use process.env variables to keep private variables,
require('dotenv').config()

// Express Middleware
const helmet = require('helmet') // creates headers that protect from attacks (security)
const bodyParser = require('body-parser') // turns response into usable format
const cors = require('cors')  // allows/disallows cross-site communication
const morgan = require('morgan') // logs requests

// db Connection w/ Heroku
// const db = require('knex')({
//   client: 'pg',
//   connection: {
//     connectionString: process.env.DATABASE_URL,
//     ssl: true,
//   }
// });

// db Connection w/ localhost
var db = require('knex')({
  client: 'oracledb',
  connection: {
    host : '10.201.237.54',
    user : 'RADAR',
    password : 'd_RADAR',
    database : 'tradbdev'
  }
});

// Controllers - aka, the db queries
const reconController = require('./controllers/reconController')
const taskController = require('./controllers/taskController')

// App
const app = express()

// App Middleware
const whitelist = ['http://localhost:3001']
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(helmet())
app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(morgan('combined')) // use 'tiny' or 'combined'

// App Routes - Auth
app.get('/', (req, res) => res.send('Welcome To Radar CRUD App'))
app.get('/recon', (req, res) => reconController.getTableData(req, res, db))
app.post('/recon', (req, res) => reconController.postTableData(req, res, db))
app.put('/recon', (req, res) => reconController.putTableData(req, res, db))
app.delete('/recon', (req, res) => reconController.deleteTableData(req, res, db))

app.get('/task', (req, res) => taskController.getTaskData(req, res, db))
app.post('/task', (req, res) => taskController.postTaskData(req, res, db))
app.put('/task', (req, res) => taskController.putTaskData(req, res, db))
app.delete('/task', (req, res) => taskController.deleteTaskData(req, res, db))


// App Server Connection
app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on port ${process.env.PORT || 3000}`)
})
