import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../styles/Classroom.module.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import searchIcon from '../../public/search.png';
import videoIcon from '../../public/video-circle.png';
import arrowRightIcon from '../../public/arrow-right.png';
import eyeIcon from '../../public/eye-icon.png';
import WalletWrapper from '../components/WalletWrapper';

import { useRouter } from 'next/router';

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

  // Function to open quiz modal
  const openQuizModal = () => {
    setQuizModalOpen(true);
  };

  // Function to close quiz modal
  const closeQuizModal = () => {
    setQuizModalOpen(false);
  };

  // Function to check the wallet connection
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

  // Function to fetch user details from the backend using the wallet address
  const fetchUserDetails = async (walletAddress) => {
    try {
      const response = await fetch(`https://byteapi-two.vercel.app/api/user/${walletAddress}`);
      if (!response.ok) {
        if (response.status === 404) {
          // Redirect to account page if no user is found
          router.push('/account');
          return;
        }
        throw new Error('Failed to fetch user details');
      }
      const data = await response.json();

      if (data && data.user) {
        setUserFullName(data.user.fullname);
        setUserCourseCategory(data.user.course);
        fetchVideos(data.user.course);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      router.push('/account'); // Redirect to account page on any error
    }
  };

  // Function to fetch videos from the backend
  const fetchVideos = async (courseCategory) => {
    try {
      const response = await fetch('https://byteapi-two.vercel.app/api/videos');
      const data = await response.json();

      const filteredVideos = data.videos.filter((video) => video.category !== 'Orientation');
      const matchingVideos = filteredVideos.filter((video) => video.category === courseCategory);
      const otherVideos = filteredVideos.filter((video) => video.category !== courseCategory);
      const sortedVideos = [...matchingVideos, ...otherVideos];
      setAllVideoItems(sortedVideos);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  // Function to handle "Load More" button click
  const handleLoadMore = () => {
    setVisibleCourses((prev) => prev + 8);
  };

  // Function to connect the wallet when "Connect Wallet" button is clicked
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

  // Function to open video modal when "Watch Video" is clicked
  const openVideoModal = (videoUrl) => {
    setVideoToWatch(videoUrl);
    setShowModal(true);
  };

  // Function to close video modal
  const closeVideoModal = () => {
    setVideoToWatch(null);
    setShowModal(false);
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
            {userFullName ? (
              <p className={styles.userName}>{userFullName}</p>
            ) : (
              <p className={styles.userName}>Unknown User</p>
            )}
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
              {allVideoItems.length === 0 ? (
                <div className={styles.noVideos}>
                  <Image src="/no-video.svg" alt="No videos available" width={100} height={100} />
                  <p>No videos available</p>
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
                      <Image
                        src={videoIcon}
                        alt="Play Video"
                        className={styles.videoIcon}
                        width={40}
                        height={40}
                        onClick={() => openVideoModal(item.videoembedlink.split('embed/')[1])}
                      />
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
                        <button className={styles.continueButton} onClick={() => openVideoModal(item.videoembedlink.split('embed/')[1])}>
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

      {/* Wallet Connect Modal */}
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