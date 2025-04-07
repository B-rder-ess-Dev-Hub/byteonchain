import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminSidebar from '../components/AdminSidebar';
import styles from '../styles/AdminDashboard.module.css';
import { fetchData } from '../../utils/api';



export async function getStaticProps() {
  return {
    props: {}
  };
}

export const config = {
  unstable_runtimeJS: true
};


const Dashboard = () => {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuizzes: 0,
    totalCourses: 0,
    completedQuizzes: 0,
    totalVideos: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [courseVideos, setCourseVideos] = useState([]);
  const [adminActivities, setAdminActivities] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/login');
      return;
    }

    setIsAuthenticated(true);
    fetchDashboardData(token);
  }, [router]);

  const fetchDashboardData = async (token) => {
    try {
      setIsLoading(true);

      const totalsData = await fetchData('/api/totals');
      const videosData = await fetchData('/api/videos');
      const eventsData = await fetchData('/api/events');

      setStats({
        totalUsers: totalsData.total_users || 0,
        totalQuizzes: 12,
        totalCourses: 8,
        completedQuizzes: 189,
        totalVideos: totalsData.total_videos || 0,
        totalAttestations: totalsData.total_attestations || 0,
        totalNews: totalsData.total_news || 0
      });

      const formattedVideos = videosData.videos.map(video => ({
        _id: video._id,
        title: video.videoname,
        course: video.category,
        author: video.author,
        duration: "10:00",
        created_at: new Date().toISOString(),
        embedLink: video.videoembedlink
      }));

      setCourseVideos(formattedVideos);

      const formattedEvents = eventsData.events.map(event => {
        const eventDate = new Date(event.date);
        const currentDate = new Date();

        let status = 'Upcoming';
        if (eventDate < currentDate) {
          status = 'Completed';
        } else if (eventDate.getTime() - currentDate.getTime() < 7 * 24 * 60 * 60 * 1000) {
          status = 'Registration Open';
        }

        return {
          _id: event._id,
          title: event.eventname,
          date: event.date,
          attendees: Math.floor(Math.random() * 100) + 20,
          status: status,
          category: event.eventcategory[0]
        };
      });

      setEvents(formattedEvents);

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setIsLoading(false);
    }
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
          <title>Admin Dashboard | ByteOnChain</title>
        </Head>

        <div className={styles.dashboardContainer}>
          <div className={styles.dashboardHeader}>
            <h1 className={styles.dashboardTitle}>Dashboard</h1>
            <p className={styles.dashboardSubtitle}>Welcome to the ByteOnChain admin dashboard</p>
          </div>

          {isLoading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <p>Loading dashboard data...</p>
            </div>
          ) : (
            <>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 20H22V18C22 16.3431 20.6569 15 19 15C18.0444 15 17.1931 15.4468 16.6438 16.1429M17 20H7M17 20V18C17 17.3438 16.8736 16.717 16.6438 16.1429M7 20H2V18C2 16.3431 3.34315 15 5 15C5.95561 15 6.80686 15.4468 7.35625 16.1429M7 20V18C7 17.3438 7.12642 16.717 7.35625 16.1429M7.35625 16.1429C8.0935 14.301 9.89482 13 12 13C14.1052 13 15.9065 14.301 16.6438 16.1429M15 7C15 8.65685 13.6569 10 12 10C10.3431 10 9 8.65685 9 7C9 5.34315 10.3431 4 12 4C13.6569 4 15 5.34315 15 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className={styles.statInfo}>
                    <h3 className={styles.statValue}>{stats.totalUsers}</h3>
                    <p className={styles.statLabel}>Users</p>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className={styles.statInfo}>
                    <h3 className={styles.statValue}>{stats.totalQuizzes}</h3>
                    <p className={styles.statLabel}>Quizzes</p>
                  </div>
                </div>



                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 10.5V6.5C15 5.39543 14.1046 4.5 13 4.5H4C2.89543 4.5 2 5.39543 2 6.5V17.5C2 18.6046 2.89543 19.5 4 19.5H13C14.1046 19.5 15 18.6046 15 17.5V13.5M15 10.5L21 6.5V17.5L15 13.5M15 10.5L15 13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className={styles.statInfo}>
                    <h3 className={styles.statValue}>{stats.totalVideos}</h3>
                    <p className={styles.statLabel}>Videos</p>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12.75L11.25 15L15 9.75M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className={styles.statInfo}>
                    <h3 className={styles.statValue}>{stats.totalAttestations || 0}</h3>
                    <p className={styles.statLabel}>Attestations</p>
                  </div>
                </div>

                {/* Add News stat card */}
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 20H5C3.89543 20 3 19.1046 3 18V6C3 4.89543 3.89543 4 5 4H15C16.1046 4 17 4.89543 17 6V7M19 20C17.8954 20 17 19.1046 17 18V7M19 20C20.1046 20 21 19.1046 21 18V9C21 7.89543 20.1046 7 19 7H17M7 8H13M7 12H13M7 16H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className={styles.statInfo}>
                    <h3 className={styles.statValue}>{stats.totalNews || 0}</h3>
                    <p className={styles.statLabel}>News</p>
                  </div>
                </div>
              </div>

              {/* Course Video Count Cards with brand colors */}
              <div className={styles.cardSectionsContainer}>
                {/* Course Video Count Cards */}
                <div className={styles.cardSection}>
                  <h2 className={styles.sectionTitle}>Courses Total Video Count</h2>

                  <div className={styles.courseCardsGrid}>
                    {Object.entries(courseVideos.reduce((courses, video) => {
                      const courseName = typeof video.course === 'string' ? video.course : 'Unknown Course';
                      if (!courses[courseName]) {
                        courses[courseName] = 0;
                      }
                      courses[courseName]++;
                      return courses;
                    }, {})).map(([course, count], index) => (
                      <div key={`course-${index}`} className={`${styles.courseCard} ${styles[`brandGradient${index % 3}`]}`}>
                        <h3 className={styles.courseTitle}>{course}</h3>
                        <div className={styles.videoCount}>
                          <span className={styles.countNumber}>{count}</span>
                          <span className={styles.countLabel}>Videos</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Videos Section */}
                <div className={styles.cardSection}>
                  <h2 className={styles.sectionTitle}>Recent Videos</h2>

                  <div className={styles.recentVideosContainer}>
                    {courseVideos.length > 0 ? (
                      // Limit to only the latest 3 videos
                      courseVideos.slice(0, 3).map((video) => (
                        <div key={video._id || `video-${Math.random().toString(36).substring(2, 9)}`} className={styles.recentVideoCard}>
                          <div className={styles.videoThumbnail}>
                            <div className={styles.playIcon}>
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 5.14V19.14L19 12.14L8 5.14Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </div>
                          </div>
                          <div className={styles.videoInfo}>
                            <h3 className={styles.videoTitle}>{typeof video.title === 'string' ? video.title : 'Untitled Video'}</h3>
                            <div className={styles.videoMeta}>
                              <span className={styles.videoCourse}>{typeof video.course === 'string' ? video.course : 'Unknown Course'}</span>
                              <span className={styles.videoDuration}>By {typeof video.author === 'string' ? video.author : 'Unknown Author'}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className={styles.noData}>No videos found</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Events section remains as a table */}
              <div className={styles.eventsSection}>
                <h2 className={styles.sectionTitle}>Events</h2>

                <div className={styles.tableContainer}>
                  <table className={styles.usersTable}>
                    <thead>
                      <tr>
                        <th>Event Title</th>
                        <th>Date</th>
                        <th>Category</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.length > 0 ? (
                        events.map((event) => (
                          <tr key={event._id || `event-${Math.random().toString(36).substring(2, 9)}`}>
                            <td>{typeof event.title === 'string' ? event.title : 'Untitled Event'}</td>
                            <td>{event.date ? new Date(event.date).toLocaleDateString() : 'No date'}</td>
                            <td>{typeof event.category === 'string' ? event.category : 'Uncategorized'}</td>
                            <td>
                              <span className={`${styles.eventStatus} ${styles[(event.status || 'unknown').toLowerCase().replace(' ', '')]}`}>
                                {typeof event.status === 'string' ? event.status : 'Unknown Status'}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className={styles.noData}>No events found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;