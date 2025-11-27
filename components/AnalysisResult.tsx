import React from 'react';
import { InspectionResult, Severity } from '../types';
import DefectCard from './DefectCard';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CheckCircle2, AlertOctagon, FileText } from 'lucide-react';

interface AnalysisResultProps {
  result: InspectionResult;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result }) => {
  const criticalCount = result.defects.filter(d => d.severity === Severity.CRITICAL || d.severity === Severity.HIGH).length;
  const scoreColor = result.bladeConditionScore > 80 ? 'text-green-600' : result.bladeConditionScore > 50 ? 'text-yellow-600' : 'text-red-600';
  const scoreBg = result.bladeConditionScore > 80 ? 'bg-green-50' : result.bladeConditionScore > 50 ? 'bg-yellow-50' : 'bg-red-50';

  const chartData = [
    { name: 'Condition', value: result.bladeConditionScore },
    { name: 'Defect Impact', value: 100 - result.bladeConditionScore }
  ];

  const CHART_COLORS = ['#10b981', '#ef4444'];
  if(result.bladeConditionScore < 50) CHART_COLORS[0] = '#ef4444'; 
  else if (result.bladeConditionScore < 80) CHART_COLORS[0] = '#eab308';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Executive Summary Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          
          {/* Score Gauge */}
          <div className="relative w-32 h-32 flex-shrink-0">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={50}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell key="score" fill={CHART_COLORS[0]} />
                  <Cell key="rest" fill="#f3f4f6" />
                </Pie>
              </PieChart>
             </ResponsiveContainer>
             <div className="absolute inset-0 flex items-center justify-center flex-col">
               <span className={`text-xl font-bold ${scoreColor}`}>{result.bladeConditionScore}</span>
               <span className="text-[10px] text-gray-400 uppercase">Health</span>
             </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-lg font-semibold text-gray-900 mb-1 flex items-center justify-center md:justify-start gap-2">
              {criticalCount > 0 ? (
                <><AlertOctagon className="text-red-500 w-5 h-5" /> Attention Required</>
              ) : (
                <><CheckCircle2 className="text-green-500 w-5 h-5" /> Blade Operational</>
              )}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              {result.summary}
            </p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
               <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                 {new Date(result.timestamp).toLocaleDateString()}
               </span>
               <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                 {result.defects.length} Issues Detected
               </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <FileText className="w-5 h-5 text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900">Detailed Findings</h3>
      </div>

      {result.defects.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900">No Defects Detected</h3>
          <p className="text-gray-500 mt-2">The blade appears to be in excellent structural condition.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {result.defects.map((defect, index) => (
            <DefectCard key={index} defect={defect} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AnalysisResult;