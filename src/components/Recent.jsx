import React, { useRef, useState } from 'react';
import Image from 'next/image';
import videoIcon from '../../public/video-circle.png';
import recentArrowIcon from '../../public/arrow-icon.png';
import arrowRightIcon from '../../public/arrow-right.png'; // Import the arrow icon
import styles from '../styles/Recent.module.css';
import Modal from './Modal';

const Recent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const videoUrl = 'https://www.youtube.com/embed/xHtUBo3Ju-c'; // YouTube video URL
  const carouselRef = useRef(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const carouselItems = Array(8).fill({
    title: 'Getting Started with Solidity',
    percentage: '37%',
    time: '1Hr:20Mins Left',
    imageUrl: '/img.png', // Replace with your actual image path
  });

  return (
    <div className={styles.recentSection}>
      <div className={styles.recentHeader}>
        <div className={styles.recentStrip}></div>
        <span className={styles.recentText}>Recent</span>
        <Image src={recentArrowIcon} alt="Arrow" className={styles.recentArrowIcon} width={20} height={20} />
      </div>
      <div className={styles.carousel} ref={carouselRef}>
        {carouselItems.map((item, index) => (
          <div key={index} className={styles.carouselCard}>
            <div className={styles.videoContainer} onClick={openModal}>
              <Image
                src={videoIcon}
                alt="Play Video"
                className={styles.videoIcon}
                width={50}
                height={50}
              />
              <Image
                src={item.imageUrl}
                alt="Sample"
                className={styles.carouselImage}
                layout="fill"
              />
            </div>
            <div className={styles.cardContent}>
              <p className={styles.cardTitle}>{item.title}</p>
              <div className={styles.infoContainer}>
                <span className={styles.percentage}>{item.percentage}</span>
                <span className={styles.time}>{item.time}</span>
              </div>
              <div className={styles.progressContainer}>
                <div className={styles.progressBarContainer}>
                  <div className={styles.progressBar} style={{ width: '37%' }}></div>
                </div>
              </div>
              <button className={styles.continueButton}>
                Continue
                <Image
                  src={arrowRightIcon}
                  alt="Arrow"
                  className={styles.continueIcon}
                  width={15} // Add width
                  height={15} // Add height
                />
              </button>
            </div>
          </div>
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal} videoUrl={videoUrl} />
    </div>
  );
};

export default Recent;
