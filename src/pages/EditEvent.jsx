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
   axios.get(`${process.env.REACT_APP_API_URL}/events`)
      .then((res) => {
        const event = res.data.find((e) => e.id === id);
        if (event) {
          setTitle(event.title);
          setDuration(event.duration);
          setSlug(event.slug);
        }
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleUpdate = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/events/${id}`, {
        title,
        duration,
        slug,
      });

      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Edit Event</h1>

        <input value={title} onChange={(e) => setTitle(e.target.value)} />
        <input value={duration} onChange={(e) => setDuration(e.target.value)} />
        <input value={slug} onChange={(e) => setSlug(e.target.value)} />

        <button onClick={handleUpdate}>Update</button>
      </div>
    </div>
  );
}

export default EditEvent;