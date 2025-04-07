import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminSidebar from '../components/AdminSidebar';
import styles from '../styles/Quizzes.module.css';
import { useToast } from '../components/ToastNotification';

export const getStaticProps = () => {
  return {
    props: {}
  }
}

export const config = {
  unstable_runtimeJS: true
};

const Quizzes = () => {
  const router = useRouter();
  const toast = useToast();
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [quizzesPerPage] = useState(10);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push('/login');
        return;
      }
      setIsAuthenticated(true);
      fetchQuizzes();
    }
  }, [router]);


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

      // More robust data handling
      let quizzesData = [];
      if (data && Array.isArray(data)) {
        quizzesData = data;
      } else if (data && data.quizzes && Array.isArray(data.quizzes)) {
        quizzesData = data.quizzes;
      } else if (data && typeof data === 'object') {
        quizzesData = Object.values(data);
      }

      // Ensure each quiz has a unique ID and all required fields
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

      // Sort quizzes by creation date
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

  // Also update your sanitizeQuizData function to be more robust
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

  const createQuiz = async (quizData) => {
    try {
      setIsLoading(true);

      const apiKey = process.env.NEXT_PUBLIC_BYTE_API_KEY;
      const response = await fetch('https://byteapi-two.vercel.app/api/quizzes/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Bytekeys': apiKey
        },
        body: JSON.stringify(quizData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create quiz: ${response.status}`);
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

  const deleteQuiz = async (quizId, courseTitle) => {
    toast.confirm(
      'Are you sure you want to delete this quiz?',
      async () => {
        try {
          setIsLoading(true);

          const apiKey = process.env.NEXT_PUBLIC_BYTE_API_KEY || '';
          // Use course_title for deletion instead of _id
          const response = await fetch(`https://byteapi-two.vercel.app/api/quizzes/${courseTitle}/`, {
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

      // Ensure questions array exists
      const questions = quizData.questions || [];

      // Prepare the complete data to send to the API
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
        purpose: quizData.purpose || 'course'
      };

      console.log('Updating quiz:', originalCourseTitle);
      console.log('Data being sent:', JSON.stringify(dataToSend, null, 2));


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

      console.log('Response status:', response.status);
      console.log('Response status text:', response.statusText);

      const responseText = await response.text();
      console.log('Response text:', responseText);

      if (!response.ok) {
        let errorMessage = `Failed to update quiz: ${response.status} ${response.statusText}`;
        let errorDetails = '';

        try {
          const errorData = JSON.parse(responseText);
          console.log('Parsed error data:', errorData);

          if (errorData.message) {
            errorMessage = errorData.message;
          }

          if (errorData.error) {
            errorDetails = errorData.error;
          }
        } catch (e) {
          console.log('Failed to parse error response as JSON:', e);
          if (responseText) {
            errorDetails = responseText;
          }
        }

        const fullError = errorDetails ? `${errorMessage} - Details: ${errorDetails}` : errorMessage;
        console.error('Full error information:', fullError);
        throw new Error(fullError);
      }

      fetchQuizzes();
      setIsEditModalOpen(false);
      toast.success('Quiz updated successfully');
    } catch (error) {
      console.error('Error updating quiz:', error);
      console.error('Error stack:', error.stack);
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
    setCurrentQuiz(sanitizeQuizData(quiz));
    setIsViewModalOpen(true);
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
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 16L4 17C4 18.6569 5.34315 20 7 20L17 20C18.6569 20 20 18.6569 20 17L20 16M16 8L12 4M12 4L8 8M12 4L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
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
                        i === 0 || // First page
                        i === totalPages - 1 || // Last page
                        (i >= currentPage - 2 && i <= currentPage + 1) // Pages around current
                      ) {
                        return (
                          <button
                            key={`page-${i + 1}`} // This key is unique based on page number
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
                        // Make sure ellipsis keys are unique
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

              {isViewModalOpen && currentQuiz && (
                <div className={styles.modalOverlay}>
                  <div className={styles.modalContent}>
                    <div className={styles.modalHeader}>
                      <h3>Quiz Details</h3>
                      <button
                        className={styles.closeButton}
                        onClick={() => setIsViewModalOpen(false)}
                      >
                        ×
                      </button>
                    </div>
                    <div className={styles.modalBody}>
                      <div className={styles.quizDetails}>
                        <h2 className={styles.quizDetailTitle}>{currentQuiz.course_title}</h2>
                        {currentQuiz.description && (
                          <p className={styles.quizDetailDescription}>{currentQuiz.description}</p>
                        )}

                        <div className={styles.quizMeta}>
                          <div className={styles.quizMetaItem}>
                            <span className={styles.metaLabel}>Total Questions</span>
                            <span className={styles.metaValue}>{currentQuiz.questions?.length || 0}</span>
                          </div>
                          <div className={styles.quizMetaItem}>
                            <span className={styles.metaLabel}>Issuer</span>
                            <span className={styles.metaValue}>{currentQuiz.issuer}</span>
                          </div>
                          <div className={styles.quizMetaItem}>
                            <span className={styles.metaLabel}>Duration</span>
                            <span className={styles.metaValue}>{currentQuiz.duration}</span>
                          </div>
                          <div className={styles.quizMetaItem}>
                            <span className={styles.metaLabel}>Status</span>
                            <span className={styles.metaValue}>
                              <span className={`${styles.statusBadge} ${styles[currentQuiz.status]}`}>
                                {currentQuiz.status}
                              </span>
                            </span>
                          </div>
                          {currentQuiz.marks_per_question && (
                            <div className={styles.quizMetaItem}>
                              <span className={styles.metaLabel}>Marks Per Question</span>
                              <span className={styles.metaValue}>{currentQuiz.marks_per_question}</span>
                            </div>
                          )}
                          {currentQuiz.purpose && (
                            <div className={styles.quizMetaItem}>
                              <span className={styles.metaLabel}>Purpose</span>
                              <span className={styles.metaValue}>{currentQuiz.purpose}</span>
                            </div>
                          )}
                        </div>

                        <h3 className={styles.questionsTitle}>Questions</h3>
                        {currentQuiz.questions && currentQuiz.questions.length > 0 ? (
                          <div className={styles.questionsList}>
                            {currentQuiz.questions.map((question, index) => (
                              // Use a stable key that doesn't change on each render
                              <div key={`question-${index}`} className={styles.questionItem}>
                                <h4 className={styles.questionText}>
                                  {index + 1}. {question.question}
                                </h4>
                                <div className={styles.answersList}>
                                  {Array.isArray(question.options) ? question.options.map((option, optIndex) => {
                                    // Ensure option is a string to prevent rendering objects directly
                                    const optionText = typeof option === 'string'
                                      ? option
                                      : option === null || option === undefined
                                        ? ''
                                        : JSON.stringify(option);

                                    // Ensure answer comparison works with different types
                                    const isCorrect = typeof question.answer === 'string' && typeof option === 'string'
                                      ? question.answer === option
                                      : JSON.stringify(question.answer) === JSON.stringify(option);

                                    return (
                                      <div
                                        key={`option-${index}-${optIndex}`}
                                        className={`${styles.answerItem} ${isCorrect ? styles.correctAnswer : ''}`}
                                      >
                                        <span className={styles.answerLetter}>
                                          {String.fromCharCode(65 + optIndex)}
                                        </span>
                                        <span className={styles.answerText}>{optionText}</span>
                                        {isCorrect && (
                                          <span className={styles.correctBadge}>Correct</span>
                                        )}
                                      </div>
                                    );
                                  }) : <p>No options available</p>}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className={styles.noQuestions}>No questions added to this quiz yet.</p>
                        )}
                      </div>
                    </div>
                    <div className={styles.modalFooter}>
                      <button
                        className={styles.closeModalButton}
                        onClick={() => setIsViewModalOpen(false)}
                      >
                        Close
                      </button>
                      <button
                        className={styles.editQuizButton}
                        onClick={() => {
                          setIsViewModalOpen(false);
                          setCurrentQuiz(currentQuiz);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M15.2322 5.23223L18.7677 8.76777M16.7322 3.73223C17.7085 2.75592 19.2914 2.75592 20.2677 3.73223C21.244 4.70854 21.244 6.29146 20.2677 7.26777L6.5 21.0355H3V17.4644L16.7322 3.73223Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Edit Quiz
                      </button>
                    </div>
                  </div>
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

              {/* Create Quiz Modal */}
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



// Quiz Form Component
const QuizForm = ({ quiz, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    course_title: quiz?.course_title || '',
    issuer: quiz?.issuer || 'Borderless Developers Programme',
    duration: quiz?.duration || '30 minutes',
    total_questions: quiz?.total_questions || 0,
    marks_per_question: quiz?.marks_per_question || 1,
    questions: quiz?.questions || [],
    status: quiz?.status || 'active',
    purpose: quiz?.purpose || 'course'
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    answer: ''
  });

  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(-1);
  const [customIssuer, setCustomIssuer] = useState(
    quiz?.issuer !== 'Borderless Developers Programme' ? quiz?.issuer : ''
  );
  const [issuerType, setIssuerType] = useState(
    quiz?.issuer === 'Borderless Developers Programme' ? 'default' : 'custom'
  );

  useEffect(() => {

    if (quiz?.questions && quiz.questions.length > 0) {
      setFormData(prev => ({
        ...prev,
        questions: quiz.questions,
        total_questions: quiz.questions.length
      }));
    }
  }, [quiz]);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseInt(value, 10) || 0
    }));
  };

  const handleIssuerTypeChange = (e) => {
    const type = e.target.value;
    setIssuerType(type);

    if (type === 'default') {
      setFormData(prev => ({
        ...prev,
        issuer: 'Borderless Developers Programme'
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        issuer: customIssuer
      }));
    }
  };

  const handleCustomIssuerChange = (e) => {
    const value = e.target.value;
    setCustomIssuer(value);
    setFormData(prev => ({
      ...prev,
      issuer: value
    }));
  };

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setCurrentQuestion(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...currentQuestion.options];
    updatedOptions[index] = value;


    if (currentQuestion.answer === currentQuestion.options[index]) {
      setCurrentQuestion(prev => ({
        ...prev,
        options: updatedOptions,
        answer: value
      }));
    } else {
      setCurrentQuestion(prev => ({
        ...prev,
        options: updatedOptions
      }));
    }
  };

  const handleCorrectAnswerChange = (index) => {
    setCurrentQuestion(prev => ({
      ...prev,
      answer: prev.options[index]
    }));
  };

  const addQuestion = () => {
    if (editingQuestionIndex >= 0) {
      // Update existing question
      const updatedQuestions = [...formData.questions];
      updatedQuestions[editingQuestionIndex] = currentQuestion;
      setFormData(prev => ({
        ...prev,
        questions: updatedQuestions,
        total_questions: updatedQuestions.length
      }));
      setEditingQuestionIndex(-1);
    } else {
      // Add new question
      const updatedQuestions = [...formData.questions, currentQuestion];
      setFormData(prev => ({
        ...prev,
        questions: updatedQuestions,
        total_questions: updatedQuestions.length
      }));
    }

    setCurrentQuestion({
      question: '',
      options: ['', '', '', ''],
      answer: ''
    });
    setIsAddingQuestion(false);
  };

  const editQuestion = (index) => {
    setCurrentQuestion(formData.questions[index]);
    setEditingQuestionIndex(index);
    setIsAddingQuestion(true);
  };

  const removeQuestion = (index) => {
    const updatedQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      questions: updatedQuestions,
      total_questions: updatedQuestions.length
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.quizForm}>
      <div className={styles.formGroup}>
        <label>Course Title</label>
        <input
          type="text"
          name="course_title"
          value={formData.course_title}
          onChange={handleChange}
          required
          placeholder="Enter course title"
        />
      </div>

      <div className={styles.formGroup}>
        <label>Issuer</label>
        <div className={styles.issuerSelection}>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="issuerType"
                value="default"
                checked={issuerType === 'default'}
                onChange={handleIssuerTypeChange}
              />
              Borderless Developers Programme
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="issuerType"
                value="custom"
                checked={issuerType === 'custom'}
                onChange={handleIssuerTypeChange}
              />
              Custom Issuer
            </label>
          </div>

          {issuerType === 'custom' && (
            <input
              type="text"
              value={customIssuer}
              onChange={handleCustomIssuerChange}
              placeholder="Enter custom issuer name"
              className={styles.customIssuerInput}
              required={issuerType === 'custom'}
            />
          )}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label>Duration</label>
        <input
          type="text"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          required
          placeholder="e.g., 30 minutes"
        />
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Marks Per Question</label>
          <input
            type="number"
            name="marks_per_question"
            value={formData.marks_per_question}
            onChange={handleNumberChange}
            required
            min="1"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Purpose</label>
          <select
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            required
          >
            <option value="course">Course</option>
            <option value="onboarding">Onboarding</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="active">Active</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      <div className={styles.questionsSection}>
        <div className={styles.questionsSectionHeader}>
          <h3>Questions ({formData.questions.length})</h3>
          {!isAddingQuestion && (
            <button
              type="button"
              className={styles.addQuestionButton}
              onClick={() => setIsAddingQuestion(true)}
            >
              Add Question
            </button>
          )}
        </div>

        {isAddingQuestion ? (
          <div className={styles.questionForm}>
            <div className={styles.formGroup}>
              <label>Question Text</label>
              <input
                type="text"
                name="question"
                value={currentQuestion.question}
                onChange={handleQuestionChange}
                required
                placeholder="Enter question text"
              />
            </div>

            <div className={styles.optionsGroup}>
              <label>Options</label>
              {currentQuestion.options.map((option, index) => (
                <div key={index} className={styles.optionItem}>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    required
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                  />
                  <label className={styles.correctLabel}>
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={currentQuestion.answer === option}
                      onChange={() => handleCorrectAnswerChange(index)}
                    />
                    Correct
                  </label>
                </div>
              ))}
            </div>

            <div className={styles.questionFormActions}>
              <button
                type="button"
                className={styles.removeQuestionButton}
                onClick={() => {
                  setIsAddingQuestion(false);
                  setEditingQuestionIndex(-1);
                  setCurrentQuestion({
                    question: '',
                    options: ['', '', '', ''],
                    answer: ''
                  });
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.addQuestionButton}
                onClick={addQuestion}
              >
                {editingQuestionIndex >= 0 ? 'Update' : 'Add'} Question
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.questionsList}>
            {formData.questions.length > 0 ? (
              formData.questions.map((question, qIndex) => (
                <div key={`question-form-${qIndex}`}>
                  <div className={styles.questionContent}>
                    <h4 className={styles.questionText}>
                      {qIndex + 1}. {question.question}
                    </h4>
                    <div className={styles.questionOptions}>
                      {question.options.map((option, optIndex) => (
                        <div key={`option-form-${qIndex}-${optIndex}`}>
                          <span className={styles.optionLetter}>
                            {String.fromCharCode(65 + optIndex)}
                          </span>
                          <span className={styles.optionText}>{option}</span>
                          {question.answer === option && (
                            <span className={styles.correctBadge}>Correct</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={styles.questionActions}>
                    <button
                      type="button"
                      className={styles.editQuestionButton}
                      onClick={() => editQuestion(index)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className={styles.removeQuestionButton}
                      onClick={() => removeQuestion(index)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.noQuestionsMessage}>
                No questions added yet. Click "Add Question" to create your first question.
              </p>
            )}
          </div>
        )}
      </div>

      <div className={styles.formActions}>
        <button type="button" onClick={onCancel} className={styles.cancelButton}>
          Cancel
        </button>
        <button
          type="submit"
          className={styles.saveButton}
          disabled={formData.questions.length === 0}
        >
          Create Quiz
        </button>
      </div>
    </form>
  );
};




export default Quizzes;