import React from 'react';
import Image from 'next/image';
import styles from '../styles/Classroom.module.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

// Import your custom icons
import searchIcon from '../../public/search.png';
import videoIcon from '../../public/video-circle.png';
import arrowRightIcon from '../../public/arrow-right.png'; 
import eyeIcon from '../../public/eye-icon.png'; 

const Classroom = ({ userName }) => {
  const videoItems = [
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
  ];

  return (
    <div className={styles.classroomContainer}>
      {/* Header Component */}
      <div className={styles.headerWrapper}>
        <Header />
      </div>

      {/* Sidebar and Main Content */}
      <div className={styles.contentWrapper}>
        <Sidebar />

        <div className={styles.mainContent}>
          {/* Banner */}
          <div className={styles.banner}>
            <h1 className={styles.bannerText}>Welcome to our class</h1>
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
              {videoItems.map((item, index) => (
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
                          width={20}  /* Reduced size by 10% */
                          height={20} /* Reduced size by 10% */
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
                    <button className={styles.continueButton}>
                      Watch Video
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classroom;
