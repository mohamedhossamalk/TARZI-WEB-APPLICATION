import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ordersAPI } from '../../api/api';

const Checkout = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
    paymentMethod: 'cash'
  });

  // أنماط CSS داخلية
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '2rem auto',
      padding: '0 1rem',
      fontFamily: 'Arial, sans-serif',
      direction: 'rtl'
    },
    title: {
      fontSize: '2rem',
      color: '#333',
      marginBottom: '2rem'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '2rem',
      '@media (max-width: 768px)': {
        gridTemplateColumns: '1fr'
      }
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      padding: '1.5rem',
      marginBottom: '1.5rem'
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
    select: {
      width: '100%',
      padding: '0.75rem',
      borderRadius: '4px',
      border: '1px solid #ddd',
      fontSize: '1rem',
      backgroundColor: 'white'
    },
    textarea: {
      width: '100%',
      padding: '0.75rem',
      borderRadius: '4px',
      border: '1px solid #ddd',
      fontSize: '1rem',
      minHeight: '100px',
      resize: 'vertical'
    },
    radioGroup: {
      marginTop: '0.5rem'
    },
    radioLabel: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '0.5rem',
      cursor: 'pointer'
    },
    radio: {
      marginLeft: '0.5rem'
    },
    orderSummary: {
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      padding: '1.5rem'
    },
    orderTitle: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      color: '#333'
    },
    productList: {
      marginBottom: '1.5rem'
    },
    productItem: {
      display: 'flex',
      justifyContent: 'space-between',
      borderBottom: '1px solid #eee',
      padding: '0.75rem 0'
    },
    productName: {
      display: 'flex',
      alignItems: 'center'
    },
    quantityBadge: {
      backgroundColor: '#0d6efd',
      color: 'white',
      borderRadius: '50%',
      width: '20px',
      height: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.75rem',
      marginLeft: '0.5rem'
    },
    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0.75rem 0',
      borderBottom: '1px solid #eee'
    },
    summaryTotal: {
      fontWeight: 'bold',
      fontSize: '1.1rem',
      borderBottom: 'none',
      paddingTop: '1rem'
    },
    button: {
      backgroundColor: '#0d6efd',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      cursor: 'pointer',
      width: '100%',
      marginTop: '1rem'
    },
    disabledButton: {
      opacity: 0.7,
      cursor: 'not-allowed'
    },
    cities: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '0.5rem'
    },
    cityOption: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '0.5rem'
    },
    requiredMark: {
      color: 'red',
      marginRight: '0.25rem'
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=checkout');
      return;
    }

    // محاكاة تحميل بيانات السلة من التخزين المحلي أو API
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    } else {
      // بيانات وهمية للعرض
      setCartItems([
        {
          _id: '1',
          name: 'قميص قطني كلاسيكي',
          price: 350,
          quantity: 2,
          image: 'https://via.placeholder.com/80x80',
          category: 'قمصان'
        },
        {
          _id: '2',
          name: 'بنطلون جينز أزرق',
          price: 450,
          quantity: 1,
          image: 'https://via.placeholder.com/80x80',
          category: 'بناطيل'
        }
      ]);
    }

    // تعبئة البيانات الافتراضية من معلومات المستخدم إذا كانت متوفرة
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || '',
        phone: user.phone || ''
      }));
    }

    setLoading(false);
  }, [isAuthenticated, navigate, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 1000 ? 0 : 50; // شحن مجاني لطلبات أكبر من 1000 جنيه
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // التحقق من البيانات المطلوبة
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city) {
      alert('يرجى إدخال جميع البيانات المطلوبة');
      return;
    }
    
    setOrderProcessing(true);
    
    try {
      // محاكاة إرسال طلب إلى API
      // في التطبيق الفعلي، استخدم ordersAPI.create()
      // await ordersAPI.create({
      //   items: cartItems,
      //   shippingAddress: {
      //     fullName: formData.fullName,
      //     phone: formData.phone,
      //     address: formData.address,
      //     city: formData.city
      //   },
      //   notes: formData.notes,
      //   paymentMethod: formData.paymentMethod,
      //   totalAmount: calculateTotal()
      // });
      
      // محاكاة انتظار استجابة من السيرفر
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // تفريغ السلة
      localStorage.removeItem('cart');
      
      // توجيه المستخدم إلى صفحة تأكيد الطلب
      navigate('/order-confirmation');
    } catch (error) {
      console.error('فشل في إتمام الطلب:', error);
      alert('حدث خطأ أثناء إتمام الطلب. يرجى المحاولة مرة أخرى.');
    } finally {
      setOrderProcessing(false);
    }
  };

  if (loading) {
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
      <h1 style={styles.title}>إتمام الطلب</h1>

      <form onSubmit={handleSubmit}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '2rem'
        }}>
          <div>
            <div style={styles.card}>
              <h2 style={styles.orderTitle}>بيانات التوصيل</h2>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span style={styles.requiredMark}>*</span> الاسم الكامل
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span style={styles.requiredMark}>*</span> رقم الهاتف
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span style={styles.requiredMark}>*</span> العنوان
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  placeholder="المنطقة، الشارع، رقم المبنى"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span style={styles.requiredMark}>*</span> المدينة
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  style={styles.select}
                >
                  <option value="">اختر المدينة</option>
                  <option value="القاهرة">القاهرة</option>
                  <option value="الإسكندرية">الإسكندرية</option>
                  <option value="الجيزة">الجيزة</option>
                  <option value="شرم الشيخ">شرم الشيخ</option>
                  <option value="المنصورة">المنصورة</option>
                  <option value="طنطا">طنطا</option>
                  <option value="أسيوط">أسيوط</option>
                  <option value="الأقصر">الأقصر</option>
                  <option value="أسوان">أسوان</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>ملاحظات إضافية</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  style={styles.textarea}
                  placeholder="أي تفاصيل إضافية تريد إضافتها لطلبك"
                ></textarea>
              </div>
            </div>

            <div style={styles.card}>
              <h2 style={styles.orderTitle}>طريقة الدفع</h2>
              
              <div style={styles.radioGroup}>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={formData.paymentMethod === 'cash'}
                    onChange={handleChange}
                    style={styles.radio}
                  />
                  الدفع عند الاستلام
                </label>

                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit"
                    checked={formData.paymentMethod === 'credit'}
                    onChange={handleChange}
                    style={styles.radio}
                  />
                  بطاقة ائتمان
                </label>

                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="fawry"
                    checked={formData.paymentMethod === 'fawry'}
                    onChange={handleChange}
                    style={styles.radio}
                  />
                  فوري
                </label>
              </div>
            </div>
          </div>

          <div>
            <div style={styles.orderSummary}>
              <h2 style={styles.orderTitle}>ملخص الطلب</h2>
              
              <div style={styles.productList}>
                {cartItems.map(item => (
                  <div key={item._id} style={styles.productItem}>
                    <div style={styles.productName}>
                      <div style={styles.quantityBadge}>{item.quantity}</div>
                      {item.name}
                    </div>
                    <div>{item.price * item.quantity} ج.م</div>
                  </div>
                ))}
              </div>

              <div style={styles.summaryRow}>
                <div>إجمالي المنتجات</div>
                <div>{calculateSubtotal()} ج.م</div>
              </div>
              <div style={styles.summaryRow}>
                <div>الشحن</div>
                <div>
                  {calculateShipping() === 0
                    ? "شحن مجاني"
                    : `${calculateShipping()} ج.م`}
                </div>
              </div>
              <div style={{ ...styles.summaryRow, ...styles.summaryTotal }}>
                <div>الإجمالي</div>
                <div>{calculateTotal()} ج.م</div>
              </div>

              <button
                type="submit"
                style={{
                  ...styles.button,
                  ...(orderProcessing ? styles.disabledButton : {})
                }}
                disabled={orderProcessing}
              >
                {orderProcessing ? 'جاري تأكيد الطلب...' : 'تأكيد الطلب'}
              </button>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>ملاحظات:</div>
              <ul style={{ paddingRight: '1.5rem', color: '#666', lineHeight: '1.6' }}>
                <li>يستغرق وقت التوصيل من 3 إلى 5 أيام عمل</li>
                <li>سيتم التواصل معك هاتفياً لتأكيد الطلب</li>
                <li>يمكنك تتبع حالة طلبك من صفحة حسابي</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;