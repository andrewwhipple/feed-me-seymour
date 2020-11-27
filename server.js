const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
var fetch = require('node-fetch');
let Parser = require('rss-parser');
let parser = new Parser();
let xml_js = require('xml-js');

app.use(express.json());

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route
app.get('/express_backend', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});

// given a feed url, return the feed encoded as JSON or an error
app.get('/fetch_feed/:feed_url', (req, res) => {
    fetch(decodeURIComponent(req.params.feed_url), {
        method: 'GET',
      }).then((fetch_response) => {
        fetch_response.text().then((xmlTxt) => {
            let json_feed;
            try {
                json_feed = xml_js.xml2js(xmlTxt, {compact: true});
                //console.log("test\n");
            } catch(error) {
                //console.log("double test\n");
                res.status(404).send("Not a valid XML feed");
                return;
            }

            var xml_recode = xml_js.js2xml(json_feed, {spaces: 2, compact: true});
            res.send(json_feed);

            // handle the fact that & is not properly encoded specifically in the category sections
        })
      }).catch((error) => {
        res.status(404).send("Not a valid URL");
      });
});

// given a feed encoded as json, return xml encoded data
app.post('/encode_feed/', (req, res) => {

  let xml_feed;
  try {
    xml_feed = xml_js.js2xml(req.body, {spaces: 2, compact: true});
    res.attachment('feed.xml');
    res.send(xml_feed);

  } catch(error) {
    res.status(500).send("Error formatting feed as XML");
  }
});