import React, { useState } from "react";
import axios from "axios";

const DiagnosisPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setResult(null); // Clear previous result
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("audio", selectedFile);

    setIsUploading(true);
    setError(null);

    try {
      // Upload audio
      const uploadRes = await axios.post("http://localhost:5008/api/diagnosis/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { diagnosisId } = uploadRes.data;

      // Fetch diagnosis result
      const resultRes = await axios.get(`http://localhost:5008/api/diagnosis/${diagnosisId}/result`);
      setResult(resultRes.data.result);
    } catch (err: any) {
      console.error(err);
      setError("An error occurred during diagnosis.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Voice-Based Diagnosis</h1>

      <input type="file" accept="audio/*" onChange={handleFileChange} className="mb-4" />

      <button
        onClick={handleUpload}
        disabled={isUploading || !selectedFile}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isUploading ? "Uploading..." : "Submit Diagnosis"}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {result && (
        <div className="mt-6 p-4 bg-green-100 text-green-900 rounded">
          <h2 className="text-xl font-semibold mb-2">Diagnosis Result:</h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
};

export default DiagnosisPage;
