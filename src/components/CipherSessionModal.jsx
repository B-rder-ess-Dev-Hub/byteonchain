import React, { useState, useEffect } from 'react';
import styles from '../styles/CipherSessionModal.module.css';

const CipherSessionModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    fullname: '',
    course: '',
    sex: '',
    age: '',
    state: '',
    phone: '',
    email: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  
  // Brand color for styling elements
  const brandColor = '#fab800';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullname.trim()) newErrors.fullname = 'Full name is required';
    if (!formData.course.trim()) newErrors.course = 'Course is required';
    if (!formData.sex) newErrors.sex = 'Sex is required';
    if (!formData.age.trim()) newErrors.age = 'Age is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      setSubmitError('');
      
      try {
        // API endpoint for cipher session registration
        const apiEndpoint = 'https://byteapi-two.vercel.app/api/ciphersession/';
        
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            "Bytekeys": process.env.NEXT_PUBLIC_BYTE_API_KEY || ''
          },
          body: JSON.stringify({
            fullname: formData.fullname,
            age: parseInt(formData.age, 10),
            sex: formData.sex,
            state: formData.state,
            course: formData.course,
            phone: formData.phone,
            email: formData.email
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Registration failed: ${response.status}`);
        }
        
        setIsSuccess(true);
        setTimeout(() => {
          onClose();
          // Reset form after closing
          setFormData({
            fullname: '',
            course: '',
            sex: '',
            age: '',
            state: '',
            phone: '',
            email: ''
          });
          setIsSuccess(false);
        }, 3000);
      } catch (error) {
        console.error('Error submitting form:', error);
        setSubmitError(error.message || 'Failed to submit. Please try again later.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 500); // Match this with the animation duration
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modalContent} ${isClosing ? styles.modalClosing : ''}`}>
        <button className={styles.closeButton} onClick={handleClose}>
          Close
        </button>
        
        <div className={styles.modalHeader}>
          <h2>July Cipher Session Registration</h2>
          <div className={styles.headerDecoration}></div>
        </div>
        
        {isSuccess ? (
          <div className={styles.successMessage}>
            <div className={styles.successIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="100" strokeDashoffset="100">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3>Registration Successful!</h3>
            <p>Thank you for registering for the July Cipher Session. We'll be in touch soon with more details about the event!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="fullname">Full Name</label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                className={errors.fullname ? styles.inputError : ''}
                placeholder="Enter your full name"
              />
              {errors.fullname && <span className={styles.errorText}>{errors.fullname}</span>}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="course">Course</label>
              <select
                id="course"
                name="course"
                value={formData.course}
                onChange={handleChange}
                className={errors.course ? styles.inputError : ''}
              >
                <option value="">Select a course</option>
                <option value="Web Design and Development">Web Design and Development</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Solidity">Solidity</option>
              </select>
              {errors.course && <span className={styles.errorText}>{errors.course}</span>}
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="sex">Sex</label>
                <select
                  id="sex"
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  className={errors.sex ? styles.inputError : ''}
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                {errors.sex && <span className={styles.errorText}>{errors.sex}</span>}
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="age">Age</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className={errors.age ? styles.inputError : ''}
                  placeholder="Your age"
                  min="1"
                  max="120"
                />
                {errors.age && <span className={styles.errorText}>{errors.age}</span>}
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="state">State</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={errors.state ? styles.inputError : ''}
                placeholder="Your state of residence"
              />
              {errors.state && <span className={styles.errorText}>{errors.state}</span>}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={errors.phone ? styles.inputError : ''}
                placeholder="Your phone number"
              />
              {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? styles.inputError : ''}
                placeholder="Your email address"
              />
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
            </div>
            
            {submitError && <div className={styles.submitError}>{submitError}</div>}
            
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isSubmitting}
              style={{ background: isSubmitting ? `linear-gradient(135deg, ${brandColor}, #ff9d00)` : '' }}
            >
              {isSubmitting ? (
                <>
                  <span className={styles.spinner}></span>
                  <span style={{ marginLeft: '10px' }}>Processing...</span>
                </>
              ) : (
                'Register Now'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CipherSessionModal;