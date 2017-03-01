var express = require('express');
var router = express.Router();
var pg = require('pg');
var config = {
  database: 'phi', // the name of the database
  host: 'localhost', // where is your database
  port: 5432, // the port number for your database
  max: 10, // how many connections at one time
  idleTimeoutMillis: 30000 // 30 seconds to try to connect
};

var pool = new pg.Pool(config);

router.get('/', function(req, res){
  // This will be replaced with a SELECT statement to SQL
  pool.connect(function(errorConnectingToDatabase, client, done){
    if(errorConnectingToDatabase) {
      // There was an error connecting to the database
      console.log('Error connecting to database: ', errorConnectingToDatabase);
      res.sendStatus(500);
    } else {
      // We connected to the database!!!
      // Now, we're gonna' git stuff!!!!!
      client.query('SELECT * FROM "books";', function(errorMakingQuery, result){
        done();
        if(errorMakingQuery) {
          console.log('Error making the database query: ', errorMakingQuery);
          res.sendStatus(500);
        } else {
          res.send(result.rows);
        }
      });
    }
  });
});

router.post('/new', function(req, res){
  // This will be replaced with an INSERT statement to SQL
  var newBook = req.body;

  pool.connect(function(errorConnectingToDatabase, client, done){
    if(errorConnectingToDatabase) {
      // There was an error connecting to the database
      console.log('Error connecting to database: ', errorConnectingToDatabase);
      res.sendStatus(500);
    } else {
      // We connected to the database!!!
      // Now, we're gonna' git stuff!!!!!
      client.query('INSERT INTO books (title, author, edition, publisher) VALUES ($1, $2, $3, $4);',
      [newBook.title, newBook.author, newBook.edition, newBook.publisher],
      function(errorMakingQuery, result){
        done();
        if(errorMakingQuery) {
          console.log('Error making the database query: ', errorMakingQuery);
          res.sendStatus(500);
        } else {
          res.sendStatus(201);
        }
      });
    }
  });
});


//delete/48  /:id tells us that it was an optional perameter
router.delete('/delete/:id', function(req, res){
  var bookID = req.params.id;
  console.log('book id to delete: ', bookID);

  pool.connect(function(errorConnectingToDatabase, client, done){
    if(errorConnectingToDatabase) {
      // There was an error connecting to the database
      console.log('Error connecting to database: ', errorConnectingToDatabase);
      res.sendStatus(500);
    } else {
      // We connected to the database!!!
      // Now, we're gonna' git stuff!!!!!
      client.query('DELETE FROM books WHERE id=$1;', //PARAM 1 $1 tells PG that we're looking for a variable
      [bookID], //PARAM 2 variable that we're adding to the PG query (Replaces $1 in the query)
      function(errorMakingQuery, result){ //PARAM 3 the function that is run after the query takes place
        done();
        if(errorMakingQuery) {
          console.log('Error making the database query: ', errorMakingQuery);
          res.sendStatus(500);
        } else {
          res.sendStatus(201);
        }//ends client.query function
      });//ends client.query
    } //ends ppol connect function
  });//ends pool connect
});//ends delete router


//delete/48  /:id tells us that it was an optional perameter
router.put('/save/:id', function(req, res){
  var bookID = req.params.id; //finds the optional parameter
  var bookObject = req.body;
  console.log('book id to save: ', bookID);

  pool.connect(function(errorConnectingToDatabase, client, done){
    if(errorConnectingToDatabase) {
      // There was an error connecting to the database
      console.log('Error connecting to database: ', errorConnectingToDatabase);
      res.sendStatus(500);
    } else {
      // We connected to the database!!!
      // Now, we're gonna' git stuff!!!!!
      client.query('UPDATE books SET title=$1 WHERE id=$2;', //PARAM 1 $1 tells PG that we're looking for a variable
      [bookObject.title, bookID], //PARAM 2 variable that we're adding to the PG query (Replaces $1 in the query)
      function(errorMakingQuery, result){ //PARAM 3 the function that is run after the query takes place
        done();
        if(errorMakingQuery) {
          console.log('Error making the database query: ', errorMakingQuery);
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }//ends client.query function
      });//ends client.query
    } //ends ppol connect function
  });//ends pool connect
});//ends save router

module.exports = router;
