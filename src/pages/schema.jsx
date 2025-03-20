import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import styles from "../styles/Schema.module.css";
import fetchFilteredAttestations from "../../utils/filter"
import Filter from "../../utils/filter";
import WalletWrapper from '../components/WalletWrapper';


const SchemaContent = () => {
  const schemaUID = '0xadc627b3baae8680c1e7d1f080ea5e50738e7efcc93e95a35269e6841116fffe';
  return (
    <div className={styles.schemaPage}>
      {/* Header Component */}
      <div className={styles.headerWrapper}>
        <Header />
      </div>

      {/* Sidebar and Main Content */}
      <div className={styles.contentWrapper}>
        <div className={styles.sidebarWrapper}>
          <Sidebar />
        </div>

        {/* Main Schema Content */}
        <div className={styles.mainContent}>
          <h1 className={styles.pageTitle}>Schema Information</h1>
          <p className={styles.pageDescription}>
            Below are the schema links for our Course and Onboarding process.
          </p>

          <div className={styles.schemasContainer}>
            {/* Course Schema */}
            <div className={styles.schemaCard}>
              <h2 className={styles.schemaTitle}>Course Schema</h2>
              <p className={styles.schemaDescription}>
                This schema defines the structure for all course-related data.
              </p>
              <a
                href="https://arbitrum.easscan.org/schema/view/0xe9a059a2f6cf3a119b0f8c1d5dc022711a447c7fbb94baf6ce670ca2e6faeaeb"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.schemaButton}
              >
                View Schema
              </a>
            </div>

            {/* Onboarding Schema */}
            <div className={styles.schemaCard}>
              <h2 className={styles.schemaTitle}>Onboarding Schema</h2>
              <p className={styles.schemaDescription}>
                This schema details the onboarding process and associated data.
              </p>
              <a
                href="https://arbitrum.easscan.org/schema/view/0xadc627b3baae8680c1e7d1f080ea5e50738e7efcc93e95a35269e6841116fffe"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.schemaButton}
              >
                View Schema
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Schema = () => {
  return (
    <WalletWrapper>
      <SchemaContent />
    </WalletWrapper>
  );
};

export default Schema;