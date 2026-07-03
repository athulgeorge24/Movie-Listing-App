import { useState, useEffect } from 'react';
import { fetchMovieDetails } from '../services/api';

/**
 * MovieModal fetches and renders detailed specifications for a single movie title.
 * Provides overlay click, ESC key, and button closing triggers.
 */
export default function MovieModal({ movieId, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  // Close modal on Escape key press and prevent background scrolling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  // Fetch detailed movie information on mount/id change
  useEffect(() => {
    if (!movieId) return;

    let isMounted = true;

    const loadDetails = async () => {
      // Escape synchronous context to prevent cascading renders warning in strict hooks linter
      await Promise.resolve();
      if (!isMounted) return;

      setLoading(true);
      setError(null);
      setDetails(null);
      setImageError(false);

      try {
        const data = await fetchMovieDetails(movieId);
        if (isMounted) {
          if (data.Response === 'False') {
            setError(data.Error || 'Could not fetch detailed movie information.');
          } else {
            setDetails(data);
          }
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError({
            message: err.message || 'Failed to load movie details.',
            code: err.code || 'FETCH_ERROR'
          });
          setLoading(false);
        }
      }
    };

    loadDetails();

    return () => {
      isMounted = false;
    };
  }, [movieId]);

  if (!movieId) return null;

  const handleOverlayClick = (e) => {
    // Only close if user clicked the backdrop overlay container directly
    if (e.target.className === 'modal-overlay') {
      onClose();
    }
  };

  const getRottenTomatoesRating = (ratings) => {
    if (!ratings || !Array.isArray(ratings)) return null;
    const rt = ratings.find((r) => r.Source === 'Rotten Tomatoes');
    return rt ? rt.Value : null;
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick} role="dialog" aria-modal="true">
      <div className="modal-container">
        <button className="modal-close-btn" onClick={onClose} aria-label="Close details modal">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {loading && (
          <div className="modal-loader">
            <div className="spinner-ring">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <p>Fetching specifications...</p>
          </div>
        )}

        {error && (
          <div className="modal-error">
            <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h3>Unable to load details</h3>
            <p>{typeof error === 'object' ? error.message : error}</p>
            {error.code === 'API_KEY_MISSING' && (
              <p className="modal-setup-tip">
                Ensure <code>OMDB_API_KEY</code> is correctly set up in your local <code>.env</code> file.
              </p>
            )}
            <button className="primary-btn" onClick={onClose}>Close</button>
          </div>
        )}

        {details && (
          <div className="modal-content">
            <div className="modal-poster-panel">
              {details.Poster && details.Poster !== 'N/A' && !imageError ? (
                <img 
                  src={details.Poster} 
                  alt={`${details.Title} Cover`} 
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="modal-poster-placeholder">
                  <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                    <line x1="7" y1="2" x2="7" y2="22"></line>
                    <line x1="17" y1="2" x2="17" y2="22"></line>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                  </svg>
                  <span>No Poster Available</span>
                </div>
              )}
            </div>

            <div className="modal-info-panel">
              <div className="modal-header-info">
                <span className="modal-type-tag">{details.Type}</span>
                <h2 className="modal-title">{details.Title}</h2>
                <p className="modal-tagline-meta">
                  <span className="meta-pill">{details.Rated !== 'N/A' ? details.Rated : 'Not Rated'}</span>
                  <span className="meta-dot"></span>
                  <span>{details.Runtime !== 'N/A' ? details.Runtime : 'Unknown length'}</span>
                  <span className="meta-dot"></span>
                  <span>{details.Released !== 'N/A' ? details.Released : details.Year}</span>
                </p>
              </div>

              <div className="ratings-grid">
                {details.imdbRating && details.imdbRating !== 'N/A' && (
                  <div className="rating-badge-item">
                    <span className="rating-source">IMDb</span>
                    <span className="rating-score">⭐ {details.imdbRating}/10</span>
                    <span className="rating-votes">{details.imdbVotes} votes</span>
                  </div>
                )}
                {getRottenTomatoesRating(details.Ratings) && (
                  <div className="rating-badge-item">
                    <span className="rating-source">Rotten Tomatoes</span>
                    <span className="rating-score">🍅 {getRottenTomatoesRating(details.Ratings)}</span>
                  </div>
                )}
                {details.Metascore && details.Metascore !== 'N/A' && (
                  <div className="rating-badge-item">
                    <span className="rating-source">Metascore</span>
                    <span className="rating-score">🎮 {details.Metascore}/100</span>
                  </div>
                )}
              </div>

              <div className="modal-plot-block">
                <h3>Plot Outline</h3>
                <p>{details.Plot !== 'N/A' ? details.Plot : 'No description outline available for this title.'}</p>
              </div>

              <div className="specs-grid">
                <div className="spec-item">
                  <span className="spec-label">Genre</span>
                  <span className="spec-value">{details.Genre}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Director</span>
                  <span className="spec-value">{details.Director}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Writers</span>
                  <span className="spec-value">{details.Writer}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Cast Stars</span>
                  <span className="spec-value">{details.Actors}</span>
                </div>
                {details.Awards && details.Awards !== 'N/A' && (
                  <div className="spec-item full-width">
                    <span className="spec-label">Awards & Achievements</span>
                    <span className="spec-value medal-text">🏆 {details.Awards}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
