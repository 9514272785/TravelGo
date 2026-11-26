function Search({
    filters,
    updateFilter,
    resetFilters,
    filtersActive,
    states,
    favoritesCount
}) {

    return (

        <section className="search-container">

            <h2>Find Your Destination</h2>

            <input
                type="text"
                placeholder="Search by name or state..."
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
                aria-label="Search destinations"
            />

            <div className="filter-row">

                <select
                    value={filters.state}
                    onChange={(e) => updateFilter("state", e.target.value)}
                    aria-label="Filter by state"
                >
                    <option value="all">All States</option>
                    {states.map((state) => (
                        <option key={state} value={state}>
                            {state}
                        </option>
                    ))}
                </select>

                <select
                    value={filters.sort}
                    onChange={(e) => updateFilter("sort", e.target.value)}
                    aria-label="Sort destinations"
                >
                    <option value="default">Sort: Default</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="days">Duration: Shortest</option>
                    <option value="name">Name: A to Z</option>
                </select>

                <button
                    className={`chip ${filters.favoritesOnly ? "chip-active" : ""}`}
                    onClick={() =>
                        updateFilter("favoritesOnly", !filters.favoritesOnly)
                    }
                >
                    ♥ Favourites ({favoritesCount})
                </button>

                {filtersActive && (
                    <button className="btn btn-outline" onClick={resetFilters}>
                        Reset
                    </button>
                )}

            </div>

        </section>
    );
}

export default Search;