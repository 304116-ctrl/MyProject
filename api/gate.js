export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    res.status(400).send('Missing "url" parameter');
    return;
  }

  try {
    const response = await fetch(url);

    // Copy response headers (skip restricted ones)
    for (const [key, value] of response.headers.entries()) {
      if (!['content-encoding', 'content-length'].includes(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    }
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Read response as text (works for HTML, most resources)
    const text = await response.text();
    res.status(response.status).send(text);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).send('Error fetching URL: ' + err.message);
  }
