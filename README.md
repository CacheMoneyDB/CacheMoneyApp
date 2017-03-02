# CacheMoneyApp
Fantasy stock trading single page app

### Built with

* MONGO
* Express
* Node
* Deployed with Heroku
* Handlebars
* Jquery

### Authors

[Chris Bruner](https://github.com/QuantumArchive),
[Michelle Srikhundonr](https://github.com/michellesri),
[Niilo Smeds](https://github.com/nsmeds), and 
[Tom Timmel](https://github.com/TomTimmel)

### Application Instructions

* We require that you sign in to use our app with a username and password
* Once you have an account, you automatically have a portfolio with a $100,000 cash value
* Use the search tab to research stocks using the ticker
* On the search tab, you can also purchase and sell stocks in your portfolio
* On the portfolio tab, you can view your portfolio of stacks, and total value
* Go to the leaderboard to see how you match up against the best!

### Application Structure

* This application consists of a front-end web page, an express server with RESTful routing and a mongo DB for data persistence (hosted by [mlab.com](mlab.com))
* The front end consists largely of jQuery event listeners that make appropriate AJAX calls to the server
* The RESTful API consists of the following routes
    * Users - Used for user sign up, sign in and validation: Routes - POST/validate, POST/signup, POST/signin, and DELETE/
    * Portfolios - Used for holding and dealing with users portfolios: Routes - GET/all, GET/leaderboard, GET/, PUT/buy, and PUT/sell
    * Stockstores - Used to hold an object containing each unique stock as key value pair for making our Yahoo API call: Routes - GET/, GET/:id, and POST/
    * YahooAPI - Used for interfacing with the YahooAPI to return data to the front end and to update all portfolios: Routes - GET/dailyUpdate and GET/
* All delete routes require admin level authentication
* Portfolio routes require user authentication prior to access

### Getting Started

Our GitHub: https://github.com/CacheMoneyDB/CacheMoneyApp

### Other libraries

-using yahoo-finance npm package to get stock data with a 15 minute delay
-We also update our database of owned stocks 30 minutes after close 

### Testing

Testing can be performed for our various database data models and end2end routes if npm is installed with the following two commands:

```
npm test
npm test:watch
```

The first command will perform all test at once using mocha.
The second command will allow you retest your files as changes are made.

### Issues

Please feel free to submit issues on our Github!

### License

MIT