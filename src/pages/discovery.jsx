import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import styles from '../styles/Discovery.module.css';

const Discovery = () => {
  const allVideos = [
    { id: 1, title: 'Introduction to Web3', views: '1.2k', uploader: 'John Doe', uploadedAt: '2 days ago', category: 'Blockchain' },
    { id: 2, title: 'Cybersecurity Fundamentals', views: '3.4k', uploader: 'Jane Smith', uploadedAt: '1 week ago', category: 'Cipher Session' },
    { id: 3, title: 'Embedded Systems 101', views: '900', uploader: 'Paul Adams', uploadedAt: '3 hours ago', category: 'Podcast' },
    { id: 4, title: 'UI/UX Design Tips', views: '2.5k', uploader: 'Alex Green', uploadedAt: '5 days ago', category: 'Cipher Session' },
    { id: 5, title: 'Learn Solidity', views: '4.8k', uploader: 'Sarah Lee', uploadedAt: '2 weeks ago', category: 'Blockchain' },
    { id: 6, title: 'Blockchain Basics', views: '1.9k', uploader: 'Michael Doe', uploadedAt: '3 weeks ago', category: 'Blockchain' },
    { id: 7, title: 'Master Arbitrum Stylus', views: '5.3k', uploader: 'Alice Smith', uploadedAt: '1 month ago', category: 'Blockchain' },
    { id: 8, title: 'Web Design Mastery', views: '6.1k', uploader: 'Chris Brown', uploadedAt: '1 day ago', category: 'Cipher Session' },
    { id: 9, title: 'Advanced Solidity', views: '8.2k', uploader: 'Emma White', uploadedAt: '4 days ago', category: 'Blockchain' },
    { id: 10, title: 'Web3 for Beginners', views: '3.3k', uploader: 'Liam Wilson', uploadedAt: '2 hours ago', category: 'Blockchain' },
    { id: 11, title: 'React Native Essentials', views: '7.4k', uploader: 'Sophia Taylor', uploadedAt: '3 days ago', category: 'Cipher Session' },
    { id: 12, title: 'AI in Embedded Systems', views: '5.0k', uploader: 'James Brown', uploadedAt: '6 days ago', category: 'Podcast' },
  ];

  const [videos, setVideos] = useState(allVideos.slice(0, 8));
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Blockchain', 'Cipher Session', 'Podcast'];

  const filterVideos = (category) => {
    setActiveCategory(category);
    if (category === 'All') {
      setVideos(allVideos.slice(0, 8));
    } else {
      const filteredVideos = allVideos.filter(video => video.category === category);
      setVideos(filteredVideos.slice(0, 8));
    }
  };

  const loadMoreVideos = () => {
    const currentLength = videos.length;
    const moreVideos = allVideos.slice(currentLength, currentLength + 4); // Fetch 4 more videos
    setVideos([...videos, ...moreVideos]);
  };

  return (
    <div className={styles.discoveryContainer}>
      <Header />
      <div className={styles.contentWrapper}>
        <div className={styles.sidebarWrapper}>
          <Sidebar />
        </div>
        <div className={styles.mainContent}>
          <h1 className={styles.pageTitle}>Discover</h1>
          <div className={styles.categoryFilters}>
            {categories.map((category) => (
              <button
                key={category}
                className={`${styles.categoryPill} ${activeCategory === category ? styles.active : ''}`}
                onClick={() => filterVideos(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <div className={styles.videoGrid}>
            {videos.map((video) => (
              <div key={video.id} className={styles.videoCard}>
                <img
                  src="/img.png"
                  alt={video.title}
                  className={styles.thumbnail}
                />
                <div className={styles.videoInfo}>
                  <h3 className={styles.videoTitle}>{video.title}</h3>
                  <p className={styles.videoMeta}>
                    {video.uploader} • {video.views} views • {video.uploadedAt}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {videos.length < allVideos.length && activeCategory === 'All' && (
            <button className={styles.loadMoreButton} onClick={loadMoreVideos}>
              Load More
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Discovery;