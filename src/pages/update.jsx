import React from 'react';
import Image from 'next/image';
import styles from '../styles/Update.module.css';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import exampleImage from '../../public/img.png';

const Update = ({ description }) => {
  const truncateDescription = (desc) => {
    const words = desc.split(' '); // Split description into words
    const truncated = words.slice(0, 9).join(' '); // Get first 9 words
    return truncated;
  };

  const updateItems = [
    {
      title: 'React Basics',
      description: 'Learn the basics of React, including components and hooks.',
    },
    {
      title: 'Node.js & Express',
      description: 'Explore advanced backend development concepts with Node.js.',
    },
    {
      title: 'Smart Contracts',
      description: 'A beginner-friendly guide to writing smart contracts in Solidity.',
    },
    {
      title: 'Flutter Apps',
      description: 'Build beautiful and responsive mobile applications using Flutter.',
    },
    {
      title: 'CSS Layouts',
      description: 'Master responsive design using CSS Flexbox and Grid.',
    },
    {
      title: 'Docker Basics',
      description: 'Introduction to containerization using Docker and Docker Compose.',
    },
    {
      title: 'GraphQL',
      description: 'Learn how to query APIs using GraphQL and integrate with React.',
    },
    {
      title: 'Vue.js Fundamentals',
      description: 'Master the Vue.js framework to build interactive UIs.',
    },
    {
      title: 'MongoDB',
      description: 'Learn how to set up and manage databases with MongoDB.',
    },
    {
      title: 'AWS Services',
      description: 'Learn to use AWS to deploy and manage cloud applications.',
    },
  ];

  return (
    <div className={styles.updateContainer}>
      {/* Header */}
      <Header />

      <div className={styles.contentWrapper}>
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className={styles.mainContent}>
          {/* First Section - Today's Updates */}
          <div className={styles.recentHeader}>
            <div className={styles.recentStrip}></div>
            <span className={styles.recentText}>Today's Updates</span>
          </div>

          {/* Grid of Update Items (First 5 Items) */}
          <div className={styles.grid}>
            {updateItems.slice(0, 5).map((item, index) => (
              <div key={index} className={styles.gridItem}>
                <div className={styles.imageContainer}>
                  <Image
                    src={exampleImage}
                    alt={item.title}
                    className={styles.gridImage}
                    width={200}
                    height={150}
                  />
                </div>
                <div className={styles.content}>
                  <h3 className={styles.title}>{item.title}</h3>
                  <p className={styles.description}>
                    {truncateDescription(item.description)}
                    <a href="#" className={styles.readMore}>
                      Read More
                    </a>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Second Section - Updates */}
          <div className={styles.recentHeader}>
            <div className={styles.recentStrip}></div>
            <span className={styles.recentText}>Updates</span>
          </div>

          {/* Grid of Update Items (Next 10 Items - 2 Rows of 5 Items) */}
          <div className={styles.gridTwoRows}>
            {updateItems.slice(5, 10).map((item, index) => (
              <div key={index} className={styles.gridItem}>
                <div className={styles.imageContainer}>
                  <Image
                    src={exampleImage}
                    alt={item.title}
                    className={styles.gridImage}
                    width={200}
                    height={150}
                  />
                </div>
                <div className={styles.content}>
                  <h3 className={styles.title}>{item.title}</h3>
                  <p className={styles.description}>
                    {truncateDescription(item.description)}
                    <a href="#" className={styles.readMore}>
                      Read More
                    </a>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <div className={styles.loadMoreContainer}>
            <button className={styles.loadMoreButton}>Load More</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Update;
