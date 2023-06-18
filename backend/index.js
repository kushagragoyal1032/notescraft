const connectToMongo = require('./db');
const express = require('express');
var cors = require('cors')

connectToMongo(); // function defination in db.js
const app = express()
const port = 3030 // port of the site 

app.use(cors())
app.use(express.json())

// Available routes 
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))
 
app.listen(port, () => {
  console.log(`NotesCraft backend listening on port http://localhost:${port}`)
})


// npm install -g nodemon -> nodemon .\index.js