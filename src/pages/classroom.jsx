import React, { useState } from 'react';
import Image from 'next/image';
import styles from '../styles/Classroom.module.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

import searchIcon from '../../public/search.png';
import videoIcon from '../../public/video-circle.png';
import arrowRightIcon from '../../public/arrow-right.png';
import eyeIcon from '../../public/eye-icon.png';

const Classroom = ({ userName }) => {
  const allVideoItems = [
    {
      imageUrl: '/img.png',
      title: 'UI/UX Design Basics',
      tutor: 'John Doe',
      views: '2.1k',
      days: '2d',
      tutorImage: '/avatar.png',
    },
    {
      imageUrl: '/img.png',
      title: 'Advanced JavaScript',
      tutor: 'Jane Smith',
      views: '1.9k',
      days: '3d',
      tutorImage: '/avatar.png',
    },
    {
      imageUrl: '/img.png',
      title: 'React.js Essentials',
      tutor: 'Mark Taylor',
      views: '3.1k',
      days: '1d',
      tutorImage: '/avatar.png',
    },
    {
      imageUrl: '/img.png',
      title: 'Node.js Mastery',
      tutor: 'Sarah Lee',
      views: '1.5k',
      days: '5d',
      tutorImage: '/avatar.png',
    },
    {
      imageUrl: '/img.png',
      title: 'Python for Data Science',
      tutor: 'Anna White',
      views: '2.3k',
      days: '4d',
      tutorImage: '/avatar.png',
    },
    {
      imageUrl: '/img.png',
      title: 'Flutter for Beginners',
      tutor: 'Chris Brown',
      views: '2.8k',
      days: '2d',
      tutorImage: '/avatar.png',
    },
    {
      imageUrl: '/img.png',
      title: 'Kotlin Masterclass',
      tutor: 'Mia Lopez',
      views: '1.2k',
      days: '6d',
      tutorImage: '/avatar.png',
    },
    {
      imageUrl: '/img.png',
      title: 'Machine Learning 101',
      tutor: 'Sophia Green',
      views: '3.4k',
      days: '1d',
      tutorImage: '/avatar.png',
    },
    {
      imageUrl: '/img.png',
      title: 'Machine Learning 101',
      tutor: 'Sophia Green',
      views: '3.4k',
      days: '1d',
      tutorImage: '/avatar.png',
    },
    {
      imageUrl: '/img.png',
      title: 'Machine Learning 101',
      tutor: 'Sophia Green',
      views: '3.4k',
      days: '1d',
      tutorImage: '/avatar.png',
    },
    {
      imageUrl: '/img.png',
      title: 'Machine Learning 101',
      tutor: 'Sophia Green',
      views: '3.4k',
      days: '1d',
      tutorImage: '/avatar.png',
    },
    {
      imageUrl: '/img.png',
      title: 'Machine Learning 101',
      tutor: 'Sophia Green',
      views: '3.4k',
      days: '1d',
      tutorImage: '/avatar.png',
    },
  ];

  const [visibleCourses, setVisibleCourses] = useState(8); 

  const handleLoadMore = () => {
    setVisibleCourses((prev) => prev + 8); 
  };

  return (
    <div className={styles.classroomContainer}>
      {/* Header Component */}
      <div className={styles.headerWrapper}>
        <Header />
      </div>

      {/* Sidebar and Main Content */}
      <div className={styles.contentWrapper}>
        <div className={styles.sidebarWrapper}>
          <Sidebar />
        </div>
        <div className={styles.mainContent}>
          {/* Banner */}
          <div className={styles.banner}>
            <h1 className={styles.bannerText}>Welcome to your class</h1>
            <p className={styles.userName}>{userName || 'John Doe'}</p>
          </div>

          {/* Search Field */}
          <div className={styles.searchWrapper}>
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
          </div>

          {/* Video Section */}
          <div className={styles.recentSection}>
            <div className={styles.videoGrid}>
              {allVideoItems.slice(0, visibleCourses).map((item, index) => (
                <div key={index} className={styles.carouselCard}>
                  <div className={styles.videoContainer}>
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      className={styles.carouselImage}
                      layout="intrinsic"
                      width={200}
                      height={181}
                    />
                    <Image
                      src={videoIcon}
                      alt="Play Video"
                      className={styles.videoIcon}
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className={styles.cardContent}>
                    <p className={styles.cardTitle}>{item.title}</p>
                    <div className={styles.infoContainer}>
                      <div className={styles.tutorContainer}>
                        <Image
                          src={item.tutorImage}
                          alt={item.tutor}
                          className={styles.tutorImage}
                          width={20}
                          height={20}
                        />
                        <span className={styles.tutorName}>{item.tutor}</span>
                      </div>
                      <div className={styles.viewsAndDays}>
                        <div className={styles.viewsContainer}>
                          <Image src={eyeIcon} alt="Eye Icon" width={12} height={12} />
                          <span className={styles.views}>{item.views}</span>
                        </div>
                        <span className={styles.separator}>|</span>
                        <span className={styles.days}>{item.days}</span>
                      </div>
                    </div>
                    <div className={styles.buttonContainer}>
                      <button className={styles.continueButton}>Watch Video</button>
                      <button
                        className={styles.shareButton}
                        onClick={() => {
                          const tweetText = `Check out this amazing course: "${item.title}" by @primidac! Watch it now!`;
                          const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
                          window.open(twitterShareUrl, '_blank');
                        }}
                      >
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Load More Button */}
            {visibleCourses < allVideoItems.length && (
              <div className={styles.loadMoreContainer}>
                <button className={styles.loadMoreButton} onClick={handleLoadMore}>
                  Load More
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classroom;