
const express = require('express');
const app = express();
const scraperjs = require('scraperjs');

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

app.get('/', (req, res) => {
  
});


app.listen(4001,() =>
    console.log('Listening on port 4001')
);
