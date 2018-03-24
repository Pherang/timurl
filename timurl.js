const express = require('express'),
      MongoClient = require('mongodb').MongoClient,
      app = express();

let uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/timmieurls'
let dbName = 'timmieurls'
let collection = 'urls'
MongoClient.connect(uri, function (err, client) {
  const db = client.db(dbName)
  app.get('/', (req,res) => {
   
    let msg = 'Hello, to use this service paste your url after http://timurl.herokuapp.com/tiny/' 
    msg += '<br>E.g http://timurl.herokuapp.com/tiny/https://developer.mozilla.org'

    res.send(msg)
  })

  app.get(/tiny\/.*/, (req,res) => {
   
    // cleanup url for checking
    let url = req.url.replace(/\/tiny\//, '')
    
    let validUrl
    // Just check if the URL format is correct upto the first / or full domain e.g. map.cork.app.com, gold.com/gimme
    //thanks https://regexer.com gskinner for this tool. Did have to tweak it for JS to work      
    let urlExpression = /http:\/\/(?:\w+)(?:\.\w+)+(?:\/|$)/i

    if(urlExpression.test(url)) {
      validUrl = url
      console.log('It is a valid url ' + validUrl)
      let doc = {}
      let randomTimNumber
      doc.fullurl = validUrl

      // Create a random number and check to see if it is in the DB. If it is, it has to be regenerated.
      randomTimNumber = Math.random()
      console.log(randomTimNumber)
      randomTimNumber = randomTimNumber * 10000
      if (randomTimNumber < 1000) { randomTimNumber = randomTimNumber * 10 }
      console.log(Math.floor(randomTimNumber))
      doc.timurlnumber = Math.floor(randomTimNumber)
    
//      db.collection(collection).insertOne(doc) 
      res.send(validUrl)
    }
    
    res.end()

  }) // end api endpoint route

  let server = app.listen(3000, () => {
    let port = server.address().port
    console.log('Express server listening on port %s.', port)
  })

});
