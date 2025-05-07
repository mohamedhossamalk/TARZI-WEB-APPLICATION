// src/features/products/pages/ProductDetailPage.jsx
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useGetProductQuery, useAddReviewMutation } from '../api/productsApi';
import { useAddToCartMutation } from '../../cart/api/cartApi';
import { useSelector } from 'react-redux';
import { Button } from '../../../components/ui/Button';
import { Rating } from '../../../components/ui/Rating';
import { Loader } from '../../../components/ui/Loader';
import { ErrorMessage } from '../../../components/ui/ErrorMessage';
import { Tab, Tabs } from '../../../components/ui/Tabs';
import { formatCurrency } from '../../../utils/format';
import { 
  ShoppingCartIcon, HeartIcon, ShareIcon, 
  CheckCircleIcon, XCircleIcon 
} from '../../../components/icons';
import { ProductCard } from '../components/ProductCard';
import { ReviewForm } from '../components/ReviewForm';
import { Review } from '../components/Review';
import { Counter } from '../../../components/ui/Counter';
import { useToast } from '../../../hooks/useToast';

const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
`;

const Breadcrumbs = styled.div`
  display: flex;
  margin-bottom: 24px;
  font-size: 0.9rem;
  color: var(--text-secondary);
  
  a {
    color: var(--text-secondary);
    text-decoration: none;
    
    &:hover {
      color: var(--primary);
      text-decoration: underline;
    }
  }
  
  span {
    margin: 0 8px;
  }
`;

const ProductContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  margin-bottom: 48px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const GalleryContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const MainImage = styled.div`
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    background-color: white;
  }
`;

const Thumbnails = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 8px;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--grey-100);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--grey-500);
    border-radius: 4px;
  }
`;

const Thumbnail = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid ${props => props.active ? 'var(--primary)' : 'transparent'};
  transition: border-color 0.2s;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  &:hover {
    border-color: ${props => props.active ? 'var(--primary)' : 'var(--grey-300)'};
  }
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProductHeader = styled.div`
  margin-bottom: 24px;
`;

const ProductTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 12px 0;
  color: var(--text-primary);
`;

const ProductMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

const StockStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  
  span {
    font-weight: 500;
  }
  
  &.in-stock {
    color: var(--success);
  }
  
  &.out-of-stock {
    color: var(--error);
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const ProductPrice = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
`;

const CurrentPrice = styled.span`
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary);
`;

const OldPrice = styled.span`
  font-size: 1.2rem;
  text-decoration: line-through;
  color: var(--grey-500);
`;

const Discount = styled.span`
  background-color: var(--primary);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
`;

const Description = styled.div`
  margin-bottom: 24px;
  color: var(--text-secondary);
  line-height: 1.6;
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background-color: var(--border);
  margin: 24px 0;
`;

const SelectionOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 24px;
`;

const OptionGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const OptionLabel = styled.label`
  font-weight: 500;
  color: var(--text-primary);
`;

const ColorOptions = styled.div`
  display: flex;
  gap: 12px;
`;

const ColorOption = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid ${props => props.selected ? 'var(--primary)' : 'transparent'};
  background-color: ${props => props.color};
  cursor: pointer;
  transition: transform 0.2s, border-color 0.2s;
  position: relative;
  
  &:hover {
    transform: scale(1.1);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -6px;
    left: -6px;
    right: -6px;
    bottom: -6px;
    border-radius: 50%;
    border: 1px solid var(--grey-300);
    opacity: ${props => props.selected ? 1 : 0};
    transition: opacity 0.2s;
  }
`;

const SizeOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const SizeOption = styled.button`
  padding: 8px 16px;
  border: 1px solid ${props => props.selected ? 'var(--primary)' : 'var(--border)'};
  background-color: ${props => props.selected ? 'var(--primary)' : 'transparent'};
  color: ${props => props.selected ? 'white' : 'var(--text-primary)'};
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: var(--primary);
    color: ${props => props.selected ? 'white' : 'var(--primary)'};
  }
  
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    border-color: var(--grey-300);
    color: var(--grey-500);
    background-color: var(--grey-100);
  }
`;

const QuantityContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`;

const ActionsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 12px;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const ActionButton = styled(Button)`
  margin-right: ${props => props.variant === 'primary' ? '0' : '8px'};
`;

const IconActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--grey-100);
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  
  svg {
    width: 20px;
    height: 20px;
    color: var(--text-primary);
    transition: color 0.2s;
  }
  
  &:hover {
    background-color: var(--grey-300);
    
    svg {
      color: var(--primary);
    }
  }
  
  &.active {
    background-color: var(--red-100);
    
    svg {
      color: var(--primary);
    }
  }
`;

const TabsContainer = styled.div`
  margin: 48px 0;
`;

const TabContent = styled.div`
  padding: 24px 0;
`;

const SpecTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  tr:nth-child(even) {
    background-color: var(--grey-100);
  }
  
  th, td {
    padding: 12px 16px;
    text-align: right;
    border-bottom: 1px solid var(--border);
  }
  
  th {
    width: 30%;
    font-weight: 500;
    color: var(--text-primary);
  }
  
  td {
    color: var(--text-secondary);
  }
`;

const ReviewsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ReviewSummary = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border);
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const AverageRating = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .rating-value {
    font-size: 3rem;
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1;
  }
  
  .rating-count {
    color: var(--text-secondary);
    margin-top: 8px;
  }
`;

const RatingBreakdown = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const RatingBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  .rating-label {
    width: 24px;
    font-weight: 500;
  }
  
  .bar-container {
    height: 8px;
    background-color: var(--grey-300);
    border-radius: 4px;
    flex: 1;
    overflow: hidden;
  }
  
  .bar-fill {
    height: 100%;
    background-color: var(--primary);
    border-radius: 4px;
    width: ${props => props.percentage}%;
  }
  
  .rating-count {
    min-width: 40px;
    text-align: left;
    color: var(--text-secondary);
    font-size: 0.9rem;
  }
`;

const RelatedProductsSection = styled.section`
  margin-top: 48px;
`;

const SectionHeader = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 24px;
  color: var(--text-primary);
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
`;

