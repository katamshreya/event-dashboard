import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import './Dashboard.css';

const COLORS = ['#f4a259', '#bc4749', '#6a994e', '#386641', '#a7c957', '#e07a5f', '#3d405b'];

function Dashboard({ breweries, filteredBreweries, typeCounts }) {
  // Chart 1: breweries by type
  const typeData = Object.entries(typeCounts)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);

  // Chart 2: top 10 states by brewery count
  const stateCounts = breweries.reduce((acc, b) => {
    if (!b.state) return acc;
    acc[b.state] = (acc[b.state] || 0) + 1;
    return acc;
  }, {});
  const stateData = Object.entries(stateCounts)
    .map(([state, count]) => ({ state, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return (
    <div className="dashboard">
      <section className="charts-row">
        <div className="chart-card">
          <h3>Breweries by Type</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={typeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" tick={{ fontSize: 11 }} angle={-30} textAnchor="end" height={60} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count">
                {typeData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Top 10 States by Brewery Count</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stateData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="state" tick={{ fontSize: 11 }} angle={-30} textAnchor="end" height={60} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#386641" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="event-list">
        {filteredBreweries.length === 0 && <p>No breweries match your search.</p>}
        {filteredBreweries.map((b) => (
          <Link to={`/brewery/${b.id}`} className="event-row-link" key={b.id}>
            <div className="event-row">
              <div className="event-info">
                <h4>{b.name}</h4>
                <p>
                  {b.city}, {b.state || b.country}
                </p>
                <p>Type: {b.brewery_type}</p>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}

export default Dashboard;