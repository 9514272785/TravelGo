import { Link } from "react-router-dom";

function About() {
    return (
        <div className="inner-page about-page">
            <div className="about-hero">
                <span className="eyebrow">ABOUT TRAVELGO</span>
                <h1>
                    Travel more.
                    <br />
                    <span>Discover more.</span>
                </h1>
                <p>
                    TravelGo is a travel booking and trip planning demo
                    application designed to make discovering destinations
                    and planning journeys simple.
                </p>
                <Link to="/" className="btn primary-btn">
                    Start exploring ↗
                </Link>
            </div>

            <div className="about-features">
                <div className="feature-card">
                    <span>⌕</span>
                    <h3>Discover places</h3>
                    <p>Search and explore destinations across India.</p>
                </div>

                <div className="feature-card">
                    <span>✈</span>
                    <h3>Plan journeys</h3>
                    <p>Compare estimated bus, train and flight fares.</p>
                </div>

                <div className="feature-card">
                    <span>▤</span>
                    <h3>Manage bookings</h3>
                    <p>Keep your booking information in one place.</p>
                </div>

                <div className="feature-card">
                    <span>♡</span>
                    <h3>Save favourites</h3>
                    <p>Keep track of the places you want to visit.</p>
                </div>
            </div>
        </div>
    );
}

export default About;