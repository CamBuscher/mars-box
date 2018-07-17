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

app.post('/api/v1/items', (request, response) => {
  const item = request.body;

  if (!item.name) {
    return response.status(422)
      .send({ error: `Expected format: { name: <String>. You're missing a "name" property.`})
  }

  item.packed = false

  database('items').insert(item, 'id')
    .then(item_ids => {
      response.status(201).json({ id: item_ids[0]})
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})

app.delete('/api/v1/items/:id', (request, response) => {
  const {id} = request.params;

  database('items').where('id', id).del()
    .then(deletedRows => {
      if (deletedRows === 0) {
        response.status(404).json({ error: "Please enter a valid ID." })
      } else {
        response.sendStatus(204)
      }
    })
    .catch(error => response.status(500).json(error))
})

app.patch('/api/v1/items/:id', (request, response) => {
  const {id} = request.params;

  const { packed } = request.body;
  console.log(packed)
  if (packed === undefined) {
    return response.status(422)
      .send({ error: `Request body must have "packed" property with a boolean value.`})
  }

  database('items').where('id', id)
    .update({packed})
    .then(() => {
      response.status(200).json({id, packed})
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})

module.exports = app