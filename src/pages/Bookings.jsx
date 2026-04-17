import { useEffect, useState } from "react";
import axios from "axios";
import "../css/booking.css";

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const FilterIcon = () => (
  <svg viewBox="0 0 24 24">
    <line x1="4" y1="6" x2="20" y2="6"/>
    <line x1="8" y1="12" x2="16" y2="12"/>
    <line x1="11" y1="18" x2="13" y2="18"/>
  </svg>
);

const TABS = ["Upcoming", "Unconfirmed", "Recurring", "Past", "Canceled"];

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("Upcoming");

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/bookings`)
      .then(res => setBookings(res.data))
      .catch(err => console.log(err));
  };

  const cancelBooking = async (id) => {
    await axios.delete(`${process.env.REACT_APP_API_URL}/bookings/${id}`);
    fetchBookings();
  };

  const now = new Date();
  const upcoming = bookings.filter(b => new Date(b.booking_date) >= now);
  const past     = bookings.filter(b => new Date(b.booking_date) < now);

  // Which list to show based on active tab
  const displayList =
    activeTab === "Past"     ? past :
    activeTab === "Upcoming" ? upcoming : [];

  const emptyMessages = {
    Upcoming:    { title: "No upcoming bookings",    body: "You have no upcoming bookings. As soon as someone books a time with you it will show up here." },
    Unconfirmed: { title: "No unconfirmed bookings", body: "Bookings that are awaiting confirmation will appear here." },
    Recurring:   { title: "No recurring bookings",   body: "Your recurring bookings will appear here." },
    Past:        { title: "No past bookings",         body: "Bookings that have already passed will appear here." },
    Canceled:    { title: "No canceled bookings",     body: "Any canceled bookings will appear here." },
  };

  const isEmpty = displayList.length === 0;

  return (
    <div className="container">
      <div className="card">
        <h1>Bookings</h1>
        <p className="subtitle">See upcoming and past events booked through your event type links.</p>

        {/* Tab bar */}
        <div className="tab-bar">
          <div className="tab-group">
            {TABS.map(tab => (
              <button
                key={tab}
                className={`tab-btn${activeTab === tab ? " active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <button className="filter-btn">
            <FilterIcon /> Filter
          </button>
        </div>

        {/* Bookings panel */}
        <div className="bookings-panel">
          {isEmpty ? (
            <div className="empty-state">
              <div className="empty-icon"><CalendarIcon /></div>
              <h2>{emptyMessages[activeTab].title}</h2>
              <p>{emptyMessages[activeTab].body}</p>
            </div>
          ) : (
            displayList.map(b => (
              <div key={b.id} className={`booking-item${activeTab === "Past" ? " past" : ""}`}>
                <div className="booking-info">
                  <span className="booking-name">{b.name}</span>
                  <div className="booking-meta">
                    <span>
                      <CalendarIcon />
                      {new Date(b.booking_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <span className="booking-dot" />
                    <span>
                      <ClockIcon />
                      {b.start_time}
                    </span>
                  </div>
                </div>
                {activeTab === "Upcoming" && (
                  <button className="cancel-btn" onClick={() => cancelBooking(b.id)}>
                    Cancel
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Bookings;