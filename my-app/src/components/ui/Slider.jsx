// src/components/ui/Slider.jsx
import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const SliderContainer = styled.div`
  width: 100%;
  position: relative;
  padding: 10px 0;
`;

const SliderTrack = styled.div`
  background: var(--grey-300);
  height: 4px;
  width: 100%;
  border-radius: 2px;
  position: relative;
`;

const SliderRange = styled.div`
  background: var(--primary);
  height: 4px;
  position: absolute;
  border-radius: 2px;
  left: ${props => props.left}%;
  right: ${props => 100 - props.right}%;
`;

const SliderHandle = styled.div`
  width: 18px;
  height: 18px;
  background: ${props => props.active ? 'var(--primary-dark)' : 'var(--primary)'};
  border-radius: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  left: ${props => props.position}%;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: background-color 0.2s;
  z-index: 2;
  
  &:hover {
    background: var(--primary-dark);
  }
  
  &:active {
    transform: translate(-50%, -50%) scale(1.1);
  }
`;

const TickMarks = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const TickMark = styled.div`
  width: 2px;
  height: 8px;
  background-color: var(--grey-300);
  position: relative;
  
  &::after {
    content: '${props => props.value}';
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 10px;
    color: var(--text-secondary);
  }
`;

export const Slider = ({
  min = 0,
  max = 100,
  step = 1,
  value = [0, 100],
  onChange,
  showTicks = false,
  tickStep,
  disabled = false
}) => {
  const [handleValues, setHandleValues] = useState(value);
  const [activeHandle, setActiveHandle] = useState(null);
  const trackRef = useRef(null);
  
  useEffect(() => {
    setHandleValues(value);
  }, [value]);
  
  const handleMouseMove = (e) => {
    if (activeHandle === null || disabled) return;
    
    const track = trackRef.current;
    const trackRect = track.getBoundingClientRect();
    const percentage = ((e.clientX - trackRect.left) / trackRect.width) * 100;
    const clampedPercentage = Math.min(Math.max(percentage, 0), 100);
    
    const rawValue = min + (max - min) * (clampedPercentage / 100);
    const steppedValue = Math.round(rawValue / step) * step;
    const newValue = Math.min(Math.max(steppedValue, min), max);
    
    const newValues = [...handleValues];
    
    if (activeHandle === 0) {
      newValues[0] = Math.min(newValue, handleValues[1] - step);
    } else {
      newValues[1] = Math.max(newValue, handleValues[0] + step);
    }
    
    setHandleValues(newValues);
    onChange && onChange(newValues);
  };
  
  const handleMouseUp = () => {
    setActiveHandle(null);
  };
  
  useEffect(() => {
    if (activeHandle !== null) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [activeHandle, handleValues]);
  
  const valueToPercentage = (value) => {
    return ((value - min) / (max - min)) * 100;
  };
  
  const renderTickMarks = () => {
    if (!showTicks) return null;
    
    const ticks = [];
    const actualTickStep = tickStep || step;
    
    for (let i = min; i <= max; i += actualTickStep) {
      ticks.push(
        <TickMark key={i} style={{ left: `${valueToPercentage(i)}%` }} value={i} />
      );
    }
    
    return <TickMarks>{ticks}</TickMarks>;
  };
  
  return (
    <SliderContainer>
      <SliderTrack ref={trackRef}>
        <SliderRange 
          left={valueToPercentage(handleValues[0])} 
          right={valueToPercentage(handleValues[1])} 
        />
        <SliderHandle 
          position={valueToPercentage(handleValues[0])} 
          onMouseDown={() => !disabled && setActiveHandle(0)}
          active={activeHandle === 0}
          disabled={disabled}
        />
        <SliderHandle 
          position={valueToPercentage(handleValues[1])} 
          onMouseDown={() => !disabled && setActiveHandle(1)}
          active={activeHandle === 1}
          disabled={disabled}
        />
      </SliderTrack>
      {renderTickMarks()}
    </SliderContainer>
  );
};