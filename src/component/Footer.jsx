import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-main">
                <div>
                    <Link to="/" className="logo footer-logo">
                        <span>✦</span> TravelGo
                    </Link>
                    <p>
                        Discover places. Plan journeys.
                        Make memories.
                    </p>
                </div>

                <div className="footer-links">
                    <strong>Explore</strong>
                    <Link to="/">Destinations</Link>
                    <Link to="/trips">My Trips</Link>
                    <Link to="/bookings">My Bookings</Link>
                    <Link to="/about">About Us</Link>
                </div>
            </div>

            <div className="footer-bottom">
                <span>© 2026 TravelGo. All rights reserved.</span>
                <span>Made for your next adventure ✦</span>
            </div>
        </footer>
    );
}

export default Footer;