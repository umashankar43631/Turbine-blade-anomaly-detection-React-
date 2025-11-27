import React, { useState, useRef } from 'react';
import Header from './components/Header';
import AnalysisResult from './components/AnalysisResult';
import ImageAnnotator from './components/ImageAnnotator';
import { Upload, X, Camera, AlertCircle, Loader2, Wind } from 'lucide-react';
import { analyzeBladeImage } from './services/geminiService';
import { FileData, InspectionResult } from './types';

function App() {
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<InspectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    // Reset previous state
    setResult(null);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const base64String = e.target.result as string;
        // Extract base64 data part and mime type
        const parts = base64String.split(',');
        const mimeType = parts[0].split(':')[1].split(';')[0];
        const base64 = parts[1];

        setFileData({
          file,
          previewUrl: base64String,
          base64,
          mimeType
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!fileData) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const analysisResult = await analyzeBladeImage(fileData.base64, fileData.mimeType);
      setResult(analysisResult);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setFileData(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Header />

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          
          {/* Left Column: Upload & Preview */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h2 className="font-semibold text-gray-700 flex items-center gap-2">
                  <Camera className="w-5 h-5" /> Image Input
                </h2>
                {fileData && (
                  <button 
                    onClick={handleClear}
                    className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                  >
                    <X className="w-4 h-4" /> Clear
                  </button>
                )}
              </div>

              <div className="p-6">
                {!fileData ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors group"
                  >
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Upload Blade Image</h3>
                    <p className="text-gray-500 mt-2 text-sm">
                      Drag and drop or click to upload.<br/>
                      Supports Standard & Binocular Images
                    </p>
                    <p className="text-xs text-gray-400 mt-4">JPG, PNG, WEBP (Max 10MB)</p>
                  </div>
                ) : (
                  <div className="relative rounded-lg bg-gray-900 flex items-center justify-center overflow-hidden min-h-[300px]">
                    {/* Replaced fixed aspect ratio div with a flexible container for Annotator */}
                     <ImageAnnotator 
                        imageSrc={fileData.previewUrl} 
                        defects={result?.defects || []}
                     />
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </div>

              {fileData && (
                <div className="p-4 border-t border-gray-100 bg-gray-50">
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className={`w-full py-3 px-4 rounded-lg font-semibold text-white shadow-sm flex items-center justify-center gap-2 transition-all ${
                      isAnalyzing 
                        ? 'bg-blue-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md active:transform active:scale-[0.98]'
                    }`}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Analyzing Structure...
                      </>
                    ) : (
                      <>
                        Run AI Analysis
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Helper Info */}
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
              <h4 className="text-blue-800 font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Detection Capabilities
              </h4>
              <ul className="text-sm text-blue-700 space-y-1.5 list-disc list-inside">
                <li>Surface Cracks & Laminate Fractures</li>
                <li>Leading Edge Erosion (Paint vs Laminate)</li>
                <li>Lightning Damages (Tip & Surface)</li>
                <li>Core Material Defects</li>
                <li>Environmental Wear (Dust/Erosion)</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-7">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h3 className="text-red-800 font-semibold">Analysis Failed</h3>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            {!result && !isAnalyzing && (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-xl border border-dashed border-gray-300 text-gray-400">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <Camera className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Ready for Inspection</h3>
                <p className="max-w-md mx-auto">Upload an image of a wind turbine blade to begin the automated structural analysis.</p>
              </div>
            )}

            {isAnalyzing && (
              <div className="h-full flex flex-col items-center justify-center bg-white rounded-xl border border-gray-200 p-12">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Wind className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mt-6">Analyzing Blade Surface</h3>
                <p className="text-gray-500 mt-2 text-sm">Identifying fissures, erosion patterns, and structural anomalies...</p>
                <div className="w-64 bg-gray-100 rounded-full h-1.5 mt-8 overflow-hidden">
                  <div className="h-full bg-blue-600 animate-progress origin-left w-full"></div>
                </div>
              </div>
            )}

            {result && <AnalysisResult result={result} />}
          </div>

        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} BladeGuard AI. 
            <span className="hidden sm:inline"> | </span> 
            <span className="block sm:inline mt-1 sm:mt-0 text-gray-400">Assisting Human Inspectors. Not a replacement for certified NDT.</span>
          </p>
        </div>
      </footer>

      {/* Tailwind Custom Animation */}
      <style>{`
        @keyframes progress {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(0.5); }
          100% { transform: scaleX(1); }
        }
        .animate-progress {
          animation: progress 2s infinite ease-in-out;
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default App;