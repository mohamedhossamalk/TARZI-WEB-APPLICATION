import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../api/api';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // أنماط CSS داخلية
  const styles = {
    hero: {
      position: 'relative',
      height: '500px',
      overflow: 'hidden'
    },
    slider: {
      width: '100%',
      height: '100%',
      display: 'flex',
      transition: 'transform 0.5s ease-in-out'
    },
    slide: {
      minWidth: '100%',
      height: '100%',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    },
    slideOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)'
    },
    slideContent: {
      position: 'relative',
      zIndex: 1,
      color: 'white',
      textAlign: 'center',
      padding: '0 2rem'
    },
    heading: {
      fontSize: '2.5rem',
      marginBottom: '1rem'
    },
    subheading: {
      fontSize: '1.2rem',
      marginBottom: '2rem'
    },
    button: {
      backgroundColor: '#0d6efd',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '4px',
      fontSize: '1rem',
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-block'
    },
    section: {
      padding: '4rem 1rem',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    sectionTitle: {
      textAlign: 'center',
      marginBottom: '2rem',
      color: '#333',
      fontSize: '2rem'
    },
    featuredGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '2rem'
    },
    categoryGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '2rem'
    },
    card: {
      border: '1px solid #eee',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s ease',
      backgroundColor: 'white'
    },
    cardImage: {
      width: '100%',
      height: '200px',
      objectFit: 'cover'
    },
    cardBody: {
      padding: '1rem'
    },
    cardTitle: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem'
    },
    cardPrice: {
      color: '#666',
      marginBottom: '0.5rem'
    },
    categoryCard: {
      position: 'relative',
      height: '200px',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    },
    categoryImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    categoryOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    categoryTitle: {
      color: 'white',
      fontSize: '1.5rem',
      fontWeight: 'bold'
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '300px'
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
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productsAPI.getAll(),
          categoriesAPI.getAll()
        ]);
        
        // افتراض أن المنتجات الأولى هي المميزة
        setFeaturedProducts(productsRes.data.slice(0, 3));
        setCategories(categoriesRes.data.slice(0, 4));
      } catch (error) {
        console.error('فشل تحميل البيانات:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // تغيير الشريحة كل 5 ثوانٍ
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % 3); // ٣ شرائح
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const slides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e',
      title: 'أزياء عصرية',
      subtitle: 'تصاميم حصرية تناسب ذوقك',
      buttonText: 'تسوق الآن'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7',
      title: 'ملابس مخصصة',
      subtitle: 'مقاسات دقيقة وتصاميم فريدة',
      buttonText: 'اكتشف المزيد'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1476234251651-f353703a034d',
      title: 'تجربة تسوق مميزة',
      subtitle: 'جودة عالية وخدمة متميزة',
      buttonText: 'اطلب الآن'
    }
  ];

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

  return (
    <div>
      {/* قسم العرض الرئيسي */}
      <div style={styles.hero}>
        <div
          style={{
            ...styles.slider,
            transform: `translateX(${-currentSlide * 100}%)`
          }}
        >
          {slides.map((slide) => (
            <div
              key={slide.id}
              style={{
                ...styles.slide,
                backgroundImage: `url(${slide.image})`
              }}
            >
              <div style={styles.slideOverlay}></div>
              <div style={styles.slideContent}>
                <h1 style={styles.heading}>{slide.title}</h1>
                <p style={styles.subheading}>{slide.subtitle}</p>
                <Link to="/products" style={styles.button}>
                  {slide.buttonText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* قسم المنتجات المميزة */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>منتجات مميزة</h2>
        <div style={styles.featuredGrid}>
          {featuredProducts.map((product) => (
            <div key={product._id} style={styles.card}>
              <img
                src={product.image || 'https://via.placeholder.com/300x200'}
                alt={product.name}
                style={styles.cardImage}
              />
              <div style={styles.cardBody}>
                <h3 style={styles.cardTitle}>{product.name}</h3>
                <p style={styles.cardPrice}>{product.price} ج.م</p>
                <Link to={`/products/${product._id}`} style={styles.button}>
                  عرض التفاصيل
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* قسم الفئات */}
      <div style={{...styles.section, backgroundColor: '#f8f9fa'}}>
        <h2 style={styles.sectionTitle}>تسوق حسب الفئة</h2>
        <div style={styles.categoryGrid}>
          {categories.map((category) => (
            <Link to={`/products?category=${category._id}`} key={category._id}>
              <div style={styles.categoryCard}>
                <img
                  src={category.image || 'https://via.placeholder.com/300x200'}
                  alt={category.name}
                  style={styles.categoryImage}
                />
                <div style={styles.categoryOverlay}>
                  <h3 style={styles.categoryTitle}>{category.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* قسم الخدمات */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>خدماتنا</h2>
        <div style={styles.featuredGrid}>
          <div style={styles.card}>
            <div style={styles.cardBody}>
              <h3 style={styles.cardTitle}>تفصيل حسب المقاس</h3>
              <p>نقدم خدمة تفصيل الملابس حسب مقاسات الجسم الدقيقة لضمان أعلى مستويات الراحة والأناقة.</p>
              <Link to="/services" style={styles.button}>
                اعرف المزيد
              </Link>
            </div>
          </div>
          
          <div style={styles.card}>
            <div style={styles.cardBody}>
              <h3 style={styles.cardTitle}>تعديل الملابس</h3>
              <p>نقدم خدمة تعديل وضبط الملابس لتناسب جسمك بشكل مثالي مع الحفاظ على جودتها الأصلية.</p>
              <Link to="/services" style={styles.button}>
                اعرف المزيد
              </Link>
            </div>
          </div>
          
          <div style={styles.card}>
            <div style={styles.cardBody}>
              <h3 style={styles.cardTitle}>استشارات الأزياء</h3>
              <p>خبراؤنا في عالم الأزياء جاهزون لمساعدتك في اختيار ما يناسبك من ألوان وأنماط وتصاميم.</p>
              <Link to="/services" style={styles.button}>
                اعرف المزيد
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* قسم شهادة العملاء */}
      <div style={{...styles.section, backgroundColor: '#f8f9fa'}}>
        <h2 style={styles.sectionTitle}>ما يقوله عملاؤنا</h2>
        <div style={styles.featuredGrid}>
          <div style={styles.card}>
            <div style={styles.cardBody}>
              <p style={{marginBottom: '1rem'}}>"تجربة رائعة في التعامل، جودة ممتازة وخدمة راقية جداً. سأتعامل معهم مرة أخرى بكل تأكيد."</p>
              <h4 style={{fontWeight: 'bold'}}>أحمد محمد</h4>
            </div>
          </div>
          
          <div style={styles.card}>
            <div style={styles.cardBody}>
              <p style={{marginBottom: '1rem'}}>"ملابس ذات جودة عالية وتناسب مقاساتي تماماً. فريق خدمة العملاء متعاون للغاية."</p>
              <h4 style={{fontWeight: 'bold'}}>سارة أحمد</h4>
            </div>
          </div>
          
          <div style={styles.card}>
            <div style={styles.cardBody}>
              <p style={{marginBottom: '1rem'}}>"أفضل مكان للحصول على ملابس مخصصة. التفاصيل مدروسة والنتيجة النهائية رائعة."</p>
              <h4 style={{fontWeight: 'bold'}}>محمد علي</h4>
            </div>
          </div>
        </div>
      </div>

      {/* قسم الاتصال */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>تواصل معنا</h2>
        <div style={{textAlign: 'center'}}>
          <p style={{fontSize: '1.1rem', marginBottom: '1.5rem'}}>
            هل لديك استفسار؟ نحن هنا للمساعدة! تواصل معنا الآن.
          </p>
          <Link to="/contact" style={{
            ...styles.button,
            padding: '12px 30px',
            fontSize: '1.1rem'
          }}>
            اتصل بنا
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;