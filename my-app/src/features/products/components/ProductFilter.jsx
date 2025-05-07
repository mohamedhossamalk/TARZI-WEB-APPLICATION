// src/features/products/components/ProductFilter.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Checkbox } from '../../../components/ui/Checkbox';
import { Slider } from '../../../components/ui/Slider';
import { Button } from '../../../components/ui/Button';
import { FilterIcon } from '../../../components/icons';
import { formatCurrency } from '../../../utils/format';
import { useGetCategoriesQuery, useGetBrandsQuery } from '../api/productsApi';

const FilterContainer = styled.div`
  width: 100%;
  background-color: var(--white);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

const FilterHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FilterTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const FilterBody = styled.div`
  padding: 20px;
`;

const FilterSection = styled.div`
  margin-bottom: 24px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterSectionTitle = styled.h4`
  font-size: 1rem;
  margin-bottom: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ExpandButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  line-height: 1;
  color: var(--text-secondary);
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: ${props => props.expanded ? 'none' : '200px'};
  overflow: ${props => props.expanded ? 'visible' : 'auto'};
  padding-right: 4px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--grey-100);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: var(--grey-300);
    border-radius: 3px;
  }
`;

const PriceRange = styled.div`
  padding: 0 8px;
`;

const PriceLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 0.9rem;
  margin-bottom: 12px;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const ShowMoreButton = styled.button`
  background: none;
  border: none;
  color: var(--primary);
  padding: 8px 0;
  font-size: 0.9rem;
  cursor: pointer;
  text-align: center;
  display: block;
  width: 100%;
  margin-top: 8px;
`;

const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 20px;
`;

const FilterMobileToggle = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  z-index: 999;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  svg {
    width: 24px;
    height: 24px;
  }
  
  @media (min-width: 992px) {
    display: none;
  }
`;

const MobileFilterOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: ${props => props.show ? 'block' : 'none'};
`;

const MobileFilterContainer = styled.div`
  position: fixed;
  top: 0;
  right: ${props => props.show ? '0' : '-100%'};
  width: 85%;
  max-width: 360px;
  height: 100%;
  background-color: var(--white);
  z-index: 1001;
  transition: right 0.3s ease;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const MobileFilterHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MobileFilterTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-primary);
`;

const MobileFilterBody = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
`;

const MobileFilterFooter = styled.div`
  padding: 16px;
  border-top: 1px solid var(--border);
  display: flex;
  gap: 12px;
`;

