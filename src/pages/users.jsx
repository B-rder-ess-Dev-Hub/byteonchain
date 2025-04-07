import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminSidebar from '../components/AdminSidebar';
import styles from '../styles/Users.module.css';
import { fetchData, putData } from '../../utils/api'; 
import { useToast } from '../components/ToastNotification';
import axios from 'axios';




const Users = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  const toast = useToast();
  
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAttestationModalOpen, setIsAttestationModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/login');
      return;
    }
    
    setIsAuthenticated(true);
    fetchUsers();
  }, [router]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await fetchData('/api/users/all');
      
      if (data && Array.isArray(data.users)) {
        
        const sortedUsers = data.users.sort((a, b) => {
          return b._id.localeCompare(a._id);
        });
        
        setUsers(sortedUsers);
        setFilteredUsers(sortedUsers);
      } else if (data && Array.isArray(data)) {
        const sortedUsers = data.sort((a, b) => {
          return b._id.localeCompare(a._id);
        });
        
        setUsers(sortedUsers);
        setFilteredUsers(sortedUsers);
      } else {
        console.error('Unexpected data format:', data);
        setUsers([]);
        setFilteredUsers([]);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      setFilteredUsers([]);
      setIsLoading(false);
    }
  };

 
  const saveUserChanges = async (updatedUser) => {
    try {
      setIsLoading(true);
      
      const userData = {
        fullname: updatedUser.fullname,
        email: updatedUser.email,
        phone: updatedUser.phone,
        sex: updatedUser.sex,
        course: updatedUser.course || '', 
        countryCode: updatedUser.countryCode || '',
        course_id: updatedUser.course_id || {},
        quiz_attempts: updatedUser.quiz_attempts || 0
      };
      
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://byteapi-two.vercel.app';
      const API_KEY = process.env.NEXT_PUBLIC_BYTE_API_KEY || '';
      
      await axios.put(
        `${API_URL}/api/api/user/${updatedUser.wallet_address}`, 
        userData,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Bytekeys': API_KEY
          }
        }
      );
      
      const updatedUsers = users.map(user => 
        user._id === updatedUser._id ? updatedUser : user
      );
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setIsEditModalOpen(false);
      
      toast.success('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user: ' + (error.response?.data?.message || error.message));
    } finally {
     
      setIsLoading(false);
    }
  };

  const updateCourseIdInDatabase = async (userId, courseData) => {
    try {
      // Use the API utility with the correct endpoint
      await fetchData(`/api/api/user/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({ course_id: courseData })
      });
      
      console.log("Course ID updated successfully!");
    } catch (error) {
      console.error('Error updating course_id:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm) ||
        user.course?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
    setCurrentPage(1);
  }, [searchTerm, users]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const formatWalletAddress = (address) => {
    if (!address) return 'N/A';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };


const viewAttestation = (user) => {
  if (user.course_id && Object.keys(user.course_id).length > 0) {
    setCurrentUser(user);
    setIsAttestationModalOpen(true);
  } else {
    toast.warning('This user does not have any attestations');
  }
};
  const openEditModal = (user) => {
    setCurrentUser(user);
    setIsEditModalOpen(true);
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Verifying authentication...</p>
      </div>
    );
  }


  const UserEditForm = ({ user, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      fullname: user.fullname || '',
      email: user.email || '',
      phone: user.phone || '',
      sex: user.sex || '',
      wallet_address: user.wallet_address || '',
    });
    
    const [isSaving, setIsSaving] = useState(false);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSaving(true);
      try {
        await onSave({
          ...user,
          ...formData
        });
      } finally {
        setIsSaving(false);
      }
    };
  
    return (
      <form onSubmit={handleSubmit} className={styles.editForm}>
        <div className={styles.formGroup}>
          <label>Full Name</label>
          <input
            type="text"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Gender</label>
          <select
            name="sex"
            value={formData.sex}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className={styles.formGroup}>
        <label>Wallet Address</label>
        <input
          type="text"
          name="wallet_address"
          value={formData.wallet_address}
          onChange={handleChange}
          readOnly
          className={styles.readOnlyInput}
        />
      </div>
        <div className={styles.formActions}>
          <button type="button" onClick={onCancel} className={styles.cancelButton}>
            Cancel
          </button>
          <button type="submit" className={styles.saveButton}>
            Save Changes
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />
      <main className={styles.adminContent}>
        
        <Head>
          <title>Users | ByteOnChain</title>
        </Head>
        
        <div className={styles.usersContainer}>
          <div className={styles.usersHeader}>
            <div className={styles.headerContent}>
              <h1 className={styles.usersTitle}>Users</h1>
              <p className={styles.usersSubtitle}>Manage and view all registered users</p>
            </div>
            
            <div className={styles.searchContainer}>
              <div className={styles.searchInputWrapper}>
                <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search users by name, email, phone or course..."
                  className={styles.searchInput}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button 
                    className={styles.clearSearch}
                    onClick={() => setSearchTerm('')}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <p>Loading users data...</p>
            </div>
          ) : (
            <>
              <div className={styles.tableWrapper}>
                <div className={styles.tableContainer}>
                  <table className={styles.usersTable}>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Gender</th>
                        <th>Course</th>
                        <th>Wallet</th>
                        <th>Quiz Attempts</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentUsers.length > 0 ? (
                        currentUsers.map((user) => (
                          <tr key={user._id}>
                            <td className={styles.userName}>{user.fullname}</td>
                            <td>{user.email}</td>
                            <td>{user.phone || 'N/A'}</td>
                            <td className={styles.capitalize}>{user.sex || 'N/A'}</td>
                            <td>{user.course || 'N/A'}</td>
                            <td className={styles.walletAddress}>
                              {formatWalletAddress(user.wallet_address)}
                            </td>
                            <td className={styles.centered}>{user.quiz_attempts}</td>
                            <td>
                              <div className={styles.actionButtons}>
                                <button 
                                  className={styles.viewButton}
                                  onClick={() => viewAttestation(user)}
                                  title="View Attestation"
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M2.45825 12C3.73253 7.94288 7.52281 5 12.0004 5C16.4781 5 20.2684 7.94291 21.5426 12C20.2684 16.0571 16.4781 19 12.0005 19C7.52281 19 3.73251 16.0571 2.45825 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </button>
                                <button 
                                  className={styles.editButton}
                                  onClick={() => openEditModal(user)}
                                  title="Edit User"
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.2322 5.23223L18.7677 8.76777M16.7322 3.73223C17.7085 2.75592 19.2914 2.75592 20.2677 3.73223C21.244 4.70854 21.244 6.29146 20.2677 7.26777L6.5 21.0355H3V17.4644L16.7322 3.73223Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className={styles.noData}>
                            {searchTerm ? 'No users match your search criteria' : 'No users found'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {filteredUsers.length > usersPerPage && (
                <div className={styles.pagination}>
                  <button 
                    className={`${styles.pageButton} ${currentPage === 1 ? styles.disabled : ''}`}
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  
                  <div className={styles.pageNumbers}>
                    {Array.from({ length: totalPages }, (_, i) => {
                      // Show limited page numbers with ellipsis
                      if (
                        i === 0 || // First page
                        i === totalPages - 1 || // Last page
                        (i >= currentPage - 2 && i <= currentPage + 1) // Pages around current
                      ) {
                        return (
                          <button
                            key={i + 1}
                            className={`${styles.pageNumber} ${currentPage === i + 1 ? styles.activePage : ''}`}
                            onClick={() => paginate(i + 1)}
                          >
                            {i + 1}
                          </button>
                        );
                      } else if (
                        i === 1 && currentPage > 3 ||
                        i === totalPages - 2 && currentPage < totalPages - 3
                      ) {
                        return <span key={i} className={styles.ellipsis}>...</span>;
                      }
                      return null;
                    })}
                  </div>
                  
                  <button 
                    className={`${styles.pageButton} ${currentPage === totalPages ? styles.disabled : ''}`}
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              )}
              
              {/* Attestation Modal */}
              {isAttestationModalOpen && currentUser && (
                <div className={styles.modalOverlay}>
                  <div className={styles.modalContent}>
                    <div className={styles.modalHeader}>
                      <h3>User Attestations</h3>
                      <button 
                        className={styles.closeButton}
                        onClick={() => setIsAttestationModalOpen(false)}
                      >
                        ×
                      </button>
                    </div>
                    <div className={styles.modalBody}>
                      <h4 className={styles.attestationTitle}>
                        Attestations for {currentUser.fullname}
                      </h4>
                      <div className={styles.attestationList}>
                        {currentUser.course_id && Object.entries(currentUser.course_id).map(([courseName, uid]) => (
                          <div key={uid} className={styles.attestationItem}>
                            <div className={styles.attestationInfo}>
                              <p className={styles.attestationName}>{courseName}</p>
                              <p className={styles.attestationUid}>{uid.substring(0, 10)}...{uid.substring(uid.length - 6)}</p>
                            </div>
                            <a 
                              href={`https://arbitrum.easscan.org/attestation/view/${uid}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className={styles.viewAttestationButton}
                            >
                              View
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
          
              {/* Edit User Modal */}
              {isEditModalOpen && currentUser && (
                <div className={styles.modalOverlay}>
                  <div className={styles.modalContent}>
                    <div className={styles.modalHeader}>
                      <h3>Edit User</h3>
                      <button 
                        className={styles.closeButton}
                        onClick={() => setIsEditModalOpen(false)}
                      >
                        ×
                      </button>
                    </div>
                    <div className={styles.modalBody}>
                      <UserEditForm 
                        user={currentUser} 
                        onSave={saveUserChanges}
                        onCancel={() => setIsEditModalOpen(false)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};



export default Users;
