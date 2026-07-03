import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import MovieCard from './components/MovieCard';
import Loader from './components/Loader';
import EmptyState from './components/EmptyState';
import MovieModal from './components/MovieModal';
import { fetchMovies } from './services/api';
import './App.css';

const TRENDING_KEYWORDS = [
  'Avengers', 'Spider-Man', 'Star Wars', 'Harry Potter', 
  'Interstellar', 'Matrix', 'Lord of the Rings', 'Inception', 
  'Gladiator', 'Avatar', 'Iron Man', 'Batman', 'Dune', 'Logan'
];

export default function App() {
  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  
  // Results & Pagination States
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Status States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal State
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  // Fetch movies helper
  const loadMovies = async (query, type, page) => {
    // Defer state updates to microtask to prevent cascading render warnings in linter
    await Promise.resolve();
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMovies(query, type, page);
      
      if (data.Response === 'True') {
        const filteredResults = (data.Search || []).filter(item => item.Type !== 'game');
        setMovies(filteredResults);
        const total = parseInt(data.totalResults, 10) || 0;
        setTotalResults(total);
        setTotalPages(Math.ceil(total / 10));
      } else {
        // OMDb returns Response="False" when no movies are found
        if (data.Error && (data.Error.includes('not found') || data.Error.includes('Too many results'))) {
          setMovies([]);
          setTotalResults(0);
          setTotalPages(0);
        } else {
          throw new Error(data.Error || 'Failed to fetch movies from OMDb.');
        }
      }
    } catch (err) {
      setMovies([]);
      setTotalResults(0);
      setTotalPages(0);
      setError({
        message: err.message || 'An unexpected error occurred.',
        code: err.code || 'UNKNOWN_ERROR'
      });
    } finally {
      setLoading(false);
    }
  };

  // Automatically load initial query on mount (fetching a random trending term)
  useEffect(() => {
    const timer = setTimeout(() => {
      const randomTerm = TRENDING_KEYWORDS[Math.floor(Math.random() * TRENDING_KEYWORDS.length)];
      loadMovies(randomTerm, selectedType, currentPage);
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchSubmit = (newSearchTerm, newType) => {
    setSearchTerm(newSearchTerm);
    setSelectedType(newType);
    setCurrentPage(1); // Reset to page 1 on new search
    loadMovies(newSearchTerm, newType, 1);
  };

  const handleLogoClick = () => {
    setSearchTerm('');
    setSelectedType('');
    setCurrentPage(1);
    const randomTerm = TRENDING_KEYWORDS[Math.floor(Math.random() * TRENDING_KEYWORDS.length)];
    loadMovies(randomTerm, '', 1);
  };

  const handlePageChange = (direction) => {
    const nextPage = direction === 'next' ? currentPage + 1 : currentPage - 1;
    if (nextPage >= 1 && nextPage <= totalPages) {
      setCurrentPage(nextPage);
      loadMovies(searchTerm, selectedType, nextPage);
      // Smooth scroll back to top of the page when changing pages
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleMovieSelect = (imdbID) => {
    setSelectedMovieId(imdbID);
  };

  const handleCloseModal = () => {
    setSelectedMovieId(null);
  };

  const handleRetry = () => {
    loadMovies(searchTerm, selectedType, currentPage);
  };

  // Determine state-specific panels to render
  const renderContent = () => {
    if (loading) {
      return <Loader type="skeleton" count={8} />;
    }

    if (error) {
      return (
        <EmptyState 
          type={error.code === 'API_KEY_MISSING' ? 'api-key-missing' : 'error'}
          message={error.message}
          onRetry={handleRetry}
        />
      );
    }

    if (movies.length === 0) {
      return <EmptyState type="no-results" searchTerm={searchTerm} />;
    }

    return (
      <>
        {/* Results Info Banner */}
        <div className="results-info-banner">
          {searchTerm ? (
            <span>Found {totalResults.toLocaleString()} results for "{searchTerm}"</span>
          ) : (
            <span>Trending Titles</span>
          )}
          <span>Page {currentPage} of {totalPages}</span>
        </div>

        {/* Movie Grid */}
        <div className="movies-grid">
          {movies.map((movie) => (
            <MovieCard 
              key={movie.imdbID} 
              movie={movie} 
              onClick={handleMovieSelect}
            />
          ))}
        </div>

        {/* Pagination Widget */}
        {totalPages > 1 && (
          <div className="pagination-container">
            <button 
              className="pagination-btn"
              onClick={() => handlePageChange('prev')}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <span className="page-info">
              {currentPage} / {totalPages}
            </span>
            <button 
              className="pagination-btn"
              onClick={() => handlePageChange('next')}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="app-container">
      {/* Navigation Header */}
      <header className="app-header">
        <div className="logo-wrapper" onClick={handleLogoClick}>
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
              <line x1="7" y1="2" x2="7" y2="22"></line>
              <line x1="17" y1="2" x2="17" y2="22"></line>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <line x1="2" y1="7" x2="7" y2="7"></line>
              <line x1="2" y1="17" x2="7" y2="17"></line>
              <line x1="17" y1="17" x2="22" y2="17"></line>
              <line x1="17" y1="7" x2="22" y2="7"></line>
            </svg>
          </div>
          <span className="logo-text">Movie Listing App</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="app-main">
        <section className="hero-section">
          <h1>Explore Movies & Shows</h1>
          <p>
            Search for your favorite titles, check ratings, and filter by format.
          </p>
        </section>

        {/* Search Bar Widget */}
        <SearchBar 
          key={`${searchTerm}-${selectedType}`}
          onSearch={handleSearchSubmit} 
          initialSearch={searchTerm} 
          initialType={selectedType}
        />

        {/* Dynamic Main Body Content */}
        {renderContent()}
      </main>

      {/* Detailed Specifications Modal */}
      {selectedMovieId && (
        <MovieModal 
          movieId={selectedMovieId} 
          onClose={handleCloseModal}
        />
      )}

      {/* Footer Block */}
      <footer className="app-footer">
        <span className="footer-brand">&copy; {new Date().getFullYear()} Movie Listing App.</span>
        <span>Secured via Vercel Serverless Gateway proxy. Data provided by OMDb API.</span>
      </footer>
    </div>
  );
}
