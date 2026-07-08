import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [breweries, setBreweries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  useEffect(() => {
    async function fetchBreweries() {
      try {
        const url = 'https://api.openbrewerydb.org/v1/breweries?per_page=50';
        const response = await fetch(url);
        const data = await response.json();
        setBreweries(data);
      } catch (err) {
        setError('Failed to fetch breweries.');
      } finally {
        setLoading(false);
      }
    }
    fetchBreweries();
  }, []);

  // Unique brewery types for filter dropdown
  const types = ['All', ...new Set(breweries.map((b) => b.brewery_type))];

  // Apply search + filter
  const filteredBreweries = breweries.filter((b) => {
    const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'All' || b.brewery_type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Summary stats (based on full dataset, not filtered)
  const totalBreweries = breweries.length;

  const uniqueStates = new Set(
    breweries.map((b) => b.state).filter(Boolean)
  ).size;

  const typeCounts = breweries.reduce((acc, b) => {
    const t = b.brewery_type || 'unknown';
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});
  const topType =
    Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  if (loading) return <div className="status">Loading breweries...</div>;
  if (error) return <div className="status error">{error}</div>;

  return (
    <div className="dashboard">
      <header className="header">
        <h1>🍺 Brewery Dashboard</h1>
        <p>Powered by the Open Brewery DB API</p>
      </header>

      <div className="stats-row">
        <div className="card">
          <h3>Total Breweries</h3>
          <p>{totalBreweries}</p>
        </div>
        <div className="card">
          <h3>States Represented</h3>
          <p>{uniqueStates}</p>
        </div>
        <div className="card">
          <h3>Most Common Type</h3>
          <p>{topType}</p>
        </div>
      </div>

      <div className="controls">
        <input
          type="text"
          placeholder="Search breweries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="event-list">
        {filteredBreweries.length === 0 && <p>No breweries match your search.</p>}
        {filteredBreweries.map((b) => (
          <div className="event-row" key={b.id}>
            <div className="event-info">
              <h4>{b.name}</h4>
              <p>
                {b.city}, {b.state || b.country}
              </p>
              <p>
                Type: {b.brewery_type} |{' '}
                {b.website_url ? (
                  <a href={b.website_url} target="_blank" rel="noreferrer">
                    Visit site
                  </a>
                ) : (
                  'No website listed'
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;