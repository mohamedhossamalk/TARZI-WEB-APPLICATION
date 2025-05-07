// src/features/customize/components/MeasurementSelector.jsx
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { useGetUserMeasurementsQuery } from '../../measurements/api/measurementsApi';
import { Loader } from '../../../components/ui/Loader';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const MeasurementCard = styled.div`
  border: 1px solid ${props => props.selected ? 'var(--primary)' : 'var(--border)'};
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  background-color: ${props => props.selected ? 'var(--red-100)' : 'var(--white)'};
  transition: all 0.2s;
  
  &:hover {
    border-color: var(--primary);
    background-color: ${props => props.selected ? 'var(--red-100)' : 'var(--grey-100)'};
  }
`;

const MeasurementHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const MeasurementTitle = styled.h4`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
`;

const MeasurementDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const MeasurementItem = styled.div`
  display: flex;
  justify-content: space-between;
  
  .label {
    color: var(--text-secondary);
  }
  
  .value {
    font-weight: 500;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 24px;
  background-color: var(--grey-100);
  border-radius: 8px;
`;

export const MeasurementSelector = ({ selected, onChange }) => {
  const navigate = useNavigate();
  const [selectedMeasurement, setSelectedMeasurement] = useState(selected);
  
  const { data: measurements, isLoading } = useGetUserMeasurementsQuery();
  
  useEffect(() => {
    if (selectedMeasurement) {
      onChange(selectedMeasurement);
    }
  }, [selectedMeasurement, onChange]);
  
  const handleSelect = (measurement) => {
    setSelectedMeasurement(measurement);
  };
  
  const handleCreateNew = () => {
    navigate('/measurements');
  };
  
  if (isLoading) {
    return <Loader center />;
  }
  
  if (!measurements || measurements.length === 0) {
    return (
      <EmptyState>
        <p>لا توجد قياسات محفوظة</p>
        <p>يرجى إضافة قياساتك لتتمكن من تخصيص بدلتك</p>
        <Button 
          variant="primary" 
          onClick={handleCreateNew}
          style={{ marginTop: '16px' }}
        >
          إضافة قياسات جديدة
        </Button>
      </EmptyState>
    );
  }
  
  return (
    <Container>
      {measurements.map((measurement) => (
        <MeasurementCard 
          key={measurement._id} 
          selected={selectedMeasurement?._id === measurement._id}
          onClick={() => handleSelect(measurement)}
        >
          <MeasurementHeader>
            <MeasurementTitle>{measurement.name}</MeasurementTitle>
            <span>{measurement.gender === 'male' ? 'ذكر' : 'أنثى'}</span>
          </MeasurementHeader>
          
          <MeasurementDetails>
            <MeasurementItem>
              <span className="label">الطول:</span>
              <span className="value">{measurement.height} سم</span>
            </MeasurementItem>
            <MeasurementItem>
              <span className="label">الوزن:</span>
              <span className="value">{measurement.weight} كجم</span>
            </MeasurementItem>
            <MeasurementItem>
              <span className="label">محيط الصدر:</span>
              <span className="value">{measurement.chest} سم</span>
            </MeasurementItem>
            <MeasurementItem>
              <span className="label">محيط الخصر:</span>
              <span className="value">{measurement.waist} سم</span>
            </MeasurementItem>
          </MeasurementDetails>
        </MeasurementCard>
      ))}
      
      <Button 
        variant="outline" 
        onClick={handleCreateNew}
      >
        إضافة قياسات جديدة
      </Button>
    </Container>
  );
};