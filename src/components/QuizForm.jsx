import React, { useState, useEffect } from 'react';
import styles from '../styles/Quizzes.module.css';



const QuizForm = ({ quiz, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      course_title: quiz?.course_title || '',
      issuer: quiz?.issuer || 'Borderless Developers Programme',
      duration: quiz?.duration || '30 minutes',
      total_questions: quiz?.total_questions || 0,
      marks_per_question: quiz?.marks_per_question || 1,
      questions: Array.isArray(quiz?.questions) ? quiz.questions.map(q => ({
        question: typeof q.question === 'string' ? q.question : String(q.question || ''),
        options: Array.isArray(q.options) ? q.options.map(opt =>
          typeof opt === 'string' ? opt : String(opt || '')
        ) : ['', '', '', ''],
        answer: typeof q.answer === 'string' ? q.answer : String(q.answer || '')
      })) : [],
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

export default QuizForm;