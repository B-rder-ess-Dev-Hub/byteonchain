import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/BottomTab.module.css';

const BottomTab = () => {
  const router = useRouter();

  const getTabColor = (path: string) => {
    return router.pathname === path ? '#FBBF24' : 'grey';
  };

  const getIcon = (path: string | any[]) => {
    const isActive = router.pathname === path;
    const baseName = path === '/' ? 'home' : path.slice(1); 
    return `/${baseName}${isActive ? 'active' : 'inactive'}.png`;
  };

  const tabs = [
    { path: '/', label: 'Home' },
    { path: '/chat', label: 'Chat' },
    { path: '/classroom', label: 'Classroom' },
    { path: '/update', label: 'Update' },
    { path: '/account', label: 'Account' },
  ];

  return (
    <div className={styles.container}>
      {tabs.map((tab) => (
        <Link href={tab.path} key={tab.label} className={styles.tab}>
          <div className={styles.tabItem}>
            <img
              src={getIcon(tab.path)}
              alt={tab.label}
              className={styles.icon}
            />
            <span className={styles.label} style={{ color: getTabColor(tab.path) }}>
              {tab.label}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default BottomTab;
