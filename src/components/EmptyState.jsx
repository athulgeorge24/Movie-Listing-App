
/**
 * EmptyState component displays visually engaging messages for missing content,
 * search misses, server errors, and environment configuration guides.
 */
export default function EmptyState({ type = 'no-results', message, onRetry, searchTerm = '' }) {
  
  if (type === 'api-key-missing') {
    return (
      <div className="empty-state api-key-state">
        <div className="empty-state-icon danger-icon">
          <svg viewBox="0 0 24 24" width="64" height="64" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            <line x1="12" y1="16" x2="12" y2="18"></line>
          </svg>
        </div>
        <h2>Configuration Required</h2>
        <p className="empty-state-description">
          The application requires an <strong>OMDb API Key</strong> to fetch movie listings.
        </p>
        
        <div className="setup-instructions">
          <h4>How to fix this locally:</h4>
          <ol>
            <li>Get a free API key at <a href="https://www.omdbapi.com/apikey.aspx" target="_blank" rel="noopener noreferrer">omdbapi.com</a></li>
            <li>Create a file named <code>.env</code> in the project root folder.</li>
            <li>Add the key: <code>OMDB_API_KEY=your_key_here</code></li>
            <li>Restart your development server (<code>npm run dev</code>).</li>
          </ol>

          <h4>How to configure on Vercel:</h4>
          <ul>
            <li>Go to your Vercel project dashboard &rarr; <strong>Settings</strong> &rarr; <strong>Environment Variables</strong></li>
            <li>Add a variable named <code>OMDB_API_KEY</code> with your API key as the value.</li>
            <li>Redeploy your project.</li>
          </ul>
        </div>
        
        {onRetry && (
          <button className="primary-btn retry-btn" onClick={onRetry}>
            Check Again
          </button>
        )}
      </div>
    );
  }

  if (type === 'error') {
    return (
      <div className="empty-state error-state">
        <div className="empty-state-icon error-icon">
          <svg viewBox="0 0 24 24" width="64" height="64" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <h2>Oops! Something went wrong</h2>
        <p className="empty-state-description">
          {message || 'We encountered an error while trying to fetch the movie data. Please check your network connection.'}
        </p>
        {onRetry && (
          <button className="primary-btn retry-btn" onClick={onRetry}>
            Try Again
          </button>
        )}
      </div>
    );
  }

  // Default: no-results
  return (
    <div className="empty-state no-results-state">
      <div className="empty-state-icon search-icon">
        <svg viewBox="0 0 24 24" width="64" height="64" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          <line x1="8" y1="11" x2="14" y2="11"></line>
        </svg>
      </div>
      <h2>No Movies Found</h2>
      <p className="empty-state-description">
        We couldn't find any listings matching <strong>"{searchTerm || 'your query'}"</strong>.
      </p>
      <p className="empty-state-suggestion">
        Try adjusting your keywords, selecting a different filter, or spelling the title differently.
      </p>
    </div>
  );
}
