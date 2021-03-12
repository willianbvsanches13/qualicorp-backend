const ClientModel = require('../models/Client');

class ClientController {
  async index (req, res) {
    const retorno = await ClientModel.find(req.query);

    return res.json(retorno);
  }

  async show (req, res) {
    const { id } = req.params;
    const retorno = await ClientModel.show(id);

    return res.json(retorno);
  }

  async store(req, res) {
    const retorno = await ClientModel.store(req.body);

    return res.json(retorno);
  }

  async update(req, res) {
    const { id } = req.params;
    const retorno = await ClientModel.update(id, req.body);

    return res.json(retorno);
  }

  async delete(req, res) {
    const { id } = req.params;
    const retorno = await ClientModel.delete(id);

    return res.json(retorno);
  }
}

module.exports = new ClientController();
