var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

//Connect to MySQL
var mysql      = require('mysql2');
try {
  var connection = mysql.createConnection({
    host     : '73.253.80.126',
    user     : 'prizzy',
    password : 'Mathman1',
    database : 'test'
  });  
} catch(e) {
  console.log(e)
}

// connection.query('SELECT COUNT(*) from player', function (error, results, fields) {
//   if (error) throw error;

//   console.log (results)
//   console.log('Returned' + results + 'lot of players')
// });

 // Construct a schema, using GraphQL schema language

var schema = buildSchema(`
  type Query {
    hello: String,
    player(name: String): [Player]
    playerbyid(id: Int): Player
  }

  type Player {
    id: Int,
    name: String,
    year_min: Int,
    year_max: Int,
    pos: String,
    height: String,
    weight: Int,
    birth_date: String,
    college: String,
    link: String
  }
`);

//Find player by name
var getPlayerByName = function(args) {
  if (args.name) {
      var name = args.name;
      return pData.filter(player => player.name === name);
  } else {
      return 'Could not find player';
  }
}

var getPlayerByID = function(args){
  if (args.id) {
    var id = args.id;
    console.log(id)

    let returnObj = []

    connection.query('SELECT * from player', function (error, results, fields) {
      if (error) {
        throw error;
      }
      // returnObj = results
      returnObj = JSON.parse(JSON.stringify(results))

      let returnPlayer = returnObj.filter(player => player.id === id)[0];
      console.log(typeof(returnPlayer), returnPlayer)
      console.log(returnPlayer.id)
      //return returnPlayer
      return returnPlayer
    });

  } else {
      return 'Could not find player';
  }
}

// The root provides a resolver function for each API endpoint
var root = {
  player: getPlayerByName,
  playerbyid: getPlayerByID,
  hello: () => {
    return 'Hello world!';
  }
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');