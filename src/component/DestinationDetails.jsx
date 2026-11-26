import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

const FALLBACK_IMAGE = "https://placehold.co/1000x500?text=TravelGo";

const origins = [
    "Tiruchirappalli",
    "Chennai",
    "Bengaluru",
    "Coimbatore",
    "Madurai"
];

const coordinates = {
    Tiruchirappalli: [10.7905, 78.7047],
    Chennai: [13.0827, 80.2707],
    Bengaluru: [12.9716, 77.5946],
    Coimbatore: [11.0168, 76.9558],
    Madurai: [9.9252, 78.1198],

    Ooty: [11.4102, 76.695],
    Goa: [15.2993, 74.124],
    Manali: [32.2432, 77.1892],
    Munnar: [10.0889, 77.0595],
    Jaipur: [26.9124, 75.7873],
    Kodaikanal: [10.2381, 77.4892],
    Kashmir: [34.0837, 74.7973],
    Mysore: [12.2958, 76.6394],
    Ladakh: [34.1526, 77.5771],
    Darjeeling: [27.036, 88.2627],
    Agra: [27.1767, 78.0081],
    Alleppey: [9.4981, 76.3388],
    Rishikesh: [30.0869, 78.2676],
    Udaipur: [24.5854, 73.7125],
    Coorg: [12.3375, 75.8069],
    Shimla: [31.1048, 77.1734],
    Mumbai: [19.076, 72.8777],
    Delhi: [28.6139, 77.209],
    Bengaluru: [12.9716, 77.5946],
    Chennai: [13.0827, 80.2707],
    Hyderabad: [17.385, 78.4867],
    Kolkata: [22.5726, 88.3639],
    Pondicherry: [11.9416, 79.8083],
    Hampi: [15.335, 76.46],
    Wayanad: [11.6854, 76.132],
    Varkala: [8.7379, 76.7163],
    Mahabalipuram: [12.6269, 80.1927],
    Rameswaram: [9.2876, 79.3129],
    Kanyakumari: [8.0883, 77.5385],
    Yercaud: [11.7753, 78.209]
};

function formatPrice(value) {
    return "₹" + Number(value).toLocaleString("en-IN");
}

function getToday() {
    const now = new Date();
    const local = new Date(
        now.getTime() - now.getTimezoneOffset() * 60000
    );

    return local.toISOString().split("T")[0];
}

function getDistance(origin, destination) {
    const start = coordinates[origin];
    const end = coordinates[destination];

    if (!start || !end) return 500;

    const radians = (degree) => degree * Math.PI / 180;

    const lat1 = radians(start[0]);
    const lat2 = radians(end[0]);
    const latDifference = radians(end[0] - start[0]);
    const lonDifference = radians(end[1] - start[1]);

    const a =
        Math.sin(latDifference / 2) ** 2 +
        Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(lonDifference / 2) ** 2;

    return Math.round(
        6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    );
}

function getTravelDetails(origin, destination, transport) {
    const straightDistance = getDistance(origin, destination);

    const settings = {
        Bus: {
            distanceFactor: 1.25,
            rate: 1.5,
            speed: 45,
            minimum: 300,
            extraHours: 0
        },
        Train: {
            distanceFactor: 1.15,
            rate: 1,
            speed: 55,
            minimum: 250,
            extraHours: 0.5
        },
        Flight: {
            distanceFactor: 1,
            rate: 4.5,
            speed: 600,
            minimum: 1500,
            extraHours: 2
        }
    };

    const setting = settings[transport];

    const distance = Math.round(
        straightDistance * setting.distanceFactor
    );

    const fare = Math.max(
        setting.minimum,
        Math.round((distance * setting.rate) / 50) * 50
    );

    const hours = distance / setting.speed + setting.extraHours;

    return {
        distance,
        fare,
        duration: `${Math.floor(hours)}h ${Math.round((hours % 1) * 60)}m`
    };
}

