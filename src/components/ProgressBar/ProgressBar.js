import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ 
  percentage = 0, 
  height = 'h-2', 
  bgColor = 'bg-gray-200', 
  fillColor = 'bg-blue-600',
  rounded = 'rounded-full',
  showPercentage = false,
  animated = true,
  size = 'normal', // 'small', 'normal', 'large'
  variant = 'default' // 'default', 'gradient', 'striped'
}) => {
  // Ensure percentage is between 0 and 100
  const safePercentage = Math.max(0, Math.min(100, percentage));
  
  // Size configurations
  const sizeConfig = {
    small: {
      height: 'h-1',
      text: 'text-xs',
      padding: 'px-2 py-1'
    },
    normal: {
      height: 'h-2',
      text: 'text-sm',
      padding: 'px-3 py-1'
    },
    large: {
      height: 'h-3',
      text: 'text-base',
      padding: 'px-4 py-2'
    }
  };

  // Variant configurations
  const variantConfig = {
    default: fillColor,
    gradient: 'bg-gradient-to-r from-blue-500 to-blue-600',
    striped: `${fillColor} bg-gradient-to-r from-transparent via-white to-transparent bg-size-200 animate-stripe`
  };

  const currentSize = sizeConfig[size] || sizeConfig.normal;
  const currentHeight = height || currentSize.height;
  const currentFillColor = variantConfig[variant] || fillColor;

  return (
    <div className="w-full">
      {showPercentage && (
        <div className="flex justify-between items-center mb-1">
          <span className={`font-medium text-gray-700 ${currentSize.text}`}>
            Progress
          </span>
          <span className={`font-semibold text-gray-900 ${currentSize.text}`}>
            {Math.round(safePercentage)}%
          </span>
        </div>
      )}
      
      <div className={`w-full ${bgColor} ${rounded} overflow-hidden ${currentHeight}`}>
        <div
          className={`${currentHeight} ${currentFillColor} ${rounded} transition-all duration-500 ease-out ${
            animated ? 'transform-gpu' : ''
          } ${variant === 'striped' ? 'animate-pulse' : ''}`}
          style={{ 
            width: `${safePercentage}%`,
            transition: animated ? 'width 0.5s ease-out' : 'none'
          }}
        />
      </div>
      
      {showPercentage && size === 'large' && (
        <div className="mt-1 text-right">
          <span className="text-xs text-gray-500">
            {safePercentage < 30 ? 'Getting started...' : 
             safePercentage < 60 ? 'Making progress...' : 
             safePercentage < 90 ? 'Almost there...' : 
             'Complete!'}
          </span>
        </div>
      )}
    </div>
  );
};

// Preset configurations for common use cases
export const LoadingProgressBar = ({ percentage, ...props }) => (
  <ProgressBar
    percentage={percentage}
    variant="gradient"
    animated={true}
    showPercentage={true}
    size="normal"
    {...props}
  />
);

export const FormProgressBar = ({ percentage, ...props }) => (
  <ProgressBar
    percentage={percentage}
    fillColor="bg-green-500"
    showPercentage={true}
    size="small"
    {...props}
  />
);

export const UploadProgressBar = ({ percentage, ...props }) => (
  <ProgressBar
    percentage={percentage}
    variant="striped"
    fillColor="bg-blue-500"
    animated={true}
    size="normal"
    {...props}
  />
);

export default ProgressBar;
