// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import "../css/style.css";

// function BookingPage() {
//   const { eventId } = useParams();

//   const [date, setDate] = useState(new Date());
//   const [slots, setSlots] = useState([]);
//   const [selectedSlot, setSelectedSlot] = useState("");
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
// const [success, setSuccess] = useState(false);
// const [loading, setLoading] = useState(false);
//   const formattedDate = date.toISOString().split("T")[0];
//   const now = new Date();
// const isToday = formattedDate === now.toISOString().split("T")[0];

//   useEffect(() => {
//     axios
//       .get(`http://localhost:5000/slots/${eventId}/${formattedDate}`)
//       .then((res) => setSlots(res.data));
//   }, [eventId, formattedDate]);

//  const handleBooking = async () => {
//   setLoading(true);
//   try {
//     await axios.post("http://localhost:5000/bookings", {
//       event_type_id: eventId,
//       name,
//       email,
//       booking_date: formattedDate,
//       start_time: selectedSlot,
//     });

//     setSuccess(true);
//   } catch (err) {
//     alert("Slot already booked");
//   }
//   setLoading(false);
// };
// if (success) {
//   return (
//     <div className="container">
//       <div className="card">
//         <h1>Booking Confirmed 🎉</h1>
//         <p>Your meeting has been scheduled.</p>
//       </div>
//     </div>
//   );
// }
//   return (
//   <div className="container">
//     <div className="card">
//       <h1>Book Slot</h1>

//       <h3>Select Date</h3>
//       <DatePicker
//   selected={date}
//   onChange={(d) => setDate(d)}
//   minDate={new Date()}
// />

//       <h3>Select Time</h3>
//      <div className="grid">
//   {slots.length === 0 ? (
//     <p>
//   No slots available for this date
// </p>
//   ) : (
//    slots.map((slot, i) => {
//   const slotTime = new Date(`${formattedDate}T${slot}`);
//   const isPast = isToday && slotTime < now;

//   return (
//     <button
//       key={i}
//       disabled={isPast}
//       onClick={() => setSelectedSlot(slot)}
//       className={`slot-btn 
//   ${selectedSlot === slot ? "active" : ""} 
//   ${isPast ? "disabled" : ""}
// `}
//     >
//       {slot}
//     </button>
//   );
// })
//   )}
// </div>

//       <h3>Your Details</h3>

//       <input placeholder="Name" onChange={e => setName(e.target.value)} />
//       <input placeholder="Email" onChange={e => setEmail(e.target.value)} />

//    <button
//   onClick={handleBooking}
//   className="primary-btn"
//   disabled={!selectedSlot || loading}
// >
//   {loading ? "Booking..." : "Confirm Booking"}
// </button>
 
//     </div>
    
//   </div>
  
// );
// }

// export default BookingPage;
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../css/style.css";

function BookingPage() {
  const { eventId } = useParams();

  const [date, setDate] = useState(new Date());
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ FIX: no toISOString (avoids timezone shift)
  const formattedDate =
    date.getFullYear() +
    "-" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(date.getDate()).padStart(2, "0");

  const now = new Date();
  const isToday =
    formattedDate ===
    (now.getFullYear() +
      "-" +
      String(now.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(now.getDate()).padStart(2, "0"));

  useEffect(() => {
    axios
      .get(`http://localhost:5000/slots/${eventId}/${formattedDate}`)
      .then((res) => setSlots(res.data))
      .catch((err) => console.log(err));
  }, [eventId, formattedDate]);

  const handleBooking = async () => {
    setLoading(true);

    try {
      await axios.post("http://localhost:5000/bookings", {
        event_type_id: eventId,
        name,
        email,
        booking_date: formattedDate,
        start_time: selectedSlot,
      });

      setSuccess(true);
    } catch (err) {
      alert("Slot already booked");
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="container">
        <div className="card">
          <h1>Booking Confirmed 🎉</h1>
          <p>Your meeting has been scheduled.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h1>Book Slot</h1>

        {/* DATE PICKER */}
        <h3>Select Date</h3>
        <DatePicker
          selected={date}
          onChange={(d) => setDate(d)}
          minDate={new Date()}
        />

        {/* SLOTS */}
        <h3>Select Time</h3>

        <div className="grid">
          {slots.length === 0 ? (
            <p>No slots available for this date</p>
          ) : (
            slots.map((slot, i) => {
              // ✅ FIX: no string-based Date parsing
              const slotTime = new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                Number(slot.split(":")[0]),
                Number(slot.split(":")[1])
              );

              const isPast = isToday && slotTime < now;

              return (
                <button
                  key={i}
                  disabled={isPast}
                  onClick={() => setSelectedSlot(slot)}
                  className={`slot-btn 
                    ${selectedSlot === slot ? "active" : ""} 
                    ${isPast ? "disabled" : ""}
                  `}
                >
                  {slot}
                </button>
              );
            })
          )}
        </div>

        {/* USER DETAILS */}
        <h3>Your Details</h3>

        <input
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleBooking}
          className="primary-btn"
          disabled={!selectedSlot || loading}
        >
          {loading ? "Booking..." : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
}

export default BookingPage;