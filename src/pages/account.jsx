import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Image from 'next/image';
import styles from '../styles/Account.module.css';

const Account = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    occupation: '',
    sex: '',
    age: '',
    course: '',
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className={styles.accountContainer}>
      {/* Header Component */}
      <div className={styles.headerWrapper}>
        <Header />
      </div>

      {/* Sidebar and Main Content */}
      <div className={styles.contentWrapper}>
        <Sidebar />

        <div className={styles.mainContent}>
          {!formSubmitted ? (
            <form onSubmit={handleFormSubmit} className={styles.formContainer}>
              <h2>Fill in your details</h2>

              {/* Full Name */}
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleFormChange}
                required
              />

              {/* Email */}
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleFormChange}
                required
              />

              {/* Phone */}
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleFormChange}
                required
              />

              {/* Occupation */}
              <input
                type="text"
                name="occupation"
                placeholder="Occupation"
                value={formData.occupation}
                onChange={handleFormChange}
                required
              />

              {/* Sex */}
              <select
                name="sex"
                value={formData.sex}
                onChange={handleFormChange}
                required
              >
                <option value="">Select Sex</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>

              {/* Age */}
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleFormChange}
                required
              />

              {/* Select Course */}
              <select
                name="course"
                value={formData.course}
                onChange={handleFormChange}
                required
              >
                <option value="">Select Course</option>
                <option value="ui-ux-design">UI/UX Design</option>
                <option value="web-design-development">Web Design and Development</option>
                <option value="cyber-security">Cyber Security</option>
                <option value="embedded-systems-design">Embedded Systems Design</option>
                <option value="solidity">Solidity</option>
                <option value="arbitrum-stylus">Arbitrum Stylus</option>
              </select>

              <button type="submit">Submit</button>
            </form>
          ) : (
            // Display Account Details After Submission
            <div className={styles.accountSection}>
              <div className={styles.accountHeader}>
                <h2 className={styles.accountTitle}>My Account</h2>
                <p className={styles.accountSubtitle}>Manage your profile and settings</p>
              </div>

              {/* Account Details */}
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

              {/* Stats Section */}
              <div className={styles.stats}>
                <h3 className={styles.statsTitle}>My Stats</h3>
                <ul className={styles.statsList}>
                  <li className={styles.statItem}>
                    <span>Total Courses Taken</span>
                    <div className={styles.coursesContainer}>
                      <span className={styles.statValue}>15</span>
                      <button className={styles.viewButton}>View</button>
                    </div>
                  </li>
                  <li className={styles.statItem}>
                    <span>Certificates</span>
                    <div className={styles.certificatesContainer}>
                      <span className={styles.statValue}>8</span>
                      <button className={styles.viewButton}>View</button>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Settings Section */}
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
    </div>
  );
};

export default Account;