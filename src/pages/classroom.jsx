import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../styles/Classroom.module.css';
import Sidebar from '../components/Sidebarcons';
import Header from '../components/Header';
import searchIcon from '../../public/search.png';
import videoIcon from '../../public/video-circle.png';
import eyeIcon from '../../public/eye-icon.png';
import WalletWrapper from '../components/WalletWrapper';
import { fetchData } from '../../utils/api'; 

import { useRouter } from 'next/router';

export const config = {
  unstable_runtimeJS: true
};

export async function getStaticProps() {
  return {
    props: {}
  };
}

const ClassroomContent = ({ walletConnected }) => {
  const [allVideoItems, setAllVideoItems] = useState([]);
  const [visibleCourses, setVisibleCourses] = useState(8);
  const [showModal, setShowModal] = useState(false);
  const [userFullName, setUserFullName] = useState('');
  const [userCourseCategory, setUserCourseCategory] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [videoToWatch, setVideoToWatch] = useState(null);
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [quizview, setquizview] = useState(true); 
  const router = useRouter();


  const checkWalletConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          fetchUserDetails(accounts[0]);
        } else {
          setShowModal(true);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    } else {
      setShowModal(true);
      alert('MetaMask is not installed. Please install MetaMask to proceed.');
    }
  };

  useEffect(() => {
    checkWalletConnection();
  }, []);

  
  const fetchUserDetails = async (walletAddress) => {
    try {
      const data = await fetchData(`/api/user/${walletAddress}`);
      
      if (data && data.user) {
        setUserFullName(data.user.fullname);
        setUserCourseCategory(data.user.course);
        fetchVideos(data.user.course);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      if (error.response && error.response.status === 404) {
        router.push('/account');
      } else {
        router.push('/account'); 
      }
    }
  };

  const fetchVideos = async (courseCategory) => {
    try {
      const data = await fetchData('/api/videos');

      const filteredVideos = data.videos.filter((video) => video.category !== 'Orientation');
      const matchingVideos = filteredVideos.filter((video) => video.category === courseCategory);
      const otherVideos = filteredVideos.filter((video) => video.category !== courseCategory);
      const sortedVideos = [...matchingVideos, ...otherVideos];
      setAllVideoItems(sortedVideos);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const handleLoadMore = () => {
    setVisibleCourses((prev) => prev + 8);
  };


  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
        setShowModal(false);
        fetchUserDetails(accounts[0]);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      alert('MetaMask is not installed. Please install MetaMask to proceed.');
    }
  };

  const openVideoModal = (videoUrl) => {
    setVideoToWatch(videoUrl);
    setShowModal(true);
  };

  const closeVideoModal = () => {
    setVideoToWatch(null);
    setShowModal(false);
  };

  return (
    <div className={styles.classroomContainer}>
      {/* Header Component */}
      <div className={styles.classroomWrapper}>
        <Header />
      </div>

      <div className={styles.contentWrapper}>
        <Sidebar />
        <div className={styles.mainContent}>
          <div className={styles.banner}>
            <div className={styles.bannerContent}>
              <h1 className={styles.bannerTitle}>Welcome to your class</h1>
              {userFullName ? (
                <p className={styles.bannerSubtitle}>{userFullName}</p>
              ) : (
                <p className={styles.bannerSubtitle}>Unknown User</p>
              )}
            </div>
            <div className={styles.bannerGraphic}>
              <div className={styles.bannerCircle}></div>
              <div className={styles.bannerCircle}></div>
              <div className={styles.bannerCircle}></div>
            </div>
          </div>

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
              {allVideoItems.length === 0 ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyStateCard}>
                    <div className={styles.emptyStateIcon}>
                      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#FBBF24" strokeWidth="2"/>
                        <path d="M12 8V12L15 15" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <h3 className={styles.emptyStateTitle}>No videos available yet</h3>
                    <p className={styles.emptyStateText}>
                      We're working on adding new content for your course. Check back soon!
                    </p>
                    <button className={styles.emptyStateButton}>
                      Refresh
                    </button>
                  </div>
                </div>
              ) : (
                allVideoItems.slice(0, visibleCourses).map((item, index) => (
                  <div key={index} className={styles.carouselCard}>
                    <div className={styles.videoContainer}>
                      <Image
                        src={item.imageUrl || '/img.png'}
                        alt={item.videoname}
                        className={styles.carouselImage}
                        layout="intrinsic"
                        width={200}
                        height={181}
                      />
                      <div className={styles.videoIconWrapper}>
                        <Image
                          src={videoIcon}
                          alt="Play Video"
                          className={styles.videoIcon}
                          width={40}
                          height={40}
                          onClick={() => openVideoModal(item.videoembedlink.split('embed/')[1])}
                        />
                      </div>
                    </div>
                    <div className={styles.cardContent}>
                      <p className={styles.cardTitle}>{item.videoname}</p>
                      <div className={styles.infoContainer}>
                        <div className={styles.tutorContainer}>
                          <Image
                            src={item.tutorImage || '/avatar.png'}
                            alt={item.author}
                            className={styles.tutorImage}
                            width={20}
                            height={20}
                          />
                          <span className={styles.tutorName}>{item.author}</span>
                        </div>
                        <div className={styles.viewsAndDays}>
                          <div className={styles.viewsContainer}>
                            <Image src={eyeIcon} alt="Eye Icon" width={12} height={12} />
                            <span className={styles.views}>{item.shares}</span>
                          </div>
                        </div>
                      </div>
                      <div className={styles.buttonContainer}>
                        <button 
                          className={styles.continueButton} 
                          onClick={() => openVideoModal(item.videoembedlink.split('embed/')[1])}
                        >
                          Watch Video
                        </button>
                        <button
                          className={styles.shareButton}
                          onClick={() => {
                            const tweetText = `Check out this amazing course: "${item.videoname}" by @primidac! Watch it now!`;
                            const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
                            window.open(twitterShareUrl, '_blank');
                          }}
                        >
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Load More Button - Modernized */}
            {visibleCourses < allVideoItems.length && (
              <div className={styles.loadMoreContainer}>
                <button className={styles.loadMoreButton} onClick={handleLoadMore}>
                  Load More
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.loadMoreIcon}>
                    <path d="M19 9L12 16L5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals - Updated styling will be in CSS */}
      {showModal && !videoToWatch && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Connect Your Wallet</h3>
            <p>You need to connect your wallet to proceed.</p>
            <button className={styles.modalButton} onClick={connectWallet}>
              Connect Wallet
            </button>
            <button
              className={styles.modalClose}
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {showModal && videoToWatch && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <iframe
              src={`https://www.youtube.com/embed/${videoToWatch}`}
              frameBorder="0"
              width="100%"
              height="400"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <button
              className={styles.modalClose}
              onClick={closeVideoModal}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Quiz Modal
      {quizModalOpen && (
        <QuizModal closeModal={closeQuizModal} />
      )} */}
    </div>
  );
};

const Classroom = () => {
  return (
    <WalletWrapper>
      <ClassroomContent />
    </WalletWrapper>
  );
};

export default Classroom;