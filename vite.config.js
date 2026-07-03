/* global process */
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables from the project root. The third argument '' loads all environment variables (including OMDB_API_KEY)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      {
        name: 'api-proxy-dev-server',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url.startsWith('/api/movies')) {
              try {
                const url = new URL(req.url, `http://${req.headers.host}`);
                const search = url.searchParams.get('search');
                const id = url.searchParams.get('id');
                const type = url.searchParams.get('type');
                const page = url.searchParams.get('page');

                const apiKey = env.OMDB_API_KEY || env.VITE_OMDB_API_KEY;

                if (!apiKey) {
                  res.writeHead(500, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ 
                    error: 'API_KEY_MISSING',
                    message: 'OMDB_API_KEY is not defined in local environment variables (.env)' 
                  }));
                  return;
                }

                let omdbUrl = '';
                if (id) {
                  omdbUrl = `https://www.omdbapi.com/?apikey=${apiKey}&i=${encodeURIComponent(id)}&plot=full`;
                } else if (search) {
                  omdbUrl = `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(search)}`;
                  if (type) omdbUrl += `&type=${encodeURIComponent(type)}`;
                  if (page) omdbUrl += `&page=${encodeURIComponent(page)}`;
                } else {
                  res.writeHead(400, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ error: 'Missing search or id query parameter.' }));
                  return;
                }

                const apiRes = await fetch(omdbUrl);
                const data = await apiRes.json();

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(data));
              } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'DEV_SERVER_ERROR', message: error.message }));
              }
            } else {
              next();
            }
          });
        }
      }
    ]
  };
})
