// create express app and serve home.html

const express = require('express');
const dns = require('dns');

const app = express();

const cors = require('cors');
app.use(cors({optionsSuccessStatus: 200})); 

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/home.html');
    }
);

// no persistence, but, you know, free tier
url_db = {};

app.post('/api/shorturl', (req, res) => {
    // get url from form data
    let url = req.body.url;
    
    // if url is null, error out
    if (!url) {
        res.json({error: 'invalid url'});
        return;
    }

    // try to lookup the hostname
    let url_parts = url.split('/');
    let hostname = url_parts[2];

    if (!hostname) {
        res.json({error: 'invalid url'});
        return;
    }

    dns.lookup(hostname, (err, address, family) => {
        if (err) {
            res.json({error: 'invalid url'});
            return;
        }
        else {
            let id = Object.keys(url_db).length;
            url_db[id] = url;
            res.json({original_url: url, short_url: id});
        }
    }); 
    }
);

app.get('/api/shorturl/:id', (req, res) => {
    let id = req.params.id;
    let url = url_db[id];
    if (!url) {
        res.json({error: 'invalid url'});
    }
    res.redirect(url);
    }        
);

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port 3000');
    }
);
