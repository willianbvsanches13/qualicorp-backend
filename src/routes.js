const express = require('express');
const handle = require('express-async-handler');

const ClientController = require('./app/controllers/Client');

const routes = express.Router();

routes.get('/', handle((req, res) => res.send('OK')));

routes.get('/clients', handle(ClientController.index));
routes.get('/clients/:id', handle(ClientController.show));
routes.post('/clients', handle(ClientController.store));
routes.put('/clients/:id', handle(ClientController.update));
routes.delete('/clients/:id', handle(ClientController.delete));

module.exports = routes
