import React, { useRef } from 'react';
import Image from 'next/image';
import recentArrowIcon from '../../public/arrow-icon.png'; 
import styles from '../styles/Tupdate.module.css';

const Tupdate = () => {
  const carouselRef = useRef(null);

  const carouselItems = [
    {
      imageUrl: '/up1.png', 
      description: 'Learn the basics of React, components, and hooks.'
    },
    {
      imageUrl: '/up2.png',
      description: 'Advanced concepts in Node.js and Express for backend development.'
    },
    {
      imageUrl: '/up1.png',
      description: 'An introduction to writing smart contracts in Solidity.'
    },
    {
      imageUrl: '/up2.png',
      description: 'Building beautiful mobile applications using Flutter.'
    },
    {
      imageUrl: '/up1.png',
      description: 'Learn how to create responsive layouts using CSS Flexbox and Grid.'
    }
  ];

  return (
    <div className={styles.recentSection}>
      <div className={styles.recentHeader}>
        <div className={styles.recentStrip}></div>
        <span className={styles.recentText}>Today's Update</span>
        <Image
          src={recentArrowIcon}
          alt="Arrow"
          className={styles.recentArrowIcon}
          width={20}
          height={20}
        />
      </div>
      
      <div className={styles.carouselWrapper}> {/* Wrap the carousel inside this container */}
        <div className={styles.carousel} ref={carouselRef}>
          {carouselItems.map((item, index) => (
            <div key={index} className={styles.carouselCard}>
              <div className={styles.videoContainer}>
                <Image
                  src={item.imageUrl}
                  alt={item.description}
                  className={styles.carouselImage}
                  layout="fill"
                />
              </div>
              <div className={styles.cardContent}>
                <p className={styles.cardDescription}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tupdate;
