import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "../styles/Classroom.module.css";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Filter from "../../utils/filter";
import eyeIcon from "../../public/eye-icon.png";

const Quiz = () => {
  const [visibleCourses, setVisibleCourses] = useState(4);
  const [userFullName, setUserFullName] = useState("");
  const [walletAddress, setWalletAddress] = useState(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAttestations, setFilteredAttestations] = useState([]);
  const [courseAttestations, setCourseAttestations] = useState([]);

  const fetchWalletAddress = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsWalletConnected(true);
          fetchUserDetails(accounts[0]);
        }
      } catch (error) {
        console.error("Error fetching wallet address:", error);
      }
    } else {
      console.error("MetaMask or a Web3 wallet is not installed.");
    }
  };

  const fetchUserDetails = async (walletAddress) => {
    try {
      const response = await fetch(
        `https://byteapi-two.vercel.app/api/user/${walletAddress}`
      );
      const data = await response.json();
      if (data && data.user) {
        setUserFullName(data.user.fullname);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    fetchWalletAddress();
  }, []);

  return (
    <div className={styles.classroomContainer}>
      <div className={styles.headerWrapper}>
        <Header />
      </div>
      <div className={styles.contentWrapper}>
        <div className={styles.sidebarWrapper}>
          <Sidebar />
        </div>
        <div className={styles.mainContent}>
          <div className={styles.banner}>
            <h1 className={styles.bannerText}>
              Ready to view attestations for courses or onboarding events?
            </h1>
            {isWalletConnected ? (
              <p className={styles.userName}>{userFullName || "Fetching name..."}</p>
            ) : (
              <p className={styles.userName}>
                Please connect your wallet to continue. {" "}
                <button
                  className={styles.connectWalletButton}
                  onClick={fetchWalletAddress}
                >
                  Connect Wallet
                </button>
              </p>
            )}
            <h1 className={styles.bannerText}>
              Search any course or onboarding attestion!
            </h1>
          </div>

          <div className={styles.searchWrapper}>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search for course/onboarding event..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Filter
              searchQuery={searchQuery}
              setFilteredAttestations={setFilteredAttestations}
              setCourseAttestations={setCourseAttestations}
            />
          </div>

          <div style={{ textAlign: "center", margin: "0.5rem 0" }}>
          <h3>
            {filteredAttestations.length > 0
              ? `Total Attestations Found: ${filteredAttestations.length + courseAttestations.length}`
              : courseAttestations.length > 0
              ? `Total Attestations Found: ${courseAttestations.length + filteredAttestations.length}`
              : "Start typing to see attestations"}
          </h3>

          </div>

          {filteredAttestations.length >= 0 && courseAttestations.length >= 0 && (
            <div style={{ overflowX: "auto", maxWidth: "1200px", margin: "0 auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  textAlign: "center",
                  tableLayout: "fixed",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#f2f2f2" }}>
                    <th style={{ padding: "8px", width: "40%" }}>Event</th>
                    <th style={{ padding: "8px", width: "40%" }}>Name</th>
                    <th style={{ padding: "6px", width: "20%" }}>View</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttestations.map((attestation, index) => (
                    <tr
                      key={attestation.id}
                      style={{
                        backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9f9f9",
                        transition: "background-color 0.3s ease",
                      }}
                    >
                      <td style={{ padding: "8px", wordWrap: "break-word" }}>
                        {attestation.decodedData.Onboarding_Event.value}
                      </td>
                      <td style={{ padding: "8px", wordWrap: "break-word" }}>
                        {attestation.decodedData.Name.value}
                      </td>
                      <td style={{ padding: "6px", wordWrap: "break-word" }}>
                        <a
                          href={`https://arbitrum.easscan.org/attestation/view/${attestation.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#1a0dab",
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                        >
                          View
                        </a>
                      </td>
                    </tr>
                  ))}
                  {courseAttestations.map((attestation, index) => (
                    <tr
                      key={attestation.id}
                      style={{
                        backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9f9f9",
                        transition: "background-color 0.3s ease",
                      }}
                    >
                      <td style={{ padding: "8px", wordWrap: "break-word" }}>
                        {attestation.decodedData.Course.value}
                      </td>
                      <td style={{ padding: "8px", wordWrap: "break-word" }}>
                        {attestation.decodedData.Name.value}
                      </td>
                      <td style={{ padding: "6px", wordWrap: "break-word" }}>
                        <a
                          href={`https://arbitrum.easscan.org/attestation/view/${attestation.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#1a0dab",
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                        >
                          View
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
         
          
           
        </div>
      </div>
    </div>
  );
};

export default Quiz;
