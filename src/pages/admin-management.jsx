import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminSidebar from '../components/AdminSidebar';
import styles from '../styles/AdminManagement.module.css';
import { useToast } from '../components/ToastNotification';
import axios from 'axios';

// Add these exports to disable static generation for this page
export const config = {
  unstable_runtimeJS: true
};

export async function getStaticProps() {
  return {
    props: {}
  };
}

const AdminManagement = () => {
  const router = useRouter();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  
  const [formData, setFormData] = useState({
    email: '',
    access_type: 'event',
    status: 'active'
  });

  // API configuration
  const API_BASE_URL = 'https://byteapi-two.vercel.app/api';
  const API_KEY = process.env.NEXT_PUBLIC_BYTE_API_KEY;

  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Bytekeys': API_KEY
    },
    timeout: 15000, 
    validateStatus: function (status) {
      return status >= 200 && status < 500; 
    }
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/login');
      return;
    }
    
    setIsAuthenticated(true);
    fetchAdmins();
  }, [router]);

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const adminEmail = localStorage.getItem('adminEmail');
      
      const response = await api.get('/admin/all');
      console.log('Admins API response:', response.data);
      
      const adminsList = response.data.admins || [];
      setAdmins(adminsList);
      
      if (adminEmail) {
        const loggedInAdmin = adminsList.find(admin => admin.email === adminEmail);
        if (loggedInAdmin) {
          setCurrentAdmin(loggedInAdmin);
          console.log('Current admin:', loggedInAdmin);
        }
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
      toast.error('Failed to load admins');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    
    // Check if current admin has master status
    if (!currentAdmin || currentAdmin.status !== 'master') {
      toast.error('Only master admins can add new admins');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await api.post('/admin/signup', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      toast.success('Admin added successfully');
      setFormData({
        email: '',
        access_type: 'event',
        status: 'active'
      });
      fetchAdmins();
    } catch (error) {
      console.error('Error adding admin:', error);
      toast.error('Failed to add admin: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAdmin = async (id) => {
    if (!currentAdmin || currentAdmin.status !== 'master') {
      toast.error('Only master admins can delete admins');
      return;
    }
    
    toast.confirm(
      'Are you sure you want to delete this admin?',
      async () => {
        try {
          setIsLoading(true);
          const token = localStorage.getItem('adminToken');
          await api.delete(`/admin/delete/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          toast.success('Admin deleted successfully');
          fetchAdmins();
        } catch (error) {
          console.error('Error deleting admin:', error);
          toast.error('Failed to delete admin');
        } finally {
          setIsLoading(false);
        }
      }
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
          <title>Admin Management | ByteOnChain</title>
        </Head>
        
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <h1 className={styles.title}>Admin Management</h1>
              <p className={styles.subtitle}>Add, view, and manage admin accounts</p>
              {currentAdmin && currentAdmin.status !== 'master' && (
                <div className={styles.warningBanner}>
                  Note: Only master admins can add or delete admin accounts
                </div>
              )}
            </div>
          </div>
          
          <div className={styles.contentWrapper}>
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Add New Admin</h2>
              <form onSubmit={handleAddAdmin} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="admin@example.com"
                  />
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="access_type">Access Type</label>
                    <select
                      id="access_type"
                      name="access_type"
                      value={formData.access_type}
                      onChange={handleChange}
                      required
                    >
                      <option value="event">Event</option>
                      <option value="full">Full</option>
                      <option value="master">Master</option>
                    </select>
                    <p className={styles.formHint}>Determines what the admin can access</p>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="status">Status</label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      required
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                
                <div className={styles.formActions}>
                  <button 
                    type="submit" 
                    className={styles.submitButton} 
                    disabled={isLoading || (currentAdmin && currentAdmin.status !== 'master')}
                  >
                    {isLoading ? 'Adding...' : 'Add Admin'}
                  </button>
                  {currentAdmin && currentAdmin.status !== 'master' && (
                    <p className={styles.permissionNote}>You need master status to add admins</p>
                  )}
                </div>
              </form>
            </div>
            
            <div className={styles.contentSection}>
              <h2 className={styles.sectionTitle}>Manage Admins</h2>
              {isLoading ? (
                <div className={styles.loadingContainer}>
                  <div className={styles.loadingSpinner}></div>
                  <p>Loading admins...</p>
                </div>
              ) : (
                <div className={styles.adminList}>
                  {admins.length > 0 ? (
                    <table className={styles.adminTable}>
                      <thead>
                        <tr>
                          <th>Email</th>
                          <th>Access Type</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {admins.map((admin) => (
                          <tr key={admin._id}>
                            <td>{admin.email}</td>
                            <td>
                              <span className={`${styles.badge} ${styles[admin.access_type]}`}>
                                {admin.access_type}
                              </span>
                            </td>
                            <td>
                              <span className={`${styles.statusBadge} ${styles[admin.status]}`}>
                                {admin.status}
                              </span>
                            </td>
                            <td>
                              {currentAdmin && currentAdmin.status === 'master' ? (
                                <button 
                                  className={styles.deleteButton}
                                  onClick={() => deleteAdmin(admin._id)}
                                >
                                  Delete
                                </button>
                              ) : (
                                <button 
                                  className={`${styles.deleteButton} ${styles.disabledButton}`}
                                  disabled
                                  title="Only master admins can delete"
                                >
                                  Delete
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className={styles.noContent}>
                      <p>No admins found. Add your first admin above.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminManagement;