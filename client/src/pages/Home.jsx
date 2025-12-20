import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const Home = () => {
    const [destinations, setDestinations] = useState([]);
    const [search, setSearch] = useState("");
    const [maxBudget, setMaxBudget] = useState("");
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState(null);
    const [bookingData, setBookingData] = useState({
        fullName: "",
        email: "",
        travelers: 1,
        food: false,
        travel: false,
        wifi: false
    });
    const [message, setMessage] = useState("");

    const fetchDestinations = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (search) params.append("search", search);
            if (maxBudget) params.append("maxPrice", maxBudget);

            const res = await fetch(`${API_BASE}/api/destinations?${params.toString()}`);
            const data = await res.json();
            setDestinations(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDestinations();
    }, []);

    const handleBook = async (e) => {
        e.preventDefault();
        if (!selected) return;

        try {
            const res = await fetch(`${API_BASE}/api/bookings`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    destinationId: selected._id,
                    fullName: bookingData.fullName,
                    email: bookingData.email,
                    travelers: Number(bookingData.travelers),
                    extras: {
                        food: bookingData.food,
                        travel: bookingData.travel,
                        wifi: bookingData.wifi
                    }
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Booking failed");
            setMessage("Booking confirmed! Check your email for details.");
            setSelected(null);
        } catch (err) {
            setMessage(err.message);
        }
    };

    return (
        <>
            <Navbar />
            <main className="px-8 py-6 max-w-6xl mx-auto">
                <section className="mb-6">
                    <h2 className="text-3xl font-semibold mb-2">
                        Find your next **escape**
                    </h2>
                    <p className="text-slate-300 mb-4">
                        Search premium destinations and filter by your budget.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by place name"
                            className="px-3 py-2 rounded-md bg-slate-900 border border-slate-700 w-64 text-sm"
                        />
                        <input
                            type="number"
                            value={maxBudget}
                            onChange={(e) => setMaxBudget(e.target.value)}
                            placeholder="Max budget"
                            className="px-3 py-2 rounded-md bg-slate-900 border border-slate-700 w-40 text-sm"
                        />
                        <button
                            onClick={fetchDestinations}
                            className="px-4 py-2 rounded-md bg-sky-500 hover:bg-sky-600 text-sm"
                        >
                            Search
                        </button>
                    </div>
                </section>

                <section className="grid md:grid-cols-3 gap-5">
                    {loading && <p>Loading destinations...</p>}
                    {!loading &&
                        destinations.map((dest) => (
                            <article
                                key={dest._id}
                                className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 flex flex-col"
                            >
                                {dest.imageUrl && (
                                    <img
                                        src={dest.imageUrl}
                                        alt={dest.name}
                                        className="h-40 w-full object-cover"
                                    />
                                )}
                                <div className="p-4 flex-1 flex flex-col">
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className="font-semibold">{dest.name}</h3>
                                        <span className="text-sm text-sky-400">
                                            ₹{dest.basePrice.toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 mb-2">
                                        {dest.city}, {dest.country}
                                    </p>
                                    <p className="text-sm text-slate-300 line-clamp-3 mb-3">
                                        {dest.description}
                                    </p>
                                    <div className="flex flex-wrap gap-1 text-xs mb-3">
                                        {dest.includesFood && (
                                            <span className="px-2 py-1 rounded-full bg-emerald-600/20 border border-emerald-500/40">
                                                Food
                                            </span>
                                        )}
                                        {dest.includesTravel && (
                                            <span className="px-2 py-1 rounded-full bg-sky-600/20 border border-sky-500/40">
                                                Travel
                                            </span>
                                        )}
                                        {dest.includesWifi && (
                                            <span className="px-2 py-1 rounded-full bg-violet-600/20 border border-violet-500/40">
                                                Wifi
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => {
                                            setSelected(dest);
                                            setMessage("");
                                        }}
                                        className="mt-auto w-full py-2 rounded-md bg-sky-500 hover:bg-sky-600 text-sm"
                                    >
                                        Book now
                                    </button>
                                </div>
                            </article>
                        ))}
                </section>

                {selected && (
                    <section className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md">
                            <h3 className="text-xl font-semibold mb-2">
                                Book {selected.name}
                            </h3>
                            <form className="space-y-3" onSubmit={handleBook}>
                                <input
                                    required
                                    placeholder="Full name"
                                    className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-700 text-sm"
                                    value={bookingData.fullName}
                                    onChange={(e) =>
                                        setBookingData({ ...bookingData, fullName: e.target.value })
                                    }
                                />
                                <input
                                    required
                                    type="email"
                                    placeholder="Email"
                                    className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-700 text-sm"
                                    value={bookingData.email}
                                    onChange={(e) =>
                                        setBookingData({ ...bookingData, email: e.target.value })
                                    }
                                />
                                <input
                                    required
                                    type="number"
                                    min="1"
                                    placeholder="Travelers"
                                    className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-700 text-sm"
                                    value={bookingData.travelers}
                                    onChange={(e) =>
                                        setBookingData({
                                            ...bookingData,
                                            travelers: e.target.value
                                        })
                                    }
                                />

                                <div className="flex flex-col gap-1 text-sm">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={bookingData.food}
                                            onChange={(e) =>
                                                setBookingData({
                                                    ...bookingData,
                                                    food: e.target.checked
                                                })
                                            }
                                        />
                                        Include food plan
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={bookingData.travel}
                                            onChange={(e) =>
                                                setBookingData({
                                                    ...bookingData,
                                                    travel: e.target.checked
                                                })
                                            }
                                        />
                                        Include local travel
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={bookingData.wifi}
                                            onChange={(e) =>
                                                setBookingData({
                                                    ...bookingData,
                                                    wifi: e.target.checked
                                                })
                                            }
                                        />
                                        Include free wifi
                                    </label>
                                </div>

                                <div className="flex gap-2 justify-end mt-2">
                                    <button
                                        type="button"
                                        onClick={() => setSelected(null)}
                                        className="px-3 py-2 rounded-md bg-slate-800 text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 rounded-md bg-sky-500 hover:bg-sky-600 text-sm"
                                    >
                                        Confirm booking
                                    </button>
                                </div>
                            </form>
                            {message && (
                                <p className="text-xs text-emerald-400 mt-3">{message}</p>
                            )}
                        </div>
                    </section>
                )}
            </main>
        </>
    );
};

export default Home;
