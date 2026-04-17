const API = process.env.REACT_APP_API_URL || "https://cal-clone-api-m5pe.onrender.com";

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