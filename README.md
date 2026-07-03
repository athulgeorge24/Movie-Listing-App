# Movie Listing App

Movie Listing App is a premium, secure React + Vite Movie Listing Application that utilizes a Vercel Serverless Function backend proxy to query the OMDb API.

## 🔐 Security Architecture

This application is designed to adhere to strict production security rules:
- **No Client Exposure**: The OMDb API Key is **never** bundled into the client-side JavaScript, exposed in the browser's network requests, or sent from the React application directly.
- **Server-Side Requests**: The browser only makes requests to the internal endpoint `/api/movies?search=...`.
- **Serverless Backend Proxy**: A Node.js serverless function (`/api/movies.js`) running on Vercel acts as a secure proxy, reading `OMDB_API_KEY` from private environment variables, sending queries to OMDb, and feeding response data back to the client.
- **Seamless Local Dev**: In local development, the custom Vite dev server middleware in `vite.config.js` acts as the proxy, pulling key definitions from your local, git-ignored `.env` file, replicating the production environment without additional tools.

---

## 🚀 Features

- 🔍 **Title Search**: Find movies, series, or individual episodes easily.
- 🎯 **Mount Action**: Automatically queries and populates results for "Batman" on page load.
- 🏷️ **Type Filters**: Filter results between Movies, TV Series, and Episodes in real-time.
- 🗂️ **Grid Layout**: Fully responsive, glassmorphic layout optimized for mobile, tablet, and desktop viewports.
- 🖼️ **Fallback Graphics**: Automatically catches broken or missing movie posters and displays an interactive, offline-ready gradient layout.
- ⚡ **Skeleton Shimmer Loaders**: Premium, low-layout-shift skeleton cards replace default loader spinners during fetch states.
- 🎛️ **Cinematic Details Modal**: Click any movie card to load director lists, cast members, plot overviews, runtime indicators, release dates, and rating scores (IMDb, Metascore, Rotten Tomatoes) in a beautiful overlay panel.
- 📄 **Pagination Controls**: Navigate large result lists smoothly with dynamic page changes.
- 🛠️ **Informative Setup Guides**: If the API key is not configured, the app renders a friendly step-by-step setup guide rather than crashing.

---

## 💻 Tech Stack

- **Frontend**: React (Functional Components + Hooks), Vite
- **Styling**: Vanilla CSS (CSS Variables, Flexbox/Grid, Glassmorphic Backdrop filters, custom animations)
- **Backend**: Node.js (Vercel Serverless Functions API)
- **Deployment**: Vercel Serverless Gateway

---

## 🛠️ Local Development Setup

To run the application locally on your computer:

### 1. Clone the Workspace and Install Dependencies
Ensure you have Node.js installed, then run:
```bash
npm install
```

### 2. Configure Your API Key
1. Obtain a free API key from the [OMDb API Key Request Form](https://www.omdbapi.com/apikey.aspx).
2. Create a file named `.env` in the root of the project:
   ```env
   OMDB_API_KEY=your_actual_omdb_api_key_here
   ```
   *(Note: This file is ignored by Git in `.gitignore` to prevent leakage)*

### 3. Launch Development Server
Start the local server using Vite:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser. The Vite dev server will proxy `/api/movies` queries using your local `.env` definition.

---

## ☁️ Vercel Production Deployment

To host this project on Vercel:

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Import the project in your Vercel Dashboard.
3. Under the project configuration settings, navigate to **Settings** &rarr; **Environment Variables**.
4. Create a new variable:
   - **Key**: `OMDB_API_KEY`
   - **Value**: *Your OMDb API Key*
5. Click **Deploy**. Vercel will build the React bundle and deploy the serverless functions in the `api/` folder automatically.
