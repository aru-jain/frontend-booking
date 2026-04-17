import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [slug, setSlug] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:5000/events`)
      .then(res => {
        const event = res.data.find(e => e.id == id);
        if (event) {
          setTitle(event.title);
          setDuration(event.duration);
          setSlug(event.slug);
        }
      });
  }, [id]);

  const handleUpdate = async () => {
    await axios.put(`http://localhost:5000/events/${id}`, {
      title,
      duration,
      slug,
    });

    navigate("/");
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Edit Event</h1>

        <input value={title} onChange={e => setTitle(e.target.value)} />
        <input value={duration} onChange={e => setDuration(e.target.value)} />
        <input value={slug} onChange={e => setSlug(e.target.value)} />

        <button onClick={handleUpdate}>Update</button>
      </div>
    </div>
  );
}

export default EditEvent;