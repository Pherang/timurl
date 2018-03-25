# timurl

A URL shortener app. I guess it's also a pretty tiny fullstack app because the URLs will be stored in MongoDB.
It'll use express this time to manage the app and a template might be used. Haven't decided yet.

MongoDB
Express
Node.js

* If a user enters a URL at the API endpoint it will validate it, generate a unique random number and store them in the mongoDB together.
* The user can try to retrieve a shortURL number at the root. e.g. hostname/1234
* There is some basic error handling in the URL entered and the short URL being retrieved.
* It needs more database error catching but not today. Need to clean up the code a little and comment where necessary and helpful.
