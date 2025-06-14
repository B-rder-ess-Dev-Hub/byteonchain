import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebarcons';
import Header from '../components/Header';
import Image from 'next/image';
import styles from '../styles/Account.module.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Confetti from 'react-confetti';
import WalletWrapper from '../components/WalletWrapper';
import { fetchData, postData } from '../../utils/api'; 

export const config = {
  unstable_runtimeJS: true
};

export async function getStaticProps() {
  return {
    props: {}
  };
}

const AccountContent = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    sex: '',
    countryCode: '+234', 
  });
  const [isLoading, setIsLoading] = useState(false);  
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [confettiVisible, setConfettiVisible] = useState(false); 
  const [countries, setCountries] = useState([]); 
  const [countryCode, setCountryCode] = useState('+234');
  const [showCoursesModal, setShowCoursesModal] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [courses, setCourses] = useState({});
  const [networks, setNetworks] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    }

    checkWalletConnection();
    fetchCountries(); 
    fetchNetworks(); 
  }, []);

  useEffect(() => {
    if (confettiVisible) {
      const timer = setTimeout(() => {
        setConfettiVisible(false); 
      }, 5000); 
      return () => clearTimeout(timer); 
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

  const onboardingOptions = [
    "BUK",
    "UNN",
    "Uniport",
    "Blockchain Lautech",
    "Let's Build DAO",
    "Regen & ReFi",
  ];

  const fetchUserData = async (address) => {
    try {
      const response = await fetchData(`/api/user/${address}`);
      if (response.status === 'success') {
        const { user } = response;
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
      if (error.response?.status === 404) {
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

  const fetchNetworks = async () => {
    try {
      const response = await fetchData('/api/networks');
      if (response.status === 'success') {
        setNetworks(response.data);
      }
    } catch (error) {
      console.error('Error fetching networks:', error);
      toast.error('Failed to fetch networks. Please try again later.', {
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
        setShowModal(false);
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

    if (!walletAddress) {
      setShowModal(true);
      return;
    }

    setIsLoading(true);  

    try {
      const response = await postData(
        '/api/signup',
        {
          fullname: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          sex: formData.sex,
          course: formData.course,
          country: formData.countryCode,
          wallet_address: walletAddress,
        }
      );

      setIsLoading(false); 
      setFormSubmitted(true);
      toast.success('Account Created Successfully. Welcome!', {
        position: "top-right",
        autoClose: 5000,
      });
      setConfettiVisible(true);  sign-up
      console.log('Signup successful:', response);
    } catch (error) {
      setIsLoading(false);  
      console.error('Error submitting form:', error);
      toast.error(
        error.response?.data?.detail || 'An error occurred during signup. Please try again.',
        {
          position: "top-right",
          autoClose: 5000,
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
      <Header />

      {/* Sidebar and Main Content */}
      <div className={styles.contentWrapper}>
        <div className={styles.sidebarWrapper}>
          <Sidebar />
        </div>

        <div className={styles.mainContent}>
          {isLoadingUser ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <p>Loading account information...</p>
            </div>
          ) : !formSubmitted ? (
            <div className={styles.formCard}>
              <div className={styles.formHeader}>
                <h2>Create Your Account</h2>
                <p>Fill in your details to get started</p>
              </div>
              
              <form onSubmit={handleFormSubmit} className={styles.formContainer}>
                <div className={styles.formGroup}>
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone">Phone Number</label>
                  <div className={styles.phoneContainer}>
                    <select
                      className={styles.countryCode}
                      value={formData.countryCode}
                      onChange={handleCountryChange}
                    >
                      {countries.map((country, index) => (
                        <option key={index} value={country.code}>
                          {country.name} ({country.code})
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="sex">Gender</label>
                    <select 
                      id="sex" 
                      name="sex" 
                      value={formData.sex} 
                      onChange={handleFormChange} 
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="course">Course/Purpose</label>
                    <select 
                      id="course" 
                      name="course" 
                      value={formData.course} 
                      onChange={handleFormChange} 
                      required
                    >
                      <option value="">Select Interest</option>
                      <option value="ui-ux-design">UI/UX Design</option>
                      <option value="web-design-development">Web Design and Development</option>
                      <option value="cyber-security">Cyber Security</option>
                      <option value="solidity">Solidity</option>
                      <option value="arbitrum-stylus">Arbitrum Stylus</option>
                      <option disabled>──────────</option>
                      <option disabled>Onboarding Options</option>
                      {onboardingOptions.map((option, index) => (
                        <option key={index} value={`Onboarding ${option}`}>
                          {option} Onboarding 
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className={styles.buttonLoader}>
                      <span className={styles.spinnerDot}></span>
                      <span className={styles.spinnerDot}></span>
                      <span className={styles.spinnerDot}></span>
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className={styles.profileContainer}>
              <div className={styles.profileHeader}>
                <div className={styles.profileHeaderContent}>
                  <h2 className={styles.accountTitle}>My Account</h2>
                  <p className={styles.accountSubtitle}>Manage your profile and settings</p>
                </div>
              </div>

              <div className={styles.profileCards}>
                <div className={styles.profileCard}>
                  <div className={styles.profileInfo}>
                    <div className={styles.profilePictureContainer}>
                      <Image
                        src="/avatar.png"
                        alt="Profile Picture"
                        className={styles.profilePicture}
                        width={120}
                        height={120}
                      />
                      <button className={styles.changePhotoButton}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M3 16.8V9.2C3 8.0799 3.21799 7.51984 3.40973 7.09202C3.71569 6.71569 4.09202 6.40973 4.51984 6.21799C4.94766 6 5.40774 6 6.2 6H7.25464C7.37758 6 7.43905 6 7.49576 5.9935C7.79166 5.95961 8.05705 5.79559 8.21969 5.54609C8.25086 5.49827 8.27836 5.44328 8.33333 5.33333C8.44329 5.11342 8.49827 5.00346 8.56062 4.90782C8.8859 4.40882 9.41668 4.08078 10.0085 4.01299C10.1219 4 10.2448 4 10.4907 4H13.5093C13.7552 4 13.8781 4 13.9915 4.01299C14.5833 4.08078 15.1141 4.40882 15.4394 4.90782C15.5017 5.00345 15.5567 5.11345 15.6667 5.33333C15.7216 5.44329 15.7491 5.49827 15.7803 5.54609C15.943 5.79559 16.2083 5.95961 16.5042 5.9935C16.561 6 16.6224 6 16.7454 6H17.8C18.9201 6 19.4802 6 19.908 6.21799C20.2843 6.40973 20.5903 6.71569 20.782 7.09202C21 = 7.51984 21 = 8.0799 21 = 9.2V16.8C21 = 17.9201 21 = 18.4802 20.782 18.908C20.5903 19.2843 20.2843 19.5903 19.908 19.782C19.4802 20 18.9201 20 17.8 20H6.2C5.0799 20 4.51984 20 4.09202 19.782C3.71569 19.5903 3.40973 19.2843 3.21799 18.908C3 = 18.4802 3 = 17.9201 3 = 16.8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                    <div className={styles.profileDetails}>
                      <h3 className={styles.userName}>{formData.fullName}</h3>
                      <div className={styles.userMeta}>
                        <div className={styles.metaItem}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 12H16L14 15H10L8 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M5.45 5.11L2 12V18C2 18.5304 2.21071 19.0391 2.58579 19.4142C2.96086 19.7893 3.46957 20 4 20H20C20.5304 20 21.0391 19.7893 21.4142C21.7893 19.0391 22 18.5304 22 18V12L18.55 5.11C18.3844 4.77679 18.1292 4.49637 17.813 4.30028C17.4967 4.10419 17.1321 4.0002 16.76 4H7.24C6.86792 4.0002 6.50326 4.10419 6.18704 4.30028C5.87083 4.49637 5.61558 4.77679 5.45 5.11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span>{formData.email}</span>
                        </div>
                        <div className={styles.metaItem}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 4H9L11 9L8.5 10.5C9.57096 12.6715 11.3285 14.429 13.5 15.5L15 13L20 15V19C20 19.5304 19.7893 20.0391 19.4142 20.4142C19.0391 20.7893 18.5304 21 18 21C14.0993 20.763 10.4202 19.1065 7.65683 16.3432C4.8935 13.5798 3.23705 9.90074 3 6C3 5.46957 3.21071 4.96086 3.58579 4.58579C3.96086 4.21071 4.46957 4 5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span>{formData.phone}</span>
                        </div>
                      </div>
                      <button className={styles.editProfileButton}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142C19.7893 21.0391 20 = 20.5304 20 = 20.6224 20 = 20.7454 20H17.8C18.9201 6 19.4802 6 19.908 6.21799C20.2843 6.40973 20.5903 6.71569 20.782 7.09202C21 = 7.51984 21 = 8.0799 21 = 9.2V16.8C21 = 17.9201 21 = 18.4802 20.782 18.908C20.5903 19.2843 20.2843 19.5903 19.908 19.782C19.4802 20 18.9201 20 17.8 20H6.2C5.0799 20 4.51984 20 4.09202 19.782C3.71569 19.5903 3.40973 19.2843 3.21799 18.908C3 = 18.4802 3 = 17.9201 3 = 16.8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 = 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 = 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 = 4.00001C22.1213 = 4.56262 21.8978 = 5.10219 21.5 = 5.50001L12 = 15L8 = 16L9 = 12L18.5 = 2.50001Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Edit Profile
                      </button>
                    </div>
                  </div>
                </div>

                <div className={styles.statsCard}>
                  <h3 className={styles.cardTitle}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 20V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 20V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M6 20V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    My Stats
                  </h3>
                  <ul className={styles.statsList}>
                    <li className={styles.statItem}>
                      <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Total Courses</span>
                        <span className={styles.statValue}>{Object.keys(courses).length}</span>
                      </div>
                      <button className={styles.viewButton} onClick={() => setShowCoursesModal(true)}>
                        View
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {showCoursesModal && (
            <div className={styles.modalOverlay}>
              <div className={styles.modal}>
                <h3 className={styles.modalTitle}>My Courses</h3>
                <ul className={styles.courseList}>
                  {Object.entries(courses).map(([courseName, attestationUID]) => (
                    <li key={attestationUID} className={styles.courseItem}>
                      <span className={styles.courseName}>{courseName}</span>
                      <a
                        href={`${networks.find(n => n.chainId === attestationChainId)?.baseURL || 'https://arbitrum.easscan.org'}/attestation/view/${attestationUID}`}
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
      </div>
    </div>
  );
};


const Account = () => {
  return (
    <WalletWrapper>
      <AccountContent />
    </WalletWrapper>
  );
};

export default Account;
