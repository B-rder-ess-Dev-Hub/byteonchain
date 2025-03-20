import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import videoIcon from '../../public/video-circle.png';
import recentArrowIcon from '../../public/arrow-icon.png';
import eyeIcon from '../../public/eye-icon.png';
import shareIcon from '../../public/share-icon.png';
import styles from '../styles/Recent.module.css';
import Modal from './Modal';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://byteapi-two.vercel.app';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: '/api',  // Use the proxied URL
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

const Recent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState('');
  const carouselRef = useRef(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  // Function to get YouTube video ID and thumbnail
  const getYouTubeInfo = (embedLink) => {
    if (!embedLink) return { id: null, thumbnail: '/img.png' };
    
    // Extract video ID from embed link
    const match = embedLink.match(/embed\/([^?]+)/);
    const videoId = match ? match[1] : null;
    
    // Generate high-quality thumbnail URL
    const thumbnail = videoId 
      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      : '/img.png';

    return { id: videoId, thumbnail };
  };

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/videos');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Transform the video data and get thumbnails
      const processedVideos = data.videos.map(video => {
        const { thumbnail } = getYouTubeInfo(video.videoembedlink);
        return {
          ...video,
          title: video.videoname,
          thumbnail,
          videoUrl: video.videoembedlink,
        };
      });
      console.log('Processed videos:', processedVideos);
      setVideos(processedVideos);
      setError(null);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setError('Failed to load videos. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (videoUrl) => {
    console.log('openModal called with URL:', videoUrl);
    if (!videoUrl) {
      console.error('No video URL provided');
      return;
    }
    setIsModalOpen(true);
    setSelectedVideoUrl(videoUrl);
  };
  
  const closeModal = () => {
    console.log('Closing modal');
    setIsModalOpen(false);
    setSelectedVideoUrl('');
  };

  if (loading) {
    return (
      <div className={styles.recentSection}>
        <div className={styles.loadingContainer}>
          <div className={styles.neomorphLoader}></div>
          <p className={styles.loadingText}>Loading videos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.recentSection}>
        <div className={styles.errorState}>
          <div className={styles.errorStateCard}>
            <Image
              src={videoIcon}
              alt="Error"
              width={60}
              height={60}
              className={styles.errorStateIcon}
            />
            <h3>Oops! Something went wrong</h3>
            <p>{error}</p>
            <button 
              className={styles.neomorphButton}
              onClick={fetchVideos}
            >
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
          {videos.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateCard}>
                <Image
                  src={videoIcon}
                  alt="No Videos"
                  width={60}
                  height={60}
                  className={styles.emptyStateIcon}
                />
                <h3>No Videos Available</h3>
                <p>Check back later for new content</p>
              </div>
            </div>
          ) : (
            videos.map((video, index) => (
              <div key={index} className={styles.carouselCard}>
                <div 
                  className={styles.videoContainer} 
                  onClick={() => openModal(video.videoembedlink)}
                >
                  <div className={styles.playIconWrapper}>
                    <Image
                      src={videoIcon}
                      alt="Play Video"
                      className={styles.videoIcon}
                      width={50}
                      height={50}
                    />
                  </div>
                  <div className={styles.carouselImageWrapper}>
                    <Image
                      src={video.thumbnail}
                      alt={video.videoname}
                      className={styles.carouselImage}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index < 2}
                    />
                  </div>
                </div>
                <div className={styles.cardContent}>
                  <p className={styles.cardTitle}>{video.videoname}</p>
                  <div className={styles.authorContainer}>
                    <span className={styles.author}>By {video.author}</span>
                  </div>
                  <button 
                    className={styles.neomorphButton} 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openModal(video.videoembedlink);
                    }}
                  >
                    Watch Video
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        videoUrl={selectedVideoUrl} 
      />
    </div>
  );
};

export default Recent;