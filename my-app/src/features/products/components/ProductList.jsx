// src/features/products/components/ProductList.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { ProductCard } from './ProductCard';
import { Loader } from '../../../components/ui/Loader';
import { Button } from '../../../components/ui/Button';
import { GridIcon, ListIcon } from '../../../components/icons';
import { useGetProductsQuery } from '../api/productsApi';

const ListContainer = styled.div`
  width: 100%;
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const ResultCount = styled.p`
  color: var(--text-secondary);
`;

const ViewOptions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ViewButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 4px;
  border: 1px solid var(--border);
  background-color: ${props => props.active ? 'var(--primary)' : 'transparent'};
  color: ${props => props.active ? 'var(--white)' : 'var(--text-primary)'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.active ? 'var(--primary-dark)' : 'var(--grey-100)'};
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const GridView = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const ListView = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const LoadMoreContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
`;

const NoProductsFound = styled.div`
  text-align: center;
  padding: 60px 0;
  
  h3 {
    margin-bottom: 16px;
    color: var(--text-primary);
  }
  
  p {
    color: var(--text-secondary);
    margin-bottom: 24px;
  }
`;

export const ProductList = ({ filters = {} }) => {
  const [viewType, setViewType] = useState('grid');
  const [page, setPage] = useState(1);
  const limit = 8;
  
  const {
    data: productData,
    isLoading,
    isFetching,
    isError,
    refetch
  } = useGetProductsQuery({ 
    ...filters, 
    page, 
    limit 
  });
  
  const products = productData?.products || [];
  const totalPages = productData?.totalPages || 0;
  const totalProducts = productData?.totalProducts || 0;
  
  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };
  
  const renderProductList = () => {
    if (isLoading) {
      return <Loader size="large" center padding="60px 0" />;
    }
    
    if (isError) {
      return (
        <NoProductsFound>
          <h3>حدث خطأ</h3>
          <p>لم نتمكن من تحميل المنتجات، يرجى المحاولة مرة أخرى</p>
          <Button onClick={refetch} variant="primary">إعادة المحاولة</Button>
        </NoProductsFound>
      );
    }
    
    if (products.length === 0) {
      return (
        <NoProductsFound>
          <h3>لم يتم العثور على منتجات</h3>
          <p>جرب تعديل عوامل التصفية للعثور على منتجات</p>
          <Button onClick={() => window.location.href = '/products'} variant="primary">عرض جميع المنتجات</Button>
        </NoProductsFound>
      );
    }
    
    return (
      <>
        {viewType === 'grid' ? (
          <GridView>
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </GridView>
        ) : (
          <ListView>
            {products.map(product => (
              <ProductCard key={product._id} product={product} view="list" />
            ))}
          </ListView>
        )}
        
        {page < totalPages && (
          <LoadMoreContainer>
            <Button 
              onClick={handleLoadMore} 
              variant="outline" 
              disabled={isFetching}
            >
              {isFetching ? 'جاري التحميل...' : 'تحميل المزيد'}
            </Button>
          </LoadMoreContainer>
        )}
      </>
    );
  };
  
  return (
    <ListContainer>
      <ListHeader>
        <ResultCount>
          {isLoading ? 'جاري البحث...' : `تم العثور على ${totalProducts} منتج`}
        </ResultCount>
        
        <ViewOptions>
          <ViewButton 
            active={viewType === 'grid'} 
            onClick={() => setViewType('grid')}
            aria-label="عرض شبكي"
          >
            <GridIcon />
          </ViewButton>
          <ViewButton 
            active={viewType === 'list'} 
            onClick={() => setViewType('list')}
            aria-label="عرض قائمة"
          >
            <ListIcon />
          </ViewButton>
        </ViewOptions>
      </ListHeader>
      
      {renderProductList()}
    </ListContainer>
  );
};