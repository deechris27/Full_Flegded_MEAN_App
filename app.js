const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

const app = express();

app.use(cors());

mongoose.connect(config.database);

mongoose.connection.on('connected', ()=>{
   console.log(`Connected to database ${config.database}`);
});

mongoose.connection.on('error', (err)=>{
   console.log(`Failed to connect to ${err}`);
});

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

const users = require('./routes/users');

app.use('/users', users);

const port = 3000 || process.env.PORT;

app.get('/', (req, res)=>{
  res.sendFile(__dirname, 'index.html');
});

app.listen(port, ()=>{
  console.log(`Connected to localhost on ${port}`);
});
