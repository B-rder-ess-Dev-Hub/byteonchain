import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminSidebar from '../components/AdminSidebar';
import styles from '../styles/Quizzes.module.css';
import { useToast } from '../components/ToastNotification';
import dynamic from 'next/dynamic';

const QuizForm = dynamic(() => import('../components/QuizForm'), { 
  ssr: false,
  loading: () => <p>Loading form...</p>
});

export const config = {
  unstable_runtimeJS: true,
  unstable_JsPreload: false
};

export async function getStaticProps() {
  try {
    const apiKey = process.env.NEXT_PUBLIC_BYTE_API_KEY;
    const response = await fetch('https://byteapi-two.vercel.app/api/quizzes/', {
      headers: {
        'Accept': 'application/json',
        'Bytekeys': apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    let quizzesData = Array.isArray(data) ? data : data.quizzes || Object.values(data || {});

    const formattedQuizzes = quizzesData.map(quiz => ({
      _id: quiz._id || quiz.id || `quiz-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      course_title: quiz.course_title || quiz.title || 'Untitled Quiz',
      issuer: quiz.issuer || 'Borderless Developers Programme',
      duration: quiz.duration || '30 minutes',
      total_questions: quiz.total_questions || (quiz.questions?.length || 0),
      status: quiz.status || 'active',
      createdAt: quiz.createdAt || new Date().toISOString(),
      questions: Array.isArray(quiz.questions) ? quiz.questions.map(q => ({
        question: String(q.question || ''),
        options: Array.isArray(q.options) ? q.options.map(opt => String(opt || '')) : [],
        answer: String(q.answer || ''),
      })) : [],
    })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return {
      props: {
        initialQuizzes: formattedQuizzes,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      props: {
        initialQuizzes: [],
      },
    };
  }
}

function Quizzes({ initialQuizzes = [] }) {
  const router = useRouter();
  const toast = useToast();
  const [quizzes, setQuizzes] = useState(initialQuizzes);
  const [filteredQuizzes, setFilteredQuizzes] = useState(initialQuizzes);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(initialQuizzes.length === 0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [quizzesPerPage] = useState(10);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push('/login');
      } else {
        setIsAuthenticated(true);
        if (initialQuizzes.length === 0) {
          fetchQuizzes();
        }
      }
    }
  }, [router, initialQuizzes]);

  const fetchQuizzes = async () => {
    try {
      setIsLoading(true);
      const apiKey = process.env.NEXT_PUBLIC_BYTE_API_KEY;

      const response = await fetch('https://byteapi-two.vercel.app/api/quizzes/', {
        headers: {
          'Accept': 'application/json',
          'Bytekeys': apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      let quizzesData = [];
      if (data && Array.isArray(data)) {
        quizzesData = data;
      } else if (data && data.quizzes && Array.isArray(data.quizzes)) {
        quizzesData = data.quizzes;
      } else if (data && typeof data === 'object') {
        quizzesData = Object.values(data);
      }

      const formattedQuizzes = quizzesData.map(quiz => ({
        _id: quiz._id || quiz.id || `quiz-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        course_title: quiz.course_title || quiz.title || 'Untitled Quiz',
        issuer: quiz.issuer || 'Borderless Developers Programme',
        duration: quiz.duration || '30 minutes',
        total_questions: quiz.total_questions || (quiz.questions?.length || 0),
        status: quiz.status || 'active',
        createdAt: quiz.createdAt || new Date().toISOString(),
        questions: Array.isArray(quiz.questions) ? quiz.questions.map(q => ({
          question: typeof q.question === 'string' ? q.question : String(q.question || ''),
          options: Array.isArray(q.options) ? q.options.map(opt =>
            typeof opt === 'string' ? opt : String(opt || '')
          ) : [],
          answer: typeof q.answer === 'string' ? q.answer : String(q.answer || '')
        })) : []
      }));

      const sortedQuizzes = formattedQuizzes.sort((a, b) => {
        return new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now());
      });

      setQuizzes(sortedQuizzes);
      setFilteredQuizzes(sortedQuizzes);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      toast.error('Failed to load quizzes: ' + error.message);
      setIsLoading(false);
      setQuizzes([]);
      setFilteredQuizzes([]);
    }
  };

  const sanitizeQuizData = (quiz) => {
    if (!quiz) return null;

    return {
      ...quiz,
      questions: Array.isArray(quiz.questions)
        ? quiz.questions.map(q => ({
          ...q,
          question: typeof q.question === 'string' ? q.question : String(q.question || ''),
          options: Array.isArray(q.options)
            ? q.options.map(opt => typeof opt === 'string' ? opt : String(opt || ''))
            : [],
          answer: typeof q.answer === 'string' ? q.answer : String(q.answer || '')
        }))
        : []
    };
  };

  const createQuiz = async (quizData, clearDraft) => {
    try {
      setIsLoading(true);
      const apiKey = process.env.NEXT_PUBLIC_BYTE_API_KEY;
      
      // Add custom_tweet field from tweet_format
      const dataToSend = {
        ...quizData,
        custom_tweet: quizData.tweet_format || null
      };
      
      const response = await fetch('https://byteapi-two.vercel.app/api/quizzes/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Bytekeys': apiKey
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create quiz: ${response.status}`);
      }

      // Clear the draft from localStorage after successful submission
      if (typeof clearDraft === 'function') {
        clearDraft();
      }

      fetchQuizzes();
      setIsCreateModalOpen(false);
      toast.success('Quiz created successfully');
    } catch (error) {
      console.error('Error creating quiz:', error);
      toast.error('Failed to create quiz: ' + error.message);
      setIsLoading(false);
    }
  };

  const deleteQuiz = async (id, courseTitle) => {
    const identifier = courseTitle || id;
    
    toast.confirm(
      'Are you sure you want to delete this quiz?',
      async () => {
        try {
          setIsLoading(true);
          const apiKey = process.env.NEXT_PUBLIC_BYTE_API_KEY || '';
          const response = await fetch(`https://byteapi-two.vercel.app/api/quizzes/${identifier}/`, {
            method: 'DELETE',
            headers: {
              'Accept': 'application/json',
              'Bytekeys': apiKey
            }
          });

          if (!response.ok) {
            throw new Error(`Failed to delete quiz: ${response.status}`);
          }

          fetchQuizzes();
          toast.success('Quiz deleted successfully');
        } catch (error) {
          console.error('Error deleting quiz:', error);
          toast.error('Failed to delete quiz: ' + error.message);
          setIsLoading(false);
        }
      }
    );
  };

  const toggleQuizStatus = async (quiz) => {
    try {
      setIsLoading(true);
      const newStatus = quiz.status === 'active' ? 'expired' : 'active';
      const apiKey = process.env.NEXT_PUBLIC_BYTE_API_KEY;

      const response = await fetch(`https://byteapi-two.vercel.app/api/quizzes/${quiz.course_title}/status?new_status=${newStatus}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Bytekeys': apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to update quiz status: ${response.status}`);
      }

      fetchQuizzes();
      toast.success(`Quiz status changed to ${newStatus}`);
    } catch (error) {
      console.error('Error updating quiz status:', error);
      toast.error('Failed to update quiz status: ' + error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredQuizzes(quizzes);
    } else {
      const filtered = quizzes.filter(quiz =>
        (quiz.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quiz.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quiz.course_title?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredQuizzes(filtered);
    }
    setCurrentPage(1);
  }, [searchTerm, quizzes]);

  const handleJsonImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const fileContent = await file.text();
      const quizData = JSON.parse(fileContent);

      if (!quizData.course_title) {
        toast.error('Invalid quiz format: Missing course_title');
        return;
      }

      createQuiz(quizData);
      toast.success('Quiz imported successfully');
    } catch (error) {
      console.error('Error importing quiz:', error);
      toast.error('Failed to import quiz: ' + error.message);
    } finally {
      event.target.value = '';
    }
  };

  const updateQuiz = async (quizData) => {
    try {
      setIsLoading(true);
      const apiKey = process.env.NEXT_PUBLIC_BYTE_API_KEY;
      const originalCourseTitle = currentQuiz.course_title;

      const questions = quizData.questions || [];
      const dataToSend = {
        course_title: quizData.course_title,
        issuer: quizData.issuer,
        duration: quizData.duration,
        total_questions: questions.length,
        marks_per_question: quizData.marks_per_question || 1,
        questions: questions.map(q => ({
          question: q.question,
          options: q.options,
          answer: q.answer
        })),
        status: quizData.status || 'active',
        purpose: quizData.purpose || 'course',
        custom_tweet: quizData.tweet_format || null
      };

      const endpoint = `https://byteapi-two.vercel.app/api/quizzes/${originalCourseTitle}`;

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Bytekeys': apiKey
        },
        body: JSON.stringify(dataToSend)
      });

      const responseText = await response.text();

      if (!response.ok) {
        let errorMessage = `Failed to update quiz: ${response.status} ${response.statusText}`;
        let errorDetails = '';

        try {
          const errorData = JSON.parse(responseText);
          if (errorData.message) {
            errorMessage = errorData.message;
          }
          if (errorData.error) {
            errorDetails = errorData.error;
          }
        } catch (e) {
          if (responseText) {
            errorDetails = responseText;
          }
        }

        const fullError = errorDetails ? `${errorMessage} - Details: ${errorDetails}` : errorMessage;
        throw new Error(fullError);
      }

      fetchQuizzes();
      setIsEditModalOpen(false);
      toast.success('Quiz updated successfully');
    } catch (error) {
      console.error('Error updating quiz:', error);
      toast.error('Failed to update quiz: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const indexOfLastQuiz = currentPage * quizzesPerPage;
  const indexOfFirstQuiz = indexOfLastQuiz - quizzesPerPage;
  const currentQuizzes = filteredQuizzes.slice(indexOfFirstQuiz, indexOfLastQuiz);
  const totalPages = Math.ceil(filteredQuizzes.length / quizzesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const viewQuiz = (quiz) => {
    const encodedTitle = encodeURIComponent(quiz.course_title);
    router.push(`/quiz/${encodedTitle}`);
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
          <title>Quizzes | ByteOnChain</title>
        </Head>

        <div className={styles.quizzesContainer}>
          <div className={styles.quizzesHeader}>
            <div className={styles.headerContent}>
              <h1 className={styles.quizzesTitle}>Quizzes</h1>
              <p className={styles.quizzesSubtitle}>Manage and create quizzes for your courses</p>
            </div>

            <div className={styles.headerActions}>
              <div className={styles.searchContainer}>
                <div className={styles.searchInputWrapper}>
                  <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search quizzes by title or description..."
                    className={styles.searchInput}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      className={styles.clearSearch}
                      onClick={() => setSearchTerm('')}
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              <button
                className={styles.createButton}
                onClick={() => setIsCreateModalOpen(true)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Create Quiz
              </button>

              <div className={styles.importContainer}>
                <label htmlFor="jsonImport" className={styles.importButton}>
                  <svg width="18" height="18" fill="#000" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1M16 8l-4-4-4 4M12 4v12"/></svg>
                  Import JSON
                </label>
                <input
                  type="file"
                  id="jsonImport"
                  accept=".json"
                  className={styles.fileInput}
                  onChange={handleJsonImport}
                />
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <p>Loading quizzes data...</p>
            </div>
          ) : (
            <>
              <div className={styles.tableWrapper}>
                <div className={styles.tableContainer}>
                  <table className={styles.quizzesTable}>
                    <thead>
                      <tr>
                        <th>Course Title</th>
                        <th>Issuer</th>
                        <th>Duration</th>
                        <th>Questions</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentQuizzes.length > 0 ? (
                        currentQuizzes.map((quiz) => (
                          <tr key={quiz._id || `quiz-${quiz.course_title}`}>
                            <td className={styles.quizTitle}>{quiz.course_title}</td>
                            <td>{quiz.issuer}</td>
                            <td>{quiz.duration}</td>
                            <td className={styles.centered}>{quiz.total_questions}</td>
                            <td>
                              <span className={`${styles.statusBadge} ${styles[quiz.status]}`}>
                                {quiz.status}
                              </span>
                            </td>
                            <td>
                              <div className={styles.actionButtons}>
                                <button
                                  className={styles.viewButton}
                                  onClick={() => viewQuiz(quiz)}
                                  title="View Quiz"
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M2.45825 12C3.73253 7.94288 7.52281 5 12.0004 5C16.4781 5 20.2684 7.94291 21.5426 12C20.2684 16.0571 16.4781 19 12.0005 19C7.52281 19 3.73251 16.0571 2.45825 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </button>
                                <button
                                  className={styles.editButton}
                                  onClick={() => {
                                    setCurrentQuiz(quiz);
                                    setIsEditModalOpen(true);
                                  }}
                                  title="Edit Quiz"
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.2322 5.23223L18.7677 8.76777M16.7322 3.73223C17.7085 2.75592 19.2914 2.75592 20.2677 3.73223C21.244 4.70854 21.244 6.29146 20.2677 7.26777L6.5 21.0355H3V17.4644L16.7322 3.73223Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </button>
                                <button
                                  className={styles.statusButton}
                                  onClick={() => toggleQuizStatus(quiz)}
                                  title={quiz.status === 'active' ? 'Mark as Expired' : 'Mark as Active'}
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </button>
                                <button
                                  className={styles.deleteButton}
                                  onClick={() => deleteQuiz(quiz._id, quiz.course_title)}
                                  title="Delete Quiz"
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </button>
                                <button
                                  className={styles.copyUrlButton}
                                  onClick={() => {
                                    const url = `${window.location.origin}/quiz/${encodeURIComponent(quiz.course_title)}`;
                                    navigator.clipboard.writeText(url);
                                    toast.success('Quiz URL copied to clipboard!');
                                  }}
                                  title="Copy Quiz URL"
                                >
                                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>
                                  Copy URL
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className={styles.noData}>
                            {searchTerm ? 'No quizzes match your search criteria' : 'No quizzes found'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {filteredQuizzes.length > quizzesPerPage && (
                <div className={styles.pagination}>
                  <button
                    className={`${styles.pageButton} ${currentPage === 1 ? styles.disabled : ''}`}
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  <div className={styles.pageNumbers}>
                    {Array.from({ length: totalPages }, (_, i) => {
                      if (
                        i === 0 ||
                        i === totalPages - 1 ||
                        (i >= currentPage - 2 && i <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={`page-${i + 1}`}
                            className={`${styles.pageNumber} ${currentPage === i + 1 ? styles.activePage : ''}`}
                            onClick={() => paginate(i + 1)}
                          >
                            {i + 1}
                          </button>
                        );
                      } else if (
                        (i === 1 && currentPage > 3) ||
                        (i === totalPages - 2 && currentPage < totalPages - 3)
                      ) {
                        return <span key={`ellipsis-${i === 1 ? 'start' : 'end'}`} className={styles.ellipsis}>...</span>;
                      }
                      return null;
                    })}
                  </div>

                  <button
                    className={`${styles.pageButton} ${currentPage === totalPages ? styles.disabled : ''}`}
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              )}

              {isEditModalOpen && currentQuiz && (
                <div className={styles.modalOverlay}>
                  <div className={styles.modalContent}>
                    <div className={styles.modalHeader}>
                      <h3>Edit Quiz</h3>
                      <button
                        className={styles.closeButton}
                        onClick={() => setIsEditModalOpen(false)}
                      >
                        ×
                      </button>
                    </div>
                    <div className={styles.modalBody}>
                      <QuizForm
                        quiz={currentQuiz}
                        onSave={(updatedQuiz) => {
                          updateQuiz(updatedQuiz);
                        }}
                        onCancel={() => setIsEditModalOpen(false)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {isCreateModalOpen && (
                <div className={styles.modalOverlay}>
                  <div className={styles.modalContent}>
                    <div className={styles.modalHeader}>
                      <h3>Create New Quiz</h3>
                      <button
                        className={styles.closeButton}
                        onClick={() => setIsCreateModalOpen(false)}
                      >
                        ×
                      </button>
                    </div>
                    <div className={styles.modalBody}>
                      <QuizForm
                        onSave={createQuiz}
                        onCancel={() => setIsCreateModalOpen(false)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Quizzes;