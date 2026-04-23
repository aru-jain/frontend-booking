import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import "../css/style.css";

const API = process.env.REACT_APP_API_URL || "https://cal-clone-api-m5pe.onrender.com";

const BookingPage = () => {
  const { eventId } = useParams();
  const [searchParams] = useSearchParams();
  const formattedDate = searchParams.get('date');

  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    axios
      .get(`${API}/slots/${eventId}/${formattedDate}`)
      .then((res) => setSlots(res.data))
      .catch((err) => console.log(err));
  }, [eventId, formattedDate]);

  const handleBooking = async () => {
    if (!name || !email || !selectedSlot) {
      alert("Fill all fields");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/bookings`, {
        event_type_id: eventId,
        name,
        email,
        booking_date: formattedDate,
        start_time: selectedSlot,
      });
      setSuccess(true);
    } catch (err) {
      alert(err?.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="booking-success">
        <div className="success-card">
          <div className="success-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="success-title">Booking confirmed!</h2>
          <p className="success-sub">You'll receive a confirmation email shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="booking-card">

        {/* Left — event info */}
        <div className="booking-info">
          <div className="booking-host">U</div>
          <h1 className="booking-event-title">Book a Slot</h1>
          <div className="booking-meta">
            <div className="booking-meta-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {formattedDate}
            </div>
            <div className="booking-meta-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              30 minutes
            </div>
          </div>
        </div>

        {/* Right — slots + form */}
        <div className="booking-right">

          {/* Slots */}
          <div className="booking-slots">
            <p className="section-label">Select a time</p>
            <div className="slots-grid">
              {slots.length === 0 ? (
                <p className="slots-empty">No slots available</p>
              ) : (
                slots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`slot-btn ${selectedSlot === slot ? 'active' : ''}`}
                  >
                    {slot}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Form */}
          <div className="booking-form">
            <div className="field">
              <label>Your name</label>
              <input
                placeholder="Jane Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Email address</label>
              <input
                placeholder="jane@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              className="confirm-btn"
              onClick={handleBooking}
              disabled={loading || !selectedSlot || !name || !email}
            >
              {loading ? 'Booking...' : 'Confirm booking'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BookingPage;