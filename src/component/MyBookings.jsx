import { Link } from "react-router-dom";

function formatPrice(value) {
    return "₹" + Number(value || 0).toLocaleString("en-IN");
}

function MyBookings({ bookings, cancelBooking }) {
    return (
        <div className="inner-page">
            <div className="section-heading">
                <div>
                    <span className="eyebrow">YOUR JOURNEY HISTORY</span>
                    <h1>My Bookings</h1>
                    <p>View and manage your confirmed demo bookings.</p>
                </div>

                <span className="result-count">
                    {bookings.length} bookings
                </span>
            </div>

            {bookings.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">▤</div>
                    <h2>No bookings yet</h2>
                    <p>Your bookings will appear here after confirmation.</p>
                    <Link to="/" className="btn primary-btn">
                        Find a destination
                    </Link>
                </div>
            ) : (
                <div className="booking-list">
                    {[...bookings].reverse().map((booking) => (
                        <div className="saved-booking" key={booking.id}>
                            <div className="saved-booking-image">
                                <img
                                    src={booking.image}
                                    alt={booking.destination}
                                />
                            </div>

                            <div className="saved-booking-content">
                                <div className="booking-title-row">
                                    <div>
                                        <span className="eyebrow">
                                            BOOKING #{booking.id}
                                        </span>
                                        <h2>{booking.destination}</h2>
                                        <p>{booking.country}</p>
                                    </div>

                                    <span className="status-pill">
                                        Confirmed
                                    </span>
                                </div>

                                <div className="booking-details-grid">
                                    <div>
                                        <span>Customer</span>
                                        <strong>{booking.customer}</strong>
                                    </div>

                                    <div>
                                        <span>Email</span>
                                        <strong>{booking.email}</strong>
                                    </div>

                                    <div>
                                        <span>Travel date</span>
                                        <strong>{booking.date}</strong>
                                    </div>

                                    <div>
                                        <span>Travellers</span>
                                        <strong>{booking.travellers}</strong>
                                    </div>

                                    <div>
                                        <span>Starting city</span>
                                        <strong>{booking.origin}</strong>
                                    </div>

                                    <div>
                                        <span>Transport</span>
                                        <strong>{booking.transport}</strong>
                                    </div>

                                    <div>
                                        <span>Distance</span>
                                        <strong>{booking.distance} km</strong>
                                    </div>

                                    <div>
                                        <span>Journey time</span>
                                        <strong>{booking.journeyDuration}</strong>
                                    </div>

                                    <div>
                                        <span>Package</span>
                                        <strong>{formatPrice(booking.packagePrice)}</strong>
                                    </div>

                                    <div>
                                        <span>Transport / person</span>
                                        <strong>{formatPrice(booking.transportFare)}</strong>
                                    </div>

                                    <div>
                                        <span>Coupon</span>
                                        <strong>{booking.couponCode || "None"}</strong>
                                    </div>

                                    <div>
                                        <span>Discount</span>
                                        <strong>{formatPrice(booking.discount)}</strong>
                                    </div>
                                </div>

                                <div className="booking-footer">
                                    <div>
                                        <span>Total paid amount (demo)</span>
                                        <strong>{formatPrice(booking.total)}</strong>
                                    </div>

                                    <button
                                        className="cancel-button"
                                        onClick={() => {
                                            if (window.confirm("Cancel this booking?")) {
                                                cancelBooking(booking.id);
                                            }
                                        }}
                                    >
                                        Cancel booking
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyBookings;