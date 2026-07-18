import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import BreweryDetail from './components/BreweryDetail';
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

  const types = ['All', ...new Set(breweries.map((b) => b.brewery_type))];

  const filteredBreweries = breweries.filter((b) => {
    const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'All' || b.brewery_type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalBreweries = breweries.length;
  const uniqueStates = new Set(breweries.map((b) => b.state).filter(Boolean)).size;
  const typeCounts = breweries.reduce((acc, b) => {
    const t = b.brewery_type || 'unknown';
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});
  const topType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  if (loading) return <div className="status">Loading breweries...</div>;
  if (error) return <div className="status error">{error}</div>;

  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar
          totalBreweries={totalBreweries}
          uniqueStates={uniqueStates}
          topType={topType}
          search={search}
          setSearch={setSearch}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          types={types}
        />
        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  breweries={breweries}
                  filteredBreweries={filteredBreweries}
                  typeCounts={typeCounts}
                />
              }
            />
            <Route
              path="/brewery/:id"
              element={<BreweryDetail breweries={breweries} />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;