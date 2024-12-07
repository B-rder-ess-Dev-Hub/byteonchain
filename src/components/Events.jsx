import React from 'react';
import Image from 'next/image';
import recentArrowIcon from '../../public/arrow-icon.png'; // Import the arrow icon
import styles from '../styles/Events.module.css';

const Events = () => {
  const events = [
    {
      type: 'Workshop',
      time: '6:00 PM - 8:00 PM',
      title: 'Introduction to Web3 Development',
      status: 'future', // "future", "in-progress", "completed"
    },
    {
      type: 'Meetup',
      time: '3:00 PM - 5:00 PM',
      title: 'Cybersecurity Networking Session',
      status: 'in-progress', // In-progress
    },
    {
      type: 'Seminar',
      time: '10:00 AM - 12:00 PM',
      title: 'Advancements in Embedded Systems',
      status: 'completed', // Completed
    },
  ];

  return (
    <div className={styles.recentSection}>
      {/* Header Section */}
      <div className={styles.recentHeader}>
        <div className={styles.recentStrip}></div>
        <span className={styles.recentText}>Upcoming Events</span>
        <Image
          src={recentArrowIcon}
          alt="Arrow"
          className={styles.recentArrowIcon}
          width={20}
          height={20}
        />
      </div>

      {/* Event List Section */}
      <div className={styles.eventsContainer}>
        {events.map((event, index) => (
          <div key={index} className={styles.eventRow}>
            {/* Left Indicator */}
            <div className={styles.indicatorContainer}>
              <div
                className={`${styles.indicator} ${
                  event.status === 'future'
                    ? styles.futureIndicator
                    : event.status === 'in-progress'
                    ? styles.inProgressIndicator
                    : styles.completedIndicator
                }`}
              ></div>
            </div>

            {/* Event Card */}
            <div
              className={`${styles.eventCard} ${
                event.status === 'future'
                  ? styles.futureEvent
                  : event.status === 'in-progress'
                  ? styles.inProgressEvent
                  : styles.completedEvent
              }`}
            >
              <div className={styles.eventHeader}>
                <span className={styles.eventType}>{event.type}</span>
                <span className={styles.eventTime}>{event.time}</span>
              </div>
              <div className={styles.eventTitle}>{event.title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
