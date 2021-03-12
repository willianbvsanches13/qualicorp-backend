const yup = require('yup');
const neo4j = require('../../database');
const uuid = require('uuid');

let schema = yup.object().shape({
  name: yup.string().required(),
  cpf: yup.string().required(),
  email: yup.string().email().required(),
  phone: yup.number().positive().integer().required(),
  city: yup.string(),
  state: yup.string(),
  address: yup.string(),
  district: yup.string(),
  number: yup.string(),
  complement: yup.string(),
  gender: yup.string(),
  birth: yup.date(),
});

class ClientModel {
  async find(queryParams) {
    const { name = '', page = '1', perPage = '10' } = queryParams;
    const pagination = ` SKIP ${(Number(page) - 1) * Number(perPage)} LIMIT ${perPage} `;
    let retorno = null, count = 0;
    if (name) {
      const query = `MATCH (c:Client) WHERE c.name CONTAINS $name RETURN c`;
      const queryCount = `MATCH (c:Client) WHERE c.name CONTAINS $name RETURN count(c)`;

      retorno = await neo4j.run(`${query} ${pagination}`, { name });
      count = await neo4j.run(queryCount);
    } else {
      const query = `MATCH (c:Client) RETURN c`;
      const queryCount = `MATCH (c:Client) RETURN count(c)`;

      retorno = await neo4j.run(`${query} ${pagination}`);
      count = await neo4j.run(queryCount);
    }

    const total = count.records[0]._fields[0].low;

    return {
      meta: {
        total,
        page,
        perPage,
      },
      data: retorno.records
    };
  }

  async show(id) {
    const query = `MATCH (c:Client) WHERE c.id = $id RETURN c`;
    const retorno = await neo4j.run(query, { id });

    return retorno.records;
  }

  async store(data) {
    await schema.validate(data);

    const query = `
      CREATE (Person:Client {
        id: $id,
        name: $name,
        cpf: $cpf,
        email: $email,
        phone: $phone
        ${data.city ? ',city: $city' : ''}
        ${data.state ? ',state: $state' : ''}
        ${data.address ? ',address: $address' : ''}
        ${data.district ? ',district: $district' : ''}
        ${data.number ? ',number: $number' : ''}
        ${data.complement ? ',complement: $complement' : ''}
        ${data.gender ? ',gender: $gender' : ''}
        ${data.birth ? ',birth: $birth' : ''}
      })
    `;

    const retorno = await neo4j.run(query, {
      ...data,
      id: uuid.v1(),
    });

    return retorno.summary.query.parameters;
  }

  async update(id, data) {
    delete data.id;
    await schema.validate(data);

    const query = `
      MATCH (c {id: $id})
      SET c = {
        id: $id,
        name: $name,
        cpf: $cpf,
        email: $email,
        phone: $phone
        ${data.city ? ',city: $city' : ''}
        ${data.state ? ',state: $state' : ''}
        ${data.address ? ',address: $address' : ''}
        ${data.district ? ',district: $district' : ''}
        ${data.number ? ',number: $number' : ''}
        ${data.complement ? ',complement: $complement' : ''}
        ${data.gender ? ',gender: $gender' : ''}
        ${data.birth ? ',birth: $birth' : ''}
      }
      RETURN c
    `;

    const retorno = await neo4j.run(query, {
      ...data,
      id,
    });

    return retorno.summary.query.parameters;
  }

  async delete(id) {
    const query = `
      MATCH (c {id: $id})
      DELETE c
    `;

    const retorno = await neo4j.run(query, { id });

    return retorno.summary.query.parameters;
  }
}

module.exports = new ClientModel();
