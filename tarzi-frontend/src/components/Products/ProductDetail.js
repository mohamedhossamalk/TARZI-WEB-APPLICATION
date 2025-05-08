import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsAPI } from '../../api/api';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // أنماط CSS داخلية
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '2rem auto',
      padding: '0 1rem',
      fontFamily: 'Arial, sans-serif',
      direction: 'rtl'
    },
    breadcrumb: {
      marginBottom: '1rem',
      color: '#666'
    },
    breadcrumbLink: {
      color: '#0d6efd',
      textDecoration: 'none'
    },
    productContainer: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '2rem',
      '@media (max-width: 768px)': {
        gridTemplateColumns: '1fr'
      }
    },
    imageContainer: {
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    image: {
      width: '100%',
      height: 'auto',
      display: 'block'
    },
    productInfo: {
      padding: '1rem'
    },
    title: {
      fontSize: '2rem',
      marginBottom: '1rem',
      color: '#333'
    },
    price: {
      fontSize: '1.5rem',
      color: '#0d6efd',
      marginBottom: '1rem',
      fontWeight: 'bold'
    },
    category: {
      backgroundColor: '#f0f0f0',
      padding: '0.25rem 0.5rem',
      borderRadius: '4px',
      display: 'inline-block',
      marginBottom: '1rem',
      color: '#666'
    },
    description: {
      color: '#333',
      lineHeight: '1.6',
      marginBottom: '1.5rem'
    },
    quantityContainer: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '1.5rem'
    },
    quantityLabel: {
      marginLeft: '1rem',
      fontWeight: 'bold'
    },
    quantityControls: {
      display: 'flex',
      alignItems: 'center',
      border: '1px solid #ddd',
      borderRadius: '4px'
    },
    quantityButton: {
      padding: '0.5rem 1rem',
      border: 'none',
      backgroundColor: '#f0f0f0',
      cursor: 'pointer',
      fontSize: '1.2rem'
    },
    quantityInput: {
      width: '40px',
      border: 'none',
      textAlign: 'center',
      fontSize: '1rem'
    },
    button: {
      backgroundColor: '#0d6efd',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      cursor: 'pointer',
      marginRight: '1rem'
    },
    wishlistButton: {
      backgroundColor: 'transparent',
      color: '#0d6efd',
      border: '1px solid #0d6efd',
      borderRadius: '4px',
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      cursor: 'pointer'
    },
    hr: {
      margin: '2rem 0',
      borderTop: '1px solid #eee'
    },
    features: {
      marginBottom: '2rem'
    },
    featuresTitle: {
      fontSize: '1.2rem',
      marginBottom: '1rem',
      fontWeight: 'bold'
    },
    featuresList: {
      listStyle: 'disc',
      paddingRight: '1.5rem',
      color: '#333',
      lineHeight: '1.6'
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '300px'
    },
    error: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      padding: '1rem',
      borderRadius: '4px',
      marginBottom: '1rem'
    },
    spinner: {
      width: '40px',
      height: '40px',
      border: '4px solid rgba(0, 0, 0, 0.1)',
      borderTopColor: '#0d6efd',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productsAPI.getById(id);
        setProduct(response.data);
      } catch (err) {
        setError('فشل في تحميل بيانات المنتج');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleIncreaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    // هنا سيتم تنفيذ إضافة المنتج إلى السلة
    console.log(`تمت إضافة ${quantity} من المنتج ${product.name} إلى السلة`);
    alert(`تمت إضافة ${product.name} إلى السلة`);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <style>
          {`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>{error || 'لم يتم العثور على المنتج'}</div>
        <Link to="/products" style={styles.breadcrumbLink}>العودة للمنتجات</Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.breadcrumb}>
        <Link to="/" style={styles.breadcrumbLink}>الرئيسية</Link>
        {' > '}
        <Link to="/products" style={styles.breadcrumbLink}>المنتجات</Link>
        {' > '}
        {product.name}
      </div>

      <div style={styles.productContainer}>
        <div style={styles.imageContainer}>
          <img
            src={product.image || 'https://via.placeholder.com/600x400'}
            alt={product.name}
            style={styles.image}
          />
        </div>

        <div style={styles.productInfo}>
          <h1 style={styles.title}>{product.name}</h1>
          <div style={styles.price}>{product.price} ج.م</div>
          {product.category && (
            <div style={styles.category}>{product.category.name}</div>
          )}
          <p style={styles.description}>{product.description}</p>

          <div style={styles.quantityContainer}>
            <label style={styles.quantityLabel}>الكمية:</label>
            <div style={styles.quantityControls}>
              <button
                style={styles.quantityButton}
                onClick={handleDecreaseQuantity}
              >
                -
              </button>
              <input
                type="text"
                value={quantity}
                readOnly
                style={styles.quantityInput}
              />
              <button
                style={styles.quantityButton}
                onClick={handleIncreaseQuantity}
              >
                +
              </button>
            </div>
          </div>

          <div>
            <button
              style={styles.button}
              onClick={handleAddToCart}
            >
              إضافة للسلة
            </button>
            <button style={styles.wishlistButton}>
              إضافة للمفضلة
            </button>
          </div>

          <hr style={styles.hr} />

          <div style={styles.features}>
            <h3 style={styles.featuresTitle}>المميزات:</h3>
            <ul style={styles.featuresList}>
              {product.features ? 
                product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                )) : 
                <>
                  <li>خامات عالية الجودة</li>
                  <li>تصميم عصري أنيق</li>
                  <li>مريح للاستخدام اليومي</li>
                </>
              }
            </ul>
          </div>

          {product.sizes && (
            <div style={styles.features}>
              <h3 style={styles.featuresTitle}>المقاسات المتاحة:</h3>
              <div style={{display: 'flex', gap: '0.5rem'}}>
                {product.sizes.map((size, index) => (
                  <div key={index} style={{
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    minWidth: '40px',
                    textAlign: 'center'
                  }}>
                    {size}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;