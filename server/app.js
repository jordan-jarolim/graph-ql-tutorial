const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors')

const app = express();

// allow cross origin request
app.use(cors());

mongoose.connect('mongodb://jordan:test123@ds229621.mlab.com:29621/graphql-testdb');
mongoose.connection.once('open', () => {
  console.log('connected to db');
})

// middleware handling graphql requests - needs to know how graph looks to be able to walk through - schema
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

// init app
app.listen(4000, () => {
  console.log('listening for requests on port 4000');
});