function DestinationDetails({
    destinations,
    trips,
    bookings,
    addTrip,
    addBooking,
    loading,
    error
}) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        date: "",
        travellers: 1,
        origin: "Tiruchirappalli",
        transport: "Bus",
        coupon: ""
    });

    const [couponMessage, setCouponMessage] = useState("");
    const [couponResult, setCouponResult] = useState(null);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    if (loading) {
        return <div className="message">Loading destination...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    const destination = destinations.find(
        (item) => String(item.id) === id
    );

    if (!destination) {
        return (
            <div className="empty-state">
                <h2>Destination not found</h2>
                <Link to="/" className="btn primary-btn">
                    Back Home
                </Link>
            </div>
        );
    }

    const added = trips.some(
        (trip) => String(trip.id) === String(destination.id)
    );

    const travellers = Math.max(1, Number(form.travellers) || 1);

    const travel = getTravelDetails(
        form.origin,
        destination.name,
        form.transport
    );

    const packageTotal = Number(destination.price) * travellers;
    const transportTotal = travel.fare * travellers;
    const subtotal = packageTotal + transportTotal;

    const discount = couponResult?.discount || 0;
    const total = Math.max(0, subtotal - discount);

    function handleChange(e) {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: ""
        }));

        if (name === "origin" || name === "transport") {
            setCouponResult(null);
            setCouponMessage("");
        }
    }

    function applyCoupon() {
        const code = form.coupon.trim().toUpperCase();

        if (!code) {
            setCouponMessage("Enter a coupon code.");
            setCouponResult(null);
            return;
        }

        let amount = 0;
        let message = "";

        if (code === "FIRST10") {
            const alreadyBooked = bookings.length > 0;

            if (alreadyBooked) {
                setCouponMessage("FIRST10 is only for your first booking.");
                setCouponResult(null);
                return;
            }

            amount = subtotal * 0.10;
            message = "10% discount applied!";
        } else if (code === "TRAIN15" && form.transport === "Train") {
            amount = transportTotal * 0.15;
            message = "15% train discount applied!";
        } else if (code === "FLY20" && form.transport === "Flight") {
            amount = transportTotal * 0.20;
            message = "20% flight discount applied!";
        } else if (code === "TRAVEL500" && subtotal >= 5000) {
            amount = 500;
            message = "₹500 discount applied!";
        } else {
            setCouponMessage("Invalid coupon or booking does not meet the conditions.");
            setCouponResult(null);
            return;
        }

        amount = Math.round(amount);

        setCouponResult({
            code,
            discount: amount
        });

        setCouponMessage(message);
    }

    function validate() {
        const newErrors = {};

        if (form.name.trim().length < 2) {
            newErrors.name = "Enter your full name.";
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = "Enter a valid email address.";
        }

        if (!/^[6-9]\d{9}$/.test(form.phone)) {
            newErrors.phone = "Enter a valid 10-digit mobile number.";
        }

        if (!form.date) {
            newErrors.date = "Choose a travel date.";
        } else if (form.date < getToday()) {
            newErrors.date = "Travel date cannot be in the past.";
        }

        if (
            !Number.isInteger(Number(form.travellers)) ||
            travellers < 1 ||
            travellers > 10
        ) {
            newErrors.travellers = "Choose between 1 and 10 travellers.";
        }

        return newErrors;
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const newErrors = validate();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setSaving(true);

        const booking = {
            destinationId: destination.id,
            destination: destination.name,
            country: destination.country,
            image: destination.image,
            days: destination.days,
            packagePrice: Number(destination.price),
            customer: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone,
            date: form.date,
            travellers,
            origin: form.origin,
            transport: form.transport,
            distance: travel.distance,
            journeyDuration: travel.duration,
            transportFare: travel.fare,
            couponCode: couponResult?.code || "",
            discount,
            subtotal,
            total,
            bookedOn: new Date().toISOString()
        };

        const success = await addBooking(booking);

        setSaving(false);

        if (success) {
            navigate("/bookings");
        }
    }

    return (
        <div className="details-page">
            <Link to="/" className="back-link">
                ← Back to destinations
            </Link>

            <div className="details-banner-wrapper">
                <img
                    className="details-banner"
                    src={destination.image}
                    alt={destination.name}
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                />

                <div className="banner-title">
                    <span>{destination.country}</span>
                    <h1>{destination.name}</h1>
                </div>
            </div>

            <div className="details-layout">
                <div className="details-info">
                    <div className="facts">
                        <div className="fact">
                            <span>Duration</span>
                            <strong>{destination.days} Days</strong>
                        </div>

                        <div className="fact">
                            <span>Package / person</span>
                            <strong>{formatPrice(destination.price)}</strong>
                        </div>

                        <div className="fact">
                            <span>Best time</span>
                            <strong>{destination.bestTime}</strong>
                        </div>
                    </div>

                    <div className="details-section">
                        <span className="eyebrow">DISCOVER</span>
                        <h2>About {destination.name}</h2>
                        <p>{destination.description}</p>
                    </div>

                    <div className="details-section">
                        <span className="eyebrow">DON'T MISS</span>
                        <h2>Top Attractions</h2>

                        <div className="attraction-list">
                            {destination.attractions.map((place) => (
                                <div className="attraction-item" key={place}>
                                    <span>✦</span>
                                    {place}
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        className="btn outline-btn"
                        onClick={() => addTrip(destination)}
                        disabled={added}
                    >
                        {added ? "✓ Added to My Trips" : "+ Add to My Trips"}
                    </button>
                </div>

                <aside className="booking-card">
                    <div className="booking-heading">
                        <span className="eyebrow">PLAN YOUR JOURNEY</span>
                        <h2>Book this trip</h2>
                        <p>Complete your details to continue.</p>
                    </div>

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="form-group">
                            <label htmlFor="name">Full name</label>
                            <input
                                id="name"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Your name"
                            />
                            {errors.name && <small className="field-error">{errors.name}</small>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email address</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                            />
                            {errors.email && <small className="field-error">{errors.email}</small>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Mobile number</label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                maxLength={10}
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="10-digit mobile number"
                            />
                            {errors.phone && <small className="field-error">{errors.phone}</small>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="origin">Starting city</label>
                            <select
                                id="origin"
                                name="origin"
                                value={form.origin}
                                onChange={handleChange}
                            >
                                {origins.map((origin) => (
                                    <option key={origin} value={origin}>
                                        {origin}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Choose transport</label>

                            <div className="transport-options">
                                {["Bus", "Train", "Flight"].map((mode) => (
                                    <button
                                        type="button"
                                        key={mode}
                                        className={`transport-option ${form.transport === mode ? "chosen" : ""}`}
                                        onClick={() =>
                                            handleChange({
                                                target: {
                                                    name: "transport",
                                                    value: mode
                                                }
                                            })
                                        }
                                    >
                                        <span>
                                            {mode === "Bus" ? "🚌" : mode === "Train" ? "🚆" : "✈️"}
                                        </span>
                                        {mode}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="journey-info">
                            <div>
                                <span>Estimated distance</span>
                                <strong>{travel.distance.toLocaleString("en-IN")} km</strong>
                            </div>

                            <div>
                                <span>Journey time</span>
                                <strong>{travel.duration}</strong>
                            </div>

                            <div>
                                <span>Transport fare / person</span>
                                <strong>{formatPrice(travel.fare)}</strong>
                            </div>

                            <small>
                                Demo estimates only. Actual routes, schedules and fares may differ.
                            </small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="date">Travel date</label>
                            <input
                                id="date"
                                type="date"
                                name="date"
                                min={getToday()}
                                value={form.date}
                                onChange={handleChange}
                            />
                            {errors.date && <small className="field-error">{errors.date}</small>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="travellers">Number of travellers</label>
                            <input
                                id="travellers"
                                type="number"
                                name="travellers"
                                min="1"
                                max="10"
                                value={form.travellers}
                                onChange={handleChange}
                            />
                            {errors.travellers && <small className="field-error">{errors.travellers}</small>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="coupon">Discount coupon</label>

                            <div className="coupon-input">
                                <input
                                    id="coupon"
                                    name="coupon"
                                    value={form.coupon}
                                    onChange={(e) => {
                                        handleChange(e);
                                        setCouponResult(null);
                                        setCouponMessage("");
                                    }}
                                    placeholder="Enter coupon code"
                                />

                                <button
                                    type="button"
                                    onClick={applyCoupon}
                                >
                                    Apply
                                </button>
                            </div>

                            {couponMessage && (
                                <small className={couponResult ? "success-text" : "field-error"}>
                                    {couponMessage}
                                </small>
                            )}
                        </div>

                        <div className="price-breakdown">
                            <div>
                                <span>Package × {travellers}</span>
                                <strong>{formatPrice(packageTotal)}</strong>
                            </div>

                            <div>
                                <span>{form.transport} × {travellers}</span>
                                <strong>{formatPrice(transportTotal)}</strong>
                            </div>

                            <div>
                                <span>Subtotal</span>
                                <strong>{formatPrice(subtotal)}</strong>
                            </div>

                            <div className="discount-line">
                                <span>Discount</span>
                                <strong>- {formatPrice(discount)}</strong>
                            </div>

                            <div className="final-total">
                                <span>Total amount</span>
                                <strong>{formatPrice(total)}</strong>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn primary-btn btn-block"
                            disabled={saving}
                        >
                            {saving ? "Confirming..." : "Confirm Booking →"}
                        </button>

                        <p className="booking-note">
                            This is a demo booking. No payment is collected.
                        </p>
                    </form>
                </aside>
            </div>
        </div>
    );
}

export default DestinationDetails;