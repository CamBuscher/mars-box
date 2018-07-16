const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Mars Box';

app.use(bodyParser.json());
app.use(express.static('public'));

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}`)
})

app.get('/api/v1/items', (request, response) => {
  database('items').select()
    .then(items => {
      response.status(200).json(items)
    })
    .catch(error => {
      response.status(500).json({error})
    })
})

module.exports = app