import { Link } from "react-router-dom";

const FALLBACK_IMAGE = "https://placehold.co/600x400?text=TravelGo";

function formatPrice(value) {
    return "₹" + Number(value).toLocaleString("en-IN");
}

function Main({
    destinations,
    trips,
    favorites,
    addTrip,
    toggleFavorite,
    loading,
    error,
    resetFilters
}) {

    return (

        <section className="main-container">

            <div className="section-heading" id="destinations">
                <h2>Popular Destinations</h2>
                {!loading && !error && (
                    <span>{destinations.length} places found</span>
                )}
            </div>

            {loading && <p className="message">Loading destinations...</p>}

            {error && <p className="error-message">{error}</p>}

            {!loading && !error && destinations.length > 0 && (

                <div className="destination-grid">

                    {destinations.map((destination) => {

                        const added = trips.some(
                            (trip) => trip.id === destination.id
                        );
                        const isFavorite = favorites.includes(destination.id);

                        return (

                            <article
                                className="destination-card"
                                key={destination.id}
                            >

                                <div className="card-image">

                                    <Link to={`/destination/${destination.id}`}>
                                        <img
                                            src={destination.image}
                                            alt={destination.name}
                                            loading="lazy"
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src = FALLBACK_IMAGE;
                                            }}
                                        />
                                    </Link>

                                    <button
                                        className={`fav-btn ${isFavorite ? "active" : ""}`}
                                        onClick={() =>
                                            toggleFavorite(destination.id)
                                        }
                                        aria-label={
                                            isFavorite
                                                ? "Remove from favourites"
                                                : "Add to favourites"
                                        }
                                    >
                                        {isFavorite ? "♥" : "♡"}
                                    </button>

                                </div>

                                <div className="destination-info">

                                    <h3>
                                        <Link to={`/destination/${destination.id}`}>
                                            {destination.name}
                                        </Link>
                                    </h3>

                                    <p className="location">
                                        {destination.country}
                                    </p>

                                    <div className="destination-details">
                                        <span>{destination.days} Days</span>
                                        <strong>
                                            {formatPrice(destination.price)}
                                        </strong>
                                    </div>

                                    <div className="card-actions">

                                        <Link
                                            to={`/destination/${destination.id}`}
                                            className="btn btn-outline"
                                        >
                                            Details
                                        </Link>

                                        <button
                                            className={`btn ${added ? "btn-outline" : "btn-primary"}`}
                                            onClick={() => addTrip(destination)}
                                            disabled={added}
                                        >
                                            {added ? "✓ Added" : "Add to Trips"}
                                        </button>

                                    </div>

                                </div>

                            </article>
                        );
                    })}

                </div>
            )}

            {!loading && !error && destinations.length === 0 && (
                <div className="empty-state">
                    <h3>No destinations found</h3>
                    <p>Try a different search or reset the filters.</p>
                    <button className="btn btn-primary" onClick={resetFilters}>
                        Reset Filters
                    </button>
                </div>
            )}

        </section>
    );
}

export default Main;