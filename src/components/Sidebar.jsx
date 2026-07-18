import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({
  totalBreweries,
  uniqueStates,
  topType,
  search,
  setSearch,
  typeFilter,
  setTypeFilter,
  types,
}) {
  return (
    <aside className="sidebar">
      <Link to="/" className="sidebar-title-link">
        <h1>🍺 Brewery Dashboard</h1>
      </Link>
      <p className="sidebar-subtitle">Powered by the Open Brewery DB API</p>

      <div className="stats-stack">
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
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
}

export default Sidebar;