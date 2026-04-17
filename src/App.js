import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CreateEvent from "./pages/CreateEvent";
import BookingPage from "./pages/BookingPage";
import Bookings from "./pages/Bookings";
import Availability from "./pages/Availability";
import EditEvent from "./pages/EditEvent";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <BrowserRouter>
    <Sidebar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create" element={<CreateEvent />} />
        <Route path="/book/:eventId" element={<BookingPage />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/availability" element={<Availability />} />
        <Route path="/edit/:id" element={<EditEvent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;