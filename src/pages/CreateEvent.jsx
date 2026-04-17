import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/c.css";

function CreateEvent() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    duration: "",
    slug: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5000/events", form);
      alert("Event created");
      navigate("/"); // go back to dashboard
    } catch (err) {
      console.log(err);
    }
  };

//   return (
//     <div>
//       <h1>Create Event</h1>

//       <input
//         name="title"
//         placeholder="Title"
//         onChange={handleChange}
//       />

//       <input
//         name="description"
//         placeholder="Description"
//         onChange={handleChange}
//       />

//       <input
//         name="duration"
//         placeholder="Duration (minutes)"
//         onChange={handleChange}
//       />

//       <input
//         name="slug"
//         placeholder="Slug"
//         onChange={handleChange}
//       />

//       <button onClick={handleSubmit}>Create</button>
//     </div>
//   );
// }
return (
  <div className="create-event-page">
    <div className="create-event-card">
      <h1>Add a new event type</h1>
      <p className="subtitle">Set up event types to offer different types of meetings.</p>

      <div className="field-group">
        <label>Title</label>
        <input name="title" placeholder="Quick chat" onChange={handleChange} />
      </div>

      <div className="field-group">
        <label>URL</label>
        <div className="url-field-wrapper">
          <span className="url-prefix">https://url.com/</span>
          <input name="slug" placeholder="your-slug" onChange={handleChange} />
        </div>
      </div>

      <div className="field-group">
        <label>Description</label>
        <div className="textarea-toolbar">
          <button type="button"><b>B</b></button>
          <button type="button"><i>I</i></button>
        </div>
        <textarea name="description" placeholder="A quick video meeting." onChange={handleChange} />
      </div>

      <div className="field-group">
        <label>Duration</label>
        <div className="duration-field-wrapper">
          <input name="duration" placeholder="15" onChange={handleChange} />
          <span className="duration-suffix">minutes</span>
        </div>
      </div>

      <div className="action-row">
        <button className="btn-secondary" onClick={() => navigate("/")}>Close</button>
        <button className="btn-primary" onClick={handleSubmit}>Continue</button>
      </div>
    </div>
  </div>
);}

export default CreateEvent;