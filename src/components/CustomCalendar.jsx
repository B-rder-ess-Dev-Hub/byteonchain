// components/CustomCalendar.js
import React, { useState } from 'react';
import styles from '../styles/CustomCalendar.module.css'; // Import styles

const CustomCalendar = ({ selectedDate, onDateChange }) => {
  const [currentWeek, setCurrentWeek] = useState(getCurrentWeek());

  function getCurrentWeek() {
    const startOfWeek = new Date();
    const day = startOfWeek.getDay();
    const start = new Date(startOfWeek.setDate(startOfWeek.getDate() - day));
    const end = new Date(start);
    end.setDate(end.getDate() + 6);

    return { start, end };
  }

  const generateWeek = () => {
    const days = [];
    let currentDay = new Date(currentWeek.start);

    while (currentDay <= currentWeek.end) {
      days.push(currentDay.getDate());
      currentDay.setDate(currentDay.getDate() + 1);
    }

    return days;
  };

  const handleDayClick = (day) => {
    const newDate = new Date(currentWeek.start.getFullYear(), currentWeek.start.getMonth(), day);
    onDateChange(newDate);
  };

  const getDayClass = (day) => {
    if (!day) return '';
    const date = new Date(currentWeek.start.getFullYear(), currentWeek.start.getMonth(), day);
    return date.toDateString() === selectedDate.toDateString() ? styles.selected : '';
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={styles.calendar}>
      <header className={styles.header}>
        <h2 className={styles.heading}>This week</h2>
        <div className={styles.divider}></div>
      </header>
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
            className={`${styles.day} ${getDayClass(day)}`}
            onClick={() => handleDayClick(day)}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomCalendar;
