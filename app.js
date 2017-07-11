const express = require('express');
const graphQLHTTP = require('express-graphql');
const schema = require('./schema');
const summonerType = require('./schema');
const dotenv = require('dotenv').config();

const app = express();

app.use('/graphql', graphQLHTTP({
  schema: schema.schema,
  graphiql: true,
}));

app.listen(process.env.PORT, function () {
  console.log('App is live at localhost:3000/graphql');
})