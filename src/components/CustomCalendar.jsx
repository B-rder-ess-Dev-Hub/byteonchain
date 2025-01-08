import React, { useState, useEffect } from 'react';
import styles from '../styles/CustomCalendar.module.css';

const CustomCalendar = () => {
  const [currentWeek, setCurrentWeek] = useState(getCurrentWeek());
  const [todayDate, setTodayDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setTodayDate(new Date());
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

      console.log('Processed events:', processedEvents); // Debug log
      setEvents(processedEvents);
      setError(null);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  // Get events for a specific day
  const getEventsForDay = (day) => {
    return events.filter(event => isSameDay(new Date(event.date), day));
  };

  function getCurrentWeek() {
    const today = new Date();
    const day = today.getDay();
    const start = new Date(today.setDate(today.getDate() - day));
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return { start, end };
  }

  const generateWeek = () => {
    const days = [];
    let currentDay = new Date(currentWeek.start);

    while (currentDay <= currentWeek.end) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }

    return days;
  };

  const handleDayClick = (day) => {
    setSelectedDate(day);
  };

  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const getDayClass = (day) => {
    if (!day) return '';

    let classes = [styles.day];

    if (selectedDate && isSameDay(day, selectedDate)) {
      classes.push(styles.selected);
    }

    if (isSameDay(day, todayDate)) {
      classes.push(styles.currentDay);
    }

    // Check if day has events
    if (getEventsForDay(day).length > 0) {
      classes.push(styles.hasEvent);
    }

    return classes.join(' ');
  };

  // Format time to display
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Format date to "Jan 8th, 2025"
  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const day = date.getDate();
    const suffix = day % 10 === 1 && day !== 11 ? 'st' :
                   day % 10 === 2 && day !== 12 ? 'nd' :
                   day % 10 === 3 && day !== 13 ? 'rd' : 'th';
    return date.toLocaleDateString('en-US', options).replace(/\d+/, `${day}${suffix}`);
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={styles.calendar}>
      <header className={styles.header}>
        <h2 className={styles.heading}>This week</h2>
      </header>
      <div className={styles.divider}></div>
      <div className={styles.calendarContent}>
        <div className={styles.dayLabels}>
          {weekDays.map((day, index) => (
            <div key={index} className={styles.dayLabel}>
              {day}
            </div>
          ))}
        </div>
        <div className={styles.days}>
          {generateWeek().map((day, index) => (
            <div
              key={index}
              className={getDayClass(day)}
              onClick={() => handleDayClick(day)}
            >
              <span className={styles.dayNumber}>{day.getDate()}</span>
              {getEventsForDay(day).length > 0 && (
                <span className={styles.eventDot}></span>
              )}
            </div>
          ))}
        </div>
        <div className={styles.eventsSection}>
          <h3 className={styles.eventsHeading}>
            {selectedDate && isSameDay(selectedDate, todayDate) ? (
              'Events for Today'
            ) : (
              selectedDate ? `Events for ${formatDate(selectedDate)}` : 'Today\'s Events'
            )}
          </h3>
          {loading ? (
            <div className={styles.loading}>Loading events...</div>
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : (
            <>
              {getEventsForDay(selectedDate || todayDate).length > 0 ? (
                <div className={styles.eventsList}>
                  {getEventsForDay(selectedDate || todayDate).map((event, index) => (
                    <div key={index} className={styles.eventItem}>
                      <div className={styles.eventDot}></div>
                      <div className={styles.eventDetails}>
                        <span className={styles.eventName}>{event.eventname}</span>
                        <span className={styles.eventTime}>
                          {formatTime(event.from_time)} - {formatTime(event.to_time)}
                        </span>
                        <div className={styles.eventCategories}>
                          {event.eventcategory.map((category, idx) => (
                            <span key={idx} className={styles.category}>
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.noEvents}>
                  No events scheduled
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomCalendar;