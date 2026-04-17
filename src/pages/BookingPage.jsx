import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';

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

  if (success) return <p>Booking confirmed! ✅</p>;

  return (
    <div>
      <h2>Book a Slot</h2>
      <div>
        {slots.map((slot) => (
          <button
            key={slot}
            onClick={() => setSelectedSlot(slot)}
            style={{ fontWeight: selectedSlot === slot ? 'bold' : 'normal' }}
          >
            {slot}
          </button>
        ))}
      </div>
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button onClick={handleBooking} disabled={loading}>
        {loading ? 'Booking...' : 'Book'}
      </button>
    </div>
  );
};

export default BookingPage;