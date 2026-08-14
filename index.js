require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(express.urlencoded({ extended: false }));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// In-memory URL database
const urls = {};
let shortUrl = 1;

// Create short URL
app.post('/api/shorturl', function(req, res) {
  const originalUrl = req.body.url;

  if (!originalUrl) {
    return res.json({ error: 'invalid url' });
  }

  try {
    const parsedUrl = new URL(originalUrl);

    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return res.json({ error: 'invalid url' });
    }

    const id = shortUrl++;
    urls[id] = originalUrl;

    res.json({
      original_url: originalUrl,
      short_url: id
    });
  } catch (error) {
    res.json({ error: 'invalid url' });
  }
});

// Redirect short URL
app.get('/api/shorturl/:short_url', function(req, res) {
  const id = req.params.short_url;

  if (!urls[id]) {
    return res.json({ error: 'No short URL found for the given input' });
  }

  res.redirect(urls[id]);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
