import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../styles/Update.module.css';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import WalletWrapper from '../components/WalletWrapper';
import { FiClock, FiArrowRight, FiChevronDown, FiX } from 'react-icons/fi';

const UpdateContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [visibleItems, setVisibleItems] = useState(6);
  const [newsItems, setNewsItems] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  useEffect(() => {
    // Fetch news data from the API
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://byteapi-two.vercel.app/api/news');
        
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        
        const data = await response.json();
        
        // Transform the API data and add random read times
        const transformedNews = data.news.map(item => ({
          title: item.title,
          description: item.title, // Using title as description since API doesn't provide one
          category: 'News',
          readTime: `${Math.floor(Math.random() * 10) + 2} min`, // Random read time between 2-11 minutes
          image: item.imgurl,
          url: item.url
        }));
        
        setNewsItems(transformedNews);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching news:', err);
        setIsLoading(false);
      }
    };
    
    fetchNews();
  }, []);

  const loadMore = () => {
    setVisibleItems(prev => Math.min(prev + 3, newsItems.length));
  };

  const openNewsModal = (news) => {
    setSelectedNews(news);
    setShowModal(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  const closeNewsModal = () => {
    setShowModal(false);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) closeNewsModal();
    };
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto'; // Ensure scrolling is re-enabled when component unmounts
    };
  }, []);

  return (
    <div className={styles.updateContainer}>
      {/* Header */}
      <Header />

      <div className={styles.contentWrapper}>
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className={styles.mainContent}>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <p>Loading latest crypto news...</p>
            </div>
          ) : (
            <>
              {/* Featured News Section */}
              <section className={styles.featuredSection}>
                <div className={styles.sectionHeader}>
                  <h2>Today's Updates</h2>
                  <div className={styles.headerLine}></div>
                </div>
                
                <div className={styles.featuredGrid}>
                  {newsItems.length > 0 && (
                    <div className={styles.featuredMain}>
                      <div className={styles.featuredImageContainer}>
                        <Image
                          src={newsItems[0].image}
                          alt={newsItems[0].title}
                          fill
                          className={styles.featuredImage}
                        />
                        <div className={styles.featuredCategory}>{newsItems[0].category}</div>
                      </div>
                      <div className={styles.featuredContent}>
                        <h3>{newsItems[0].title}</h3>
                        <p>{newsItems[0].description}</p>
                        <div className={styles.newsMetadata}>
                          <span><FiClock /> {newsItems[0].readTime}</span>
                          <button 
                            onClick={() => openNewsModal(newsItems[0])} 
                            className={styles.readMoreLink}
                          >
                            Read Full Story <FiArrowRight />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className={styles.featuredSidebar}>
                    {newsItems.slice(1, 3).map((item, index) => (
                      <div key={index} className={styles.sidebarItem}>
                        <div className={styles.sidebarImageContainer}>
                          <Image
                            src={item.image}
                            alt={item.title}
                            width={120}
                            height={80}
                            className={styles.sidebarImage}
                          />
                          <div className={styles.sidebarCategory}>{item.category}</div>
                        </div>
                        <div className={styles.sidebarContent}>
                          <h4>{item.title}</h4>
                          <div className={styles.newsMetadata}>
                            <span><FiClock /> {item.readTime}</span>
                            <button 
                              onClick={() => openNewsModal(item)} 
                              className={styles.readMoreLink}
                            >
                              Read More
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Latest News Section */}
              <section className={styles.latestSection}>
                <div className={styles.sectionHeader}>
                  <h2>Updates</h2>
                  <div className={styles.headerLine}></div>
                </div>
                
                <div className={styles.newsGrid}>
                  {newsItems.slice(3, visibleItems).map((item, index) => (
                    <div key={index} className={styles.newsCard}>
                      <div className={styles.newsImageContainer}>
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={300}
                          height={180}
                          className={styles.newsImage}
                        />
                        <div className={styles.newsCategory}>{item.category}</div>
                      </div>
                      <div className={styles.newsContent}>
                        <h4>{item.title}</h4>
                        <p>{item.description.substring(0, 100)}...</p>
                        <div className={styles.newsMetadata}>
                          <span><FiClock /> {item.readTime}</span>
                          <button 
                            onClick={() => openNewsModal(item)} 
                            className={styles.readMoreLink}
                          >
                            Read More <FiArrowRight />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {visibleItems < newsItems.length && (
                  <div className={styles.loadMoreContainer}>
                    <button className={styles.loadMoreButton} onClick={loadMore}>
                      Load More <FiChevronDown />
                    </button>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </div>

      {/* News Reading Modal */}
      {showModal && selectedNews && (
        <div className={styles.modalOverlay} onClick={closeNewsModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalCloseButton} onClick={closeNewsModal}>
              <FiX size={24} />
            </button>
            
            <div className={styles.modalHeader}>
              <div className={styles.modalImageContainer}>
                <Image
                  src={selectedNews.image}
                  alt={selectedNews.title}
                  width={800}
                  height={400}
                  className={styles.modalImage}
                />
              </div>
              <h2 className={styles.modalTitle}>{selectedNews.title}</h2>
              <div className={styles.modalMeta}>
                <span className={styles.modalCategory}>{selectedNews.category}</span>
                <span className={styles.modalReadTime}><FiClock /> {selectedNews.readTime}</span>
              </div>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.newsContent}>
                <p className={styles.modalDescription}>
                  {selectedNews.description}
                </p>
                
                {/* News content iframe */}
                <div className={styles.newsIframeContainer}>
                  <iframe 
                    src={selectedNews.url} 
                    title={selectedNews.title}
                    className={styles.newsIframe}
                  />
                </div>
                
                <div className={styles.modalFooter}>
                  <a 
                    href={selectedNews.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.visitSourceButton}
                  >
                    Visit Original Source
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Update = () => {
  return (
    <WalletWrapper>
      <UpdateContent />
    </WalletWrapper>
  );
};

export default Update;

