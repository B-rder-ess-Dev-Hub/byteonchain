import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminSidebar from '../components/AdminSidebar';
import styles from '../styles/Uploads.module.css';
import { useToast } from '../components/ToastNotification';
import axios from 'axios';



export async function getStaticProps() {
  return {
    props: {}
  };
}

export const config = {
  unstable_runtimeJS: true
};

const Uploads = () => {
  const router = useRouter();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('videos');
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [videos, setVideos] = useState([]);
  const [videoFormData, setVideoFormData] = useState({
    videoname: '',
    videoembedlink: '',
    category: '',
    author: ''
  });
  
  // News state
  const [news, setNews] = useState([]);
  const [newsFormData, setNewsFormData] = useState({
    title: '',
    url: '',
    imgurl: ''
  });
  
  // Events state
  const [events, setEvents] = useState([]); 
  const [eventFormData, setEventFormData] = useState({
    eventname: '',
    from_time: '',
    to_time: '',
    date: '',
    eventcategory: [''],
    event_link: '', 
    description: '',
    location: '', 
    title: '' 
  });

  const API_BASE_URL = 'https://byteapi-two.vercel.app/api';
  const API_KEY = process.env.NEXT_PUBLIC_BYTE_API_KEY;

  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Bytekeys': API_KEY
    },
    timeout: 15000, 
    validateStatus: function (status) {
      return status >= 200 && status < 500; 
    }
  });

  api.interceptors.request.use(function (config) {
    console.log(`Making ${config.method.toUpperCase()} request to ${config.url}`);
    return config;
  }, function (error) {
    return Promise.reject(error);
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/login');
      return;
    }
    
    setIsAuthenticated(true);
    fetchData();
  }, [router]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchVideos(),
        fetchNews(),
        fetchEvents()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  // Videos functions
  const fetchVideos = async () => {
    try {
      const response = await api.get('/videos');
      console.log('Videos API response:', response.data);
      setVideos(response.data.videos || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast.error('Failed to load videos');
    }
  };

  // News functions
  const fetchNews = async () => {
    try {
      const response = await api.get('/news');
      console.log('News API response:', response.data);
      setNews(response.data.news || []);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error('Failed to load news');
    }
  };

  // Events functions
  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      console.log('Events API response:', response.data);
      setEvents(response.data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    }
  };

  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await api.post('/videos', {
        ...videoFormData,
        shares: 0
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      toast.success('Video added successfully');
      setVideoFormData({
        videoname: '',
        videoembedlink: '',
        category: '',
        author: ''
      });
      fetchVideos();
    } catch (error) {
      console.error('Error adding video:', error);
      toast.error('Failed to add video: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const deleteVideo = async (id) => {
    toast.confirm(
      'Are you sure you want to delete this video?',
      async () => {
        try {
          setIsLoading(true);
          const token = localStorage.getItem('adminToken');
          await api.delete(`/videos/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          toast.success('Video deleted successfully');
          fetchVideos();
        } catch (error) {
          console.error('Error deleting video:', error);
          toast.error('Failed to delete video');
        } finally {
          setIsLoading(false);
        }
      }
    );
  };

  const handleNewsSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('adminToken');
      await api.post('/news', newsFormData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      toast.success('News added successfully');
      setNewsFormData({
        title: '',
        url: '',
        imgurl: ''
      });
      fetchNews();
    } catch (error) {
      console.error('Error adding news:', error);
      toast.error('Failed to add news: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const deleteNews = async (id) => {
    toast.confirm(
      'Are you sure you want to delete this news item?',
      async () => {
        try {
          setIsLoading(true);
          const token = localStorage.getItem('adminToken');
          await api.delete(`/news/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          toast.success('News deleted successfully');
          fetchNews();
        } catch (error) {
          console.error('Error deleting news:', error);
          toast.error('Failed to delete news');
        } finally {
          setIsLoading(false);
        }
      }
    );
  };

 
  
  const formatTimeForAPI = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return '';
    
    if (timeStr.includes('T') && timeStr.includes('Z')) {
      return timeStr;
    }
    
    try {
      const datePart = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
      
      // Create a date object in a more reliable way
      const [hours, minutes] = timeStr.split(':').map(Number);
      const [year, month, day] = datePart.split('-').map(Number);
      
      // Month is 0-indexed in JavaScript Date
      const dateTime = new Date(year, month - 1, day, hours, minutes);
      
      // Check if the date is valid before returning ISO string
      if (isNaN(dateTime.getTime())) {
        console.error('Invalid date created:', { dateStr, timeStr, dateTime });
        return '';
      }
      
      return dateTime.toISOString();
    } catch (error) {
      console.error('Error formatting time for API:', error, { dateStr, timeStr });
      return '';
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('adminToken');
      
      const formattedData = {
        title: eventFormData.title || eventFormData.eventname, 
        description: eventFormData.description || 'No description provided', 
        location: eventFormData.location || 'Online', 
        eventname: eventFormData.eventname,
        eventcategory: eventFormData.eventcategory,
        event_link: eventFormData.event_link,
        date: formatTimeForAPI(eventFormData.date, '00:00'),
        from_time: formatTimeForAPI(eventFormData.date, eventFormData.from_time),
        to_time: formatTimeForAPI(eventFormData.date, eventFormData.to_time)
      };
      
      console.log('Sending event data:', formattedData);
      
      const response = await api.post('/events', formattedData, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        timeout: 10000 
      });
      
      console.log('Event API response:', response.data);
      
      toast.success('Event added successfully');
      setEventFormData({
        eventname: '',
        title: '',
        from_time: '',
        to_time: '',
        date: '',
        eventcategory: [''],
        event_link: '',
        description: '',
        location: ''
      });
      fetchEvents();
    } catch (error) {
      console.error('Error adding event:', error);
      toast.error('Failed to add event: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEvent = async (id) => {
    toast.confirm(
      'Are you sure you want to delete this event?',
      async () => {
        try {
          setIsLoading(true);
          const token = localStorage.getItem('adminToken');
          
          console.log(`Attempting to delete event with ID: ${id}`);
          
          const response = await api.delete(`/events/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          console.log('Delete event response:', response);
          
          if (response.status === 200 || response.status === 204) {
            toast.success('Event deleted successfully');
            setEvents(prevEvents => prevEvents.filter(event => event._id !== id));
            await fetchEvents();
          } else {
            console.error('Unexpected response status:', response.status);
            toast.error(`Failed to delete event: Unexpected status ${response.status}`);
          }
        } catch (error) {
          console.error('Error deleting event:', error);
          
          if (error.response) {
            console.error('Error response:', error.response.data);
            console.error('Status code:', error.response.status);
            toast.error(`Failed to delete event: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
          } else if (error.request) {
            console.error('No response received:', error.request);
            toast.error('Failed to delete event: No response from server');
          } else {
            console.error('Error message:', error.message);
            toast.error(`Failed to delete event: ${error.message}`);
          }
        } finally {
          setIsLoading(false);
        }
      }
    );
  };

  const handleVideoChange = (e) => {
    const { name, value } = e.target;
    setVideoFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNewsChange = (e) => {
    const { name, value } = e.target;
    setNewsFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEventChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'eventcategory') {
      const categories = value.split(',').map(cat => cat.trim());
      setEventFormData(prev => ({ ...prev, [name]: categories }));
    } else if (name === 'from_time' || name === 'to_time') {
      setEventFormData(prev => ({ ...prev, [name]: value }));
    } else {
      setEventFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(timeString).toLocaleTimeString(undefined, options);
  };

 
  if (!isAuthenticated) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Verifying authentication...</p>
      </div>
    );
  }

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />
      <main className={styles.adminContent}>
        <Head>
          <title>Content Uploads | ByteOnChain</title>
        </Head>
        
        <div className={styles.uploadsContainer}>
          <div className={styles.uploadsHeader}>
            <div className={styles.headerContent}>
              <h1 className={styles.uploadsTitle}>Content Management</h1>
              <p className={styles.uploadsSubtitle}>Upload and manage videos, news, and events</p>
            </div>
          </div>
          
          <div className={styles.tabsContainer}>
            <div className={styles.tabs}>
              <button 
                className={`${styles.tabButton} ${activeTab === 'videos' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('videos')}
              >
                Videos
              </button>
              <button 
                className={`${styles.tabButton} ${activeTab === 'news' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('news')}
              >
                News
              </button>
              <button 
                className={`${styles.tabButton} ${activeTab === 'events' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('events')}
              >
                Events
              </button>
            </div>
            
            <div className={styles.tabContent}>
              {/* Videos Tab */}
              {activeTab === 'videos' && (
                <div className={styles.tabPanel}>
                  <div className={styles.formSection}>
                    <h2 className={styles.sectionTitle}>Add New Video</h2>
                    <form onSubmit={handleVideoSubmit} className={styles.uploadForm}>
                      <div className={styles.formGroup}>
                        <label htmlFor="videoname">Video Title</label>
                        <input
                          type="text"
                          id="videoname"
                          name="videoname"
                          value={videoFormData.videoname}
                          onChange={handleVideoChange}
                          required
                          placeholder="Enter video title"
                        />
                      </div>
                      
                      <div className={styles.formGroup}>
                        <label htmlFor="videoembedlink">Video Embed Link</label>
                        <input
                          type="url"
                          id="videoembedlink"
                          name="videoembedlink"
                          value={videoFormData.videoembedlink}
                          onChange={handleVideoChange}
                          required
                          placeholder="https://www.youtube.com/embed/..."
                        />
                        <p className={styles.formHint}>Use YouTube embed link format</p>
                      </div>
                      
                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label htmlFor="category">Category</label>
                          <input
                            type="text"
                            id="category"
                            name="category"
                            value={videoFormData.category}
                            onChange={handleVideoChange}
                            required
                            placeholder="e.g., Tutorial, Webinar"
                          />
                        </div>
                        
                        <div className={styles.formGroup}>
                          <label htmlFor="author">Author</label>
                          <input
                            type="text"
                            id="author"
                            name="author"
                            value={videoFormData.author}
                            onChange={handleVideoChange}
                            required
                            placeholder="Video creator name"
                          />
                        </div>
                      </div>
                      
                      <div className={styles.formActions}>
                        <button type="submit" className={styles.submitButton} disabled={isLoading}>
                          {isLoading ? 'Adding...' : 'Add Video'}
                        </button>
                      </div>
                    </form>
                  </div>
                  
                  <div className={styles.contentSection}>
                    <h2 className={styles.sectionTitle}>Manage Videos</h2>
                    {isLoading ? (
                      <div className={styles.loadingContainer}>
                        <div className={styles.loadingSpinner}></div>
                        <p>Loading videos...</p>
                      </div>
                    ) : (
                      <div className={styles.contentGrid}>
                        {videos.length > 0 ? (
                          videos.map((video) => (
                            <div key={video._id} className={styles.contentCard}>
                              <div className={styles.videoPreview}>
                                <iframe 
                                  src={video.videoembedlink} 
                                  title={video.videoname}
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                ></iframe>
                              </div>
                              <div className={styles.contentInfo}>
                                <h3 className={styles.contentTitle}>{video.videoname}</h3>
                                <div className={styles.contentMeta}>
                                  <span className={styles.metaItem}>
                                    <strong>Category:</strong> {video.category}
                                  </span>
                                  <span className={styles.metaItem}>
                                    <strong>Author:</strong> {video.author}
                                  </span>
                                  <span className={styles.metaItem}>
                                    <strong>Shares:</strong> {video.shares}
                                  </span>
                                </div>
                                <button 
                                  className={styles.deleteButton}
                                  onClick={() => deleteVideo(video._id)}
                                >
                                  Delete Video
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className={styles.noContent}>
                            <p>No videos found. Add your first video above.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* News Tab */}
              {activeTab === 'news' && (
                <div className={styles.tabPanel}>
                  <div className={styles.formSection}>
                    <h2 className={styles.sectionTitle}>Add News Item</h2>
                    <form onSubmit={handleNewsSubmit} className={styles.uploadForm}>
                      <div className={styles.formGroup}>
                        <label htmlFor="title">News Title</label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          value={newsFormData.title}
                          onChange={handleNewsChange}
                          required
                          placeholder="Enter news title"
                        />
                      </div>
                      
                      <div className={styles.formGroup}>
                        <label htmlFor="url">News URL</label>
                        <input
                          type="url"
                          id="url"
                          name="url"
                          value={newsFormData.url}
                          onChange={handleNewsChange}
                          required
                          placeholder="https://example.com/news-article"
                        />
                      </div>
                      
                      <div className={styles.formGroup}>
                        <label htmlFor="imgurl">Image URL</label>
                        <input
                          type="url"
                          id="imgurl"
                          name="imgurl"
                          value={newsFormData.imgurl}
                          onChange={handleNewsChange}
                          required
                          placeholder="https://example.com/image.jpg"
                        />
                        <p className={styles.formHint}>Use a direct link to an image (JPG, PNG)</p>
                      </div>
                      
                      <div className={styles.formActions}>
                        <button type="submit" className={styles.submitButton} disabled={isLoading}>
                          {isLoading ? 'Adding...' : 'Add News'}
                        </button>
                      </div>
                    </form>
                  </div>
                  
                  <div className={styles.contentSection}>
                    <h2 className={styles.sectionTitle}>Manage News</h2>
                    {isLoading ? (
                      <div className={styles.loadingContainer}>
                        <div className={styles.loadingSpinner}></div>
                        <p>Loading news...</p>
                      </div>
                    ) : (
                      <div className={styles.contentGrid}>
                        {news.length > 0 ? (
                          news.map((item) => (
                            <div key={item._id} className={styles.contentCard}>
                              <div className={styles.newsImage}>
                                <img src={item.imgurl} alt={item.title} />
                              </div>
                              <div className={styles.contentInfo}>
                                <h3 className={styles.contentTitle}>{item.title}</h3>
                                <a 
                                  href={item.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className={styles.newsLink}
                                >
                                  View Article
                                </a>
                                <button 
                                  className={styles.deleteButton}
                                  onClick={() => deleteNews(item._id)}
                                >
                                  Delete News
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className={styles.noContent}>
                            <p>No news found. Add your first news item above.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Events Tab */}
              {activeTab === 'events' && (
                <div className={styles.tabPanel}>
                  <div className={styles.formSection}>
                    <h2 className={styles.sectionTitle}>Add New Event</h2>
                    <form onSubmit={handleEventSubmit} className={styles.uploadForm}>
                      <div className={styles.formGroup}>
                        <label htmlFor="eventname">Event Name</label>
                        <input
                          type="text"
                          id="eventname"
                          name="eventname"
                          value={eventFormData.eventname}
                          onChange={handleEventChange}
                          required
                          placeholder="Enter event name"
                        />
                      </div>
                      
                      <div className={styles.formGroup}>
                        <label htmlFor="date">Event Date</label>
                        <input
                          type="date"
                          id="date"
                          name="date"
                          value={eventFormData.date.split('T')[0]}
                          onChange={handleEventChange}
                          required
                        />
                      </div>
                      
                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label htmlFor="from_time">Start Time</label>
                          <input
                            type="time"
                            id="from_time"
                            name="from_time"
                            value={eventFormData.from_time}
                            onChange={handleEventChange}
                            required
                          />
                        </div>
                        
                        <div className={styles.formGroup}>
                          <label htmlFor="to_time">End Time</label>
                          <input
                            type="time"
                            id="to_time"
                            name="to_time"
                            value={eventFormData.to_time}
                            onChange={handleEventChange}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className={styles.formGroup}>
                        <label htmlFor="event_link">Event Link</label>
                        <input
                          type="url"
                          id="event_link"
                          name="event_link"
                          value={eventFormData.event_link}
                          onChange={handleEventChange}
                          placeholder="https://example.com/event-registration"
                        />
                        <p className={styles.formHint}>URL for event registration or details page</p>
                      </div>
                      
                      <div className={styles.formGroup}>
                        <label htmlFor="eventcategory">Event Categories</label>
                        <input
                          type="text"
                          id="eventcategory"
                          name="eventcategory"
                          value={eventFormData.eventcategory.join(', ')}
                          onChange={handleEventChange}
                          required
                          placeholder="Workshop, Conference, Meetup (comma separated)"
                        />
                        <p className={styles.formHint}>Separate categories with commas</p>
                      </div>
                      
                      <div className={styles.formActions}>
                        <button type="submit" className={styles.submitButton} disabled={isLoading}>
                          {isLoading ? 'Adding...' : 'Add Event'}
                        </button>
                      </div>
                    </form>
                  </div>
                  
                  <div className={styles.contentSection}>
                    <h2 className={styles.sectionTitle}>Manage Events</h2>
                    {isLoading ? (
                      <div className={styles.loadingContainer}>
                        <div className={styles.loadingSpinner}></div>
                        <p>Loading events...</p>
                      </div>
                    ) : (
                      <div className={styles.eventsList}>
                        {events.length > 0 ? (
                          events.map((event) => (
                            <div key={event._id} className={styles.eventCard}>
                              <div className={styles.eventDate}>
                                <div className={styles.eventDay}>
                                  {new Date(event.date).getDate()}
                                </div>
                                <div className={styles.eventMonth}>
                                  {new Date(event.date).toLocaleString('default', { month: 'short' })}
                                </div>
                              </div>
                              <div className={styles.eventInfo}>
                                <h3 className={styles.eventTitle}>{event.eventname}</h3>
                                <div className={styles.eventTime}>
                                  {formatTime(event.from_time)} - {formatTime(event.to_time)}
                                </div>
                                {event.event_link && (
                                  <a 
                                    href={event.event_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.eventLink}
                                  >
                                    Event Details
                                  </a>
                                )}
                                <div className={styles.eventCategories}>
                                  {event.eventcategory.map((category, index) => (
                                    <span key={index} className={styles.categoryTag}>
                                      {category}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className={styles.eventActions}>
                                <button 
                                  className={styles.deleteButton}
                                  onClick={() => deleteEvent(event._id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className={styles.noContent}>
                            <p>No events found. Add your first event above.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Uploads;

