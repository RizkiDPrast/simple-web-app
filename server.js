var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');

var jwt = require('jsonwebtoken');

var env = require('./server/config');

// var ApolloClient = require('apollo-client');
// var createNetworkInterface = require('apollo-client');
// var gql = require('graphql-tag');

// var networkInterface = createNetworkInterface({uri: env.graphqlUri});
// const client = new ApolloClient(networkInterface);

var port = process.env.port || 8080;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(morgan('dev'))

app.get('/', function(req, res) {
    res.send('test');
})

app.listen(port, function(){
    console.log(`app listening on port: ${port}`)
})
