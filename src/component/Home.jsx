import { useState } from "react";
import { Link } from "react-router-dom";

function Home({
    destinations,
    loading,
    error,
    trips,
    addTrip,
    favorites,
    toggleFavorite
}) {
    const [search, setSearch] = useState("");
    const [stateFilter, setStateFilter] = useState("all");
    const [sort, setSort] = useState("default");
    const [favoritesOnly, setFavoritesOnly] = useState(false);

    const states = [...new Set(
        destinations.map((destination) => destination.country)
    )].sort();

    let filtered = destinations.filter((destination) => {
        const matchesSearch =
            destination.name.toLowerCase().includes(search.toLowerCase()) ||
            destination.country.toLowerCase().includes(search.toLowerCase());

        const matchesState =
            stateFilter === "all" || destination.country === stateFilter;

        const matchesFavorite =
            !favoritesOnly || favorites.includes(destination.id);

        return matchesSearch && matchesState && matchesFavorite;
    });

    if (sort === "price-low") {
        filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sort === "price-high") {
        filtered = [...filtered].sort((a, b) => b.price - a.price);
    } else if (sort === "days") {
        filtered = [...filtered].sort((a, b) => a.days - b.days);
    } else if (sort === "name") {
        filtered = [...filtered].sort((a, b) =>
            a.name.localeCompare(b.name)
        );
    }

    if (loading) {
        return <div className="message">Loading destinations...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="home-page">
            <div className="hero">
                <div className="hero-content">
                    <span className="eyebrow">EXPLORE INDIA WITH TRAVELGO</span>

                    <h1>
                        Your next journey
                        <br />
                        starts <span>here.</span>
                    </h1>

                    <p>
                        Discover beautiful destinations, plan your journey
                        and book your next unforgettable trip.
                    </p>

                    <a href="#destinations" className="btn primary-btn">
                        Explore destinations ↗
                    </a>

                    <div className="hero-stats">
                        <div>
                            <strong>{destinations.length}+</strong>
                            <span>Destinations</span>
                        </div>
                        <div>
                            <strong>3</strong>
                            <span>Travel modes</span>
                        </div>
                        <div>
                            <strong>24/7</strong>
                            <span>Trip planning</span>
                        </div>
                    </div>
                </div>

                <div className="hero-image">
                    <img
                        src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1000"
                        alt="Beautiful travel destination"
                    />
                    <div className="floating-card">
                        <span>✦</span>
                        <div>
                            <strong>Explore more</strong>
                            <small>Make memories everywhere</small>
                        </div>
                    </div>
                </div>
            </div>

            <section className="destination-section" id="destinations">
                <div className="section-heading">
                    <div>
                        <span className="eyebrow">FIND YOUR NEXT STOP</span>
                        <h2>Explore destinations</h2>
                        <p>Find the perfect place for your next adventure.</p>
                    </div>

                    <span className="result-count">
                        {filtered.length} destinations
                    </span>
                </div>

                <div className="search-panel">
                    <input
                        type="search"
                        placeholder="Search destination or state..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <select
                        value={stateFilter}
                        onChange={(e) => setStateFilter(e.target.value)}
                    >
                        <option value="all">All States</option>
                        {states.map((state) => (
                            <option key={state} value={state}>
                                {state}
                            </option>
                        ))}
                    </select>

                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                    >
                        <option value="default">Sort: Default</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="days">Shortest Duration</option>
                        <option value="name">Name: A to Z</option>
                    </select>

                    <button
                        className={`favorite-filter ${favoritesOnly ? "active" : ""}`}
                        onClick={() => setFavoritesOnly(!favoritesOnly)}
                    >
                        ♥ Favourites
                    </button>
                </div>

                {filtered.length === 0 ? (
                    <div className="empty-state">
                        <h3>No destinations found</h3>
                        <p>Try changing your search or filters.</p>
                        <button
                            className="btn primary-btn"
                            onClick={() => {
                                setSearch("");
                                setStateFilter("all");
                                setSort("default");
                                setFavoritesOnly(false);
                            }}
                        >
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <div className="destination-grid">
                        {filtered.map((destination) => {
                            const added = trips.some(
                                (trip) =>
                                    String(trip.id) === String(destination.id)
                            );

                            const favorite = favorites.includes(destination.id);

                            return (
                                <div className="destination-card" key={destination.id}>
                                    <div className="card-image">
                                        <img
                                            src={destination.image}
                                            alt={destination.name}
                                            loading="lazy"
                                        />

                                        <button
                                            className={`heart-button ${favorite ? "selected" : ""}`}
                                            onClick={() =>
                                                toggleFavorite(destination.id)
                                            }
                                            aria-label="Toggle favourite"
                                        >
                                            {favorite ? "♥" : "♡"}
                                        </button>

                                        <span className="days-tag">
                                            {destination.days} days
                                        </span>
                                    </div>

                                    <div className="card-content">
                                        <span className="card-location">
                                            📍 {destination.country}
                                        </span>

                                        <h3>{destination.name}</h3>

                                        <p>
                                            {destination.description?.slice(0, 85)}
                                            ...
                                        </p>

                                        <div className="card-bottom">
                                            <div>
                                                <small>Starting from</small>
                                                <strong>
                                                    ₹{Number(destination.price).toLocaleString("en-IN")}
                                                </strong>
                                            </div>

                                            <Link
                                                to={`/destination/${destination.id}`}
                                                className="card-link"
                                            >
                                                Explore ↗
                                            </Link>
                                        </div>

                                        <button
                                            className="add-trip-button"
                                            onClick={() => addTrip(destination)}
                                            disabled={added}
                                        >
                                            {added ? "✓ Added to My Trips" : "+ Add to My Trips"}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}

export default Home;