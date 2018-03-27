require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');

const port = process.env.PORT;

const app = express();

app.use(bodyParser.json());

require('./routes/todos')(app);
require('./routes/users')(app);

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

module.exports = { app };