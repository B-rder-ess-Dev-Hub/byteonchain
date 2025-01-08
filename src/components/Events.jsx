import React, { useEffect, useState } from 'react';
import styles from '../styles/Events.module.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentWeek] = useState(getCurrentWeek());

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      
      // Ensure data is an array
      const eventsArray = Array.isArray(data) ? data : data.events || [];
      
      // Process the events data
      const processedEvents = eventsArray.map(event => ({
        ...event,
        date: new Date(event.date),
        from_time: new Date(event.from_time),
        to_time: new Date(event.to_time)
      }));

      // Filter events to only include those within the current week
      const filteredEvents = processedEvents.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= currentWeek.start && eventDate <= currentWeek.end;
      });

      setEvents(filteredEvents);
      setError(null);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  // Function to get the current week
  function getCurrentWeek() {
    const today = new Date();
    const day = today.getDay();
    const start = new Date(today.setDate(today.getDate() - day));
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return { start, end };
  }

  return (
    <div className={styles.eventsContainer}>
      <h2 className={styles.eventsHeading}>Upcoming Events</h2>
      {loading ? (
        <div className={styles.loading}>Loading events...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : events.length > 0 ? (
        <div className={styles.eventsList}>
          {events.map((event, index) => (
            <div key={index} className={styles.eventRow}>
              <span className={styles.eventName}>{event.eventname}</span>
              <span className={styles.eventTime}>
                {new Date(event.from_time).toLocaleString()} - {new Date(event.to_time).toLocaleString()}
              </span>
              <div className={styles.eventCategories}>
                {event.eventcategory.map((category, idx) => (
                  <span key={idx} className={styles.category}>
                    {category}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.noEvents}>
          No events scheduled
        </div>
      )}
    </div>
  );
};

export default Events;
