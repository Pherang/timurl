const express = require('express'),
      MongoClient = require('mongodb').MongoClient,
      app = express();

let uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/timmieurls'

MongoClient.connect(uri, function (err, client) {
app.get('/', (req,res) => {
   
    let msg = 'Hello, to use this service paste your url after http://timurl.herokuapp.com/tiny/' 
    msg += '<br>E.g http://timurl.herokuapp.com/tiny/https://developer.mozilla.org'

    res.send(msg)
  })


  app.get(/tiny\/.*/, (req,res) => {
   
    res.send(req.url)
    res.end()
  })

  let server = app.listen(3000, () => {
    let port = server.address().port
    console.log('Express server listening on port %s.', port)
  })


});
