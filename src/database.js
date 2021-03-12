const neo4j = require('neo4j-driver');

const { NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD } = process.env;

if (!NEO4J_URI || !NEO4J_USER || !NEO4J_PASSWORD) throw Error('NEO4J_URI, NEO4J_USER ou NEO4J_PASSWORD não setados');

const driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD));

const session = driver.session({ database: NEO4J_USER });

module.exports = session;
