import { useState, useEffect } from "react";
import axios from "axios";
import "../css/a.css";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const defaultSchedule = DAYS.map((day, i) => ({
  day,
  dayIndex: i,
  enabled: i >= 1 && i <= 5,
  start: "09:00",
  end: "17:00",
}));

function Availability() {
  const [schedule, setSchedule] = useState(defaultSchedule);
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [saved, setSaved] = useState(false);

  const toggleDay = (i) => {
    setSchedule((prev) =>
      prev.map((d, idx) => (idx === i ? { ...d, enabled: !d.enabled } : d))
    );
  };

  const updateTime = (i, field, value) => {
    setSchedule((prev) =>
      prev.map((d, idx) => (idx === i ? { ...d, [field]: value } : d))
    );
  };

  const copyToAll = (i) => {
    const source = schedule[i];
    setSchedule((prev) =>
      prev.map((d) =>
        d.enabled ? { ...d, start: source.start, end: source.end } : d
      )
    );
  };

  const handleSave = async () => {
    const entries = schedule.filter((d) => d.enabled);
    await Promise.all(
      entries.map((d) =>
        axios.post("http://localhost:5000/availability", {
          day_of_week: d.dayIndex,
          start_time: d.start,
          end_time: d.end,
          timezone,
        })
      )
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const enabledDays = schedule.filter((d) => d.enabled);
  const firstEnabled = enabledDays[0];

  return (
    <div className="avail-page">
      <div className="avail-header">
        <div>
          <h1 className="avail-title">Working hours</h1>
          <p className="avail-subtitle">
            {enabledDays.map((d) => d.day.slice(0, 3)).join(", ")}
            {firstEnabled ? ` \u2014 ${firstEnabled.start} to ${firstEnabled.end}` : ""}
          </p>
        </div>
      </div>

      <div className="avail-body">
        <div className="avail-main">
          <div className="avail-schedule">
            {schedule.map((day, i) => (
              <div className={`avail-row ${!day.enabled ? "row-disabled" : ""}`} key={i}>
                <button
                  className={`toggle ${day.enabled ? "on" : ""}`}
                  onClick={() => toggleDay(i)}
                  aria-label={`Toggle ${day.day}`}
                >
                  <span className="toggle-thumb" />
                </button>

                <span className="avail-dayname">{day.day}</span>

                {day.enabled ? (
                  <div className="avail-times">
                    <input
                      type="time"
                      value={day.start}
                      onChange={(e) => updateTime(i, "start", e.target.value)}
                      className="time-input"
                    />
                    <span className="time-sep">-</span>
                    <input
                      type="time"
                      value={day.end}
                      onChange={(e) => updateTime(i, "end", e.target.value)}
                      className="time-input"
                    />
                    <button className="icon-btn" onClick={() => copyToAll(i)} title="Copy times to all active days">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2"/>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                      </svg>
                    </button>
                  </div>
                ) : (
                  <span className="unavailable-label">Unavailable</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="avail-sidebar">
          <label className="sidebar-label">Timezone</label>
          <select
            className="tz-select"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
          >
            <option value="Asia/Kolkata">Asia/Kolkata</option>
            <option value="UTC">UTC</option>
            <option value="America/New_York">America/New York</option>
            <option value="Europe/London">Europe/London</option>
          </select>
        </div>
      </div>

      <div className="avail-footer">
        <button className="save-btn" onClick={handleSave}>
          {saved ? "Saved!" : "Save availability"}
        </button>
      </div>
    </div>
  );
}

export default Availability;