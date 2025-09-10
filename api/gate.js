export default async function handler(req, res) {
  try {
    // Defensive: Parse and validate the URL
    const { url } = req.query;
    if (!url) {
      res.status(400).send('Missing "url" parameter');
      return;
    }
    if (!/^https?:\/\//i.test(url)) {
      res.status(400).send('Invalid URL');
      return;
    }

    // Add a user-agent for sites that require it
    const fetchResponse = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; VercelProxy/1.0)',
        'Accept': '*/*'
      }
    });

    // Defensive: If fetch fails (non-2xx), return error
    if (!fetchResponse.ok) {
      res.status(fetchResponse.status).send(`Target returned status ${fetchResponse.status}`);
      return;
    }

    // Pass on content-type and CORS
    const contentType = fetchResponse.headers.get('content-type') || 'text/html; charset=utf-8';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Read as text (for HTML)
    const text = await fetchResponse.text();

    res.status(200).send(text);
  } catch (err) {
    // Log error to Vercel's console (shows up in logs)
    console.error('Proxy error:', err);
    res.status(500).send('Proxy error: ' + (err.message || err.toString()));
  }
}
