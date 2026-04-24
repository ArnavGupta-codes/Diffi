import React, { useState } from "react";
import { motion } from "framer-motion";
import ImageDropArea from "../components/ImageDropArea";

const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

const UploadPage = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [tag, setTag] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resetImages, setResetImages] = useState(false);

  const handleUpload = async () => {
    if (selectedFiles.length === 0 || !tag) {
      setMessage({ text: "⚠️ Please select at least one file and enter a tag.", type: "error" });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    selectedFiles.forEach(file => formData.append("files", file));
    formData.append("tag", tag);

    try {
      const response = await fetch(`${API_URL}/upload/`, {
        method: "POST",
        body: formData,
      });
      await response.json();
      setMessage({ text: `✅ ${selectedFiles.length} image(s) uploaded successfully! Tag: ${tag}`, type: "success" });
      setTag("");
      setSelectedFiles([]);
      setResetImages(true);
    } catch (error) {
      console.error("Error uploading files:", error);
      setMessage({ text: "❌ Upload failed. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="page-title">Upload Questions</h2>
      <p className="page-subtitle">Add question images to your bank with topic tags for easy retrieval</p>

      {message && (
        <div className={`message message-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Topic Tag</label>
        <input
          type="text"
          className="form-input"
          placeholder="e.g. Linear Algebra, Thermodynamics..."
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        />
      </div>

      <ImageDropArea
        onFileSelect={setSelectedFiles}
        reset={resetImages}
        onResetComplete={() => setResetImages(false)}
        multiple={true}
      />

      <button
        className="uploadbtn"
        onClick={handleUpload}
        disabled={selectedFiles.length === 0 || !tag || loading}
      >
        {loading ? (
          <><i className="fas fa-spinner fa-spin"></i> Uploading...</>
        ) : (
          <>Upload {selectedFiles.length > 0 ? `(${selectedFiles.length} files)` : ""}</>
        )}
      </button>
    </motion.div>
  );
};

export default UploadPage;
