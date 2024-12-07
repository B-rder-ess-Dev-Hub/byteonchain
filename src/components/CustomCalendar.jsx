import React, { useState, useEffect } from 'react';
import styles from '../styles/CustomCalendar.module.css';

const CustomCalendar = ({ selectedDate, onDateChange }) => {
  const [currentWeek, setCurrentWeek] = useState(getCurrentWeek());
  const [todayDate, setTodayDate] = useState(new Date());

  useEffect(() => {
    setTodayDate(new Date());
  }, []);

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
      days.push(new Date(currentDay)); // Store full date objects for accurate comparisons
      currentDay.setDate(currentDay.getDate() + 1);
    }

    return days;
  };

  const handleDayClick = (day) => {
    onDateChange(day);
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

    if (selectedDate && isSameDay(day, selectedDate)) {
      return styles.selected;
    }

    if (isSameDay(day, todayDate)) {
      return styles.currentDay;
    }

    return styles.inactiveDay;
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={styles.calendar}>
      <header className={styles.header}>
        <h2 className={styles.heading}>This week</h2>
      </header>
      <div className={styles.divider}></div>
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
            {day.getDate()}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomCalendar;
