import React from 'react';
import Image from 'next/image';
import recentArrowIcon from '../../public/arrow-icon.png'; // Import the arrow icon
import styles from '../styles/Events.module.css';
import noEventImage from '../../public/no-event.svg'; // Import the "No Event" image

const Events = () => {
  return (
    <div className={styles.recentSection}>
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

      {/* Card Section */}
      <div className={styles.eventCard}>
        <Image
          src={noEventImage}
          alt="No Upcoming Event"
          className={styles.noEventImage}
          width={150}
          height={150}
        />
        <p className={styles.noEventText}>No Upcoming Event</p>
      </div>
    </div>
  );
};

export default Events;
