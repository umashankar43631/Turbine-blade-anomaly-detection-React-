import React, { useState } from 'react';
import { DetectedDefect } from '../types';
import { SEVERITY_BORDER_COLORS, SEVERITY_BG_COLORS, SEVERITY_LABEL_COLORS } from '../constants';

interface ImageAnnotatorProps {
  imageSrc: string;
  defects: DetectedDefect[];
  className?: string;
}

const ImageAnnotator: React.FC<ImageAnnotatorProps> = ({ imageSrc, defects, className }) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div className={`relative inline-block w-full h-auto ${className}`}>
      <img 
        src={imageSrc} 
        alt="Analyzed Blade" 
        className={`block w-full h-auto rounded-lg transition-opacity duration-300 ${!imgLoaded ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setImgLoaded(true)}
      />
      {imgLoaded && defects.map((defect, idx) => {
        if (!defect.boundingBox) return null;
        
        const { ymin, xmin, ymax, xmax } = defect.boundingBox;
        
        // Convert 0-1000 scale to percentages
        const top = (ymin / 1000) * 100;
        const left = (xmin / 1000) * 100;
        const height = ((ymax - ymin) / 1000) * 100;
        const width = ((xmax - xmin) / 1000) * 100;

        // Position label inside if close to top edge
        const isNearTop = top < 8;

        return (
          <div
            key={idx}
            className={`absolute border-2 ${SEVERITY_BORDER_COLORS[defect.severity]} ${SEVERITY_BG_COLORS[defect.severity]} hover:bg-opacity-40 transition-colors cursor-pointer group/box z-10 hover:z-30`}
            style={{
              top: `${top}%`,
              left: `${left}%`,
              height: `${height}%`,
              width: `${width}%`,
            }}
          >
            {/* Visible Label */}
            <span 
               className={`absolute ${isNearTop ? 'top-0' : 'bottom-full'} left-[-2px] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${SEVERITY_LABEL_COLORS[defect.severity]} whitespace-nowrap z-20 shadow-sm pointer-events-none`}
             >
                {defect.type}
             </span>

            {/* Tooltip on hover (Enhanced details) */}
            <div className="opacity-0 group-hover/box:opacity-100 absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-gray-900/95 backdrop-blur-sm text-white text-xs px-3 py-2 rounded shadow-xl whitespace-nowrap z-30 pointer-events-none transition-all duration-200 transform translate-y-1 group-hover/box:translate-y-0 border border-gray-700">
              <div className="flex flex-col gap-0.5">
                <span className="font-semibold text-gray-100">{defect.type}</span>
                <span className="text-gray-400 text-[10px] flex items-center gap-2">
                  <span>{defect.severity} Severity</span>
                  <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                  <span>{defect.confidence}% Conf.</span>
                </span>
                <span className="text-gray-400 text-[10px] italic">{defect.location}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ImageAnnotator;