export const ProductDetailPage = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [color, setColor] = useState(null);
  const [size, setSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const { showToast } = useToast();
  const isLoggedIn = useSelector(state => !!state.auth.token);
  
  const { 
    data: product, 
    isLoading, 
    isError, 
    error,
    refetch
  } = useGetProductQuery(id);
  
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  const [addReview] = useAddReviewMutation();
  
  const handleAddToCart = async () => {
    if (!color && product?.colors?.length > 0) {
      return showToast('يرجى اختيار اللون', 'error');
    }
    
    if (!size && product?.sizes?.length > 0) {
      return showToast('يرجى اختيار المقاس', 'error');
    }
    
    try {
      await addToCart({
        productId: product._id,
        quantity,
        color: color || undefined,
        size: size || undefined
      }).unwrap();
      
      showToast('تمت إضافة المنتج إلى السلة', 'success');
    } catch (err) {
      showToast(err.data?.message || 'حدث خطأ أثناء الإضافة إلى السلة', 'error');
    }
  };
  
  const handleAddReview = async (reviewData) => {
    try {
      await addReview({ productId: id, ...reviewData }).unwrap();
      showToast('تمت إضافة المراجعة بنجاح', 'success');
    } catch (err) {
      showToast(err.data?.message || 'حدث خطأ أثناء إضافة المراجعة', 'error');
    }
  };
  
  const toggleFavorite = () => {
    if (!isLoggedIn) {
      return showToast('يرجى تسجيل الدخول أولاً', 'info');
    }
    
    setIsFavorite(!isFavorite);
    showToast(
      isFavorite 
        ? 'تمت إزالة المنتج من المفضلة' 
        : 'تمت إضافة المنتج إلى المفضلة',
      'success'
    );
  };
  
  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('تم نسخ رابط المنتج', 'success');
    }
  };
  
  if (isLoading) {
    return (
      <PageContainer>
        <Loader size="large" center />
      </PageContainer>
    );
  }
  
  if (isError) {
    return (
      <PageContainer>
        <ErrorMessage 
          message={error?.data?.message || "حدث خطأ أثناء تحميل المنتج"} 
          retry={refetch}
        />
      </PageContainer>
    );
  }

  const hasDiscount = product.discount > 0;
  const discountPercentage = Math.round((product.discount / product.price) * 100);
  const finalPrice = product.price - product.discount;
  
  return (
    <PageContainer>
      <Breadcrumbs>
        <Link to="/">الرئيسية</Link>
        <span>/</span>
        <Link to="/products">المنتجات</Link>
        <span>/</span>
        <Link to={`/products?category=${product.category}`}>{product.category}</Link>
        <span>/</span>
        <span>{product.name}</span>
      </Breadcrumbs>
      
      <ProductContainer>
        <GalleryContainer>
          <MainImage>
            <img 
              src={product.images ? product.images[selectedImage] : product.imageUrl} 
              alt={product.name} 
            />
          </MainImage>
          
          {product.images && product.images.length > 1 && (
            <Thumbnails>
              {product.images.map((image, index) => (
                <Thumbnail 
                  key={index} 
                  active={selectedImage === index}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={image} alt={`${product.name} - ${index + 1}`} />
                </Thumbnail>
              ))}
            </Thumbnails>
          )}
        </GalleryContainer>
        
        <ProductInfo>
          <ProductHeader>
            <ProductTitle>{product.name}</ProductTitle>
            <ProductMeta>
              <Rating value={product.rating} count={product.numReviews} />
              
              {product.countInStock > 0 ? (
                <StockStatus className="in-stock">
                  <CheckCircleIcon />
                  <span>متوفر في المخزن</span>
                </StockStatus>
              ) : (
                <StockStatus className="out-of-stock">
                  <XCircleIcon />
                  <span>غير متوفر حالياً</span>
                </StockStatus>
              )}
            </ProductMeta>
            
            <ProductPrice>
              <CurrentPrice>{formatCurrency(finalPrice)}</CurrentPrice>
              {hasDiscount && (
                <>
                  <OldPrice>{formatCurrency(product.price)}</OldPrice>
                  <Discount>خصم {discountPercentage}%</Discount>
                </>
              )}
            </ProductPrice>
            
            <Description>{product.description}</Description>
          </ProductHeader>
          
          <Divider />
          
          <SelectionOptions>
            {product.colors && product.colors.length > 0 && (
              <OptionGroup>
                <OptionLabel>اللون:</OptionLabel>
                <ColorOptions>
                  {product.colors.map(colorOption => (
                    <ColorOption
                      key={colorOption}
                      color={colorOption}
                      selected={color === colorOption}
                      onClick={() => setColor(colorOption)}
                      aria-label={`لون: ${colorOption}`}
                    />
                  ))}
                </ColorOptions>
              </OptionGroup>
            )}
            
            {product.sizes && product.sizes.length > 0 && (
              <OptionGroup>
                <OptionLabel>المقاس:</OptionLabel>
                <SizeOptions>
                  {product.sizes.map(sizeOption => (
                    <SizeOption
                      key={sizeOption}
                      selected={size === sizeOption}
                      onClick={() => setSize(sizeOption)}
                    >
                      {sizeOption}
                    </SizeOption>
                  ))}
                </SizeOptions>
              </OptionGroup>
            )}
          </SelectionOptions>
          
          <QuantityContainer>
            <OptionLabel>الكمية:</OptionLabel>
            <Counter 
              min={1} 
              max={product.countInStock} 
              value={quantity} 
              onChange={setQuantity} 
            />
          </QuantityContainer>
          
          <ActionsContainer>
            <ActionButton 
              variant="primary" 
              startIcon={<ShoppingCartIcon />}
              disabled={!product.countInStock || isAddingToCart}
              onClick={handleAddToCart}
              fullWidth
            >
                    {isAddingToCart ? 'جاري الإضافة...' : 'إضافة إلى السلة'}
            </ActionButton>
            
            <IconActionButton 
              className={isFavorite ? 'active' : ''}
              onClick={toggleFavorite}
              aria-label={isFavorite ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
            >
              <HeartIcon />
            </IconActionButton>
            
            <IconActionButton 
              onClick={shareProduct}
              aria-label="مشاركة المنتج"
            >
              <ShareIcon />
            </IconActionButton>
          </ActionsContainer>
        </ProductInfo>
      </ProductContainer>
      
      <TabsContainer>
        <Tabs>
          <Tab 
            active={activeTab === 'description'} 
            onClick={() => setActiveTab('description')}
          >
            الوصف
          </Tab>
          <Tab 
            active={activeTab === 'specifications'} 
            onClick={() => setActiveTab('specifications')}
          >
            المواصفات
          </Tab>
          <Tab 
            active={activeTab === 'reviews'} 
            onClick={() => setActiveTab('reviews')}
          >
            التقييمات ({product.reviews?.length || 0})
          </Tab>
        </Tabs>
        
        <TabContent>
          {activeTab === 'description' && (
            <div>
              {product.longDescription || product.description}
            </div>
          )}
          
          {activeTab === 'specifications' && (
            <SpecTable>
              <tbody>
                <tr>
                  <th>المادة</th>
                  <td>{product.material || 'غير محدد'}</td>
                </tr>
                <tr>
                  <th>الماركة</th>
                  <td>{product.brand || 'غير محدد'}</td>
                </tr>
                <tr>
                  <th>بلد المنشأ</th>
                  <td>{product.origin || 'غير محدد'}</td>
                </tr>
                <tr>
                  <th>الضمان</th>
                  <td>{product.warranty || 'لا يوجد'}</td>
                </tr>
                <tr>
                  <th>المقاسات المتاحة</th>
                  <td>{product.sizes?.join(', ') || 'غير محدد'}</td>
                </tr>
                <tr>
                  <th>الألوان المتاحة</th>
                  <td>{product.colors?.join(', ') || 'غير محدد'}</td>
                </tr>
                <tr>
                  <th>الوزن</th>
                  <td>{product.weight || 'غير محدد'}</td>
                </tr>
              </tbody>
            </SpecTable>
          )}
          
          {activeTab === 'reviews' && (
            <ReviewsContainer>
              {product.reviews && product.reviews.length > 0 ? (
                <>
                  <ReviewSummary>
                    <AverageRating>
                      <div className="rating-value">{product.rating.toFixed(1)}</div>
                      <Rating value={product.rating} />
                      <div className="rating-count">من {product.numReviews} تقييم</div>
                    </AverageRating>
                    
                    <RatingBreakdown>
                      {[5, 4, 3, 2, 1].map(star => {
                        const count = product.reviews.filter(r => Math.round(r.rating) === star).length;
                        const percentage = (count / product.reviews.length) * 100;
                        
                        return (
                          <RatingBar key={star} percentage={percentage}>
                            <div className="rating-label">{star}</div>
                            <div className="bar-container">
                              <div className="bar-fill" />
                            </div>
                            <div className="rating-count">{count}</div>
                          </RatingBar>
                        );
                      })}
                    </RatingBreakdown>
                  </ReviewSummary>
                  
                  <div>
                    {product.reviews.map(review => (
                      <Review key={review._id} review={review} />
                    ))}
                  </div>
                </>
              ) : (
                <p>لا توجد تقييمات حتى الآن. كن أول من يقيم هذا المنتج!</p>
              )}
              
              {isLoggedIn ? (
                <ReviewForm onSubmit={handleAddReview} />
              ) : (
                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                  <p>يرجى تسجيل الدخول لإضافة تقييم</p>
                  <Button 
                    variant="primary" 
                    as={Link} 
                    to={`/login?redirect=/product/${id}#reviews`}
                    style={{ marginTop: '12px' }}
                  >
                    تسجيل الدخول
                  </Button>
                </div>
              )}
            </ReviewsContainer>
          )}
        </TabContent>
      </TabsContainer>
      
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <RelatedProductsSection>
          <SectionHeader>منتجات مشابهة</SectionHeader>
          <ProductGrid>
            {product.relatedProducts.map(relatedProduct => (
              <ProductCard key={relatedProduct._id} product={relatedProduct} />
            ))}
          </ProductGrid>
        </RelatedProductsSection>
      )}
    </PageContainer>
  );
};