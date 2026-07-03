/**
 * Fetches movies matching the search term, type filter, and page number
 * @param {string} search - Search query
 * @param {string} type - Movie type filter ('movie', 'series', 'episode' or '')
 * @param {number|string} page - Page number for pagination
 * @returns {Promise<Object>} The OMDb API search response
 */
export async function fetchMovies(search, type = '', page = 1) {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (type) params.append('type', type);
  if (page) params.append('page', page.toString());

  const response = await fetch(`/api/movies?${params.toString()}`);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
    error.code = errorData.error || 'HTTP_ERROR';
    throw error;
  }
  
  const data = await response.json();
  
  // Handled API key missing specifically so the UI can prompt configuration instruction
  if (data.error === 'API_KEY_MISSING' || data.Response === 'False' && data.Error && data.Error.includes('API key')) {
    const error = new Error(data.message || data.Error || 'OMDb API key is missing');
    error.code = 'API_KEY_MISSING';
    throw error;
  }

  return data;
}

/**
 * Fetches detailed info for a single movie by its IMDb ID
 * @param {string} id - IMDb ID of the movie
 * @returns {Promise<Object>} Detailed movie data
 */
export async function fetchMovieDetails(id) {
  if (!id) throw new Error('Movie ID is required');
  
  const response = await fetch(`/api/movies?id=${encodeURIComponent(id)}`);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
    error.code = errorData.error || 'HTTP_ERROR';
    throw error;
  }
  
  const data = await response.json();

  if (data.error === 'API_KEY_MISSING' || data.Response === 'False' && data.Error && data.Error.includes('API key')) {
    const error = new Error(data.message || data.Error || 'OMDb API key is missing');
    error.code = 'API_KEY_MISSING';
    throw error;
  }

  return data;
}