export const ProductFilter = ({ onFilterChange, initialFilters = {} }) => {
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [filters, setFilters] = useState({
    categories: initialFilters.categories || [],
    brands: initialFilters.brands || [],
    priceRange: initialFilters.priceRange || [0, 5000],
    minRating: initialFilters.minRating || 0,
    ...initialFilters
  });
  
  const [expanded, setExpanded] = useState({
    categories: false,
    brands: false
  });
  
  const [searchTerms, setSearchTerms] = useState({
    categories: '',
    brands: ''
  });
  
  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: brandsData } = useGetBrandsQuery();
  
  const categories = categoriesData?.categories || [];
  const brands = brandsData?.brands || [];
  
  // فلترة الفئات والعلامات التجارية بناءً على مصطلح البحث
  const filteredCategories = categories.filter(category => 
    category.name.includes(searchTerms.categories)
  );
  
  const filteredBrands = brands.filter(brand => 
    brand.name.includes(searchTerms.brands)
  );
  
  useEffect(() => {
    // إرسال التغييرات إلى المكون الأب
    onFilterChange(filters);
  }, [filters, onFilterChange]);
  
  const handleCategoryChange = (categoryId) => {
    const newCategories = [...filters.categories];
    
    if (newCategories.includes(categoryId)) {
      // إزالة الفئة إذا كانت محددة بالفعل
      const index = newCategories.indexOf(categoryId);
      newCategories.splice(index, 1);
    } else {
      // إضافة الفئة
      newCategories.push(categoryId);
    }
    
    setFilters({
      ...filters,
      categories: newCategories
    });
  };
  
  const handleBrandChange = (brandId) => {
    const newBrands = [...filters.brands];
    
    if (newBrands.includes(brandId)) {
      // إزالة العلامة التجارية إذا كانت محددة بالفعل
      const index = newBrands.indexOf(brandId);
      newBrands.splice(index, 1);
    } else {
      // إضافة العلامة التجارية
      newBrands.push(brandId);
    }
    
    setFilters({
      ...filters,
      brands: newBrands
    });
  };
  
  const handlePriceChange = (value) => {
    setFilters({
      ...filters,
      priceRange: value
    });
  };
  
  const handleResetFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      priceRange: [0, 5000],
      minRating: 0
    });
  };
  
  const handleApplyFilters = () => {
    // في النسخة المحمولة، أغلق الفلتر بعد التطبيق
    setShowMobileFilter(false);
  };
  
  const toggleExpanded = (section) => {
    setExpanded({
      ...expanded,
      [section]: !expanded[section]
    });
  };
  
  const handleSearchChange = (section, value) => {
    setSearchTerms({
      ...searchTerms,
      [section]: value
    });
  };
  
  const filterContent = (
    <>
      <FilterSection>
        <FilterSectionTitle>
          السعر
        </FilterSectionTitle>
        
        <PriceRange>
          <Slider 
            min={0}
            max={5000}
            step={50}
            value={filters.priceRange}
            onChange={handlePriceChange}
          />
          <PriceLabels>
            <span>{formatCurrency(filters.priceRange[0])}</span>
            <span>{formatCurrency(filters.priceRange[1])}</span>
          </PriceLabels>
        </PriceRange>
      </FilterSection>
      
      <FilterSection>
        <FilterSectionTitle>
          الفئات
          <ExpandButton onClick={() => toggleExpanded('categories')}>
            {expanded.categories ? '−' : '+'}
          </ExpandButton>
        </FilterSectionTitle>
        
        <SearchInput
          type="text"
          placeholder="بحث عن فئة..."
          value={searchTerms.categories}
          onChange={(e) => handleSearchChange('categories', e.target.value)}
        />
        
        <CheckboxGroup expanded={expanded.categories}>
          {filteredCategories.map(category => (
            <Checkbox
              key={category._id}
              id={`category-${category._id}`}
              label={`${category.name} (${category.productCount || 0})`}
              checked={filters.categories.includes(category._id)}
              onChange={() => handleCategoryChange(category._id)}
            />
          ))}
        </CheckboxGroup>
        
        {!expanded.categories && filteredCategories.length > 5 && (
          <ShowMoreButton onClick={() => toggleExpanded('categories')}>
            عرض المزيد
          </ShowMoreButton>
        )}
      </FilterSection>
      
      <FilterSection>
        <FilterSectionTitle>
          العلامات التجارية
          <ExpandButton onClick={() => toggleExpanded('brands')}>
            {expanded.brands ? '−' : '+'}
          </ExpandButton>
        </FilterSectionTitle>
        
        <SearchInput
          type="text"
          placeholder="بحث عن علامة تجارية..."
          value={searchTerms.brands}
          onChange={(e) => handleSearchChange('brands', e.target.value)}
        />
        
        <CheckboxGroup expanded={expanded.brands}>
          {filteredBrands.map(brand => (
            <Checkbox
              key={brand._id}
              id={`brand-${brand._id}`}
              label={`${brand.name} (${brand.productCount || 0})`}
              checked={filters.brands.includes(brand._id)}
              onChange={() => handleBrandChange(brand._id)}
            />
          ))}
        </CheckboxGroup>
        
        {!expanded.brands && filteredBrands.length > 5 && (
          <ShowMoreButton onClick={() => toggleExpanded('brands')}>
            عرض المزيد
          </ShowMoreButton>
        )}
      </FilterSection>
    </>
  );
  
  return (
    <>
      {/* نسخة سطح المكتب */}
      <FilterContainer>
        <FilterHeader>
          <FilterTitle>
            <FilterIcon /> تصفية المنتجات
          </FilterTitle>
        </FilterHeader>
        
        <FilterBody>
          {filterContent}
          
          <ButtonGroup>
            <Button 
              variant="outline" 
              onClick={handleResetFilters}
              fullWidth
            >
              إعادة تعيين
            </Button>
            <Button 
              variant="primary" 
              onClick={handleApplyFilters}
              fullWidth
            >
              تطبيق
            </Button>
          </ButtonGroup>
        </FilterBody>
      </FilterContainer>
      
      {/* زر النسخة المحمولة */}
      <FilterMobileToggle onClick={() => setShowMobileFilter(true)}>
        <FilterIcon />
      </FilterMobileToggle>
      
      {/* النسخة المحمولة */}
      <MobileFilterOverlay show={showMobileFilter} onClick={() => setShowMobileFilter(false)} />
      <MobileFilterContainer show={showMobileFilter}>
        <MobileFilterHeader>
          <MobileFilterTitle>تصفية المنتجات</MobileFilterTitle>
          <CloseButton onClick={() => setShowMobileFilter(false)}>&times;</CloseButton>
        </MobileFilterHeader>
        
        <MobileFilterBody>
          {filterContent}
        </MobileFilterBody>
        
        <MobileFilterFooter>
          <Button 
            variant="outline" 
            onClick={handleResetFilters}
            fullWidth
          >
            إعادة تعيين
          </Button>
          <Button 
            variant="primary" 
            onClick={handleApplyFilters}
            fullWidth
          >
            تطبيق
          </Button>
        </MobileFilterFooter>
      </MobileFilterContainer>
    </>
  );
};