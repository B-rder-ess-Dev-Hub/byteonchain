import React from 'react';
import Image from 'next/image';
import styles from '../styles/Update.module.css';
import BottomTab from '../components/BottomTab'; 
import searchIcon from '../../public/search.png'; 
import settingsIcon from '../../public/settings.png'; 
import exampleImage from '../../public/img.png'; 

const Update = () => {
  return (
    <div className={styles.updateContainer}>
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
          placeholder="Search for updates..."
          className={styles.searchInput}
        />
      </div>

      {/* Main Image with heading and description */}
      <div className={styles.imageContainer}>
        <Image
          src={exampleImage}
          alt="Main Update"
          className={styles.mainImage}
          width={900}
          height={400}
        />
        <h2 className={styles.imageHeading}>Update on Classroom Activities</h2>
        <p className={styles.imageDescription}>
          Stay updated with the latest events, lessons, and activities happening in the classroom.
        </p>
      </div>

      {/* Custom Carousel of updates */}
      <div className={styles.carouselContainer}>
        <h2 className={styles.carouselTitle}>Latest Updates</h2>
        <div className={styles.carousel}>
          {/* Sample update items */}
          <div className={styles.carouselItem}>
            <Image
              src={exampleImage}
              alt="Update 1"
              className={styles.carouselImage}
              width={400}
              height={250}
            />
            <p className={styles.updateTitle}>New Lesson on React Hooks</p>
          </div>
          <div className={styles.carouselItem}>
            <Image
              src={exampleImage}
              alt="Update 2"
              className={styles.carouselImage}
              width={400}
              height={250}
            />
            <p className={styles.updateTitle}>Workshop on UI/UX Design</p>
          </div>
          <div className={styles.carouselItem}>
            <Image
              src={exampleImage}
              alt="Update 3"
              className={styles.carouselImage}
              width={400}
              height={250}
            />
            <p className={styles.updateTitle}>Guest Speaker Event</p>
          </div>
          <div className={styles.carouselItem}>
            <Image
              src={exampleImage}
              alt="Update 4"
              className={styles.carouselImage}
              width={400}
              height={250}
            />
            <p className={styles.updateTitle}>Introduction to Blockchain</p>
          </div>
        </div>
      </div>
      <BottomTab />
    </div>
  );
};

export default Update;
