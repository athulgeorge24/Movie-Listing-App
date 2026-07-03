/* global process */
export default async function handler(req, res) {
  // Set CORS headers for security and preflight request support
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // req.query is parsed query parameters by Vercel's Node helper
    const { search, id, type, page } = req.query;
    const apiKey = process.env.OMDB_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ 
        error: 'API_KEY_MISSING',
        message: 'OMDb API Key is not configured on the server. Please add OMDB_API_KEY to your Vercel Environment Variables.' 
      });
    }

    let url = '';
    if (id) {
      url = `https://www.omdbapi.com/?apikey=${apiKey}&i=${encodeURIComponent(id)}&plot=full`;
    } else if (search) {
      url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(search)}`;
      if (type) {
        url += `&type=${encodeURIComponent(type)}`;
      }
      if (page) {
        url += `&page=${encodeURIComponent(page)}`;
      }
    } else {
      return res.status(400).json({ error: 'Missing search or id query parameter.' });
    }

    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: 'OMDB_API_ERROR',
        message: `OMDb API responded with status ${response.status}` 
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching from OMDb:', error);
    return res.status(500).json({ error: 'SERVER_ERROR', message: error.message });
  }
}
