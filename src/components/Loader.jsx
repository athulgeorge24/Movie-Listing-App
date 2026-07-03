
/**
 * Loader component that displays either a full-page cinematic loading spinner
 * or a placeholder skeleton card grid based on the `type` prop.
 * 
 * @param {string} type - 'skeleton' for card placeholders, 'spinner' for a global loader
 * @param {number} count - number of skeleton cards to render (default is 8)
 */
export default function Loader({ type = 'skeleton', count = 8 }) {
  if (type === 'spinner') {
    return (
      <div className="spinner-container" aria-label="Loading content">
        <div className="spinner-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <p className="spinner-text">Loading Movies...</p>
      </div>
    );
  }

  // Create an array of length `count` to map over for skeleton cards
  const skeletons = Array.from({ length: count }, (_, index) => index);

  return (
    <div className="movies-grid skeleton-grid" aria-label="Loading movies data">
      {skeletons.map((id) => (
        <div key={id} className="movie-card skeleton-card">
          <div className="skeleton-image-container">
            <div className="skeleton-image shimmer"></div>
          </div>
          <div className="skeleton-info">
            <div className="skeleton-line skeleton-title shimmer"></div>
            <div className="skeleton-row">
              <div className="skeleton-line skeleton-badge shimmer"></div>
              <div className="skeleton-line skeleton-year shimmer"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
