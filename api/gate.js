export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    res.status(400).send('Missing "url" parameter');
    return;
  }

  try {
    // Only allow http/https URLs for security
    if (!/^https?:\/\//i.test(url)) {
      res.status(400).send('Invalid URL');
      return;
    }

    const response = await fetch(url);

    // Get content type, fallback to text/html
    const contentType = response.headers.get('content-type') || 'text/html';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Read as text (safe for HTML and most cases)
    const text = await response.text();

    res.status(response.status).send(text);
  } catch (err) {
    // Log to Vercel logs for debugging
    console.error('Fetch error:', err);
    res.status(500).send('Error fetching URL: ' + (err.message || err.toString()));
  }
}
