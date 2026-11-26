import "./App.css";
import { useState, useEffect } from "react";
import {
    Routes,
    Route,
    NavLink,
    Link,
    useLocation
} from "react-router-dom";
import emailjs from "@emailjs/browser";

import Home from "./component/Home";
import DestinationDetails from "./component/DestinationDetails";
import MyTrips from "./component/MyTrips";
import MyBookings from "./component/MyBookings";
import About from "./component/About";
import Footer from "./component/Footer";
import Toast from "./component/Toast";
import useLocalStorage from "./hooks/useLocalStorage";
import seedData from "../data/db.json";

const API =
    import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV ? "http://localhost:3500" : "");

function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

function App() {
    const [destinations, setDestinations] = useState(() =>
        API ? [] : seedData.destinations
    );
    const [bookings, setBookings] = useLocalStorage("bookings", []);

    const [trips, setTrips] = useLocalStorage("trips", []);
    const [favorites, setFavorites] = useLocalStorage("favorites", []);
    const [theme, setTheme] = useLocalStorage("theme", "light");

    const [loading, setLoading] = useState(Boolean(API));
    const [error, setError] = useState("");
    const [toast, setToast] = useState("");

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    useEffect(() => {
        if (!API) {
            return;
        }

        const controller = new AbortController();

        async function fetchData() {
            try {
                setLoading(true);

                const [destinationResponse, bookingResponse] =
                    await Promise.all([
                        fetch(`${API}/destinations`, {
                            signal: controller.signal
                        }),
                        fetch(`${API}/bookings`, {
                            signal: controller.signal
                        })
                    ]);

                if (!destinationResponse.ok || !bookingResponse.ok) {
                    throw new Error("Unable to load TravelGo data");
                }

                const destinationData = await destinationResponse.json();
                const bookingData = await bookingResponse.json();

                setDestinations(destinationData);
                setBookings(bookingData);
                setError("");
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError("Unable to connect to the server. Please start JSON Server.");
                }
            } finally {
                setLoading(false);
            }
        }

        fetchData();

        return () => controller.abort();
    }, [setBookings]);

    function showToast(message) {
        setToast(message);
    }

    function addTrip(destination) {
        const exists = trips.some(
            (trip) => String(trip.id) === String(destination.id)
        );

        if (exists) {
            showToast("Destination already added!");
            return;
        }

        setTrips([...trips, destination]);
        showToast("Added to My Trips!");
    }

    function removeTrip(id) {
        setTrips(trips.filter((trip) => String(trip.id) !== String(id)));
        showToast("Trip removed!");
    }

    function toggleFavorite(id) {
        const exists = favorites.includes(id);

        if (exists) {
            setFavorites(favorites.filter((item) => item !== id));
            showToast("Removed from favourites");
        } else {
            setFavorites([...favorites, id]);
            showToast("Added to favourites");
        }
    }

    async function addBooking(booking) {
        try {
            let savedBooking;

            if (API) {
                const response = await fetch(`${API}/bookings`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(booking)
                });

                if (!response.ok) {
                    throw new Error("Booking could not be saved");
                }

                savedBooking = await response.json();
            } else {
                savedBooking = {
                    ...booking,
                    id: crypto.randomUUID()
                };
            }

            setBookings((previous) => [...previous, savedBooking]);

            try {
                const serviceId = import.meta.env.VITE_EMAIL_SERVICE_ID;
                const templateId = import.meta.env.VITE_EMAIL_TEMPLATE_ID;
                const publicKey = import.meta.env.VITE_EMAIL_PUBLIC_KEY;

                if (!serviceId || !templateId || !publicKey) {
                    throw new Error("EmailJS is not configured");
                }

                await emailjs.send(
                    serviceId,
                    templateId,
                    {
                        to_email: savedBooking.email,
                        name: savedBooking.customer,
                        destination: savedBooking.destination,
                        origin: savedBooking.origin,
                        transport: savedBooking.transport,
                        travel_date: savedBooking.date,
                        travellers: savedBooking.travellers,
                        package_price: savedBooking.packagePrice,
                        transport_fare: savedBooking.transportFare,
                        coupon: savedBooking.couponCode || "None",
                        discount: savedBooking.discount,
                        total: savedBooking.total,
                        distance: savedBooking.distance,
                        duration: savedBooking.journeyDuration
                    },
                    publicKey
                );

                showToast("Booking confirmed! Email sent.");
            } catch {
                showToast("Booking saved, but confirmation email failed.");
            }

            return true;
        } catch (err) {
            showToast(err.message || "Booking failed");
            return false;
        }
    }

    async function cancelBooking(id) {
        if (!API) {
            setBookings((previous) =>
                previous.filter((booking) => booking.id !== id)
            );
            showToast("Booking cancelled!");
            return;
        }

        try {
            const response = await fetch(`${API}/bookings/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error("Unable to cancel booking");
            }

            setBookings((previous) =>
                previous.filter((booking) => booking.id !== id)
            );

            showToast("Booking cancelled!");
        } catch {
            showToast("Unable to cancel booking");
        }
    }

    return (
        <>
            <ScrollToTop />

            <header className="header">
                <Link to="/" className="logo">
                    <span>✦</span> TravelGo
                </Link>

                <nav className="navigation">
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/trips">
                        My Trips <span>{trips.length}</span>
                    </NavLink>
                    <NavLink to="/bookings">
                        Bookings <span>{bookings.length}</span>
                    </NavLink>
                    <NavLink to="/about">About</NavLink>
                </nav>

                <button
                    className="theme-button"
                    onClick={() =>
                        setTheme(theme === "light" ? "dark" : "light")
                    }
                    aria-label="Toggle theme"
                >
                    {theme === "light" ? "☾" : "☀"}
                </button>
            </header>

            <main>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Home
                                destinations={destinations}
                                loading={loading}
                                error={error}
                                trips={trips}
                                addTrip={addTrip}
                                favorites={favorites}
                                toggleFavorite={toggleFavorite}
                            />
                        }
                    />

                    <Route
                        path="/destination/:id"
                        element={
                            <DestinationDetails
                                destinations={destinations}
                                trips={trips}
                                bookings={bookings}
                                addTrip={addTrip}
                                addBooking={addBooking}
                                loading={loading}
                                error={error}
                            />
                        }
                    />

                    <Route
                        path="/trips"
                        element={
                            <MyTrips
                                trips={trips}
                                removeTrip={removeTrip}
                            />
                        }
                    />

                    <Route
                        path="/bookings"
                        element={
                            <MyBookings
                                bookings={bookings}
                                cancelBooking={cancelBooking}
                            />
                        }
                    />

                    <Route path="/about" element={<About />} />

                    <Route
                        path="*"
                        element={
                            <div className="empty-state">
                                <h1>404</h1>
                                <p>Page not found</p>
                                <Link to="/" className="btn primary-btn">
                                    Back Home
                                </Link>
                            </div>
                        }
                    />
                </Routes>
            </main>

            <Footer />

            <Toast
                message={toast}
                clearToast={() => setToast("")}
            />
        </>
    );
}

export default App;