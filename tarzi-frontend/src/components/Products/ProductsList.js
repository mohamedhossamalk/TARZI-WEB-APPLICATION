// src/components/Products/ProductsList.js
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { productsAPI, categoriesAPI, helpers } from '../../api/api';
import { useAuth } from '../../context/AuthContext';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // تحميل عناصر السلة من localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error('خطأ في قراءة بيانات السلة:', error);
      }
    }
  }, []);

  // التحقق ما إذا كان المنتج موجودًا في السلة
  const isItemInCart = (productId) => {
    return cartItems.some(item => item._id === productId);
  };

  // إضافة منتج للسلة
  const addToCart = (product) => {
    const updatedCartItems = [...cartItems];
    const existingItemIndex = updatedCartItems.findIndex(item => item._id === product._id);
    
    if (existingItemIndex !== -1) {
      updatedCartItems[existingItemIndex] = {
        ...updatedCartItems[existingItemIndex],
        quantity: updatedCartItems[existingItemIndex].quantity + 1
      };
    } else {
      updatedCartItems.push({ ...product, quantity: 1 });
    }
    
    setCartItems(updatedCartItems);
    localStorage.setItem('cart', JSON.stringify(updatedCartItems));
  };

  // استخراج المعلمات من عنوان URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    const searchParam = params.get('q');
    const pageParam = params.get('page');
    
    if (categoryParam) setSelectedCategory(categoryParam);
    if (searchParam) setSearchTerm(searchParam);
    if (pageParam) setPage(Number(pageParam) || 1);
  }, [location.search]);

  // تحديث عنوان URL عند تغيير المرشحات
  const updateUrlParams = useCallback(() => {
    const params = new URLSearchParams();
    if (selectedCategory) params.append('category', selectedCategory);
    if (searchTerm) params.append('q', searchTerm);
    if (page > 1) params.append('page', page.toString());
    
    navigate(`/products?${params.toString()}`, { replace: true });
  }, [selectedCategory, searchTerm, page, navigate]);

  useEffect(() => {
    updateUrlParams();
  }, [selectedCategory, searchTerm, page, updateUrlParams]);

  // جلب الفئات
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesAPI.getAll();
        setCategories(response.data.categories || []);
      } catch (err) {
        console.error('فشل في جلب الفئات:', err);
        // لا نريد عرض خطأ للمستخدم هنا، فقط في وحدة التحكم للمطورين
      }
    };

    fetchCategories();
  }, []);

  // جلب المنتجات
  const fetchProducts = useCallback(async (resetList = false) => {
    try {
      const currentPage = resetList ? 1 : page;
      const loadingState = resetList || page === 1 ? setLoading : setIsLoadingMore;
      
      loadingState(true);
      setError(null);
      
      const params = {
        page: currentPage,
        pageSize: 9
      };
      
      if (selectedCategory) params.category = selectedCategory;
      if (searchTerm) params.keyword = searchTerm;
      
      const response = await productsAPI.getAll(params);
      
      const productsData = response.data.products || [];
      const pagination = response.data.pagination || {};
      
      if (resetList || currentPage === 1) {
        setProducts(productsData);
      } else {
        setProducts(prev => [...prev, ...productsData]);
      }
      
      setTotalPages(pagination.pages || 0);
      setHasMore(currentPage < pagination.pages);
      
      if (resetList) setPage(1);
    } catch (err) {
      console.error('فشل في جلب المنتجات:', err);
      setError(helpers?.formatErrorMessage(err) || 'حدث خطأ أثناء جلب المنتجات. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  }, [page, selectedCategory, searchTerm]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);
    setPage(1); // إعادة تعيين الصفحة عند تغيير الفئة
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // إعادة تعيين الصفحة عند البحث
    fetchProducts(true);
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      // حفظ عنوان URL الحالي للعودة بعد تسجيل الدخول
      navigate('/login?redirect=' + encodeURIComponent(location.pathname + location.search));
      return;
    }
    
    addToCart(product);
  };

  // أنماط CSS داخلية
  const styles = {
    container: {
      padding: '2rem 1rem',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: 'Cairo, sans-serif',
      direction: 'rtl'
    },
    header: {
      textAlign: 'center',
      marginBottom: '2rem',
      color: '#333',
      fontSize: '2rem'
    },
    filterContainer: {
      marginBottom: '2rem',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: '1rem',
      padding: '1rem',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px'
    },
    filterGroup: {
      display: 'flex',
      alignItems: 'center',
      marginRight: '1rem'
    },
    filterLabel: {
      marginLeft: '0.5rem',
      fontWeight: 'bold'
    },
    select: {
      padding: '8px 12px',
      borderRadius: '4px',
      border: '1px solid #ddd',
      minWidth: '200px'
    },
    searchForm: {
      display: 'flex',
      flex: '1',
      marginRight: '1rem',
      marginLeft: '1rem'
    },
    searchInput: {
      padding: '8px 12px',
      borderRadius: '4px 0 0 4px',
      border: '1px solid #ddd',
      borderRight: 'none',
      flexGrow: 1
    },
    searchButton: {
      padding: '8px 16px',
      backgroundColor: '#0d6efd',
      color: 'white',
      border: 'none',
      borderRadius: '0 4px 4px 0',
      cursor: 'pointer'
    },
    productsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '2rem'
    },
    productCard: {
      border: '1px solid #eee',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      backgroundColor: 'white',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    },
    productImage: {
      width: '100%',
      height: '200px',
      objectFit: 'cover'
    },
    productBody: {
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1
    },
    productTitle: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem',
      color: '#333'
    },
    priceContainer: {
      display: 'flex',
      alignItems: 'baseline',
      marginBottom: '0.5rem'
    },
    productPrice: {
      color: '#0d6efd',
      fontWeight: 'bold',
      fontSize: '1.1rem'
    },
    productOldPrice: {
      color: '#999',
      textDecoration: 'line-through',
      marginRight: '0.5rem',
      fontSize: '0.9rem'
    },
    productDescription: {
      color: '#666',
      flexGrow: 1,
      fontSize: '0.9rem',
      marginBottom: '1rem'
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '1rem'
    },
    detailButton: {
      padding: '8px 16px',
      backgroundColor: 'transparent',
      color: '#0d6efd',
      border: '1px solid #0d6efd',
      borderRadius: '4px',
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-block'
    },
    cartButton: {
      padding: '8px 16px',
      backgroundColor: '#0d6efd',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    cartButtonAdded: {
      backgroundColor: '#198754'
    },
    emptyMessage: {
      textAlign: 'center',
      padding: '3rem 0',
      color: '#666'
    },
    loadingContainer: {
      textAlign: 'center',
      padding: '3rem 0'
    },
    spinner: {
      width: '40px',
      height: '40px',
      border: '4px solid rgba(0, 0, 0, 0.1)',
      borderTopColor: '#0d6efd',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      margin: '0 auto',
      display: 'inline-block'
    },
    error: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      padding: '1rem',
      borderRadius: '4px',
      marginBottom: '1rem'
    },
    loadMoreButton: {
      backgroundColor: '#f8f9fa',
      color: '#333',
      border: '1px solid #ddd',
      borderRadius: '4px',
      padding: '10px 20px',
      margin: '2rem auto',
      display: 'block',
      cursor: 'pointer'
    }
  };

  // تنسيق عرض السعر
  const formatPrice = (price) => {
    return `${price.toFixed(2)} ج.م`;
  };

  // حساب السعر بعد الخصم
  const calculateDiscountedPrice = (price, discount) => {
    if (!discount) return null;
    const discountAmount = (price * discount) / 100;
    return price - discountAmount;
  };

  if (loading && products.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
          <p>جاري تحميل المنتجات...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>منتجاتنا</h2>
      
      {error && <div style={styles.error}>{error}</div>}
      
      <div style={styles.filterContainer}>
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel} htmlFor="category-select">الفئة:</label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={handleCategoryChange}
            style={styles.select}
          >
            <option value="">كل الفئات</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <form style={styles.searchForm} onSubmit={handleSearch}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث عن منتج..."
            style={styles.searchInput}
          />
          <button type="submit" style={styles.searchButton}>
            بحث
          </button>
        </form>
      </div>

      {products.length > 0 ? (
        <div style={styles.productsGrid}>
          {products.map((product) => {
            const isInCart = isItemInCart(product._id);
            const discountedPrice = calculateDiscountedPrice(product.price, product.discount);
            
            return (
              <div key={product._id} style={styles.productCard}>
                <img
                  src={product.imageUrl || product.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
                  alt={product.name}
                  style={styles.productImage}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x200?text=Error+Loading+Image';
                  }}
                />
                
                <div style={styles.productBody}>
                  <h3 style={styles.productTitle}>{product.name}</h3>
                  
                  <div style={styles.priceContainer}>
                    {discountedPrice ? (
                      <>
                        <span style={styles.productPrice}>{formatPrice(discountedPrice)}</span>
                        <span style={styles.productOldPrice}>{formatPrice(product.price)}</span>
                      </>
                    ) : (
                      <span style={styles.productPrice}>{formatPrice(product.price)}</span>
                    )}
                  </div>
                  
                  <p style={styles.productDescription}>
                    {product.description 
                      ? `${product.description.substring(0, 100)}${product.description.length > 100 ? '...' : ''}` 
                      : 'لا يوجد وصف متاح لهذا المنتج.'}
                  </p>
                  
                  <div style={styles.buttonContainer}>
                    <Link to={`/products/${product._id}`} style={styles.detailButton}>
                      عرض التفاصيل
                    </Link>
                    <button 
                      style={{
                        ...styles.cartButton,
                        ...(isInCart ? styles.cartButtonAdded : {})
                      }}
                      onClick={() => handleAddToCart(product)}
                    >
                      {isInCart ? 'تمت الإضافة ✓' : 'إضافة للسلة'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={styles.emptyMessage}>
          <p>لم يتم العثور على منتجات{searchTerm ? ' تطابق بحثك' : ''}</p>
          {searchTerm && (
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setPage(1);
              }}
              style={{
                ...styles.cartButton,
                marginTop: '1rem',
                backgroundColor: '#6c757d'
              }}
            >
              مسح البحث
            </button>
          )}
        </div>
      )}

      {isLoadingMore && (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
        </div>
      )}

      {hasMore && products.length > 0 && (
        <button 
          style={styles.loadMoreButton} 
          onClick={handleLoadMore}
          disabled={isLoadingMore}
        >
          {isLoadingMore ? 'جاري التحميل...' : 'تحميل المزيد'}
        </button>
      )}
    </div>
  );
};

export default ProductsList;