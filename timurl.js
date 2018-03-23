const express = require('express'),
      MongoClient = require('mongodb').MongoClient,
      app = express();

let uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/timmieurls'


console.log(uri)
