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
   
    // cleanup url for checking
    let url = req.url.replace(/\/tiny\//, '')
    
    let validUrl
    // Just check if the URL format is correct upto the first / or full domain e.g. map.cork.app.com, gold.com/gimme
    //let urlExpression = /http:\/\/(\w+)(\.\w+)+[/\s]/i;    //thanks https://regexer.com gskinner for this great tool!      
    let urlExpression = /http:\/\/(?:\w+)(?:\.\w+)+(?:\/|$)/i
    console.log(urlExpression)
    console.log(url)
    console.log(urlExpression.test(url))
    if(urlExpression.test(url)) {
      validUrl = url
      console.log('It is a valid url ' + validUrl)
      res.send(validUrl)
    }
    
    res.end()

  })

  let server = app.listen(3000, () => {
    let port = server.address().port
    console.log('Express server listening on port %s.', port)
  })

});
