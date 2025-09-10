export default async function handler(req, res) {
  // Get the URL from the query parameter
  const { url } = req.query;

  if (!url) {
    res.status(400).send('Missing "url" parameter');
    return;
  }

  try {
    // Fetch the requested URL
    const response = await fetch(url);

    // Copy response headers (except some restricted ones)
    for (const [key, value] of response.headers.entries()) {
      if (key.toLowerCase() !== "content-encoding" && key.toLowerCase() !== "content-length") {
        res.setHeader(key, value);
      }
    }

    // Basic CORS header for iframe use
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Pipe the response body to the client
    res.status(response.status);
    response.body.pipe(res);
  } catch (err) {
    res.status(500).send('Error fetching URL: ' + err.message);
  }
}
