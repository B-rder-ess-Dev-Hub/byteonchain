import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from '../styles/Sidebar.module.css';
import avatar from '../../public/avatar.png';

const Sidebar = () => {
  const router = useRouter();

  const isActiveTab = (path: string) => {
    return router.pathname === path;
  };

  const tabs = [
    { path: '/', label: 'Home' },
    { path: '/chat', label: 'Chat' },
    { path: '/classroom', label: 'Classroom' },
    { path: '/update', label: 'Update' },
    { path: '/account', label: 'Account' },
  ];

  return (
    <div className={styles.sidebar}>
  {tabs.map((tab) => (
  <Link href={tab.path} key={tab.label}>
    <div
      className={`${styles.tabItem} ${
        isActiveTab(tab.path) ? styles.activeTab : ''
      }`}
    >
      <img
        src={`/${tab.label.toLowerCase()}${
          isActiveTab(tab.path) ? 'active' : 'inactive'
        }.png`}
        alt={`${tab.label} Icon`}
        className={styles.icon}
      />
      <span className={`${styles.label} ${isActiveTab(tab.path) ? styles.activeLabel : ''}`}>
        {tab.label}
      </span>
    </div>
  </Link>
))}




<hr className={styles.dottedLine} />
<div className={styles.userProfile}>
  <div className={styles.profileTop}>
    <div className={styles.avatarContainer}>
      <Image
        src={avatar}
        alt="User Avatar"
        width={40}
        height={40}
        className={styles.avatar}
      />
    </div>
    <div className={styles.userInfo}>
      <span className={styles.username}>John Doe</span>
      <span className={styles.role}>Student</span>
    </div>
  </div>
</div>


    </div>
  );
};

export default Sidebar;
