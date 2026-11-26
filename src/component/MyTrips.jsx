import { Link } from "react-router-dom";

function MyTrips({ trips, removeTrip }) {
    const total = trips.reduce(
        (sum, trip) => sum + Number(trip.price),
        0
    );

    return (
        <div className="inner-page">
            <div className="section-heading">
                <div>
                    <span className="eyebrow">YOUR SAVED PLACES</span>
                    <h1>My Trips</h1>
                    <p>Your favourite destinations, all in one place.</p>
                </div>
                <span className="result-count">{trips.length} saved</span>
            </div>

            {trips.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">✈</div>
                    <h2>No trips saved yet</h2>
                    <p>Explore destinations and add places to your trip list.</p>
                    <Link to="/" className="btn primary-btn">
                        Explore destinations
                    </Link>
                </div>
            ) : (
                <>
                    <div className="trip-summary">
                        <div>
                            <span>Saved destinations</span>
                            <strong>{trips.length}</strong>
                        </div>
                        <div>
                            <span>Combined package estimate / person</span>
                            <strong>₹{total.toLocaleString("en-IN")}</strong>
                        </div>
                    </div>

                    <div className="destination-grid">
                        {trips.map((trip) => (
                            <div className="destination-card" key={trip.id}>
                                <div className="card-image">
                                    <img src={trip.image} alt={trip.name} />
                                    <span className="days-tag">{trip.days} days</span>
                                </div>

                                <div className="card-content">
                                    <span className="card-location">
                                        📍 {trip.country}
                                    </span>

                                    <h3>{trip.name}</h3>

                                    <div className="card-bottom">
                                        <div>
                                            <small>Package / person</small>
                                            <strong>
                                                ₹{Number(trip.price).toLocaleString("en-IN")}
                                            </strong>
                                        </div>

                                        <Link
                                            to={`/destination/${trip.id}`}
                                            className="card-link"
                                        >
                                            Book now ↗
                                        </Link>
                                    </div>

                                    <button
                                        className="remove-button"
                                        onClick={() => removeTrip(trip.id)}
                                    >
                                        Remove trip
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default MyTrips;