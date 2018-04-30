const express = require('express'),
      MongoClient = require('mongodb').MongoClient,
      app = express(); PORT = process.env.PORT || 3000

let uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/timmieurls'

// Local database config
//let dbName = 'timmieurls'

// heroku database config
let dbName = 'heroku_dwmfsp7n'

let collection = 'urls'
let hostname = process.env.APP_HOST || 'http://127.0.0.1:3000'
MongoClient.connect(uri, function (err, client) {
  const db = client.db(dbName)

  // Tries to retrieve short URL
  async function checkShortUrl(urlNumber) {
    let findings = await db.collection(collection).find({ timurlnumber: urlNumber})
    let answer = await findings.next()
    
    return answer
  }

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
    //thanks https://regexer.com gskinner for this to test our Regexes in a sandbox
    let urlExpression = /https?:\/\/(?:\w+)(?:[\.-]\w+)+(?:\/|$)/i

    if(urlExpression.test(url)) {
      validUrl = url.toLowerCase()
      console.log('It is a valid url ' + validUrl)
      
      // full url and short to be stored in database
      let doc = {}
      let randomTimNumber
      
      doc.fullurl = validUrl

      // Create a random number and check to if it is in the DB. If it is, it has to be regenerated. The number is the short URL
      async function generateShortUrl(testNumber) {
        randomTimNumber = testNumber || Math.random() * 10000
        if (randomTimNumber < 100) { randomTimNumber = randomTimNumber * 100 }
        if (randomTimNumber < 1000) { randomTimNumber = randomTimNumber * 10 }
        randomTimNumber = Math.floor(randomTimNumber)
        console.log('Random URL is ' + randomTimNumber)

        // Find the document that has the short url number
        let result = await checkShortUrl(randomTimNumber)
        console.log('Does the ' +randomTimNumber+ ' exist? ' + result)
        
        if (result) {
          console.log('URL Found regenerating new URL')
          
          // Recursive call to genShortUrl 
          return (randomTimNumber = await genShortUrl())
        } else {
          // If no matching short URL number is found then we can use the current one.
          console.log('The number doesn\'t exist ')
          
          console.log('Returning valid URL ' + randomTimNumber)
          return randomTimNumber
        }
      }
      // 
      async function insertUrl () {
        let urlNum = await generateShortUrl()
        doc.timurlnumber = urlNum
        db.collection(collection).insertOne(doc)
        let shortUrlObject = await db.collection(collection).find({ timurlnumber:urlNum })
        let answer = await shortUrlObject.next()
        console.log(answer)
        let resultsForUser = {}
        resultsForUser.fullurl = answer.fullurl
        resultsForUser.shorturl = hostname + '/' + answer.timurlnumber

        res.send(resultsForUser)
        res.end()
      }
      insertUrl()
    } else {
     res.send('Invalid URL format') 
     res.end() 
    }// End if statement validating URL
  

  }) // end get short url api endpoint route

  // Check for four digit short url
  app.get(/\/\d{4}$/, (req,res) => {
    
    let inputNumber = Number.parseInt(req.url.substring(1))

    async function getShortUrl(timnumber){
      let resultObj = await checkShortUrl(timnumber)  
      
      if (resultObj) {
        let fullurl = resultObj.fullurl
        res.redirect(301, fullurl)
      } else {
        res.send('No URL found')
      }
      res.end()
    }

    getShortUrl(inputNumber)
  })

  app.use( (req,res,next) => {
    res.send('Error, go to home page for instructions')
    res.end()
  })

  let server = app.listen(PORT, () => {
    let port = server.address().port
    console.log('Express server listening on port %s.', port)
  })

});
