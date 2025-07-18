import React, { useState, useRef } from 'react';
import { Upload, Mic, Play, Pause, RotateCcw, Brain, CheckCircle, AlertTriangle, Info } from 'lucide-react';

interface DiagnosisResult {
  confidence: number;
  issue: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  recommendations: string[];
  estimatedCost: { min: number; max: number };
}

const DiagnosisPage: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    recordingIntervalRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
    // Simulate creating an audio file
    const blob = new Blob(['mock audio data'], { type: 'audio/wav' });
    const file = new File([blob], 'recording.wav', { type: 'audio/wav' });
    setAudioFile(file);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
    }
  };

  const analyzeAudio = () => {
    if (!audioFile) return;
    
    setIsAnalyzing(true);
    setResult(null);

    // Simulate AI analysis
    setTimeout(() => {
      const mockResult: DiagnosisResult = {
        confidence: 87,
        issue: 'Engine Belt Issues',
        severity: 'medium',
        description: 'Based on the audio analysis, your vehicle likely has a worn or loose serpentine belt. This is causing the squealing sound you recorded.',
        recommendations: [
          'Inspect serpentine belt for cracks or fraying',
          'Check belt tension and alignment',
          'Replace belt if necessary',
          'Inspect belt pulleys for wear'
        ],
        estimatedCost: { min: 3500, max: 8500 }
      };
      setResult(mockResult);
      setIsAnalyzing(false);
    }, 4000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 border-green-200';
      case 'medium': return 'bg-yellow-100 border-yellow-200';
      case 'high': return 'bg-red-100 border-red-200';
      default: return 'bg-gray-100 border-gray-200';
    }
  };

  const reset = () => {
    setAudioFile(null);
    setResult(null);
    setRecordingTime(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary p-4 rounded-full">
              <Brain className="h-8 w-8 text-secondary" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-2">AI Audio Diagnosis</h1>
          <p className="text-xl text-gray-600">Upload or record car sounds for instant AI-powered analysis</p>
        </div>

        {!result && (
          <div className="bg-white rounded-xl shadow-lg p-8 animate-fade-in">
            {/* Instructions */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-secondary mb-4">How it works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <Mic className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-secondary mb-2">1. Record or Upload</h3>
                  <p className="text-sm text-gray-600">Capture the sound your car is making</p>
                </div>
                <div className="text-center">
                  <div className="bg-primary p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <Brain className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="font-semibold text-secondary mb-2">2. AI Analysis</h3>
                  <p className="text-sm text-gray-600">Our AI analyzes the audio patterns</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-secondary mb-2">3. Get Results</h3>
                  <p className="text-sm text-gray-600">Receive diagnosis and recommendations</p>
                </div>
              </div>
            </div>

            {/* Recording Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-secondary mb-4">Record Car Sound</h3>
                <div className="text-center">
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      className="bg-red-500 text-white p-6 rounded-full hover:bg-red-600 transition-all duration-200 transform hover:scale-105 mb-4"
                    >
                      <Mic className="h-12 w-12" />
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="bg-red-600 text-white p-6 rounded-full animate-pulse mb-4"
                    >
                      <Pause className="h-12 w-12" />
                    </button>
                  )}
                  <div className="text-center">
                    {isRecording && (
                      <div className="text-2xl font-bold text-red-600 mb-2">
                        Recording: {formatTime(recordingTime)}
                      </div>
                    )}
                    <p className="text-gray-600">
                      {isRecording ? 'Recording in progress... Tap to stop' : 'Tap to start recording'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center my-6">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-4 text-gray-500 font-medium">OR</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              {/* File Upload Section */}
              <div>
                <h3 className="text-xl font-bold text-secondary mb-4">Upload Audio File</h3>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors duration-200"
                >
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">MP3, WAV, M4A files supported</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Audio File Display */}
              {audioFile && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary p-2 rounded">
                        <Play className="h-5 w-5 text-secondary" />
                      </div>
                      <div>
                        <p className="font-medium text-secondary">{audioFile.name}</p>
                        <p className="text-sm text-gray-600">
                          {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={reset}
                      className="text-gray-500 hover:text-red-500 transition-colors duration-200"
                    >
                      <RotateCcw className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Analyze Button */}
              {audioFile && !isAnalyzing && (
                <div className="text-center">
                  <button
                    onClick={analyzeAudio}
                    className="bg-primary text-secondary px-8 py-4 rounded-lg font-bold text-xl hover:bg-primary-dark transition-all duration-200 transform hover:scale-105"
                  >
                    🧠 Analyze with AI
                  </button>
                </div>
              )}

              {/* Analysis Loading */}
              {isAnalyzing && (
                <div className="text-center py-8">
                  <div className="animate-spin mx-auto mb-6 w-16 h-16 border-4 border-primary border-t-transparent rounded-full"></div>
                  <h3 className="text-xl font-bold text-secondary mb-2">Analyzing Audio...</h3>
                  <p className="text-gray-600">
                    Our AI is processing your car's sound patterns. This may take a few moments.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-fade-in">
            {/* Main Result */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-secondary">Diagnosis Result</h2>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{result.confidence}%</div>
                    <div className="text-sm text-gray-600">Confidence</div>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg border-2 mb-6 ${getSeverityBg(result.severity)}`}>
                <div className="flex items-center space-x-3 mb-2">
                  <AlertTriangle className={`h-6 w-6 ${getSeverityColor(result.severity)}`} />
                  <h3 className="text-xl font-bold text-secondary">{result.issue}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(result.severity)}`}>
                    {result.severity.toUpperCase()} PRIORITY
                  </span>
                </div>
                <p className="text-gray-700">{result.description}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Recommendations */}
                <div>
                  <h4 className="font-bold text-secondary mb-3 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                    Recommended Actions
                  </h4>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="w-5 h-5 bg-primary text-secondary rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cost Estimate */}
                <div>
                  <h4 className="font-bold text-secondary mb-3 flex items-center">
                    <Info className="h-5 w-5 mr-2 text-blue-600" />
                    Estimated Cost
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary mb-1">
                        Rs. {result.estimatedCost.min.toLocaleString()} - {result.estimatedCost.max.toLocaleString()}
                      </div>
                      <p className="text-sm text-gray-600">
                        Actual cost may vary based on garage and parts availability
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-secondary mb-4">Next Steps</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="bg-primary text-secondary px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-all duration-200 transform hover:scale-105">
                  Book Service Now
                </button>
                <button className="border border-secondary text-secondary px-6 py-3 rounded-lg font-semibold hover:bg-secondary hover:text-white transition-colors duration-200">
                  Find Nearby Garages
                </button>
                <button 
                  onClick={reset}
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
                >
                  New Diagnosis
                </button>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-800">Important Disclaimer</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    This AI diagnosis is for informational purposes only. For accurate diagnosis and repair, 
                    please consult with a qualified automotive professional. The estimated costs are approximate 
                    and may vary based on your vehicle's specific condition and local market rates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagnosisPage;