import { useState } from 'react';

/**
 * SearchBar component provides input handling for movie title searches
 * and filters by format type (Movie, Series, Episode).
 */
export default function SearchBar({ onSearch, initialSearch = '', initialType = '' }) {
  const [query, setQuery] = useState(initialSearch);
  const [type, setType] = useState(initialType);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    // Trim query to prevent empty spaces or unnecessary lookups
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      onSearch(trimmedQuery, type);
    }
  };

  const handleClear = () => {
    setQuery('');
    // Auto-focus back to input on clear
    document.getElementById('movie-search-input')?.focus();
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="search-container">
        <div className="search-input-wrapper">
          <span className="search-icon-prefix">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <input
            id="movie-search-input"
            type="text"
            className="search-input"
            placeholder="Search movies, series, or episodes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search movies"
            autoComplete="off"
          />
          {query && (
            <button 
              type="button" 
              className="clear-search-btn" 
              onClick={handleClear}
              aria-label="Clear search text"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>

        <div className="search-filter-wrapper">
          <select
            className="type-select"
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              // Proactively search when type changes if there is a query
              if (query.trim()) {
                onSearch(query.trim(), e.target.value);
              }
            }}
            aria-label="Filter by type"
          >
            <option value="">All Formats</option>
            <option value="movie">Movies</option>
            <option value="series">Series</option>
            <option value="episode">Episodes</option>
          </select>
        </div>

        <button type="submit" className="search-submit-btn">
          <span>Search</span>
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
    </form>
  );
}
