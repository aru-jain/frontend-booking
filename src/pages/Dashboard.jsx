import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../css/d.css";

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  // Add this state at the top of the component
const [selectedDates, setSelectedDates] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/events`)
      .then(res => setEvents(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/events/${id}`);
      setEvents(events.filter(e => e.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const filteredEvents = events.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.slug?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dash-page">

      {/* Header */}
      <div className="dash-header">
        <div className="dash-header-left">
          <h1>Event Types</h1>
          <p>Configure different events for people to book on your calendar.</p>
        </div>
        <div className="dash-header-right">
          <div className="dash-search">
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              placeholder="Search"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Link to="/create">
            <button className="dash-new-btn">+ New</button>
          </Link>
        </div>
      </div>

      {/* Events list */}
      <div className="dash-events-card">
        {filteredEvents.length === 0 && (
          <div className="dash-empty">
            {search ? `No events matching "${search}"` : "No event types yet. Create one!"}
          </div>
        )}

        {filteredEvents.map(e => (
          <div className="dash-event-row" key={e.id}>
            <div className="dash-event-left">
              <div className="dash-event-title-row">
                <span className="dash-event-title">{e.title}</span>
                <span className="dash-event-slug">/{e.slug}</span>
              </div>
              <span className="dash-event-badge">
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                {e.duration}m
              </span>
            </div>

            {/* <div className="dash-event-right">
              <Link to={`/book/${e.id}`}>
                <button className="dash-book-btn">Book</button>
              </Link>

              <button
                className="dash-icon-btn dash-edit-btn"
                onClick={() => navigate(`/edit/${e.id}`)}
                title="Edit event"
              >
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button> */}
              <div className="dash-event-right">
  <input
    type="date"
    min={new Date().toISOString().split("T")[0]}
    value={selectedDates[e.id] || ""}
    onChange={(ev) =>
      setSelectedDates((prev) => ({ ...prev, [e.id]: ev.target.value }))
    }
    className="dash-date-input"
  />
  <button
    className="dash-book-btn"
    onClick={() => {
      if (!selectedDates[e.id]) {
        alert("Please select a date first");
        return;
      }
      navigate(`/book/${e.id}?date=${selectedDates[e.id]}`);
    }}
  >
    Book
  </button>

              <button
                className="dash-icon-btn dash-delete-btn"
                onClick={() => handleDelete(e.id)}
                title="Delete event"
              >
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6M14 11v6"/>
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;