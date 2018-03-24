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
      
      // full url and short to be stored in database
      let doc = {}
      let randomTimNumber

      
      doc.fullurl = validUrl

      // Create a random number and check to if it is in the DB. If it is, it has to be regenerated. The number is the short URL
      function genShortUrl() {
        randomTimNumber = Math.random() * 10000
        if (randomTimNumber < 100) { randomTimNumber = randomTimNumber * 100 }
        if (randomTimNumber < 1000) { randomTimNumber = randomTimNumber * 10 }

        console.log(Math.floor(randomTimNumber))
        doc.timurlnumber = Math.floor(randomTimNumber)
        if (!checkShortUrl()) {
          genShortUrl()
        } else {

        }
      }
      // Retrieve URL from database
      async function checkShortUrl() {
        let findings = await db.collection(collection).find({ timurlnumber: doc.timurlnumber})
        let answer = await findings.next()
        return answer
      }
      


      //db.collection(collection).insertOne(doc.timurlnumber) 
      res.send(validUrl)
    }
    
    res.end()

  }) // end api endpoint route

  let server = app.listen(3000, () => {
    let port = server.address().port
    console.log('Express server listening on port %s.', port)
  })

});
