import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('profile');

  // أنماط CSS داخلية
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '2rem auto',
      padding: '0 1rem',
      fontFamily: 'Arial, sans-serif',
      direction: 'rtl'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '2rem'
    },
    avatar: {
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      backgroundColor: '#0d6efd',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2.5rem',
      marginLeft: '1.5rem'
    },
    headerContent: {
      flex: 1
    },
    title: {
      fontSize: '2rem',
      color: '#333',
      margin: '0 0 0.5rem 0'
    },
    email: {
      color: '#666',
      marginBottom: '0.5rem'
    },
    joinDate: {
      color: '#666',
      fontSize: '0.875rem'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      padding: '1.5rem',
      marginBottom: '1.5rem'
    },
    tabs: {
      display: 'flex',
      borderBottom: '1px solid #ddd',
      marginBottom: '1.5rem'
    },
    tab: {
      padding: '1rem',
      cursor: 'pointer',
      color: '#666',
      borderBottom: '2px solid transparent',
      transition: 'all 0.3s ease'
    },
    activeTab: {
      borderBottom: '2px solid #0d6efd',
      color: '#0d6efd',
      fontWeight: 'bold'
    },
    formGroup: {
      marginBottom: '1.5rem'
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: 'bold',
      color: '#333'
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      borderRadius: '4px',
      border: '1px solid #ddd',
      fontSize: '1rem'
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '1rem',
      marginTop: '1.5rem'
    },
    button: {
      backgroundColor: '#0d6efd',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      cursor: 'pointer'
    },
    cancelButton: {
      backgroundColor: '#6c757d',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      cursor: 'pointer'
    },
    editButton: {
      backgroundColor: 'transparent',
      color: '#0d6efd',
      border: '1px solid #0d6efd',
      borderRadius: '4px',
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      cursor: 'pointer'
    },
    infoRow: {
      display: 'flex',
      borderBottom: '1px solid #eee',
      padding: '1rem 0'
    },
    infoLabel: {
      fontWeight: 'bold',
      width: '150px',
      color: '#333'
    },
    infoValue: {
      flex: 1,
      color: '#333'
    },
    successMessage: {
      backgroundColor: '#d4edda',
      color: '#155724',
      padding: '0.75rem',
      borderRadius: '4px',
      marginBottom: '1rem'
    },
    errorMessage: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      padding: '0.75rem',
      borderRadius: '4px',
      marginBottom: '1rem'
    },
    measurementGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      gap: '1rem',
      marginTop: '1.5rem'
    },
    measurementItem: {
      backgroundColor: '#f8f9fa',
      padding: '1rem',
      borderRadius: '4px'
    },
    measurementLabel: {
      color: '#666',
      fontSize: '0.875rem',
      marginBottom: '0.5rem'
    },
    measurementValue: {
      color: '#333',
      fontSize: '1rem',
      fontWeight: 'bold'
    },
    addressGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1rem',
      marginTop: '1.5rem',
      '@media (max-width: 768px)': {
        gridTemplateColumns: '1fr'
      }
    },
    addressCard: {
      border: '1px solid #ddd',
      borderRadius: '4px',
      padding: '1rem'
    },
    addressType: {
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '0.5rem'
    },
    addressActions: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '0.5rem',
      marginTop: '1rem'
    },
    smallButton: {
      backgroundColor: 'transparent',
      color: '#0d6efd',
      border: 'none',
      padding: '0.25rem',
      cursor: 'pointer',
      fontSize: '0.875rem'
    }
  };

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    // إعادة تعيين البيانات إلى القيم الأصلية
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    }
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // التحقق من تطابق كلمات المرور
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'كلمات المرور غير متطابقة' });
      setLoading(false);
      return;
    }

    try {
      // محاكاة طلب تحديث البيانات إلى API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({ type: 'success', text: 'تم تحديث البيانات بنجاح' });
      setEditing(false);
      // في التطبيق الفعلي، قم بتحديث بيانات المستخدم في سياق المصادقة
    } catch (error) {
      console.error('فشل تحديث البيانات:', error);
      setMessage({ type: 'error', text: 'فشل تحديث البيانات. يرجى المحاولة مرة أخرى.' });
    } finally {
      setLoading(false);
    }
  };

  const dummyAddresses = [
    {
      id: 1,
      type: 'المنزل',
      address: 'شارع التحرير، وسط البلد، القاهرة',
      phone: '01012345678',
      isDefault: true
    },
    {
      id: 2,
      type: 'العمل',
      address: 'المهندسين، الجيزة',
      phone: '01098765432',
      isDefault: false
    }
  ];

  const dummyMeasurements = {
    chest: 100,
    waist: 85,
    hips: 95,
    shoulder: 45,
    sleeve: 65,
    inseam: 80,
    neck: 40
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'addresses':
        return renderAddressesTab();
      case 'measurements':
        return renderMeasurementsTab();
      case 'password':
        return renderPasswordTab();
      default:
        return renderProfileTab();
    }
  };

  const renderProfileTab = () => {
    return (
      <div style={styles.card}>
        {message.text && (
          <div 
            style={message.type === 'success' ? styles.successMessage : styles.errorMessage}
          >
            {message.text}
          </div>
        )}

        {editing ? (
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>الاسم الكامل</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>البريد الإلكتروني</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>رقم الهاتف</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.buttonContainer}>
              <button
                type="button"
                onClick={handleCancel}
                style={styles.cancelButton}
              >
                إلغاء
              </button>
              <button
                type="submit"
                style={{
                  ...styles.button,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
                disabled={loading}
              >
                {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </button>
            </div>
          </form>
        ) : (
          <>
            <div style={styles.infoRow}>
              <div style={styles.infoLabel}>الاسم الكامل</div>
              <div style={styles.infoValue}>{formData.name}</div>
            </div>
            <div style={styles.infoRow}>
              <div style={styles.infoLabel}>البريد الإلكتروني</div>
              <div style={styles.infoValue}>{formData.email}</div>
            </div>
            <div style={styles.infoRow}>
              <div style={styles.infoLabel}>رقم الهاتف</div>
              <div style={styles.infoValue}>{formData.phone || 'غير محدد'}</div>
            </div>
            <div style={styles.infoRow}>
              <div style={styles.infoLabel}>تاريخ الانضمام</div>
              <div style={styles.infoValue}>
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ar-EG') : 'غير محدد'}
              </div>
            </div>

            <div style={styles.buttonContainer}>
              <button
                onClick={handleEdit}
                style={styles.editButton}
              >
                تعديل البيانات
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderPasswordTab = () => {
    return (
      <div style={styles.card}>
        {message.text && (
          <div 
            style={message.type === 'success' ? styles.successMessage : styles.errorMessage}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>كلمة المرور الحالية</label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>كلمة المرور الجديدة</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              style={styles.input}
              required
              minLength="6"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>تأكيد كلمة المرور الجديدة</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={styles.input}
              required
              minLength="6"
            />
          </div>

          <div style={styles.buttonContainer}>
            <button
              type="submit"
              style={{
                ...styles.button,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
              disabled={loading}
            >
              {loading ? 'جاري التحديث...' : 'تحديث كلمة المرور'}
            </button>
          </div>
        </form>
      </div>
    );
  };

  const renderAddressesTab = () => {
    return (
      <div style={styles.card}>
        <h3>العناوين المحفوظة</h3>
        <div style={styles.addressGrid}>
          {dummyAddresses.map(address => (
            <div key={address.id} style={styles.addressCard}>
              <div style={styles.addressType}>{address.type}</div>
              <div>{address.address}</div>
              <div>{address.phone}</div>
              {address.isDefault && (
                <div style={{ color: '#0d6efd', marginTop: '0.5rem', fontSize: '0.875rem' }}>
                  العنوان الافتراضي
                </div>
              )}
              <div style={styles.addressActions}>
                <button style={styles.smallButton}>تعديل</button>
                <button style={{ ...styles.smallButton, color: '#dc3545' }}>حذف</button>
                {!address.isDefault && (
                  <button style={{ ...styles.smallButton, color: '#198754' }}>
                    تعيين كافتراضي
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          <button style={styles.button}>إضافة عنوان جديد</button>
        </div>
      </div>
    );
  };

  const renderMeasurementsTab = () => {
    const measurements = user?.measurements || dummyMeasurements;
    
    return (
      <div style={styles.card}>
        <h3>القياسات المحفوظة</h3>
        <p>هذه القياسات مهمة لتفصيل الملابس بشكل مناسب لجسمك.</p>
        
        <div style={styles.measurementGrid}>
          <div style={styles.measurementItem}>
            <div style={styles.measurementLabel}>الصدر</div>
            <div style={styles.measurementValue}>{measurements.chest} سم</div>
          </div>
          <div style={styles.measurementItem}>
            <div style={styles.measurementLabel}>الخصر</div>
            <div style={styles.measurementValue}>{measurements.waist} سم</div>
          </div>
          <div style={styles.measurementItem}>
            <div style={styles.measurementLabel}>الأرداف</div>
            <div style={styles.measurementValue}>{measurements.hips} سم</div>
          </div>
          <div style={styles.measurementItem}>
            <div style={styles.measurementLabel}>الكتف</div>
            <div style={styles.measurementValue}>{measurements.shoulder} سم</div>
          </div>
          <div style={styles.measurementItem}>
            <div style={styles.measurementLabel}>طول الكم</div>
            <div style={styles.measurementValue}>{measurements.sleeve} سم</div>
          </div>
          <div style={styles.measurementItem}>
            <div style={styles.measurementLabel}>طول الساق الداخلي</div>
            <div style={styles.measurementValue}>{measurements.inseam} سم</div>
          </div>
          <div style={styles.measurementItem}>
            <div style={styles.measurementLabel}>الرقبة</div>
            <div style={styles.measurementValue}>{measurements.neck} سم</div>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <button style={styles.button}>تعديل القياسات</button>
        </div>
      </div>
    );
  };

  if (!user) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          جاري التحميل...
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.avatar}>
          {user.name?.[0] || 'م'}
        </div>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>{user.name || 'المستخدم'}</h1>
          <div style={styles.email}>{user.email}</div>
          <div style={styles.joinDate}>
            عضو منذ {user.createdAt ? new Date(user.createdAt).toLocaleDateString('ar-EG') : 'غير محدد'}
          </div>
        </div>
      </div>

      <div style={styles.tabs}>
        <div
          style={{
            ...styles.tab,
            ...(activeTab === 'profile' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('profile')}
        >
          المعلومات الشخصية
        </div>
        <div
          style={{
            ...styles.tab,
            ...(activeTab === 'addresses' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('addresses')}
        >
          العناوين
        </div>
        <div
          style={{
            ...styles.tab,
            ...(activeTab === 'measurements' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('measurements')}
        >
          القياسات
        </div>
        <div
          style={{
            ...styles.tab,
            ...(activeTab === 'password' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('password')}
        >
          تغيير كلمة المرور
        </div>
      </div>

      {renderContent()}
    </div>
  );
};

export default Profile;