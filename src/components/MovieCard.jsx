import { useState } from 'react';

/**
 * MovieCard displays individual movie details in a card.
 * Handles missing/broken poster links with a styled placeholder.
 */
export default function MovieCard({ movie, onClick }) {
  const [imageError, setImageError] = useState(false);

  const { Title, Year, Type, Poster, imdbID } = movie;

  const hasPoster = Poster && Poster !== 'N/A' && !imageError;

  // Format type for badge display (capitalize first letter)
  const formattedType = Type ? Type.charAt(0).toUpperCase() + Type.slice(1) : 'Movie';

  // Determine type class for badge styling
  const getTypeBadgeClass = (type) => {
    switch (type?.toLowerCase()) {
      case 'movie':
        return 'badge-movie';
      case 'series':
        return 'badge-series';
      case 'episode':
        return 'badge-episode';
      default:
        return 'badge-other';
    }
  };

  return (
    <div 
      className="movie-card" 
      onClick={() => onClick(imdbID)}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${Title} (${Year})`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(imdbID);
        }
      }}
    >
      <div className="card-image-container">
        {hasPoster ? (
          <img 
            src={Poster} 
            alt={`${Title} Poster`} 
            className="movie-poster"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="poster-placeholder-gradient">
            <div className="placeholder-icon">
              <svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
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
            <span className="placeholder-title">{Title}</span>
            <span className="placeholder-label">Poster Unavailable</span>
          </div>
        )}
      </div>

      <div className="card-info">
        <h3 className="movie-title-header" title={Title}>{Title}</h3>
        <div className="movie-metadata-row">
          <span className={`type-badge ${getTypeBadgeClass(Type)}`}>
            {formattedType}
          </span>
          <span className="movie-year">{Year}</span>
        </div>
      </div>
    </div>
  );
}
