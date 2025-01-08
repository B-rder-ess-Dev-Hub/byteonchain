import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import recentArrowIcon from '../../public/arrow-icon.png';
import moreIcon from '../../public/arrow-icon.png';
import styles from '../styles/Tupdate.module.css';
import NewsModal from './NewsModal';

const Tupdate = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNewsUrl, setSelectedNewsUrl] = useState('');
  const carouselRef = useRef(null);
  
  const MAX_VISIBLE_NEWS = 4;

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const newsArray = data.news || [];
      
      // Only process the first 4 news items and use the imgurl from the API
      const processedNews = newsArray.slice(0, MAX_VISIBLE_NEWS).map(item => ({
        ...item,
        imageUrl: item.imgurl || '/up1.png' // Use imgurl from API or fallback to default
      }));
      
      setNews(processedNews);
      setError(null);
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('Failed to load news. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (url) => {
    setSelectedNewsUrl(url);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNewsUrl('');
  };

  if (loading) {
    return (
      <div className={styles.recentSection}>
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
          <p>Loading news...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.recentSection}>
        <div className={styles.errorState}>
          <div className={styles.errorStateCard}>
            <h3>Oops! Something went wrong</h3>
            <p>{error}</p>
            <button className={styles.retryButton} onClick={fetchNews}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

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
      
      <div className={styles.carouselWrapper}>
        <div className={styles.carousel} ref={carouselRef}>
          {news.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateCard}>
                <h3>No News Available</h3>
                <p>Check back later for updates</p>
              </div>
            </div>
          ) : (
            <>
              {news.map((item, index) => (
                <div 
                  key={index} 
                  className={styles.carouselCard}
                  onClick={() => openModal(item.url)}
                >
                  <div className={styles.imageContainer}>
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      className={styles.carouselImage}
                      width={300}
                      height={200}
                      style={{ objectFit: 'cover' }}
                      priority={index < 2}
                    />
                  </div>
                  <div className={styles.cardContent}>
                    <p className={styles.cardTitle}>{item.title}</p>
                    <button 
                      className={styles.readMoreButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(item.url);
                      }}
                    >
                      Read More
                    </button>
                  </div>
                </div>
              ))}
              <Link href="/update" className={styles.moreCard}>
                <div className={styles.moreContent}>
                  <Image
                    src={moreIcon}
                    alt="More news"
                    width={40}
                    height={40}
                  />
                  <p>More Updates</p>
                </div>
              </Link>
            </>
          )}
        </div>
        <NewsModal 
          isOpen={isModalOpen}
          onClose={closeModal}
          newsUrl={selectedNewsUrl}
        />
      </div>
    </div>
  );
};

export default Tupdate;
