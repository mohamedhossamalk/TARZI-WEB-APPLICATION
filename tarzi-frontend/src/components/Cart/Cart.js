import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem'
    },
    title: {
      fontSize: '2rem',
      color: '#333',
      margin: 0
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      padding: '1.5rem',
      marginBottom: '1.5rem'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    tableHead: {
      backgroundColor: '#f8f9fa'
    },
    tableHeader: {
      padding: '1rem',
      textAlign: 'right',
      borderBottom: '1px solid #ddd',
      fontWeight: 'bold',
      color: '#333'
    },
    tableRow: {
      borderBottom: '1px solid #eee'
    },
    tableCell: {
      padding: '1rem',
      color: '#333'
    },
    productInfo: {
      display: 'flex',
      alignItems: 'center'
    },
    productImage: {
      width: '80px',
      height: '80px',
      objectFit: 'cover',
      marginLeft: '1rem',
      borderRadius: '4px'
    },
    productName: {
      fontWeight: 'bold',
      marginBottom: '0.25rem'
    },
    productCategory: {
      color: '#666',
      fontSize: '0.875rem'
    },
    quantityControl: {
      display: 'flex',
      alignItems: 'center',
      border: '1px solid #ddd',
      borderRadius: '4px',
      width: 'fit-content'
    },
    quantityButton: {
      backgroundColor: '#f0f0f0',
      border: 'none',
      padding: '0.25rem 0.5rem',
      cursor: 'pointer',
      fontSize: '1rem'
    },
    quantityInput: {
      width: '40px',
      border: 'none',
      textAlign: 'center',
      fontSize: '0.875rem'
    },
    removeButton: {
      backgroundColor: 'transparent',
      border: 'none',
      color: '#dc3545',
      cursor: 'pointer',
      fontSize: '0.875rem'
    },
    summary: {
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      padding: '1.5rem',
      marginTop: '1.5rem'
    },
    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0.75rem 0',
      borderBottom: '1px solid #eee'
    },
    summaryTotal: {
      fontWeight: 'bold',
      fontSize: '1.1rem'
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
    emptyCart: {
      textAlign: 'center',
      padding: '3rem 0'
    },
    emptyCartIcon: {
      fontSize: '4rem',
      marginBottom: '1rem',
      color: '#ddd'
    },
    emptyCartMessage: {
      color: '#666',
      marginBottom: '1.5rem'
    },
    link: {
      color: '#0d6efd',
      textDecoration: 'none'
    },
    linkAsButton: {
      backgroundColor: '#0d6efd',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      textDecoration: 'none',
      display: 'inline-block'
    },
    couponContainer: {
      display: 'flex',
      marginTop: '1rem'
    },
    couponInput: {
      padding: '0.75rem',
      border: '1px solid #ddd',
      borderRadius: '4px 0 0 4px',
      flexGrow: 1
    },
    couponButton: {
      backgroundColor: '#6c757d',
      color: 'white',
      border: 'none',
      borderRadius: '0 4px 4px 0',
      padding: '0.75rem 1.5rem',
      cursor: 'pointer'
    }
  };

  useEffect(() => {
    // محاكاة تحميل بيانات السلة من التخزين المحلي أو من API
    setTimeout(() => {
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
      setLoading(false);
    }, 500);
  }, []);

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item => 
      item._id === id ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleRemoveItem = (id) => {
    const updatedCart = cartItems.filter(item => item._id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleClearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
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

  const handleCheckout = () => {
    if (!isAuthenticated) {
      // إذا لم يكن المستخدم مسجل الدخول، توجيهه للتسجيل
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          جاري تحميل السلة...
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>سلة التسوق</h1>
        <div style={styles.card}>
          <div style={styles.emptyCart}>
            <div style={styles.emptyCartIcon}>🛒</div>
            <h2>سلة التسوق فارغة</h2>
            <p style={styles.emptyCartMessage}>أضف بعض المنتجات لسلة التسوق واستمتع بالتسوق معنا</p>
            <Link to="/products" style={styles.linkAsButton}>تصفح المنتجات</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>سلة التسوق</h1>
        <button
          onClick={handleClearCart}
          style={{ ...styles.removeButton, fontSize: '1rem' }}
        >
          إفراغ السلة
        </button>
      </div>

      <div style={styles.card}>
        <table style={styles.table}>
          <thead style={styles.tableHead}>
            <tr>
              <th style={styles.tableHeader}>المنتج</th>
              <th style={styles.tableHeader}>السعر</th>
              <th style={styles.tableHeader}>الكمية</th>
              <th style={styles.tableHeader}>الإجمالي</th>
              <th style={styles.tableHeader}></th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map(item => (
              <tr key={item._id} style={styles.tableRow}>
                <td style={styles.tableCell}>
                  <div style={styles.productInfo}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={styles.productImage}
                    />
                    <div>
                      <div style={styles.productName}>{item.name}</div>
                      <div style={styles.productCategory}>{item.category}</div>
                    </div>
                  </div>
                </td>
                <td style={styles.tableCell}>{item.price} ج.م</td>
                <td style={styles.tableCell}>
                  <div style={styles.quantityControl}>
                    <button
                      style={styles.quantityButton}
                      onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <input
                      type="text"
                      value={item.quantity}
                      readOnly
                      style={styles.quantityInput}
                    />
                    <button
                      style={styles.quantityButton}
                      onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td style={styles.tableCell}>{item.price * item.quantity} ج.م</td>
                <td style={styles.tableCell}>
                  <button
                    style={styles.removeButton}
                    onClick={() => handleRemoveItem(item._id)}
                  >
                    إزالة
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div>
          <h3>كود الخصم</h3>
          <div style={styles.couponContainer}>
            <input
              type="text"
              placeholder="أدخل كود الخصم"
              style={styles.couponInput}
            />
            <button style={styles.couponButton}>
              تطبيق
            </button>
          </div>
        </div>

        <div style={styles.summary}>
          <h3>ملخص الطلب</h3>
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
          <div style={{ ...styles.summaryRow, ...styles.summaryTotal, borderBottom: 'none', paddingTop: '1rem' }}>
            <div>الإجمالي</div>
            <div>{calculateTotal()} ج.م</div>
          </div>

          <button
            style={styles.button}
            onClick={handleCheckout}
          >
            إتمام الطلب
          </button>
          <Link
            to="/products"
            style={{
              display: 'block',
              textAlign: 'center',
              marginTop: '1rem',
              color: '#0d6efd',
              textDecoration: 'none'
            }}
          >
            مواصلة التسوق
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;