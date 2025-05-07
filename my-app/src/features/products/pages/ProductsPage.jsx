// src/features/products/pages/ProductsPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useGetProductsQuery } from '../api/productsApi';
import { ProductCard } from '../components/ProductCard';
import { Pagination } from '../../../components/ui/Pagination';
import { Select } from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import { Slider } from '../../../components/ui/Slider';
import { Button } from '../../../components/ui/Button';
import { FilterIcon, GridIcon, ListIcon } from '../../../components/icons';
import { Loader } from '../../../components/ui/Loader';
import { ErrorMessage } from '../../../components/ui/ErrorMessage';

const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
`;

const ControlsContainer = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const FiltersToggle = styled(Button)`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
  }
`;

const FiltersContainer = styled(motion.div)`
  background-color: var(--card-bg);
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    border-radius: 0;
    padding-top: 70px;
    overflow-y: auto;
  }
`;

const FilterHeader = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  background-color: var(--black);
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  z-index: 1000;
  
  @media (max-width: 768px) {
    display: flex;
  }
`;

const FilterSection = styled.div`
  margin-bottom: 24px;
  
  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 16px;
    color: var(--text-primary);
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ContentContainer = styled.div`
  display: flex;
  gap: 24px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.aside`
  flex: 0 0 280px;
  
  @media (max-width: 768px) {
    flex: none;
    width: 100%;
  }
`;

const MainContent = styled.main`
  flex: 1;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
  
  ${({ view }) => view === 'list' && `
    grid-template-columns: 1fr;
  `}
`;

const NoResultsContainer = styled.div`
  text-align: center;
  padding: 40px 0;
  
  h3 {
    font-size: 1.2rem;
    margin-bottom: 8px;
    color: var(--text-primary);
  }
  
  p {
    color: var(--text-secondary);
    margin-bottom: 24px;
  }
`;

const PriceRange = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
`;

const ViewToggle = styled.div`
  display: flex;
  border: 1px solid var(--border);
  border-radius: 4px;
  overflow: hidden;
