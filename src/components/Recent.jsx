import React, { useRef, useState } from 'react';
import Image from 'next/image';
import videoIcon from '../../public/video-circle.png';
import recentArrowIcon from '../../public/arrow-icon.png';
import eyeIcon from '../../public/eye-icon.png';
import shareIcon from '../../public/share-icon.png';
import styles from '../styles/Recent.module.css';
import Modal from './Modal';

const Recent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const videoUrl = 'https://www.youtube.com/embed/xHtUBo3Ju-c';
  const carouselRef = useRef(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const carouselItems = Array(8).fill({
    title: 'Getting Started with Solidity',
    views: '2.3k', // Dummy view count
    shares: '1.1k', // Dummy share count
    imageUrl: '/img.png',
  });

  return (
    <div className={styles.recentSection}>
      <div className={styles.recentHeader}>
        <div className={styles.recentStrip}></div>
        <span className={styles.recentText}>Discovery</span>
        <Image
          src={recentArrowIcon}
          alt="Arrow"
          className={styles.recentArrowIcon}
          width={20}
          height={20}
        />
      </div>
      <div className={styles.carouselWrapper}>
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
                <div className={styles.carouselImageWrapper}>
                  <Image
                    src={item.imageUrl}
                    alt="Sample"
                    className={styles.carouselImage}
                    layout="fill"
                  />
                </div>
              </div>
              <div className={styles.cardContent}>
                <p className={styles.cardTitle}>{item.title}</p>
                <div className={styles.infoContainer}>
                  <div className={styles.leftInfo}>
                    <span className={styles.shares}>{item.shares}</span>
                    <Image
                      src={shareIcon}
                      alt="Shares"
                      width={12}
                      height={12}
                    />
                  </div>
                  <div className={styles.rightInfo}>
                    <span className={styles.views}>{item.views}</span>
                    <Image
                      src={eyeIcon}
                      alt="Views"
                      width={12}
                      height={12}
                    />
                  </div>
                </div>
                <button className={styles.watchButton} onClick={openModal}>
                  Watch Video
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal} videoUrl={videoUrl} />
    </div>
  );
};

export default Recent;