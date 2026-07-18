import { useParams, Link } from 'react-router-dom';
import './BreweryDetail.css';

function BreweryDetail({ breweries }) {
  const { id } = useParams();
  const brewery = breweries.find((b) => String(b.id) === id);

  if (!brewery) {
    return (
      <div className="detail-view">
        <Link to="/" className="back-link">← Back to Dashboard</Link>
        <p>Brewery not found.</p>
      </div>
    );
  }

  const address = [brewery.address_1, brewery.address_2, brewery.address_3]
    .filter(Boolean)
    .join(', ');

  const mapsUrl =
    brewery.latitude && brewery.longitude
      ? `https://www.google.com/maps/search/?api=1&query=${brewery.latitude},${brewery.longitude}`
      : null;

  return (
    <div className="detail-view">
      <Link to="/" className="back-link">← Back to Dashboard</Link>

      <h2>{brewery.name}</h2>
      <span className="badge">{brewery.brewery_type}</span>

      <div className="detail-grid">
        <div className="detail-card">
          <h3>Location</h3>
          <p>{address || 'Address not listed'}</p>
          <p>
            {brewery.city}, {brewery.state} {brewery.postal_code}
          </p>
          <p>{brewery.country}</p>
          {mapsUrl && (
            <a href={mapsUrl} target="_blank" rel="noreferrer">
              View on Google Maps
            </a>
          )}
        </div>

        <div className="detail-card">
          <h3>Contact</h3>
          <p>Phone: {brewery.phone || 'Not listed'}</p>
          <p>
            Website:{' '}
            {brewery.website_url ? (
              <a href={brewery.website_url} target="_blank" rel="noreferrer">
                {brewery.website_url}
              </a>
            ) : (
              'Not listed'
            )}
          </p>
        </div>

        <div className="detail-card">
          <h3>Other Details</h3>
          <p>Brewery ID: {brewery.id}</p>
          <p>
            Coordinates:{' '}
            {brewery.latitude && brewery.longitude
              ? `${brewery.latitude}, ${brewery.longitude}`
              : 'Not available'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default BreweryDetail;