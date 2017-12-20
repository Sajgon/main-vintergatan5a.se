
const express = require('express');
const app = express();
const scraperjs = require('scraperjs');
//const pm = require("promisemaker");
//const mysql = require('mysql');
const credentials = require('../credentials.js');   // Hämta mysql credentials
console.log("credentials", credentials);
//const db = pm(mysql.createConnection(credentials));


const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
 
// Connection URL
var url = 'mongodb://localhost:27017/Vintergatan5a-analystics';

// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");
    
    
    //var documents = database.db.collection('visitors').find({});
     //  console.log("documents",documents);

     var insertDocuments = function(db, callback) {
      // Get the documents collection
      var collection = db.collection('visitors');
      // Insert some documents
      collection.insertMany([
        {a : 1}, {a : 2}, {a : 3}
      ], function(err, result) {
        assert.equal(err, null);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log("Inserted 3 documents into the document collection");
        callback(result);
      });
    }
     
     
});




/*
    SCRAPING
    SCRAPING
*/

let newsFromAB = [];
let newsFromDN = [];

async function scrapeDN(){
    let ab = scraperjs.StaticScraper.create('https://dn.se');
    let news = await ab.scrape(($)=>{
        return $('a[href*="/nyheter"] h2, a[href*="/nyheter"] h3').map(function() {
            return {
                text: $(this).text(),
                url: 'https://dn.se' + $(this).closest('a').attr('href')
            }
        }).get();
    });
    newsFromDN = news;
    //console.log(news);
}

async function scrapeAftonbladet(){
    let ab = scraperjs.StaticScraper.create('https://aftonbladet.se');
    let news = await ab.scrape(($)=>{
        return $('a[href*="/nyheter"] h3').map(function() {
            return {
                text: $(this).text(),
                url: 'https://aftonbladet.se' + $(this).closest('a').attr('href')
            }
        }).get();
    });
    newsFromAB = news;
    //console.log(news);
}


scrapeDN();
//setInterval(scrapeDN, 60*1000);

scrapeAftonbladet();
//setInterval(scrapeAftonbladet, 60*1000);

app.use(express.static(__dirname + '/www'));

//app.get('*',(req,res) => res.send('Hello world!'));
app.get('/ab-news',(req,res) => {
   res.json(newsFromAB);
});

app.get('/dn-news',(req,res) => {
   res.json(newsFromDN);
});

app.get('/all-news', (req, res) => {
  res.json(
    newsFromAB.concat(newsFromDN)
      .sort((a,b) => a.text > b.text ? 1 : -1)
  )
});


app.get('/visitors', (req, res) => {
    
});


app.listen(4001,() =>
    console.log('Listening on port 4001')
);




//console.log(db);










