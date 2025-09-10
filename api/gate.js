export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    res.status(400).send('Missing "url" parameter');
    return;
  }

  try {
    const response = await fetch(url);

    // Copy response headers (ignoring restricted ones)
    for (const [key, value] of response.headers.entries()) {
      if (!['content-encoding', 'content-length'].includes(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    }
    // Basic CORS header for iframe use
    res.setHeader('Access-Control-Allow-Origin', '*');

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.status(response.status).end(buffer);
  } catch (err) {
    res.status(500).send('Error fetching URL: ' + err.message);
  }
