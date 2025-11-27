import React from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle, Zap, Activity } from 'lucide-react';
import { DetectedDefect, Severity } from '../types';
import { SEVERITY_COLORS } from '../constants';

interface DefectCardProps {
  defect: DetectedDefect;
}

const DefectCard: React.FC<DefectCardProps> = ({ defect }) => {
  const getIcon = (type: string) => {
    if (type.toLowerCase().includes('lightning')) return <Zap className="w-5 h-5" />;
    if (type.toLowerCase().includes('crack')) return <Activity className="w-5 h-5" />;
    return <AlertCircle className="w-5 h-5" />;
  };

  const getSeverityIcon = (severity: Severity) => {
    switch (severity) {
      case Severity.CRITICAL: return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case Severity.HIGH: return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case Severity.MEDIUM: return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default: return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${SEVERITY_COLORS[defect.severity].replace('text-', 'bg-opacity-20 ')}`}>
               {getIcon(defect.type)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 leading-tight">{defect.type}</h3>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                Location: {defect.location}
              </p>
            </div>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${SEVERITY_COLORS[defect.severity]}`}>
            {defect.severity.toUpperCase()}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
          {defect.description}
        </p>

        <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-2">
          <div className="flex items-center gap-2 text-sm">
             <span className="text-gray-400">Confidence:</span>
             <div className="h-2 w-16 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full" 
                  style={{ width: `${defect.confidence}%` }}
                />
             </div>
             <span className="font-medium text-gray-700">{defect.confidence}%</span>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-100">
             <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Recommendation</p>
             <p className="text-sm text-gray-800 font-medium">{defect.recommendation}</p>
        </div>
      </div>
    </div>
  );
};

export default DefectCard;