`;
const ViewToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: ${props => props.active ? 'var(--primary)' : 'var(--background)'};
  color: ${props => props.active ? 'var(--white)' : 'var(--text-secondary)'};
  border: none;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  
  &:hover {
    background-color: ${props => props.active ? 'var(--primary-dark)' : 'var(--grey-100)'};
  }
  
  &:first-child {
    border-right: 1px solid var(--border);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

export const ProductsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [filters, setFilters] = useState({
    category: '',
    minPrice: 0,
    maxPrice: 1000,
    inStock: false,
    sortBy: 'newest'
  });
  const [view, setView] = useState('grid');
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [page, setPage] = useState(1);
  
  // Parse query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newFilters = { ...filters };
    
    if (params.has('category')) newFilters.category = params.get('category');
    if (params.has('minPrice')) newFilters.minPrice = Number(params.get('minPrice'));
    if (params.has('maxPrice')) newFilters.maxPrice = Number(params.get('maxPrice'));
    if (params.has('inStock')) newFilters.inStock = params.get('inStock') === 'true';
    if (params.has('sortBy')) newFilters.sortBy = params.get('sortBy');
    if (params.has('page')) setPage(Number(params.get('page')));
    
    setFilters(newFilters);
  }, [location.search]);
  
  // Update URL params when filters change
  const updateFilters = (newFilters) => {
    const params = new URLSearchParams();
    
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.minPrice > 0) params.set('minPrice', newFilters.minPrice);
    if (newFilters.maxPrice < 1000) params.set('maxPrice', newFilters.maxPrice);
    if (newFilters.inStock) params.set('inStock', newFilters.inStock);
    params.set('sortBy', newFilters.sortBy);
    params.set('page', '1'); // Reset to first page on filter change
    
    navigate(`${location.pathname}?${params.toString()}`);
    setPage(1);
  };
  
  // Handle pagination change
  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(location.search);
    params.set('page', newPage.toString());
    navigate(`${location.pathname}?${params.toString()}`);
    setPage(newPage);
  };
  
  // Get products with current filters
  const {
    data,
    isLoading,
    isError,
    error
  } = useGetProductsQuery({
    ...filters,
    page
  });

  // Derived values
  const totalPages = data?.pages || 1;
  const products = data?.products || [];
  const hasProducts = products.length > 0;

  return (
    <PageContainer>
      <Header>
        <Title>المنتجات</Title>
        <ControlsContainer>
          <FiltersToggle 
            variant="outline" 
            startIcon={<FilterIcon />}
            onClick={() => setFiltersVisible(true)}
          >
            الفلاتر
          </FiltersToggle>
          
          <Select
            value={filters.sortBy}
            onChange={(e) => updateFilters({ ...filters, sortBy: e.target.value })}
            options={[
              { value: 'newest', label: 'الأحدث' },
              { value: 'price_asc', label: 'السعر: من الأقل للأعلى' },
              { value: 'price_desc', label: 'السعر: من الأعلى للأقل' },
              { value: 'name_asc', label: 'الاسم: أ-ي' },
              { value: 'name_desc', label: 'الاسم: ي-أ' }
            ]}
            label="ترتيب حسب"
            style={{ minWidth: '200px' }}
          />
          
          <ViewToggle>
            <ViewToggleButton 
              active={view === 'grid'} 
              onClick={() => setView('grid')} 
              aria-label="عرض شبكي"
            >
              <GridIcon />
            </ViewToggleButton>
            <ViewToggleButton 
              active={view === 'list'} 
              onClick={() => setView('list')} 
              aria-label="عرض قائمة"
            >
              <ListIcon />
            </ViewToggleButton>
          </ViewToggle>
        </ControlsContainer>
      </Header>
      
      <ContentContainer>
        <Sidebar>
          <FiltersContainer
            isOpen={filtersVisible}
            initial={{ x: '-100%' }}
            animate={{ x: filtersVisible ? 0 : '-100%' }}
            transition={{ duration: 0.3 }}
          >
            {filtersVisible && (
              <FilterHeader>
                <h2>الفلاتر</h2>
                <Button
                  variant="black"
                  onClick={() => setFiltersVisible(false)}
                >
                  إغلاق
                </Button>
              </FilterHeader>
            )}
            
            <FilterSection>
              <h3>الفئات</h3>
              <FilterGroup>
                <Select
                  value={filters.category}
                  onChange={(e) => updateFilters({ ...filters, category: e.target.value })}
                  options={[
                    { value: '', label: 'الكل' },
                    { value: 'suits', label: 'بدل' },
                    { value: 'shirts', label: 'قمصان' },
                    { value: 'pants', label: 'بناطيل' },
                    { value: 'accessories', label: 'إكسسوارات' }
                  ]}
                />
              </FilterGroup>
            </FilterSection>
            
            <FilterSection>
              <h3>السعر</h3>
              <FilterGroup>
                <Slider
                  min={0}
                  max={1000}
                  step={10}
                  value={[filters.minPrice, filters.maxPrice]}
                  onChange={(values) => 
                    updateFilters({ 
                      ...filters, 
                      minPrice: values[0], 
                      maxPrice: values[1] 
                    })
                  }
                />
                <PriceRange>
                  <span>{filters.minPrice} ج.م</span>
                  <span>{filters.maxPrice} ج.م</span>
                </PriceRange>
              </FilterGroup>
            </FilterSection>
            
            <FilterSection>
              <h3>خيارات متقدمة</h3>
              <FilterGroup>
                <Checkbox
                  label="متوفر في المخزن"
                  checked={filters.inStock}
                  onChange={(e) => 
                    updateFilters({ ...filters, inStock: e.target.checked })
                  }
                />
              </FilterGroup>
            </FilterSection>
            
            {filtersVisible && (
              <Button 
                variant="primary" 
                fullWidth 
                onClick={() => setFiltersVisible(false)}
              >
                تطبيق الفلاتر
              </Button>
            )}
          </FiltersContainer>
        </Sidebar>
        
        <MainContent>
          {isLoading ? (
            <Loader size="large" center />
          ) : isError ? (
            <ErrorMessage 
              message={error?.data?.message || "حدث خطأ أثناء تحميل المنتجات"} 
              retry={() => refetch()}
            />
          ) : !hasProducts ? (
            <NoResultsContainer>
              <h3>لا توجد منتجات مطابقة</h3>
              <p>جرب تغيير معايير البحث أو تصفح جميع المنتجات</p>
              <Button 
                variant="primary" 
                onClick={() => updateFilters({
                  category: '',
                  minPrice: 0,
                  maxPrice: 1000,
                  inStock: false,
                  sortBy: 'newest'
                })}
              >
                عرض جميع المنتجات
              </Button>
            </NoResultsContainer>
          ) : (
            <>
              <ProductGrid view={view}>
                {products.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </ProductGrid>
              
              {totalPages > 1 && (
                <Pagination 
                  currentPage={page} 
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </MainContent>
      </ContentContainer>
    </PageContainer>
  );
};