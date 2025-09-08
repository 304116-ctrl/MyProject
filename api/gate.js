import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send('Missing url parameter');
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': req.headers['user-agent'] || '',
      },
    });

    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    res.status(response.status);
    response.body.pipe(res);
  } catch (e) {
    res.status(500).send('Proxy error: ' + e.message);
  }
}
