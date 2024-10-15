import React from 'react';
import Image from 'next/image';
import styles from '../styles/Classroom.module.css';
import BottomTab from '../components/BottomTab'; 


// Import your custom icons
import searchIcon from '../../public/search.png'; // Replace with your search icon path
import settingsIcon from '../../public/settings.png'; // Replace with your settings icon path

const Classroom = () => {
  return (
    <div className={styles.classroomContainer}>
      {/* Top bar with Classroom text and settings icon */}
      <div className={styles.topBar}>
        <h1 className={styles.classroomTitle}>Classroom</h1>
        <Image
          src={settingsIcon}
          alt="Settings Icon"
          className={styles.settingsIcon}
          width={30}
          height={30}
        />
      </div>

      {/* Search field */}
      <div className={styles.searchContainer}>
        <Image
          src={searchIcon}
          alt="Search Icon"
          className={styles.searchIcon}
          width={20}
          height={20}
        />
        <input
          type="text"
          placeholder="Search for a course..."
          className={styles.searchInput}
        />
      </div>

      {/* Main video section (YouTube Embed) */}
      <div className={styles.mainVideoContainer}>
        <iframe
          className={styles.mainVideo}
          width="80%"
          height="400"
          src="https://www.youtube.com/embed/fm0n1BG3RsU?si=eeYUmG1cPvw6BAT5"
          title="Main Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      {/* Carousel of YouTube video courses */}
      <div className={styles.carouselContainer}>
        <h2 className={styles.carouselTitle}>Video Courses</h2>
        <div className={styles.carousel}>
          {/* Sample videos in the carousel */}
          <div className={styles.carouselItem}>
            <iframe
              className={styles.carouselVideo}
              src="https://www.youtube.com/embed/fm0n1BG3RsU?si=eeYUmG1cPvw6BAT5"
              title="Video Course 1"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <p className={styles.videoTitle}>Understanding UI/UX</p>
          </div>
          <div className={styles.carouselItem}>
            <iframe
              className={styles.carouselVideo}
              src="https://www.youtube.com/embed/fm0n1BG3RsU?si=eeYUmG1cPvw6BAT5"
              title="Video Course 2"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <p className={styles.videoTitle}>Introduction to JavaScript</p>
          </div>
          <div className={styles.carouselItem}>
            <iframe
              className={styles.carouselVideo}
              src="https://www.youtube.com/embed/fm0n1BG3RsU?si=eeYUmG1cPvw6BAT5"
              title="Video Course 3"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <p className={styles.videoTitle}>Responsive Web Design</p>
          </div>
          <div className={styles.carouselItem}>
            <iframe
              className={styles.carouselVideo}
              src="https://www.youtube.com/embed/fm0n1BG3RsU?si=eeYUmG1cPvw6BAT5"
              title="Video Course 4"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <p className={styles.videoTitle}>React Basics</p>
          </div>
          <div className={styles.carouselItem}>
            <iframe
              className={styles.carouselVideo}
              src="https://www.youtube.com/embed/fm0n1BG3RsU?si=eeYUmG1cPvw6BAT5"
              title="Video Course 5"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <p className={styles.videoTitle}>Node.js Overview</p>
          </div>
        </div>
      </div>

      <BottomTab />
    </div>
  );
};

export default Classroom;
