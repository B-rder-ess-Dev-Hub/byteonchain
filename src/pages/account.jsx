import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Image from 'next/image';
import styles from '../styles/Account.module.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Confetti from 'react-confetti';

const Account = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    sex: '',
    countryCode: '+234', // Default country code
  });
  const [isLoading, setIsLoading] = useState(false);  // For handling the loading state of the submit button
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [confettiVisible, setConfettiVisible] = useState(false); // To control confetti visibility
  const [countries, setCountries] = useState([]); // State for country list
  const [countryCode, setCountryCode] = useState('+234'); // Default country code
  const [showCoursesModal, setShowCoursesModal] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [courses, setCourses] = useState({});
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Client-side only code
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    }

    checkWalletConnection();
    fetchCountries(); // Fetch the countries and country codes
  }, []);

  useEffect(() => {
    if (confettiVisible) {
      const timer = setTimeout(() => {
        setConfettiVisible(false);  // Stop confetti after 5 seconds
      }, 5000);  // 5000ms = 5 seconds
      return () => clearTimeout(timer);  // Cleanup timeout on unmount or state change
    }
  }, [confettiVisible]);

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          await fetchUserData(accounts[0]);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      } finally {
        setIsLoadingUser(false);
      }
    } else {
      setIsLoadingUser(false);
    }
  }

  const fetchUserData = async (address) => {
    try {
      const response = await axios.get(`https://byteapi-two.vercel.app/api/user/${address}`);
      if (response.data.status === 'success') {
        const { user } = response.data;
        setFormData({
          fullName: user.fullname,
          email: user.email,
          phone: user.phone,
          sex: user.sex,
          country: user.country,
          course: user.course,
        });

        if (user.course_id) {
          setCourses(user.course_id);
        }

        setFormSubmitted(true);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setFormSubmitted(false);
      } else {
        console.error('Error fetching user data:', error);
        toast.error('Failed to fetch user data. Please try again.', { position: "top-right", autoClose: 5000 });
      }
    }
    setIsLoading(false);
  };

  const fetchCountries = async () => {
    try {
      const response = await axios.get('https://restcountries.com/v3.1/all');
      const countriesData = response.data.map((country) => ({
        name: country.name.common,
        code: country.idd?.root + (country.idd?.suffixes?.[0] || ''),
      }));
      
      // Sort countries alphabetically by name
      countriesData.sort((a, b) => a.name.localeCompare(b.name));
      
      setCountries(countriesData);
    } catch (error) {
      console.error('Error fetching countries:', error);
      toast.error('Failed to fetch countries. Please try again later.', {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
        setShowModal(false); // Hide modal after connecting
        // Check if the wallet address exists in the database
        fetchUserData(accounts[0]);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      alert('MetaMask is not installed. Please install MetaMask to proceed.');
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCountryChange = (e) => {
    const selectedCountryCode = e.target.value;
    setFormData({
      ...formData,
      countryCode: selectedCountryCode,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    // Check if wallet is connected
    if (!walletAddress) {
      setShowModal(true);
      return;
    }

    setIsLoading(true);  // Start loading state

    try {
      const response = await axios.post(
        'https://byteapi-two.vercel.app/api/signup', // Ensure this is the correct API URL
        {
          fullname: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          sex: formData.sex,
          course: formData.course,
          country:formData.countryCode,
          wallet_address: walletAddress,
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,  // Allow cookies if needed
        }
      );

      setIsLoading(false);  // Stop loading state
      setFormSubmitted(true);
      toast.success('Account Created Successfully. Welcome!', {
        position: "top-right",  // Use a simple string value for position
        autoClose: 5000,  // Optionally, set a duration
      });
      setConfettiVisible(true);  // Show confetti on successful sign-up
      console.log('Signup successful:', response.data);
    } catch (error) {
      setIsLoading(false);  // Stop loading state
      console.error('Error submitting form:', error);
      toast.error(
        error.response?.data?.detail || 'An error occurred during signup. Please try again.',
        {
          position: "top-right",  // Use a simple string value for position
          autoClose: 5000,  // Optionally, set a duration
        }
      );
    }
  };
  return (
    <div className={styles.accountContainer}>
      {/* Show Confetti on Successful Sign-up for 5 seconds */}
      {formSubmitted && confettiVisible && windowWidth && windowHeight && (
        <Confetti
          width={windowWidth}
          height={windowHeight}
        />
      )}

      {/* Header Component */}
      <div className={styles.headerWrapper}>
        <Header />
      </div>

      {/* Sidebar and Main Content */}
      <div className={styles.contentWrapper}>
        <Sidebar />

        <div className={styles.mainContent}>
        {isLoadingUser ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <p>Loading account information...</p>
            </div>
          ) : !formSubmitted ? (
            <form onSubmit={handleFormSubmit} className={styles.formContainer}>
              <h2>Fill in your details</h2>

              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleFormChange}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleFormChange}
                required
              />

              <div className={styles.phoneContainer}>
                <select 
                  className={styles.countryCode} 
                  value={formData.countryCode}
                  onChange={handleCountryChange} // Handle country change
                >
                  {countries.map((country, index) => (
                    <option key={index} value={country.code}>
                      {country.name} ({country.code})
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <select name="sex" value={formData.sex} onChange={handleFormChange} required>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>

              <select name="course" value={formData.course || ''} onChange={handleFormChange} required>
                <option value="">Select Course</option>
                <option value="ui-ux-design">UI/UX Design</option>
                <option value="web-design-development">Web Design and Development</option>
                <option value="cyber-security">Cyber Security</option>
                <option value="data-analysis">Data Analysis</option>
                <option value="solidity">Solidity</option>
                <option value="arbitrum-stylus">Arbitrum Stylus</option>
              </select>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Sign Up'}
              </button>
            </form>
          ) : (
            <div className={styles.accountSection}>
              <div className={styles.accountHeader}>
                <h2 className={styles.accountTitle}>My Account</h2>
                <p className={styles.accountSubtitle}>Manage your profile and settings</p>
              </div>

              <div className={styles.accountDetails}>
                <div className={styles.profilePictureContainer}>
                  <Image
                    src="/avatar.png"
                    alt="Profile Picture"
                    className={styles.profilePicture}
                    width={120}
                    height={120}
                  />
                </div>

                <div className={styles.accountInfo}>
                  <h3 className={styles.userName}>{formData.fullName}</h3>
                  <p className={styles.userEmail}>{formData.email}</p>
                  <button className={styles.editProfileButton}>Edit Profile</button>
                </div>
              </div>

              <div className={styles.stats}>
                <h3 className={styles.statsTitle}>My Stats</h3>
                <ul className={styles.statsList}>
                  <li className={styles.statItem}>
                    <span>Total Courses Taken</span>
                    <div className={styles.coursesContainer}>
                      <span className={styles.statValue}>{Object.keys(courses).length}</span>
                      <button className={styles.viewButton} onClick={() => setShowCoursesModal(true)}>View</button>
                    </div>
                  </li>
                  <li className={styles.statItem}>
                    <span>Certificates</span>
                    <div className={styles.coursesContainer}>
                      <span className={styles.statValue}>0</span>
                      <button className={styles.viewButton}>View</button>
                    </div>
                  </li>
                </ul>
              </div>

              <div className={styles.settings}>
                <h3 className={styles.settingsTitle}>Account Settings</h3>
                <ul className={styles.settingsList}>
                  <li className={styles.settingItem}>
                    <span>Notification Settings</span>
                    <button className={styles.settingButton}>Edit</button>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCoursesModal && (
  <div className={styles.modalOverlay}>
    <div className={styles.modal}>
      <h3 className={styles.modalTitle}>My Courses</h3>
      <ul className={styles.courseList}>
        {Object.entries(courses).map(([courseName, attestationUID]) => (
          <li key={attestationUID} className={styles.courseItem}>
            <span className={styles.courseName}>{courseName}</span>
            <a
              href={`https://arbitrum.easscan.org/attestation/view/${attestationUID}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.attestationButton}
            >
              View Attestation
            </a>
          </li>
        ))}
      </ul>
      <button className={styles.modalClose} onClick={() => setShowCoursesModal(false)}>
        Close
      </button>
    </div>
  </div>
)}

      {/* Wallet Connection Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Connect Your Wallet</h3>
            <p>You need to connect your wallet to proceed.</p>
            <button className={styles.modalButton} onClick={connectWallet}>Connect Wallet</button>
            <button className={styles.modalClose} onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account; 